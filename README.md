# obs-layout

We're trying to figure out a good name. If you have an idea or suggestion, please [let us know](https://github.com/grantjbutler/obs-layout/issues/17)!

`obs-layout` is a tool for creating complex layouts in OBS without the need to manually size and position sources. It provides a flexbox-like system for calculating layouts, and then syncs them over to scenes in OBS.

## Installation

In the future, full builds of this app will be available as Releases. However, as this project is still early in its lifecycle, you must build the app from source yourself.

## Building

obs-layout is an Electron app that uses [nklayman/vue-cli-plugin-electron-builder](https://github.com/nklayman/vue-cli-plugin-electron-builder) for building. This assumes you have the [Vue CLI](https://cli.vuejs.org) installed, as well as added the electron-build plugin by running `vue add electron-builder`.

With the electron-builder plugin installed, you can run `yarn electron:serve` to compile and launch the app.
