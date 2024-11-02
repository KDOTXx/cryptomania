<script setup lang="ts">
const props = defineProps<{
  value: boolean;
  onChange?: (state: boolean) => void;
}>();

const state = ref(props.value);

watch(
  () => props.value,
  (newValue) => {
    state.value = newValue;
  }
);

function toggle() {
  state.value = !state.value;

  if (props.onChange) {
    props.onChange(state.value);
  }
}
</script>

<template>
  <div :class="`switch ${state ? 'on' : 'off'}`" @click="toggle"></div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/themes";

.switch {
  border-radius: 25px;
  backdrop-filter: blur(25px);

  @include themed() {
    background: t("switchBackground");
  }

  transition: background 0.3s ease;

  $height: 30px;
  $off: 10px;

  width: 50px;
  height: $height;
  position: relative;
  cursor: pointer;

  &:after {
    content: "";
    border-radius: 50%;

    width: $height - $off;
    height: $height - $off;
    left: $off * 0.5;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    @include themed() {
      background: t("switchBackgroundDot");
    }

    transition: left 0.3s ease, background 0.3s ease;
  }

  &.on {
    @include themed() {
      background: t("switchBackgroundOn");
    }

    &:after {
      left: calc(100% - #{$height} + #{$off * 0.5});

      @include themed() {
        background: t("switchBackgroundDotOn");
      }
    }
  }
}
</style>
