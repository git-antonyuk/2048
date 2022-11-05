<script setup lang="ts" name="NotificationItem">
import useNotifications from "@/composables/useNotifications";
import type { TType } from "@/composables/useNotifications";
const props = defineProps<{
  id: string;
  title: string;
  closeText?: string;
  message: string;
  type?: TType;
}>();
const { closeNotification } = useNotifications();
</script>

<template>
  <div class="notification">
    <div
      :class="`notification--type notification--type-${props.type || 'info'}`"
    />
    <div class="notification__header">
      <div class="h3">{{ props.title }}</div>
      <button
        type="button"
        aria-label="close"
        @click="closeNotification(props.id)"
      >
        {{ props.closeText || "Close" }}
      </button>
    </div>
    <div class="notification__body">
      <p>{{ props.message }}</p>
    </div>
  </div>
</template>
<style scoped lang="scss">
.notification {
  position: relative;
  max-width: 400px;
  min-width: 240px;
  width: 100%;
  padding: 20px 16px;
  border-radius: 10px;
  background: var(--color-text);
  color: var(--color-background);
  overflow: hidden;
  border: 1px solid black;

  &__header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }

  &__body {
    margin-top: 24px;
  }

  &--type {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 8px;

    &-info {
      background-color: rgb(83, 83, 248);
    }
    &-warning {
      background-color: rgb(230, 230, 79);
    }
    &-error {
      background-color: rgb(228, 86, 86);
    }
    &-success {
      background-color: rgb(28, 196, 28);
    }
  }
}
</style>
