<script setup>
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";

defineProps(["title", "className"])

const model = defineModel();
</script>

<template>
  <transition tag="div" name="modal" v-if="model">
    <div class="modals" tabindex="0">
      <div :class="`xmodal ${className}`">
        <i class="modal-close fa fa-times" @click="model = false"></i>
        <div v-if="title" class="heading">
          <span class="title">{{ $t(title) }}</span>
        </div>
        <div class="modal_template">
          <OverlayScrollbarsComponent :options="{
            scrollbars: { autoHide: 'leave' },
          }" class="os-theme-thin-light">
            <div class="modal_content">
              <slot />
            </div>
          </OverlayScrollbarsComponent>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss">
@import "@/assets/sass/variables";

body.show {
  overflow: hidden;
}

.modals {
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50000;
  overflow-x: hidden;
  overflow-y: auto;
  transition: opacity 0.4s ease;
  display: flex;
}

.xmodal {
  @include themed() {
    background: t("modal");

    input {
      background: t("modal-input");
    }
  }

  .modal-close {
    position: absolute;
    right: 15px;
    top: 15px;
    opacity: 0.3;
    cursor: pointer;
    transition: opacity 0.3s ease;
    z-index: 25;

    &:hover {
      opacity: 1;
    }
  }

  max-height: 75vh;
  border-radius: 10px;
  transition: all 0.6s ease;
  will-change: transform;
  width: 600px;
  height: fit-content;
  display: flex !important;
  flex-direction: column;
  outline: unset !important;
  overflow-x: hidden;
  margin: auto;

  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, calc(-50% - 0.5px));

  &.disabled {
    opacity: 0.2;

    &::after {
      background: transparent;
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 100;
    }
  }

  .modal_template {
    height: calc(100% - 75px);
    overflow: hidden;

    .modal_content {
      overflow: hidden;
      padding: 0 20px 20px;
      display: flex;
      flex-direction: column;
    }

    .os-host {
      max-height: calc(75vh - 35px);
    }
  }

  .__view {
    height: fit-content;
    max-height: 80vh;
  }

  .heading {
    width: 100%;
    font-size: 1.2em;
    font-weight: 100;
    text-align: center;
    padding: 10px 10px 0;
  }

  .modalTitle {
    font-size: 1.1em;
  }

  @include themed() {
    .modal-tabs {
      display: flex;
      flex-direction: row;
      width: calc(100% - 40px);
      margin: 30px 20px;

      .modal-tab {
        width: 100%;
        background: t("input");
        transition: background 0.3s ease;
        text-align: center;
        padding: 2px;
        cursor: pointer;

        &:hover {
          background: lighten(t("input"), 2%);
        }

        &:first-child {
          border-top-left-radius: 3px;
          border-bottom-left-radius: 3px;
        }

        &:last-child {
          border-top-right-radius: 3px;
          border-bottom-right-radius: 3px;
        }
      }

      .modal-tab.active {
        background: t("secondary") !important;
        color: white;
      }
    }
  }

  /*  input {
        @include themed() {
          &:not(:read-only), &:not(:disabled) {
            &:hover, &:active {
              background: t('input');
            }
          }
        }
      }*/

  @include themed() {
    .content {
      color: t("text");
      background: t("sidebar");
      border: 1px solid rgba(t("sidebar"), 0.04);
      padding: 15px;
      width: 100%;
      transform: scale(0.7);
      opacity: 0;
      transition: all 0.3s;
      height: fit-content;
      min-height: 150px;
    }

    .loaderContainer {
      margin: auto;
      margin-top: 20px;
    }

    .unavailable {
      z-index: 4;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      @include blur(t("sidebar"), 0.8, 0.95, 24px);
      border-radius: 5px;

      .slanting {
        transform: skewY(-5deg) translateY(-50%);
        padding: 25px;
        position: absolute;
        top: 50%;
        background: rgba(t("text"), 0.05);
        width: 100%;

        .unavailableContent {
          font-size: 15px;
          transform: skewY(5deg);
          text-align: center;
        }
      }
    }
  }
}

.modal-enter,
.modal-leave-active {
  opacity: 0;
}

.modal-enter .xmodal,
.modal-leave-active .xmodal {
  opacity: 0;
  transform: translate(-50%, calc(-50% - 0.5px)) scale(0.95);
}

.xmodal.safari {
  position: unset !important;
  top: unset !important;
  left: unset !important;
  transform: unset !important;
}

.modal-enter .xmodal.safari,
.modal-leave-active .xmodal.safari {
  transform: scale(0.95) !important;
}

@media (max-width: 750px) {
  .xmodal {
    width: 100vw !important;
    border-radius: 0 !important;
  }
}
</style>
