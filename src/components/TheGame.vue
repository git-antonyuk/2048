<script setup lang="ts" name="TheGame">
import GameCore from "./Game/GameCore";
import { ref, onMounted } from "vue";

let game;
const gameRef = ref();
const score = ref(0);
const gameWin = ref(false);
const gameOver = ref(false);

const updateScore = (num: number) => {
  score.value = num;
};

const updateGameWin = () => {
  gameWin.value = true;
};

const updateGameOver = () => {
  gameOver.value = true;
};

onMounted(() => {
  const sample = [
    [-1, 2, -1, 2, 2],
    [2, -1, -1, 4, -1],
    [2, 0, 2, 2, 2],
    [-1, 2, 2, 2, -1],
    [2, 2, -1, 2, 2],
  ];
  game = new GameCore({
    gameWrapper: gameRef.value,
    gameSize: 6,
    obstaclesNum: 2,
  });
  game.onUpdateScore(updateScore);
  game.onUpdateWin(updateGameWin);
  game.onUpdateGameOver(updateGameOver);
});
</script>

<template>
  <div>
    <div v-if="gameWin">Congrats, you win the game 💫!</div>
    <div v-if="gameOver">Game Over 😩!</div>
    <h1>2048</h1>
    <a href="#rules">Check how to play</a>
    <p>Score: {{ score }}</p>
    <p>Best: 0</p>
    <button type="button">New game</button>
  </div>
  <div class="board-wrapper">
    <div ref="gameRef"></div>
  </div>
  <div>
    <h1>Game</h1>
    <p id="rules">
      <b>Rules:</b> Use your arrow keys or w,a,s,d keys to move the tiles. Tiles
      with the same number merge into one when they touch. Add them up to reach
      2048!
    </p>
  </div>
</template>

<style scoped></style>
