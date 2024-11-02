<script setup>
import Bus from "@/composables/useBus";
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";

const modals = ref([]);
const bodyClass = computed(() => document.body.classList);
const $last = computed(() => modals.value.length - 1);
const currentModal = computed(() => modals.value[$last.value]);

const handleEscapeKey = () => {
  if (modals.value.length && currentModal.value.escapable) {
    dismiss();
  }
};

const handleBackdropClick = () => {
  if (modals.value.length && currentModal.value.closeOnBackdrop) {
    dismiss();
  }
};

const getCssClasses = (index) => {
  const modal = modals.value[index];
  let classNames = modal.name;
  if (index < $last.value) classNames += " disabled";
  if (navigator.vendor.match(/apple/i)) classNames += " safari";
  return classNames;
};

const addModal = (options) => {
  const defaultOptions = {
    title: null,
    dismissible: true,
    name: "",
    escapable: false,
    closeOnBackdrop: true,
    backButton: false,
    onClose: () => {},
    onDismiss: () => {},
  };

  options = { ...defaultOptions, ...options };
  modals.value.push(options);
  Bus.$emit("opened", { index: $last.value, options });
  bodyClass.value.add("show");
  document.querySelector(".modals")?.scrollTo(0, 0);
};

const closeModal = (data = null, index = null) => {
  if (modals.value.length === 0) return;
  let localIndex =
    typeof index === "function"
      ? index(data, modals.value)
      : index ?? $last.value;
  Bus.$emit("closed", {
    index: localIndex,
    instance: modals.value[localIndex],
    data,
  });
  if (localIndex !== false && modals.value[localIndex])
    modals.value[localIndex].onClose(data);
  doClose(localIndex);
};

const dismiss = (index = null) => {
  if (modals.value.length === 0) return;
  let localIndex =
    typeof index === "function" ? index($last.value) : index ?? $last.value;
  if (modals.value[localIndex].onDismiss() === false) return;
  Bus.$emit("dismissed", {
    index: localIndex,
    instance: modals.value[localIndex],
  });
  doClose(localIndex);
};

const doClose = (index) => {
  if (!modals.value.length || !modals.value[index]) return;
  modals.value.splice(index, 1);
  if (!modals.value.length) {
    bodyClass.value.remove("show");
    Bus.$emit("destroyed");
  }
  document.querySelector(".modals")?.scrollTo(0, 0);
};

onMounted(() => {
  Bus.$on("modal:new", addModal);
  Bus.$on("modal:toggleBackButton", (data) => {
    modals.value[$last.value].backButton = data;
  });
  Bus.$on("modal:close", (data) => {
    closeModal(data);
  });
  Bus.$on("modal:dismiss", (index) => {
    dismiss(index);
  });
});

onBeforeUnmount(() => {
  // Bus.$off("modal:new", addModal);
  // Bus.$off("modal:toggleBackButton");
  // Bus.$off("modal:close");
  // Bus.$off("modal:dismiss");
});
</script>

<template>
  <transition tag="div" name="modal">
    <div
      class="modals"
      v-show="modals.length"
      tabindex="0"
      @keyup.esc.prevent="handleEscapeKey"
      @click="handleBackdropClick"
    >
      <div
        class="xmodal"
        v-for="(modal, index) in modals"
        :key="index"
        :class="getCssClasses(index)"
        @click.stop
      >
        <i
          v-if="modal.dismissible"
          class="modal-close fal fa-times"
          @click="handleBackdropClick"
        ></i>
        <div v-if="modal.title" class="heading">
          <transition
            :name="modal.page === 0 ? 'slide-right' : 'slide-left'"
            mode="out-in"
            tag="div"
          >
            <i
              v-if="modal.backButton"
              class="fal fa-angle-left back"
              key="1"
            ></i>
          </transition>
          <span class="title">{{ $t(modal.title) }}</span>
        </div>
        <div class="modal_template">
          <OverlayScrollbarsComponent
            :options="{
              scrollbars: { autoHide: 'leave' }
            }"
            class="os-theme-thin-light"
          >
            <component
              :is="{ ...modal.component }"
              v-bind="modal.props"
              ref="components"
              class="modal_content"
            />
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
