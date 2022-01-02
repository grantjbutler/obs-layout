export interface OBSConnectionOptions {
  host: string;
  port: number;
  password?: string;
}

export function isOBSConnectionOptions(obj: unknown): obj is OBSConnectionOptions {
  if (typeof obj !== 'object') { return false; }

  const hasRequiredFields = (obj as OBSConnectionOptions).host !== undefined
    && typeof (obj as OBSConnectionOptions).host === 'string'
    && (obj as OBSConnectionOptions).port !== undefined
    && typeof (obj as OBSConnectionOptions).port !== 'number';
  if (!hasRequiredFields) {
    return false;
  }

  if ((obj as OBSConnectionOptions).password !== undefined) {
    if (typeof (obj as OBSConnectionOptions).password !== 'string') {
      return false;
    }
  }

  return true;
}