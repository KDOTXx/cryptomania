<script setup>
import useMainStore from "@/stores/useMainStore";
import Bus from "@/composables/useBus";

const store = useMainStore();

const toggleChat = () => {
  store.toggleChat();
};

const toggleSupport = () => {
  Bus.$emit("toggleSupportWindow");
};
</script>

<template>
  <div :class="'floatingButtons ' + (store.chat ? '' : 'chatIsHidden')">
    <div class="floatingButton" @click="toggleSupport" v-if="!store.isGuest">
      <WebIcon icon="fal fa-question-circle" />
    </div>
    <div class="floatingButton" @click="toggleChat">
      <WebIcon icon="chat-outline" />
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/sass/variables";

.floatingButtons.chatIsHidden {
  right: 20px !important;
}

.floatingButtons {
  $width: 52px;
  $height: 52px;

  display: flex;
  flex-direction: row;
  position: fixed;
  bottom: 20px;
  right: $chat-width + 20px;
  z-index: 7000;
  transition: right 0.3s ease;

  @include themed() {
    .floatingButton {
      border-radius: 50%;
      background: t("sidebar");
      transition: background 0.3s ease;
      border: 1px solid t("border");
      width: $width;
      height: $height;
      box-shadow: t("shadow");
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-right: 10px;

      &:last-child {
        margin-right: 0;
      }

      svg,
      i {
        opacity: 0.6;
        transition: opacity 0.3s ease;
        fill: t("text");
        cursor: pointer;
        font-size: 1.1em;
      }

      &:hover {
        background: darken(t("sidebar"), 2.5%);

        svg,
        i {
          opacity: 1;
        }
      }
    }
  }
}
</style>
