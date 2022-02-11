import { BrowserWindow } from 'electron';

export default function broadcast (event: string, data: unknown): void {
  BrowserWindow.getAllWindows().forEach(window => {
    window.webContents.send(event, data);
  });
}
