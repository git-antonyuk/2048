<script setup lang="ts" name="TheGame">
import GameCore from "./Game/GameCore";
import { ref, onMounted } from "vue";

let game;
const gameRef = ref();
const score = ref(0);

const updateScore = (num: number) => {
  score.value = num;
};

onMounted(() => {
  game = new GameCore(gameRef.value);
  game.onUpdateScope(updateScore);
});
</script>

<template>
  <div>
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
