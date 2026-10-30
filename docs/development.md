# Development

## What you need

- Node.js 22.13 or newer, and npm
- Chrome or another Chromium browser, to load the extension unpacked
- `zip`, for `npm run package` (preinstalled on macOS and most Linux)

## Build and check

```sh
npm install
npm run dev        # rebuilds dist/ on every change
npm run check      # typecheck, lint, tests and build: the gate
npm run package    # dist/ zipped as unfold.zip

# Load it: chrome://extensions > Developer mode > Load unpacked > pick dist/
# After a rebuild, press the reload icon on the extension's card.
```

Run the gate before every commit and **gate on its exit code**, not on a read of its output. A
pipe into `tail` or `grep` reports the exit code of the pipe, so a failed build looks green.

## Versioning

The version lives in `package.json` only. `scripts/build.mjs` copies it into
`dist/manifest.json`, so `src/manifest.json` carries none and the two cannot disagree.
`scripts/release.sh` bumps it through `npm version`, which keeps `package-lock.json` in step.

Chrome accepts one to four dot-separated integers as a version, so releases stay plain
`x.y.z` with no pre-release suffix.

## Planning notes

`docs/ideas/` holds the project spec and anything else being thought through rather than
built. The `ideas/` exclude pattern matches at any depth, so nothing in it is ever committed or
pushed even though it sits under `docs/`. Treat it as the working notebook: the rest of `docs/`
is what a contributor reads.

`docs/decisions/` is local in the same way. Each decision not made yet gets one file there,
and the file is deleted once the outcome is recorded in the tracked docs. Committed files
describe only what is decided, and never link into `docs/decisions/` or `docs/ideas/`.

## Branches

`main` is what has been released. `staging` is what is going to be. Nothing is pushed to either
directly.

```
feature branch  ->  PR into staging  ->  PR from staging into main  =  a release
```

- **Cut every branch from `staging`**, not from `main`. Cutting from `main` means rebasing onto
  whatever staging already holds before the PR can merge.
- **Every PR into `staging` adds a line to `devlog.txt`**, under the heading that matches who
  the change is for. The PR template has the checkbox and the file explains the headings.
- **Merging `staging` into `main` is the release.** That PR needs no devlog line, because the
  devlog has already moved into `CHANGELOG.md` by then.

## What publishes, and what does not

- **A feature branch** publishes nothing. Push as often as you like.
- **`staging`** publishes a rolling `staging` pre-release with the extension zip: a sandbox proving the release path works before it runs against `main`.
- **Merging into `main` publishes** a GitHub Release tagged `v<version>` with the extension zip attached. It skips all of that if the tag already
  exists, so an ordinary merge that did not bump the version cannot cut a duplicate.
- **The `skip release` label** on a `staging` into `main` PR turns off the release-ready
  checks, for a merge that is deliberately not a release.

## Cutting a release

```sh
scripts/release.sh 0.2.0     # that version
scripts/release.sh           # asks, offering the next patch
```

That refuses a dirty tree, cuts `release/0.2.0` from `origin/staging`, moves the devlog into a
dated `CHANGELOG.md` section, bumps the version, runs the gate, commits, pushes, and opens
**both** pull requests: the prepare one into `staging`, and the release one from `staging` into
`main`. If the gate fails it deletes the branch and pushes nothing, leaving the tree as it
found it.

Merge the prepare PR, then the release PR. Nothing else is needed: `release-ready.yml` blocks
the second merge unless the version went up, the changelog has a dated section for it, the
devlog is empty and the tag is free.

```sh
scripts/skip-release.sh
```

opens a `staging` into `main` PR already labelled `skip release`, for moving work to `main`
without cutting a version. Anything left in `devlog.txt` stays there and lands in whichever
version is released next, so nothing is lost by merging one.

A version is published once. A mistake means burning a number rather than replacing it.

The scripts need `gh` (authenticated), `git` and `python3`. `scripts/changelog.py` holds the
devlog-to-changelog text transforms as pure functions, so it can be read and tested on its own;
the release workflow calls the same script for the GitHub release notes, so the notes and the
PR body cannot drift apart.

## Branch protection

The rulesets are version-controlled in `.github/rulesets/`, rather than clicked into a settings
page nobody can diff:

| Ruleset | Covers | Enforces |
|---|---|---|
| `branches-are-permanent` | `main`, `staging` | no deletion, no force-push |
| `staging-is-next` | `staging` | PR required, 1 approval, `check` green and up to date, signed commits |
| `main-is-released` | `main` | the same plus `ready`, and stale approvals dismissed on push |

```sh
scripts/apply-rulesets.sh          # create or update each one on GitHub, matched by name
scripts/apply-rulesets.sh --show   # print what is live now, change nothing
```

Matching by name means it is safe to run repeatedly and will not stack duplicates. Before it
pushes anything it checks that every required status check corresponds to a real workflow job:
a ruleset naming a context no workflow produces blocks every merge into that branch forever.

**Apply the rulesets only after the first push.** They require a pull request, an approval and
a green `check` on `main`; applying them to an empty repository locks you out of your own
initial commit. The correct order is: create the repo, push `main`, branch `staging`, then run
the script.

## Layout

```
.
|- src/
|  |- manifest.json         the extension manifest, with no version (the build adds it)
|  |- background/index.ts   service worker: runs a capture on the active tab
|  |- content/index.ts      injected into the page: explores and serialises its states
|  |- popup/                the toolbar popup: index.html, index.ts, popup.css
|  |- shared/               messages.ts (message contract), url-policy.ts (allowed navigations)
|  |- replay/               runtime embedded in every saved page (not written yet)
|- scripts/
|  |- build.mjs             esbuild: bundles each entry and writes dist/ with the manifest
|  |- release.sh, skip-release.sh, apply-rulesets.sh, lib.sh, changelog.py, version.sh
|- dist/                    build output: load this folder unpacked (ignored)
|- docs/development.md      how to build, load and release it
|- docs/ideas/              local notebook, never committed
|- docs/decisions/          open decisions, never committed
|- .github/                 workflows, rulesets, PR template
```

## Conventions

- **Comments explain why, not what.** If a comment describes what the next line does, rewrite
  the line instead. Keep each to a single line; anything longer belongs in the commit body.
- **No em dashes** in code, comments or docs. Use a colon, a comma or a full stop.
- **No single-letter names.** Not a loop index, not a lambda argument. `_` for a slot the
  language forces you to declare and the code never reads is the only exception.
- **Split a file when it stops reading cleanly**, not when it hits a line count.
- **No timelines.** No durations, deadlines or estimates for work in code, comments or docs
  unless explicitly asked.
- **Never add a dependency without justification.**
