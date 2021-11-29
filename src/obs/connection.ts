export interface OBSConnection {
  host: string;
  port: number;
  password?: string;
}

export function isOBSConnection(obj: unknown): obj is OBSConnection {
  const hasRequiredFields = (obj as OBSConnection).host !== undefined
    && typeof (obj as OBSConnection).host === 'string'
    && (obj as OBSConnection).port !== undefined
    && typeof (obj as OBSConnection).port !== 'number';
  if (!hasRequiredFields) {
    return false;
  }

  if ((obj as OBSConnection).password !== undefined) {
    if (typeof (obj as OBSConnection).password !== 'string') {
      return false;
    }
  }

  return true;
}