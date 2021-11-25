interface FrameStyleObject {
  top: string
  left: string
  width: string
  height: string
}

export default class Frame {
  x: number
  y: number
  width: number
  height: number
  
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = x;
    this.width = width;
    this.height = height;
  }

  toStyleObject(): FrameStyleObject {
    return {
      top: this.y + 'px',
      left: this.x + 'px',
      width: this.width + 'px',
      height: this.height + 'px'
    }
  }
}