<script setup>
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";
import axios from "axios";
import _ from "lodash";
import useMainStore from "@/stores/useMainStore";
import Bus from "@/composables/useBus";

const store = useMainStore();

const show = ref(false);
const log = ref([]);

const notifications = {
  "App\\Notifications\\CustomNotification": defaultNotificationHandler,
  "App\\Notifications\\WithdrawAccepted": defaultNotificationHandler,
  "App\\Notifications\\WithdrawDeclined": defaultNotificationHandler,
  "App\\Notifications\\VipDiscordNotification": defaultNotificationHandler,
  "App\\Notifications\\TipNotification": defaultNotificationHandler,
  default_icon: "fad fa-galaxy",
};

function defaultNotificationHandler(notification) {
  return {
    title: notification.title,
    message: notification.message,
    data: notification.data,
  };
}

function dismiss(id) {
  log.value = log.value.filter((e) => e._id !== id);
  axios.post("/api/notifications/mark", { id });
}

function add(notification, meta) {
  log.value.push({
    _id: notification.id,
    title: meta.title,
    message: meta.message,
    icon: meta.icon || notifications.default_icon,
    data: meta.data,
  });
}

// Toggle notification view on custom event
Bus.$on("notifications:toggle", () => (show.value = !show.value));

// Add notification on specific event
if (!store.isGuest) {
  Bus.$on("event:notification", (notification) => {
    const meta = notifications[notification.type](notification);
    add(notification, meta);
  });

  onMounted(() => {
    axios.post("/api/notifications/unread").then(({ data }) => {
      forEach(data.notifications, (notification) => {
        const meta = notifications[notification.type](notification.data);
        add(notification, meta);
      });
    });
  });
}
</script>

<template>
  <transition mode="out-in" name="fade">
    <div class="notificationsContainer" v-if="show" :key="1">
      <div class="notifications">
        <i
          class="fal fa-times"
          data-close-notifications
          @click="() => (show = false)"
        ></i>
        <div class="title">{{ $t("general.notifications.title") }}</div>
        <div class="notifications-content os-host-flexbox">
          <OverlayScrollbarsComponent
            :options="{
              scrollbars: { autoHide: 'leave' },
              className: 'os-theme-thin-light',
            }"
          >
            <div
              role="alert"
              class="toast"
              data-autohide="false"
              v-for="notification in log"
              :key="notification._id"
            >
              <div class="toast-header">
                <WebIcon :icon="notification.icon" style="margin-right: 5px" />
                <span class="mr-auto" v-html="$t(notification.title)"></span>
                <i
                  @click="() => dismiss(notification._id)"
                  class="fal fa-times"
                  data-dismiss="toast"
                ></i>
              </div>
              <div
                class="toast-body"
                v-html="$t(notification.message, notification.data)"
              ></div>
            </div>
          </OverlayScrollbarsComponent>
        </div>
      </div>
      <div
        class="notifications-overlay"
        v-if="show"
        @click="() => (show = !show)"
      ></div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.notificationsContainer {
  z-index: 50000;

  .toast {
    opacity: 1 !important;
  }

  .os-host {
    width: 100%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
  opacity: 1;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
