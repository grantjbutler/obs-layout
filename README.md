# obs-layout

We're trying to figure out a good name. If you have an idea or suggestion, please [let us know](https://github.com/grantjbutler/obs-layout/issues/17)!

`obs-layout` is a tool for creating complex layouts in OBS without the need to manually size and position sources. It provides a flexbox-like system for calculating layouts, and then syncs them over to scenes in OBS.

## Installation

In the future, full builds of this app will be available as Releases. However, as this project is still early in its lifecycle, you must build the app from source yourself.

## Building

obs-layout is an Electron app that uses a modified version of [vite-electron-builder](https://github.com/cawa-93/vite-electron-builder) for building. After installing dependencies with `npm`, run `npm run watch` to run the app and start a watcher to rebuild the app when source files change. If you want a one-off build and don't want to spin up a watcher, you can run `npm run build` for a development build or `npm run compile` for a production build.
