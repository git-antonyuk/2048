<script setup lang="ts" name="OptionsInput">
const props = defineProps<{
  value: string | number;
  length: number;
  label: string;
  min: number;
}>();
</script>

<template>
  <div class="options-input">
    <h4>{{ props.label }}</h4>
    <ul class="options-input__wrapper">
      <li v-for="i in props.length" :key="i" class="options-input__item">
        <button
          class="options-input__btn"
          :class="{
            'options-input__btn--active': min + i === props.value,
          }"
          type="button"
          @click="() => $emit('onInput', min + i)"
        >
          {{ min + i }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.options-input {
  mask-type: 16px;

  &__wrapper {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }

  &__btn {
    opacity: 0.5;

    &--active {
      opacity: 1;
    }
  }
}
</style>
