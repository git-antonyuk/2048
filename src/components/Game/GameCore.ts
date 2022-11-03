import HtmlBoardUI from "./HtmlBoardUI";

class GameCore {
  private gameWrapper: HTMLDivElement;
  private tileSize = 90;
  private rows = 0;
  private columns = 0;
  private board: number[][] = [];
  public score = 0;
  private boardUI: HtmlBoardUI | null = null;
  private winNum = 2048;

  constructor(gameWrapper: HTMLDivElement, gameSize = 6) {
    this.gameWrapper = gameWrapper;
    this.setBoard(gameSize);
    this.initBoard();
    this.addKeyboardListeners();
    this.initGame();

    // for (let index = 0; index < 3000; index++) {
    //   this.slideUp();
    // }
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
    this.setRandomTileNum(2);
    // this.setRandomTileNum(-1);
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

  private setRandomTileNum(num = 1) {
    if (!this.boardUI) {
      console.warn("drawTiles: Board UI not initialized");
      return;
    }

    if (!this.isEmptyTile()) {
      return;
    }

    let exist = false;

    while (!exist) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.columns);

      if (this.board[r][c] === 0) {
        this.board[r][c] = num;
        this.updateTiles();
        exist = true;
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
    return row.filter((n) => n !== 0);
  }

  private addZeros(row: number[]) {
    for (let r = 0; r < this.rows; r++) {
      if (!row[r]) {
        row.push(0);
      }
    }
    return row;
  }

  private slide(row: number[]) {
    row = this.removeZeros(row);
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        this.score += row[i];

        // Win Game
        if (row[i] === this.winNum) {
          this.onUpdateWinFunction();
        }
      }
    }
    row = this.removeZeros(row);
    row = this.addZeros(row);
    this.onUpdateScoreFunction(this.score);
    return row;
  }

  private slideLeft() {
    for (let r = 0; r < this.rows; r++) {
      let row = this.board[r];
      row = this.slide(row);
      this.board[r] = row;
    }
    this.onSlideEnd();
  }

  private slideRight() {
    for (let r = 0; r < this.rows; r++) {
      let row = this.board[r];
      row.reverse();
      row = this.slide(row);
      row.reverse();
      this.board[r] = row;
    }
    this.onSlideEnd();
  }

  private slideUp() {
    for (let c = 0; c < this.columns; c++) {
      let rowFromColumn = this.board.map((_, r) => this.board[r][c]);
      rowFromColumn = this.slide(rowFromColumn);

      for (let r = 0; r < this.rows; r++) {
        this.board[r][c] = rowFromColumn[r];
      }
    }
    this.onSlideEnd();
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
    this.onSlideEnd();
  }

  private canMove() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        const current = this.board[r][c];
        const up = this.board?.[r]?.[c - 1];
        const right = this.board?.[r + 1]?.[c];
        const down = this.board?.[r]?.[c + 1];
        const left = this.board?.[r - 1]?.[c];

        if (up === 0 || right === 0 || down === 0 || left === 0) {
          return true;
        }

        if (
          current === up ||
          current === right ||
          current === down ||
          current === left
        ) {
          return true;
        }
      }
    }

    return false;
  }

  private onSlideEnd() {
    this.updateTiles();
    this.setRandomTileNum();
    // Game Over
    if (!this.canMove()) {
      this.onUpdateGameOverFunction();
    }
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

  // Events
  private onUpdateScoreFunction: Function = function () {};
  public onUpdateScore(fn: Function) {
    this.onUpdateScoreFunction = fn;
  }

  private onUpdateWinFunction: Function = function () {};
  public onUpdateWin(fn: Function) {
    this.onUpdateWinFunction = fn;
  }

  private onUpdateGameOverFunction: Function = function () {};
  public onUpdateGameOver(fn: Function) {
    this.onUpdateGameOverFunction = fn;
  }
}

export default GameCore;
