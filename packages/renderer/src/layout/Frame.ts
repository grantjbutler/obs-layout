import Insets from './Insets'

interface FrameStyleObject {
  top: string
  left: string
  width: string
  height: string
}

export default class Frame {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  toStyleObject(): FrameStyleObject {
    return {
      top: this.y + 'px',
      left: this.x + 'px',
      width: this.width + 'px',
      height: this.height + 'px',
    };
  }

  insetBy(insets: Insets): Frame {
    return new Frame(
      this.x + insets.left,
      this.y + insets.top,
      this.width - (insets.left + insets.right),
      this.height - (insets.top + insets.bottom),
    );
  }
}
