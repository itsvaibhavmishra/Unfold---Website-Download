# Unfold

Save any web page with its tabs, accordions and menus still working.

Unfold is a Chrome extension that saves a web page the way it behaves, not just the way it first loads. It clicks through the page's tabs, accordions, menus and "load more" buttons, records every state it uncovers, and writes one self-contained HTML file where those clicks still work offline.

It works on the rendered page rather than the site's source, so a Next.js app, an Angular app, a PHP site and plain HTML all look the same to it. While it explores, it keeps the page where it is: navigation to another page or site is cancelled and requests that would change anything on the server are blocked.

## Status

Scaffold. The build, and the release pipeline are in place; the features are not written yet.
See [docs/development.md](docs/development.md) to build it.

## Stack

| Layer | Choice |
|---|---|
| Platform | Chrome extension, Manifest V3 |
| Language | TypeScript, strict |
| Bundler | esbuild: background and popup as ES modules, content script as an IIFE |
| Tests | Vitest with jsdom |
| Lint | ESLint with typescript-eslint |
| UI | Plain HTML, CSS and TypeScript in the popup, no framework |

## Build

```sh
npm install
npm run build      # then load dist/ unpacked from chrome://extensions
```

More in [docs/development.md](docs/development.md).
