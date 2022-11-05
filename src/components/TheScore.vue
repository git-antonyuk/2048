<script setup lang="ts" name="TheScore">
import { watch, ref } from "vue";
const props = defineProps<{
  score: number;
}>();

const upScore = ref<number>(0);

const isAnimationInProgress = ref(false);
const animate = () => {
  if (isAnimationInProgress.value) {
    return;
  }
  isAnimationInProgress.value = true;

  setTimeout(() => {
    isAnimationInProgress.value = false;
  }, 300);
};

watch(
  () => props.score,
  (newValue, oldValue) => {
    if (!oldValue) return;
    upScore.value = newValue - oldValue;
    animate();
  }
);
</script>

<template>
  <div class="score">
    <h2 class="h2">Score: {{ score }}</h2>
    <div
      class="score__up h2"
      :class="{ 'score__up--active': isAnimationInProgress }"
    >
      +{{ upScore }}
    </div>
  </div>
</template>
<style scoped lang="scss">
.score {
  position: relative;
  &__up {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 110px;
    right: 0;
    bottom: 0;
    font-size: 28px;
    transition: 0.4s;

    &--active {
      opacity: 1;
      transform: translate3d(0, -50%, 0);
    }
  }
}
</style>
