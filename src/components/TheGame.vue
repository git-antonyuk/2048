<script setup lang="ts" name="TheGame">
import { ref, onMounted, onBeforeUnmount } from "vue";
import GameCore from "@/modules/Game/GameCore";
import useNotifications from "@/composables/useNotifications";
import HowToPlay from "@/components/HowToPlay.vue";
import TheScore from "@/components/TheScore.vue";
import GameActions from "@/components/GameActions.vue";
import NewGameForm from "@/components/NewGameForm.vue";

const { openNotification } = useNotifications();

let game: GameCore | null = null;
const gameRef = ref();
const score = ref(0);
const showNewGameForm = ref(false);

const setShowNewGameForm = (payload: boolean) => {
  showNewGameForm.value = payload;
};

const updateScore = (num: number) => {
  score.value = num;
};

const updateGameWin = () => {
  game?.setDisabled(true);
  openNotification({
    title: "WIN WIN WIN!",
    message: "Cool! Let's play one more time, start new game! 🤘",
    type: "success",
  });
};

const updateGameOver = () => {
  game?.setDisabled(true);
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
  setShowNewGameForm(true);
};

const startNewGame = ({
  obstacles,
  boardSize,
}: {
  obstacles: number;
  boardSize: number;
}) => {
  game?.setDisabled(false);
  setShowNewGameForm(false);
  game?.startNewGame(boardSize, obstacles);
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

onBeforeUnmount(() => {
  game = null;
});
</script>

<template>
  <div>
    <h1>2048</h1>
    <HowToPlay />
    <TheScore :score="score" />
    <GameActions
      @onNewGame="newGame"
      @onGetSharedLink="getSharedLink"
      :showNewGameForm="showNewGameForm"
    />
    <NewGameForm
      v-if="showNewGameForm"
      @onSubmit="startNewGame"
      @onCancel="
        () => {
          setShowNewGameForm(false);
        }
      "
    />
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
