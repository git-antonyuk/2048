import HtmlBoardUI from "./HtmlBoardUI";
import {
  getUrlQueryParams,
  clearUrlQueryParams,
  getGameStateFromLocalStorage,
  setGameStateToStorage,
  clearGameStorage,
} from "./utils";

interface GameCoreProps {
  gameWrapper: HTMLDivElement;
  gameSize?: number;
  obstaclesNum?: number;
}

class GameCore {
  private gameWrapper: HTMLDivElement;
  private tileSize = 90;
  private rows = 0;
  private columns = 0;
  private board: number[][] = [];
  private score = 0;
  private boardUI: HtmlBoardUI | null = null;
  private winNum = 2048;
  private disabled = false;

  constructor({ gameWrapper, gameSize, obstaclesNum }: GameCoreProps) {
    this.gameWrapper = gameWrapper;
    this.setBoard(gameSize);
    this.initBoard();
    this.addKeyboardListeners();

    const gameStorage = this.getGameStateFromStorage();
    if (!gameStorage) {
      this.initGame(obstaclesNum);
    }
  }
  // Public Events
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

  // Public Methods
  public startNewGame(boardSize: number, obstacles: number) {
    this.board = [];
    this.score = 0;
    clearGameStorage();
    this.boardUI?.destroy();
    this.setBoard(boardSize);
    this.initBoard();
    this.initGame(obstacles);
  }
  public setDisabled(payload: boolean) {
    this.disabled = payload;
    this.boardUI?.setDisabled(payload);
  }
  public getScore() {
    return this.score;
  }
  public getSharedLink() {
    return `${window.location.origin}?board=${JSON.stringify(
      this.board
    )}&score=${this.score}`;
  }

  // Core
  private getGameStateFromStorage() {
    const queryParams = getUrlQueryParams();
    const localStorageParams = getGameStateFromLocalStorage();
    const board = queryParams.board || localStorageParams.board;
    const score = queryParams.score || localStorageParams.score;

    if (queryParams.board || queryParams.score) {
      clearUrlQueryParams();
    }

    if (!board || !score) {
      return null;
    }

    return {
      board: JSON.parse(board),
      score: +score,
    };
  }
  private setBoard(gameSize?: number) {
    const gameStorage = this.getGameStateFromStorage();

    if (gameStorage) {
      this.board = gameStorage.board;
      this.score = gameStorage.score;
      this.setColumnsAndRows();
      return;
    }

    if (gameSize) {
      for (let c = 0; c < gameSize; c++) {
        const row = [];
        for (let r = 0; r < gameSize; r++) {
          row.push(0);
        }
        this.board.push(row);
      }
    }
    this.setColumnsAndRows();
  }
  private setColumnsAndRows() {
    this.columns = this.board.length;
    this.rows = this.board[0].length;
  }
  private initGame(obstaclesNum?: number) {
    this.setRandomTileNum(2);
    if (obstaclesNum) {
      for (let i = 0; i < obstaclesNum; i++) {
        this.setRandomTileNum(-1);
      }
    }
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
  private removeZeros(rows: number[][]) {
    const arr = [];
    for (let i = 0; i < rows.length; i++) {
      arr[i] = rows[i].filter((n) => n !== 0);
    }
    return arr;
  }
  private addZeros(rows: number[][], arrLengths: number[]) {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      for (let a = 0; a < arrLengths[i]; a++) {
        if (!row[a]) {
          row.push(0);
        }
      }
      rows[i] = row;
    }
    return rows;
  }
  private splitRow(row: number[]) {
    const arr: number[][] = [];
    let chainIndex = 0;
    const add = (num: number) => {
      if (Array.isArray(arr[chainIndex])) {
        arr[chainIndex].push(num);
        return;
      }
      arr[chainIndex] = [];
      arr[chainIndex].push(num);
    };
    for (let i = 0; i < row.length; i++) {
      if (
        row[i] < 0 &&
        arr[chainIndex]?.length &&
        arr[chainIndex]?.[arr[chainIndex]?.length - 1] !== -1
      ) {
        chainIndex++;
      }
      if (arr[chainIndex]?.[arr[chainIndex]?.length - 1] === -1) {
        if (row[i] !== -1) {
          chainIndex++;
        }
      }
      add(row[i]);
    }
    return arr;
  }
  private getChunksLengths(arr: number[][]) {
    return arr.reduce((acc, list) => {
      acc.push(list.length);
      return acc;
    }, []);
  }
  private flatten(localRow: number[][]) {
    let res: number[] = [];
    for (let i = 0; i < localRow.length; i++) {
      res = res.concat(localRow[i]);
    }
    return res;
  }
  private slide(row: number[]) {
    let localRow = this.splitRow(row);
    const chunksLengths = this.getChunksLengths(localRow);
    localRow = this.removeZeros(localRow);
    for (let l = 0; l < localRow.length; l++) {
      const r = localRow[l];
      for (let i = 0; i < r.length - 1; i++) {
        if (r[i] > 0 && r[i] === r[i + 1]) {
          r[i] *= 2;
          r[i + 1] = 0;
          this.score += r[i];
          // Win Game
          if (r[i] === this.winNum) {
            this.onUpdateWinFunction();
          }
        }
      }
      localRow[l] = r;
    }

    localRow = this.removeZeros(localRow);
    localRow = this.addZeros(localRow, chunksLengths);
    this.onUpdateScoreFunction(this.score);
    return this.flatten(localRow);
  }
  private slideLeft() {
    if (this.disabled) {
      return;
    }
    for (let r = 0; r < this.rows; r++) {
      let row = this.board[r];
      row = this.slide(row);
      this.board[r] = row;
    }
    this.onSlideEnd();
  }
  private slideRight() {
    if (this.disabled) {
      return;
    }
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
    if (this.disabled) {
      return;
    }
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
    if (this.disabled) {
      return;
    }
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
          current >= 0 &&
          (current === up ||
            current === right ||
            current === down ||
            current === left)
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
    if (!this.canMove()) {
      this.onUpdateGameOverFunction();
    }
    setGameStateToStorage(this.board, this.score);
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
