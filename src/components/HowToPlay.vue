<script setup lang="ts" name="HowToPlay">
import useNotifications from "@/composables/useNotifications";
const { openNotification } = useNotifications();

const open = () => {
  openNotification({
    title: "Rules:",
    message:
      "Use your arrow keys or w,a,s,d keys to move the tiles. Tiles with the same number merge into one when they touch. Add them up to reach 2048!",
  });
};
</script>

<template>
  <div>
    <a @click.prevent="open">Check how to play</a>
  </div>
</template>

<style lang="scss" scoped>
.blur-game {
  filter: blur(10px);
}
</style>
