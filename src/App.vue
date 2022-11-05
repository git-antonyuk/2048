<script setup lang="ts" name="AppComponent">
import NotificationsWrapper from "./components/NotificationsWrapper.vue";
import TheGame from "./components/TheGame.vue";
import useNotifications from "@/composables/useNotifications";
const { isActive } = useNotifications();
</script>

<template>
  <div :class="{ 'blur-game': isActive }">
    <TheGame />
  </div>
  <NotificationsWrapper />
</template>

<style lang="scss" scoped>
.blur-game {
  filter: blur(10px);
}
</style>
