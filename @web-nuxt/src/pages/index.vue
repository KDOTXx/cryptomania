<script setup>
import Bus from "@/composables/useBus";
import originalSvg from "@/assets/img/icons/original.svg";
import slotsSvg from "@/assets/img/icons/slots.svg";
import casinoSvg from "@/assets/img/icons/casino.svg";

const store = useMainStore();
const router = useRouter();
const route = useRoute();
const { $toast } = useNuxtApp();

const { selectedTab: tab } = useGameCategory();

const gamesPerView = ref(0);
const page = ref([]);
const width = ref(0);

const slotGames = computed(() => {
  let gameList = store.games.filter(
    (game) => game.category.includes("slots") && !game.isHidden
  );
  gameList.sort((a, b) =>
    isNaN(a.popularity) || isNaN(b.popularity) ? 0 : b.popularity - a.popularity
  );
  return gameList;
});

const originalGames = computed(() => {
  let gameList = store.games.filter(
    (game) => game.category.includes("originals") && !game.isHidden
  );
  gameList.sort((a, b) =>
    isNaN(a.popularity) || isNaN(b.popularity) ? 0 : b.popularity - a.popularity
  );
  return gameList;
});

const liveGames = computed(() => {
  let gameList = store.games.filter(
    (game) => game.category.includes("live") && !game.isHidden
  );
  gameList.sort((a, b) =>
    isNaN(a.popularity) || isNaN(b.popularity) ? 0 : b.popularity - a.popularity
  );
  return gameList;
});


function updateGamesPerView() {
  width.value = window.innerWidth;
  const prev = gamesPerView.value;
  gamesPerView.value = window.innerWidth <= 991 ? 9 : 6;

  if (prev !== gamesPerView.value) updateGames();
}

function initializePages() {
  updatePage({ id: "slot", current: 0, max: 1 });
  updatePage({ id: "live", current: 0, max: 1 });
  updatePage({ id: "original", current: 0, max: 1 });
}

function paginate(gameList, type) {
  const pageInfo = findPage(type);
  const start = pageInfo ? pageInfo.current * gamesPerView.value : 0;
  const end = start + gamesPerView.value;

  return gameList.slice(start, end);
}

function findPage(type) {
  return page.value.find((e) => e.id === type);
}

function updatePage(object) {
  page.value = page.value.filter((e) => e.id !== object.id);
  page.value.push(object);
}

function updateGames() {
  updatePage({ id: "slot", current: 0, max: 1 });
  updatePage({ id: "live", current: 0, max: 1 });
  updatePage({ id: "original", current: 0, max: 1 });
}

const paginatedOriginalGames = computed(() => {
  const start = findPage('original') ? (findPage('original').current * gamesPerView.value) : 0;
  const end = start + gamesPerView.value;

  return originalGames.value.slice(start, end);
});

const paginatedSlotGames = computed(() => {
  const start = findPage('slot') ? (findPage('slot').current * gamesPerView.value) : 0;
  const end = start + gamesPerView.value;

  return slotGames.value.slice(start, end);
});

const paginatedLiveGames = computed(() => {
  const start = findPage('live') ? (findPage('live').current * gamesPerView.value) : 0;
  const end = start + gamesPerView.value;

  return liveGames.value.slice(start, end);
});

watch(store.games, () => updateGames());

onMounted(() => {
  updateGamesPerView();
  window.addEventListener("resize", updateGamesPerView);
  initializePages();

  if (route.params.user && route.params.token) {
    alert("if power reset modal");
    // PasswordResetModal.methods.open(route.params.user, route.params.token);
  } else if (route.params.token) {
    alert("else power");
    // axios
    //   .post("/auth/confirmEmail", { token: route.params.token })
    //   .then(() => toast.success("Email confirmed"))
    //   .catch(() => toast.error("Invalid token"));
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateGamesPerView);
});

// Event listeners using the Bus
</script>

<template>
  <div v-if="store.games.length <= 0" style="display: flex; justify-content: center">
    <Loader />
  </div>

  <div class="container" style="">
    <GameCategorySearch :IsHome="true" />

    <template v-if="tab === 'lobby'">
      <div v-if="originalGames.length > 0" class="game-list" id="slot-games">
        <div class="category category-subtitle">
          <div class="icon">
            <img :src="originalSvg" alt="Original" />
          </div>
          <div class="name">Originals</div>
          <div class="viewAll" @click="$router.push('/casino/game/category/originals')">
            {{ $t("general.viewAll") }}
          </div>
          <div class="arrows">
            <div class="arrow" @click="
              findPage('original').current > 0
                ? updatePage(
                  Object.assign(findPage('original'), {
                    current: findPage('original').current - 1,
                  })
                )
                : null
              " :class="findPage('original') && findPage('original').current <= 0
                ? 'disabled'
                : ''
                ">
              <WebIcon icon="fa fa-chevron-left" />
            </div>
            <div class="arrow" @click="
              findPage('original').current < findPage('original').max
                ? updatePage(
                  Object.assign(findPage('original'), {
                    current: findPage('original').current + 1,
                  })
                )
                : null
              " :class="findPage('original') &&
                findPage('original').current >= findPage('original').max
                ? 'disabled'
                : ''
                ">
              <WebIcon icon="fa fa-chevron-right" />
            </div>
          </div>
        </div>
        <div class="CardGrid_cardGridElement__IfdAD sorted" key="original">
          <GameListEntry v-for="game in paginatedOriginalGames" :key="game.id" :game="game" />
        </div>
      </div>
      <div v-if="slotGames.length > 0" class="game-list" id="slot-games">
        <div class="category category-subtitle">
          <div class="icon">
            <img :src="slotsSvg" alt="Slots" />
          </div>
          <div class="name">Trending Slots</div>
          <div class="viewAll" @click="$router.push('/casino/game/category/slots')">
            {{ $t("general.viewAll") }}
          </div>
          <div class="arrows">
            <div class="arrow" @click="
              findPage('slot').current > 0
                ? updatePage(
                  Object.assign(findPage('slot'), {
                    current: findPage('slot').current - 1,
                  })
                )
                : null
              " :class="findPage('slot') && findPage('slot').current <= 0
                ? 'disabled'
                : ''
                ">
              <WebIcon icon="fa fa-chevron-left" />
            </div>
            <div class="arrow" @click="
              findPage('slot').current < findPage('slot').max
                ? updatePage(
                  Object.assign(findPage('slot'), {
                    current: findPage('slot').current + 1,
                  })
                )
                : null
              " :class="findPage('slot') &&
                findPage('slot').current >= findPage('slot').max
                ? 'disabled'
                : ''
                ">
              <WebIcon icon="fa fa-chevron-right" />
            </div>
          </div>
        </div>
        <div class="CardGrid_cardGridElement__IfdAD sorted" key="slot">
          <GameListEntry v-for="game in paginatedSlotGames" :key="game.id" :game="game" />
        </div>
      </div>
      <div v-if="liveGames.length > 0" class="game-list" id="live-games">
        <div class="category category-subtitle">
          <div class="icon">
            <img :src="casinoSvg" alt="Live" />
          </div>
          <div class="name">Trending Live Games</div>
          <div class="viewAll" @click="$router.push('/casino/game/category/live')">
            {{ $t("general.viewAll") }}
          </div>
          <div class="arrows">
            <div class="arrow" @click="
              findPage('live').current > 0
                ? updatePage(
                  Object.assign(findPage('live'), {
                    current: findPage('live').current - 1,
                  })
                )
                : null
              " :class="findPage('live') && findPage('live').current <= 0
                ? 'disabled'
                : ''
                ">
              <WebIcon icon="fa fa-chevron-left" />
            </div>
            <div class="arrow" @click="
              findPage('live').current < findPage('live').max
                ? updatePage(
                  Object.assign(findPage('live'), {
                    current: findPage('live').current + 1,
                  })
                )
                : null
              " :class="findPage('live') &&
                findPage('live').current >= findPage('live').max
                ? 'disabled'
                : ''
                ">
              <WebIcon icon="fa fa-chevron-right" />
            </div>
          </div>
        </div>
        <div class="CardGrid_cardGridElement__IfdAD sorted" key="live">
          <GameListEntry v-for="game in paginatedLiveGames" :key="game.id" :game="game" />
        </div>
      </div>
      <!-- <provider-slider v-if="tab === 'lobby'" /> -->
    </template>
    <template v-else-if="tab === 'originals'">
      <div class="game-list">
        <div class="category category-subtitle">
          <div class="icon">
            <img :src="originalSvg" alt="Original" />
          </div>
          <div class="name">Originals</div>
        </div>
        <CategoryGameList :sort="{ type: 'category', by: 'originals' }" :isCategory="false" :isIndex="false" />
      </div>
    </template>
    <template v-else-if="tab === 'slots'">
      <div class="game-list">
        <div class="category category-subtitle">
          <div class="icon">
            <img :src="slotsSvg" alt="Original" />
          </div>
          <div class="name">Slots</div>
        </div>
        <CategoryGameList :sort="{ type: 'category', by: 'slots' }" :isCategory="false" :isIndex="false" />
      </div>
    </template>
    <template v-else-if="tab === 'live'">
      <div class="game-list">
        <div class="category category-subtitle">
          <div class="icon">
            <img :src="casinoSvg" alt="Original" />
          </div>
          <div class="name">Live Games</div>
        </div>
        <CategoryGameList :sort="{ type: 'category', by: 'live' }" :isCategory="false" :isIndex="false" />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/variables";

.slotExplorerIndex {
  .games {
    justify-content: unset;

    @media (max-width: 1610px) {
      justify-content: center;
    }
  }

  .game_poster {
    width: calc(20% - 14px) !important;
    height: 225px !important;
    margin: 7px !important;

    @media (max-width: 1500px) {
      width: calc(25% - 14px) !important;
    }

    @media (max-width: 991px) {
      width: 155px !important;
      height: 155px !important;
      margin: 3px !important;
    }
  }

  .text .name {
    display: none;
  }

  .index_cat {
    margin-left: 0;
    margin-bottom: 15px;
  }
}

.index_cat_banner {
  display: flex;

  .slots {
    // background: url("@/assets/img/misc/index_slots.png") no-repeat left;
  }

  .sports {
    // background: url("@/assets/img/misc/sports.png") no-repeat left;
  }

  .live_games_unavailable {
    background: rgba(255, 255, 255, 0.025);
    border-radius: 12px;
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    i,
    svg {
      font-size: 2.5em;
      margin-bottom: 15px;
    }
  }

  .slots,
  .sports {
    width: 50%;
    background-size: cover;
    height: 200px;
    margin: 5px;
    cursor: pointer;
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.01);
    }
  }

  @media (max-width: 991px) {

    .slots,
    .sports {
      margin: 0;
    }

    .slots {
      margin-bottom: 10px;
    }
  }
}

.indexCategories {
  height: 75px;
  margin-bottom: 40px;

  .os-host {
    flex: 1;
    width: 0;

    .os-content {
      display: flex;
    }
  }

  @include themed() {
    display: flex;
    padding-left: 40px;
    padding-right: 40px;
    background: t("sidebar");

    .category {
      cursor: pointer;
      transition: color 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 25px 20px;
      white-space: nowrap;

      svg,
      i {
        margin-right: 10px;
      }

      &:hover {
        color: t("secondary");
      }

      &.active {
        color: t("secondary");
      }
    }
  }
}

@media (max-width: 450px) {
  .indexCategories {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
}
</style>
