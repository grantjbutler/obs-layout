# obs-layout

We're trying to figure out a good name. If you have an idea or suggestion, please [let us know](https://github.com/grantjbutler/obs-layout/issues/17)!

`obs-layout` is a tool for creating complex layouts in OBS without the need to manually size and position sources. It provides a flexbox-like system for calculating layouts, and then syncs them over to scenes in OBS.

## Installation

The latest builds of the app can be found on the [Releases page](https://github.com/grantjbutler/obs-layout/releases). Builds are available for macOS and Windows. obs-layout app requires that v4 of the [websocket plugin](https://github.com/obsproject/obs-websocket) for OBS is installed, so make sure you have that set up before using this app.

## Building

obs-layout is an Electron app that uses a modified version of [vite-electron-builder](https://github.com/cawa-93/vite-electron-builder) for building. After installing dependencies with `npm`, run `npm run watch` to run the app and start a watcher to rebuild the app when source files change. If you want a one-off build and don't want to spin up a watcher, you can run `npm run build` for a development build or `npm run compile` for a production build.
