import type Insets from './Insets';

export default class Size {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  insetBy(insets: Insets): Size {
    return new Size(
      Math.max(this.width - (insets.left + insets.right), 0),
      Math.max(this.height - (insets.top + insets.bottom), 0),
    );
  }
}
