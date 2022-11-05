import { LS_BOARD, LS_SCORE } from "./constants";

export const getUrlQueryParams = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return Object.fromEntries(urlSearchParams.entries());
};

export const clearUrlQueryParams = () => {
  window.history.replaceState({}, "", "/");
};

export const getGameStateFromLocalStorage = () => {
  return {
    board: window.localStorage.getItem(LS_BOARD),
    score: window.localStorage.getItem(LS_SCORE),
  };
};

export const setGameStateToStorage = (board: number[][], score: number) => {
  window.localStorage.setItem(LS_BOARD, JSON.stringify(board));
  window.localStorage.setItem(LS_SCORE, `${score}`);
};

export const clearGameStorage = () => {
  window.localStorage.removeItem(LS_BOARD);
  window.localStorage.removeItem(LS_SCORE);
};
