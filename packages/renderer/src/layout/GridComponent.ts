import ContainerLayoutNode from './ContainerLayoutNode';
import ContainerComponent from './ContainerComponent';
import Frame from './Frame';
import Size from './Size';
import type LayoutNode from './LayoutNode';
import type Component from './Component';

export default class GridComponent extends ContainerComponent {
  rowSpacing = 0;
  columnSpacing = 0;
  columnCount = 1;
  distribution: 'leading' | 'center' | 'trailing' | 'justify-between' = 'center';

  static get displayName(): string {
    return 'Grid Component';
  }

  exerciseLayout(size: Size): LayoutNode {
    if (!this.children.length) {
      return new ContainerLayoutNode(this.id, new Frame(0, 0, size.width, size.height));
    }

    const rowCount = Math.ceil(this.children.length / this.columnCount);
    const totalColumnSpacing = this.columnSpacing * (this.columnCount - 1);
    const totalRowSpacing = (rowCount - 1) * this.rowSpacing;

    if (totalColumnSpacing >= size.width || totalRowSpacing >= size.height) {
      return new ContainerLayoutNode(this.id, new Frame(0, 0, size.width, size.height));
    }

    let availableHeight = size.height;
    const childSize = new Size((size.width - totalColumnSpacing) / this.columnCount, (size.height - totalRowSpacing) / rowCount);
    let childNodes: LayoutNode[] = [];
    let yOffset = 0;
    let containerHeight = (rowCount - 1) * this.rowSpacing;

    for (let row = 0; row < rowCount; row++) {
      const rowNodes: LayoutNode[] = [];

      for (let column = 0; column < this.columnCount; column++) {
        const index = column + (row * this.columnCount);
        if (index >= this.children.length) { break; }

        rowNodes.push(this.children[index].exerciseLayout(childSize));
      }

      const rowHeight = rowNodes.reduce((height, node) => Math.max(height, node.frame.height), 0);

      rowNodes.forEach((node, column) => {
        let xOffset = (column % this.columnCount) * (childSize.width + this.columnSpacing);

        if (row == rowCount - 1 && rowNodes.length != this.columnCount) {
          switch (this.distribution) {
            case 'center': {
              const totalChildWidth = rowNodes.length * childSize.width + (rowNodes.length - 1) * this.columnSpacing;
              xOffset += (size.width - totalChildWidth) / 2.0;
              break;
            }
            case 'leading':
              break;
            case 'trailing':
              xOffset += (this.columnCount - rowNodes.length) * (childSize.width + this.columnSpacing);
              break;
            case 'justify-between': {
              const spacing = (size.width - (rowNodes.length * childSize.width)) / (rowNodes.length - 1);
              xOffset = (column % rowNodes.length) * (childSize.width + spacing);
              break;
            }
          }
        }

        node.frame.x = xOffset + (childSize.width - node.frame.width) / 2.0;
        node.frame.y = yOffset + (rowHeight - node.frame.height) / 2.0;
      });

      availableHeight -= rowHeight + this.rowSpacing;
      yOffset += rowHeight + this.rowSpacing;
      containerHeight += rowHeight;

      const remainingRowCount = rowCount - (row + 1);
      childSize.height = (availableHeight - (remainingRowCount - 1) * this.rowSpacing) / remainingRowCount;

      childNodes = childNodes.concat(rowNodes);
    }

    return new ContainerLayoutNode(this.id, new Frame(0, 0, size.width, containerHeight), childNodes);
  }

  clone(): Component {
    const clone = new GridComponent();
    clone.columnSpacing = this.columnSpacing;
    clone.columnCount = this.columnCount;
    clone.rowSpacing = this.rowSpacing;
    clone.distribution = this.distribution;
    this.children.forEach(child => clone.addChild(child.clone()));
    return clone;
  }
}
