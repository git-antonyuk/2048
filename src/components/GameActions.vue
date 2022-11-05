<script setup lang="ts" name="GameActions"></script>

<template>
  <div class="game-actions">
    <button type="button" @click="() => $emit('onNewGame')">New game</button>
    <button type="button" @click="() => $emit('onGetSharedLink')">
      Share game
    </button>
  </div>
</template>

<style scoped lang="scss">
.game-actions {
  margin-top: 16px;
  display: flex;
  gap: 16px;
}
</style>
