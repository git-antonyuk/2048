<script setup lang="ts" name="NotificationsWrapper">
import NotificationItem from "@/components/NotificationItem.vue";
import useNotifications from "@/composables/useNotifications";
const { notifications, isActive } = useNotifications();
</script>

<template>
  <div class="notifications" v-if="isActive">
    <div>
      <NotificationItem
        v-bind="item"
        v-for="item in notifications"
        :key="item.id"
        class="notifications__item"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.notifications {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &__item {
    margin-top: 24px;

    &:first-child {
      margin-top: 0;
    }
  }
}
</style>
