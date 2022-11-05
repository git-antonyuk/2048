<script setup lang="ts" name="NewGameForm">
import { ref } from "vue";
import OptionsInput from "@/components/OptionsInput.vue";

const obstacles = ref<number>(3);
const boardSize = ref<number>(4);
</script>

<template>
  <form
    class="game-form"
    @submit.prevent="
      () => {
        $emit('onSubmit', {
          obstacles,
          boardSize,
        });
      }
    "
  >
    <h3>Game options:</h3>
    <OptionsInput
      label="Obstacles:"
      :value="obstacles"
      :length="5"
      :min="-1"
      @onInput="
        (v) => {
          obstacles = v;
        }
      "
    />
    <OptionsInput
      label="Board size:"
      :value="boardSize"
      :min="3"
      :length="5"
      @onInput="
        (v) => {
          boardSize = v;
        }
      "
    />
    <div class="game-form__btns">
      <button type="submit">Let's start new game</button>
      <button
        type="button"
        class="game-form__cancel"
        @click="() => $emit('onCancel')"
      >
        Cancel
      </button>
    </div>
  </form>
</template>

<style scoped lang="scss">
.game-form {
  margin-top: 24px;

  &__btns {
    margin-top: 16px;
    display: flex;
    gap: 16px;
  }

  &__cancel {
    opacity: 0.7;
  }
}
</style>
