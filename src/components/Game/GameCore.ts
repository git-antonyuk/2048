import HtmlBoardUI from "./HtmlBoardUI";

class GameCore {
  private gameWrapper: HTMLDivElement;
  private tileSize = 90;
  private rows = 0;
  private columns = 0;
  private board: number[][] = [];
  public score = 0;
  private boardUI: HtmlBoardUI | null = null;

  constructor(gameWrapper: HTMLDivElement, gameSize = 4) {
    this.gameWrapper = gameWrapper;
    this.setBoard(gameSize);
    this.initBoard();
    this.addKeyboardListeners();
    this.initGame();
  }

  private setBoard(gameSize: number) {
    for (let c = 0; c < gameSize; c++) {
      const row = [];
      for (let r = 0; r < gameSize; r++) {
        row.push(0);
      }
      this.board.push(row);
    }

    this.columns = this.board.length;
    this.rows = this.board[0].length;
  }

  private initGame() {
    this.setRandomTileNum();
    this.setRandomTileNum();
  }

  private isEmptyTile() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  private setRandomTileNum() {
    if (!this.boardUI) {
      console.warn("drawTiles: Board UI not initialized");
      return;
    }

    if (!this.isEmptyTile()) {
      console.log("You loose");
      return;
    }

    let exist = false;

    while (!exist) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.columns);

      if (this.board[r][c] === 0) {
        exist = true;
        this.board[r][c] = 1;
        this.updateTiles();
      }
    }
  }

  private initBoard() {
    this.boardUI = new HtmlBoardUI({
      wrapper: this.gameWrapper,
      tileSize: this.tileSize,
      rows: this.rows,
      columns: this.columns,
      board: this.board,
    });

    this.drawTiles();
  }

  private drawTiles() {
    if (!this.boardUI) {
      console.warn("drawTiles: Board UI not initialized");
      return;
    }
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        const num = this.board[r][c];
        this.boardUI.drawTile(r, c, num);
      }
    }
  }

  private updateTiles() {
    if (!this.boardUI) {
      console.warn("updateTiles: Board UI not initialized");
      return;
    }
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        const num = this.board[r][c];
        this.boardUI.updateTile(r, c, num);
      }
    }
  }

  private removeZeros(row: number[]) {
    return row.filter((n) => n);
  }

  private addZeros(row: number[]) {
    for (let r = 0; r < this.rows; r++) {
      if (!row[r]) {
        row.push(0);
      }
    }

    return row;
  }

  private onUpdateScopeFunction: Function = function () {};
  public onUpdateScope(fn: Function) {
    this.onUpdateScopeFunction = fn;
  }

  private slide(row: number[]) {
    row = this.removeZeros(row);

    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        this.score += row[i];
      }
    }

    row = this.removeZeros(row);
    row = this.addZeros(row);

    this.onUpdateScopeFunction(this.score);

    return row;
  }

  private slideLeft() {
    for (let r = 0; r < this.rows; r++) {
      let row = this.board[r];
      row = this.slide(row);
      this.board[r] = row;
    }

    this.updateTiles();
    this.setRandomTileNum();
  }

  private slideRight() {
    for (let r = 0; r < this.rows; r++) {
      let row = this.board[r];
      row.reverse();
      row = this.slide(row);
      row.reverse();
      this.board[r] = row;
    }

    this.updateTiles();
    this.setRandomTileNum();
  }

  private slideUp() {
    for (let c = 0; c < this.columns; c++) {
      let rowFromColumn = this.board.map((_, r) => this.board[r][c]);
      rowFromColumn = this.slide(rowFromColumn);

      for (let r = 0; r < this.rows; r++) {
        this.board[r][c] = rowFromColumn[r];
      }
    }

    this.updateTiles();
    this.setRandomTileNum();
  }

  private slideDown() {
    for (let c = 0; c < this.columns; c++) {
      let rowFromColumn = this.board.map((_, r) => this.board[r][c]);
      rowFromColumn.reverse();
      rowFromColumn = this.slide(rowFromColumn);
      rowFromColumn.reverse();

      for (let r = 0; r < this.rows; r++) {
        this.board[r][c] = rowFromColumn[r];
      }
    }

    this.updateTiles();
    this.setRandomTileNum();
  }

  private addKeyboardListeners() {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.slideLeft();
          break;
        case "a":
          this.slideLeft();
          break;
        case "ArrowRight":
          this.slideRight();
          break;
        case "d":
          this.slideRight();
          break;
        case "ArrowUp":
          this.slideUp();
          break;
        case "w":
          this.slideUp();
          break;
        case "ArrowDown":
          this.slideDown();
          break;
        case "s":
          this.slideDown();
          break;
        default:
          break;
      }
    });
  }
}

export default GameCore;
