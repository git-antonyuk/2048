interface IHtmlBoardUIProps {
  wrapper: HTMLDivElement;
  tileSize: number;
  rows: number;
  columns: number;
  board: number[][];
}

class HtmlBoardUI {
  private wrapper: HTMLDivElement;
  private tileSize = 0;
  private rows = 0;
  private columns = 0;
  private gap = 8;

  constructor({ wrapper, tileSize, rows, columns }: IHtmlBoardUIProps) {
    this.wrapper = wrapper;
    this.tileSize = tileSize;
    this.rows = rows;
    this.columns = columns;

    this.addBoardStyles();
  }

  private addBoardStyles() {
    const width = this.tileSize * this.rows + this.gap * this.rows;
    const height = this.tileSize * this.columns + this.gap * this.rows;
    this.wrapper.classList.add("board");
    this.wrapper.style.gap = `${this.gap}px`;
    this.wrapper.style.height = `${height}px`;
    this.wrapper.style.width = `${width}px`;
  }

  public drawTile(r: number, c: number, num: number) {
    const id = `t-${r}-${c}`;
    const divElement = document.createElement("div");
    divElement.id = id;
    divElement.style.height = `${this.tileSize}px`;
    divElement.style.width = `${this.tileSize}px`;
    divElement.innerHTML = `${num}`;
    divElement.classList.add("tile");
    divElement.classList.add(`tile--c-${num}`);
    this.wrapper.appendChild(divElement);
  }

  public updateTile(r: number, c: number, num: number) {
    const element = document.getElementById(`t-${r}-${c}`);
    if (!element) {
      return;
    }
    element.className = "";
    element.classList.add("tile");
    element.classList.add(`tile--c-${num}`);

    if (+element.innerHTML === num) {
      return;
    }

    element.innerHTML = `${num}`;
  }
}

export default HtmlBoardUI;
