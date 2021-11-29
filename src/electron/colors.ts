import { BrowserWindow, nativeTheme, systemPreferences } from "electron";

const mapping: { [index: number]: string } = {}

async function injectStyles(window: BrowserWindow) {
  const existingStyleToken = mapping[window.id];

  mapping[window.id] = await window.webContents.insertCSS(`:root {
    --color-text: ${process.platform == 'darwin' ? systemPreferences.getColor('text') : systemPreferences.getColor('window-text')};
    
    --color-selected-content-background: ${process.platform == 'darwin' ? systemPreferences.getColor('selected-content-background') : `#${systemPreferences.getAccentColor()}`};
    --color-window-background: ${process.platform == 'darwin' ? systemPreferences.getColor('window-background') : systemPreferences.getColor('window')};
    
    --color-accent: #${systemPreferences.getAccentColor()};
  }`)

  if (existingStyleToken) {
    window.webContents.removeInsertedCSS(existingStyleToken)
  }
}

export function injectSystemColors(window: BrowserWindow): void {
  if (!mapping[window.id]) {
    nativeTheme.on('updated', () => {
      injectStyles(window)
    })
  }

  injectStyles(window)
}