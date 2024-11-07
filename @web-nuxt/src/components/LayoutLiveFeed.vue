<script setup>
import Bus from "@/composables/useBus";
import useMainStore from "@/stores/useMainStore";
import { useAxios } from "@/composables/useAxios";
import { usePermissions } from "@/composables/usePermissions";

// import OverviewModal from "../modals/OverviewModal.vue";
// import UserModal from "../modals/UserModal.vue";

const apiClient = useAxios();
const route = useRoute();
const store = useMainStore();

const { $checkPermission } = usePermissions();

const lastGames = ref([]);
const liveFeedEntriesWrap = ref(10);
const liveFeedEntries = ref(10);
const intervalId = ref(null);

const getGames = async () => {
  lastGames.value = [];

  try {
    const { data } = await apiClient.post("/api/data/latestGames", {
      mode: "casino",
      type: store.liveChannel,
      count: liveFeedEntries.value,
    });

    lastGames.value = data.reverse();
  } catch (error) {
    console.error("Failed to fetch games:", error);
  }
};

const rotateLastGames = () => {
  intervalId.value = setInterval(() => {
    if (lastGames.value.length > 0 && store.liveChannel === "all") {
      lastGames.value.unshift(lastGames.value.pop());
    }
  }, 1000);
};

const openUserModal = (id) => {
  //   UserModal.methods.open(id);
};

const openOverviewModal = (id, game) => {
  //   OverviewModal.methods.open(id, game);
};

const gameIconSrc = (category) => {
  if (category.includes("originals")) return "/icons/original.svg";
  if (category.includes("slots")) return "/_nuxt/assets/img/icons/slots.svg";

  return "/icons/casino.svg";
};

// Event handlers
const handleLiveGameEvent = (e) => {
  if (store.liveChannel === "mine" && e.user._id !== user.value.user._id)
    return;
  if (
    store.liveChannel === "lucky_wins" &&
    (e.game.multiplier < 10 || e.game.status !== "win")
  )
    return;
  if (
    store.liveChannel === "high_rollers" &&
    e.game.wager < store.currencies[e.game.currency].highRollerRequirement
  )
    return;

  setTimeout(() => lastGames.value.unshift(e), e.delay);
};

onMounted(async () => {
  await getGames();
  liveFeedEntriesWrap.value = liveFeedEntries.value;

  Bus.$on("event:liveGame", handleLiveGameEvent);
});

onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }

  // Bus.$off("event:liveGame", handleLiveGameEvent);
  // Bus.$off("event:liveSportGame", handleLiveSportGameEvent);
});

watch(store.liveChannel, getGames);
watch(liveFeedEntries, getGames);
watch(lastGames, (newVal) => {
  if (newVal.length >= liveFeedEntries.value) newVal.pop();
});

watch(route, (to, from) => {
  if (
    (to.path.startsWith("/sport") && !from.path.startsWith("/sport")) ||
    (from.path.startsWith("/sport") && !to.path.startsWith("/sport"))
  ) {
    getGames();
  }
});
</script>

<template>
  <div class="container">
    <div class="live">
      <div class="header">
        <template>
          <div class="live_tabs">
            <div class="tabs">
              <div v-if="!store.isGuest" @click="store.setLiveChannel('mine')"
                :class="`tab ${store.liveChannel === 'mine' ? 'active' : ''}`">
                {{ $t("general.bets.mine") }}
              </div>
              <div @click="store.setLiveChannel('all')" :class="`tab ${store.liveChannel === 'all' ? 'active' : ''}`">
                {{ $t("general.bets.all") }}
              </div>
              <div @click="store.setLiveChannel('high_rollers')" :class="`tab ${store.liveChannel === 'high_rollers' ? 'active' : ''
                }`">
                {{ $t("general.bets.high_rollers") }}
              </div>
              <div @click="store.setLiveChannel('lucky_wins')" :class="`tab ${store.liveChannel === 'lucky_wins' ? 'active' : ''
                }`">
                {{ $t("general.bets.lucky_wins") }}
              </div>
            </div>
          </div>
        </template>
      </div>
      <template>
        <div class="live_table_container">
          <Loader v-if="lastGames.length == 0" />

          <table class="live-table" v-else>
            <thead>
              <tr>
                <th>{{ $t("general.bets.player") }}</th>
                <th>{{ $t("general.bets.game") }}</th>
                <th class="d-none d-xl-table-cell">
                  {{ $t("general.bets.bet") }}
                </th>
                <th class="d-none d-xl-table-cell">
                  {{ $t("general.bets.mul") }}
                </th>
                <th class="payout-column">{{ $t("general.bets.win") }}</th>
              </tr>
            </thead>
            <tbody class="live_games">
              <tr v-for="game in lastGames" :key="game.game._id">
                <td>
                  <div>
                    <a :href="game.user.private_bets !== true ||
                        (store.isGuest
                          ? false
                          : !$checkPermission('ignore_privacy'))
                        ? 'javascript:void(0)'
                        : $route.path
                      " @click="
                        game.user.private_bets !== true ||
                          (store.isGuest
                            ? false
                            : !$checkPermission('ignore_privacy'))
                          ? openUserModal(game.user._id)
                          : false
                        ">
                      <span v-if="
                        game.user.private_bets &&
                        (store.isGuest ? true : store.user.access === 'user')
                      ">
                        <WebIcon icon="fad fa-user-secret mr-1" />
                        {{ $t("general.bets.hidden_name") }}
                      </span>
                      <span v-else>
                        <img :src="`/_nuxt/assets/img${game.user.avatar.replace('avatar', 'avatars')}`" class="avatar" />
                        {{ game.user.name }}
                      </span>
                    </a>
                  </div>
                </td>
                <td>
                  <div class="gameIcon">
                    <router-link :to="`/casino/game/${game.metadata.id}`" tag="div">
                      <img :src="gameIconSrc(game.metadata.category)" alt="game category" width="30" height="30" />
                    </router-link>
                    <div class="name">
                      <router-link :to="`/casino/game/${game.metadata.id}`">{{
                        game.metadata.name
                        }}</router-link>
                    </div>
                  </div>
                </td>
                <td class="d-none d-xl-table-cell clickable" @click="openOverviewModal(game.game._id, game.game.game)">
                  <div>
                    <WebIcon :icon="store.currencies[game.game.currency].icon" :style="{
                      color: store.currencies[game.game.currency].style,
                    }" />
                    <!-- <unit
                      :fiat="store.fiatView"
                      :to="game.game.currency"
                      :value="game.game.wager"
                      class="unit-value"
                    ></unit> -->
                  </div>
                </td>
                <td class="d-none d-xl-table-cell clickable" @click="openOverviewModal(game.game._id, game.game.game)">
                  <div class="multiplier">
                    <img src="@/assets/img/increase.svg" class="increase-icon" />
                    {{
                      (game.game.status === "win" || game.game.multiplier < 1 ? game.game.multiplier : 0)?.toFixed(2) }}x
                      </div>
                </td>
                <td class="payout-column clickable" @click="openOverviewModal(game.game._id, game.game.game)">
                  <div :class="game.game.status === 'win' ? 'live-win' : ''">
                    <WebIcon :icon="store.currencies[game.game.currency].icon" :style="{
                      color: store.currencies[game.game.currency].style,
                    }" />
                    <!-- <unit
                      :fiat="store.fiatView"
                      :to="game.game.currency"
                      :value="game.game.profit"
                      class="unit-value"
                    ></unit> -->
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.container {
  table-layout: fixed;
  overflow-x: hidden;
  width: 100%;
  border-collapse: collapse;
  box-sizing: inherit;
}

.live-table th,
.live-table td {
  padding: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.avatar {
  margin-right: 5px;
  width: 1.2rem;
  height: 1.2rem;
  /* Fixed height to prevent layout shifts */
}

.gameIcon {
  display: flex;
  align-items: center;
}

.gameIcon img {
  margin-right: 5px;
  width: 100%;
  /* Fixed width to prevent layout shifts */
  height: 100%;
  /* Fixed height to prevent layout shifts */
}

.name {
  margin-left: 5px;
}

.unit-value {
  margin-left: 5px;
}

.multiplier {
  display: flex;
  align-items: center;
}

.increase-icon {
  margin-right: 5px;
}

.live-win {
  font-weight: bold;
  color: green;
}

.payout-column {
  text-align: right;
}

.clickable {
  cursor: pointer;
}
</style>
