export default class Insets {
  top: number;
  left: number;
  bottom: number;
  right: number;

  constructor(top: number, left: number, bottom: number, right: number) {
    this.top = top;
    this.left = left;
    this.bottom = bottom;
    this.right = right;
  }

  clone(): Insets {
    return new Insets(
      this.top,
      this.left,
      this.bottom,
      this.right,
    );
  }
}
