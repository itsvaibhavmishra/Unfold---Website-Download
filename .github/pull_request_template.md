### Description

<!-- What changed, and why. The why is the part that is hard to recover later. -->

### Screenshots or Video

<!-- Anything that changes what a screen looks like. -->

### Devlog

<!-- Required for a pull request into staging. Add your line to devlog.txt under the heading
     that matches who the change is for, and tick the box below.
     Not required for staging into main: the release prep has already moved the whole devlog
     into CHANGELOG.md by then. -->

- [ ] `devlog.txt` updated, or this is a staging into main pull request

### Release

<!-- Only meaningful on a staging into main pull request, because merging into main is what
     publishes. -->

- [ ] Not a release, so this pull request carries the `skip release` label

### Checklist

- [ ] `npm run check` passes, and I gated on its exit code rather than reading its output
- [ ] Screenshots are up to date with the latest push
- [ ] Loaded `dist/` unpacked in Chrome and exercised the change on a real page
