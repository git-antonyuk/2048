<script setup lang="ts" name="TheGame">
import GameCore from "./Game/GameCore";
import { ref, onMounted } from "vue";
import useNotifications from "@/composables/useNotifications";
import HowToPlay from "./HowToPlay.vue";
import TheScore from "./TheScore.vue";
import GameActions from "./GameActions.vue";
const { openNotification } = useNotifications();

let game: GameCore;
const gameRef = ref();
const score = ref(0);
const gameWin = ref(false);

const updateScore = (num: number) => {
  score.value = num;
};

const updateGameWin = () => {
  gameWin.value = true;
};

const updateGameOver = () => {
  game.setDisabled(true);
  openNotification({
    title: "Game Over!",
    message: "Ohh, no 😩... Try one more time. Start new game 🦾",
    type: "error",
  });
};

const getSharedLink = () => {
  const link = game?.getSharedLink();

  if (!link) {
    return;
  }

  navigator?.clipboard?.writeText(link);

  openNotification({
    title: "Link copied to clipboard!",
    message: "Send this link to your friend 😎",
    type: "success",
  });
};

const newGame = () => {
  openNotification({
    title: "New game 1",
    message: "New game message",
  });
};

onMounted(() => {
  game = new GameCore({
    gameWrapper: gameRef.value,
    gameSize: 6,
    obstaclesNum: 2,
  });
  updateScore(game.getScore());
  game.onUpdateScore(updateScore);
  game.onUpdateWin(updateGameWin);
  game.onUpdateGameOver(updateGameOver);
});
</script>

<template>
  <div>
    <div v-if="gameWin">Congrats, you win the game 💫!</div>
    <h1>2048</h1>
    <HowToPlay />
    <TheScore :score="score" />
    <GameActions @onNewGame="newGame" @onGetSharedLink="getSharedLink" />
  </div>
  <div class="board-wrapper">
    <div ref="gameRef"></div>
  </div>
</template>

<style lang="scss">
.board-wrapper {
  padding: 16px;
  border-radius: 10px;
  background-color: #e5e4eb;
  display: inline-block;
  margin-top: 16px;
}

.board {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border-radius: 10px;
}

.tile {
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: bold;
  font-size: 1.8em;
  color: white;

  &--c-0 {
    background-color: #1c1735;
  }
  &--c-1 {
    background-color: #b0cc44;
  }
  &--c-2 {
    background-color: #78ba3f;
  }
  &--c-4 {
    background-color: #3ab074;
  }
  &--c-8 {
    background-color: #2da8e1;
  }
  &--c-16 {
    background-color: #3566af;
  }
  &--c-32 {
    background-color: #514697;
  }
  &--c-64 {
    background-color: #7d4394;
  }
  &--c-128 {
    background-color: #c0308a;
  }
  &--c-256 {
    background-color: #db2f4e;
  }
  &--c-512 {
    background-color: #e04932;
  }
  &--c-1024 {
    background-color: #e96125;
  }
  &--c-2048 {
    background-color: #ff0000;
  }

  &--c--1 {
    background-image: url("/img/stop.png");
    background-size: cover;
    font-size: 0;
  }
}
</style>
