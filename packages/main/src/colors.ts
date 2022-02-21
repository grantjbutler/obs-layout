import type { BrowserWindow } from 'electron';
import { nativeTheme, systemPreferences } from 'electron';

const mapping: { [index: number]: string } = {};

type ColorMapping = {
  [index: string]: string

  text: string
  textSecondary: string
  controlText: string
  selectedControlText: string

  controlBackground: string
  navBarBackground: string
  selectedContentBackground: string
  underPageBackground: string
  windowBackground: string

  accent: string
  separator: string
  divider: string
}

type ColorModeMapping = {
  light: ColorMapping
  dark: ColorMapping
}

function getAccentColor(): string {
  return '#' + systemPreferences.getAccentColor();
}

function deriveColorMapping(): ColorModeMapping {
  if (process.platform == 'darwin') {
    // For macOS, `getColor` doesn't return the updated value when the system theme changes. It will instead return the value from when the browser window was first created.
    // Thus, we hard code colors here for macOS to work around this bug. https://github.com/electron/electron/issues/18699
    return {
      dark: {
        text: /*systemPreferences.getColor('text')*/ '#FFFFFF',
        textSecondary: /*systemPreferences.getColor('secondary-label')*/ '#ffffff8c',
        controlText: /*systemPreferences.getColor('control-text')*/ '#FFFFFF',
        selectedControlText: /*systemPreferences.getColor('selected-control-text')*/ 'FFFFFF',

        controlBackground: /*systemPreferences.getColor('control-background')*/ '#1E1E1E',
        navBarBackground: '#3c363c',
        selectedContentBackground: /*systemPreferences.getColor('selected-content-background')*/ '#0058D0', // This is the blue accent color. This will not reflect the user's selected accent color.
        underPageBackground: /*systemPreferences.getColor('under-page-background')*/ '#282828',
        windowBackground: /*systemPreferences.getColor('window-background')*/ '#323232',

        accent: getAccentColor(),
        separator: /*systemPreferences.getColor('separator')*/ '#ffffff1a',
        divider: '#000000',
      },
      light: {
        text: /*systemPreferences.getColor('text')*/ '#000000',
        textSecondary: /*systemPreferences.getColor('secondary-label')*/ '#0000008c',
        controlText: /*systemPreferences.getColor('control-text')*/ '#000000',
        selectedControlText: /*systemPreferences.getColor('selected-control-text')*/ '#000000',

        controlBackground: /*systemPreferences.getColor('control-background')*/ '#FFFFFF',
        navBarBackground: '#efebef',
        selectedContentBackground: /*systemPreferences.getColor('selected-content-background')*/ '#0063E1', // This is the blue accent color. This will not reflect the user's selected accent color.
        underPageBackground: /*systemPreferences.getColor('under-page-background')*/ '#969696',
        windowBackground: /*systemPreferences.getColor('window-background')*/ '#ECECEC',

        accent: getAccentColor(),
        separator: /*systemPreferences.getColor('separator')*/ '#d8d4d8',
        divider: '#d8d4d8',
      },
    };
  } else if (process.platform == 'win32') {
    return {
      dark: {
        text: systemPreferences.getColor('window-text'),
        textSecondary: systemPreferences.getColor('window-text'),
        controlText: systemPreferences.getColor('button-text'),
        selectedControlText: systemPreferences.getColor('highlight-text'),

        controlBackground: '',
        navBarBackground: '#f0f0f0',
        selectedContentBackground: getAccentColor(),
        underPageBackground: '#f0f0f0',
        windowBackground: systemPreferences.getColor('window'),

        accent: getAccentColor(),
        separator: '',
        divider: '#000000',
      },
      light: {
        text: systemPreferences.getColor('window-text'),
        textSecondary: systemPreferences.getColor('window-text'),
        controlText: systemPreferences.getColor('button-text'),
        selectedControlText: systemPreferences.getColor('highlight-text'),

        controlBackground: '',
        navBarBackground: '#f0f0f0',
        selectedContentBackground: getAccentColor(),
        underPageBackground: '#f0f0f0',
        windowBackground: systemPreferences.getColor('window'),

        accent: getAccentColor(),
        separator: '',
        divider: '#d8d4d8',
      },
    };
  } else {
    throw new Error('unsupport platform');
  }
}

async function injectStyles(window: BrowserWindow) {
  if (process.platform != 'darwin' && process.platform != 'win32') { return; }

  const existingStyleToken = mapping[window.id];

  const mode: 'dark' | 'light' = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
  const colorMapping = deriveColorMapping()[mode];

  let css = '';
  for (const property in colorMapping) {
    css += `--color-${toKebabCase(property)}: ${colorMapping[property]};\n`;
  }

  mapping[window.id] = await window.webContents.insertCSS(`:root {
    ${css}
  }`);

  if (existingStyleToken) {
    window.webContents.removeInsertedCSS(existingStyleToken);
  }
}

function toKebabCase(input: string): string {
  if (!input.length) {
    return '';
  } else if (input.length == 1) {
    return input.toLocaleLowerCase();
  } else {
    return input[0].toLocaleLowerCase() +
      input.slice(1, input.length)
        .replace(/[A-Z]/g, letter => '-' + letter.toLocaleLowerCase());
  }
}

export function injectSystemColors(window: BrowserWindow): void {
  if (!mapping[window.id]) {
    nativeTheme.on('updated', () => {
      injectStyles(window);
    });
  }

  injectStyles(window);
}
