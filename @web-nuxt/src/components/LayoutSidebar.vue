<script setup>
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";
import LeaderboardModal from "@/components/Modals/LeaderboardModal.vue";
import vClickOutside from "v-click-outside";
import useStore from "@/stores/useMainStore";
import { usePermissions } from "@/composables/usePermissions";
import Bus from "@/composables/useBus";
import menuSvg from "@/assets/img/menu.svg";
import vtxSvg from "@/assets/img/vtx.svg";
import vipSvg from "@/assets/img/vip.svg";
import homeSvg from "@/assets/img/home.svg";
import dashboardSvg from "@/assets/img/dashboard.svg";
import competitionSvg from "@/assets/img/competition.svg";
import originalSvg from "@/assets/img/icons/original.svg";
import casinoSvg from "@/assets/img/icons/casino.svg";
import affiliatesSvg from "@/assets/img/affiliates.svg";
import slotsSvg from "@/assets/img/icons/slots.svg";

const { $checkPermission } = usePermissions();

const router = useRouter();
const store = useStore();

const mobileToggle = ref(false);
const tempBlock = ref(false);

const isGuest = computed(() => store.isGuest);
const sidebar = computed(() => store.sidebar);
const sportGames = computed(() => store.sportGames);
const betSlip = computed(() => store.betSlip);

function toggleSidebar() {
  store.toggleSidebar();
}

function goToCasino() {
  router.push("/");
}

function goToAdmin() {
  window.location.href = "/admin";
}

const openLeaderboard = () => {
  LeaderboardModal.methods.open();
};

function openSearch() {
  Bus.$emit("search:toggle");
}

function navigateTo(game) {
  store.setSportFilter(game.liveCount ? "live" : "upcoming");
  router.push(`/sport/category/${game.id}`);
}

function closeSidebar() {
  if (!tempBlock.value) mobileToggle.value = false;
}

onMounted(() => {
  Bus.$on("sidebar:toggleMobile", () => {
    tempBlock.value = true;
    setTimeout(() => (tempBlock.value = false), 1);
    mobileToggle.value = !mobileToggle.value;
  });
});
</script>

<template>
  <div :class="`sidebar ${sidebar || mobileToggle ? 'visible' : 'hidden'} ${mobileToggle ? 'mobileToggle' : ''
    }`" @click="mobileToggle = false" v-click-outside="closeSidebar">
    <div class="fixed" style="border-right: 1px solid #2a2e38 !important">
      <div class="sidebar-header" style="
          border-bottom: 1px solid #2a2e38 !important;
          align-items: center;
          padding-left: 1.25rem;
        ">
        <div class="toggle" @click="toggleSidebar" style="margin: 0 !important; padding: 0 6px">
          <img :src="menuSvg" alt="menu" />
        </div>
        <div class="NavigationTab_root__3914H">
          <div class="NavigationTab_container__1rlca">
            <button class="NavigationTab_active" @click="goToCasino">
              <span>Casino</span>
            </button>
          </div>
        </div>
      </div>

      <OverlayScrollbarsComponent :options="{
        scrollbars: { autoHide: 'leave' },
      }" class="games">
        <div class="logo game" @click="openSearch">
          <WebIcon icon="fa fa-search" />
          <input :placeholder="$t('general.search')" />
        </div>

        <div class="divider"></div>
        <a class="NavigationToken_token__qSrff NavigationToken_active__aTNwj" href="/token">
          <img :src="vtxSvg" alt="token" height="48px" width="48" />
          <div class="NavigationToken_textContainer__V5wi9">
            <p>Vortex <span class="NavigationToken_code__59rbj">(VTX)</span></p>
            <p class="NavigationToken_coming__w0kag">
              <span class="NavigationToken_code__59rbj">$0.00</span>
              <span class="TokenPercentageText_positive__ZCgKR">+0.00%</span>
            </p>
          </div>
        </a>

        <div class="divider"></div>
        <NuxtLink to="/" class="game">
          <img :src="homeSvg" alt="Home" class="icon" width="24" height="24" />
          <div>Home</div>
        </NuxtLink>

        <div v-if="$checkPermission('dashboard')" @click="goToAdmin" class="game">
          <img :src="dashboardSvg" alt="Admin" class="icon" />
          <div>{{ $t("general.sidebar.admin") }}</div>
        </div>

        <NuxtLink to="/vip" class="game">
          <img :src="vipSvg" alt="VIP" class="icon" />
          <div>VIP</div>
        </NuxtLink>

        <div class="divider"></div>
        <div class="game" @click="openLeaderboard">
          <img :src="competitionSvg" alt="competition" class="icon" />
          <div>Competition</div>
        </div>
        <div class="divider"></div>

        <NuxtLink to="/casino/game/category/originals" class="game">
          <img :src="originalSvg" alt="ORIGINALS" />
          <div>Originals</div>
        </NuxtLink>

        <NuxtLink to="/casino/game/category/slots" class="game">
          <img :src="slotsSvg" alt="SLOTS" />
          <div>Slots</div>
        </NuxtLink>

        <NuxtLink to="/casino/game/category/live" class="game">
          <img :src="casinoSvg" alt="LIVE_CASINO" />
          <div>Live Games</div>
        </NuxtLink>

        <div class="divider"></div>

        <NuxtLink to="/partner" class="game">
          <img :src="affiliatesSvg" alt="affiliates" class="icon" />
          <div>{{ $t("footer.affiliates") }}</div>
        </NuxtLink>
      </OverlayScrollbarsComponent>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/sass/variables";

.sidebar.mobileToggle {
  display: block !important;
  width: 232px;
  opacity: 1;

  .fixed {
    // padding: 18px 30px;
    padding-bottom: 120px;
  }
}

@media (min-width: 1700px) {
  .sidebar.visible~.pageWrapper {
    padding-left: $sidebar-width-expand;
  }
}

@media (max-width: 991px) {
  .sidebar.visible~.pageWrapper {
    padding-left: 0 !important;
  }
}

@media (min-width: 1700px),
(max-width: 991px) {
  .sidebar .games {
    height: calc(100% - 95px) !important;
  }

  .sidebar .sidebar-header {
    display: flex !important;
  }

  .sidebar.visible {
    width: $sidebar-width-expand;

    .sidebar-description {
      opacity: 1;
      margin-left: 25px;
      height: auto;
    }

    .divider {
      // margin-top: 35px !important;
    }

    .fixed {
      width: $sidebar-width-expand;

      .sidebar-header {
        .NavigationTab_root__3914H {
          display: flex;
          padding: 1rem;
          width: 100%;
          transition: 0.2s opacity;
          opacity: 1;
          pointer-events: auto;

          .NavigationTab_container__1rlca {
            border-radius: 0.375rem;
            overflow: hidden;
            background: #504c54;
            height: 3rem;
            display: flex;

            button {
              color: white;
              flex: 1 1;
              text-align: center;
              font-size: 0.875rem;
              line-height: 150%;

              span {
                padding: 10px;
              }

              &:hover {
                background: url("/img/misc/casino-sports-bg-disable.svg");
                border: 1px solid #343843;
              }
            }

            button:first-child {
              border-right: 0;
              border-radius: 0.375rem 0 0 0.375rem;
            }

            button:last-child {
              border-left: 0;
              border-radius: 0 0.375rem 0.375rem 0;
            }

            .NavigationTab_active {
              font-weight: 700;
              text-shadow: 0 1px 0 #000;
              background: url("/img/misc/casino-sports-bg-active.svg"); // #6d39d5;
              border: 1px solid #504c54;
            }

            .NavigationTab_disable {
              font-weight: 700;
              color: gray;
              text-shadow: 0 1px 0 #000;
              background: #202329;
              border: 1px solid #504c54;
            }
          }
        }
      }

      .NavigationToken_token__qSrff {
        gap: 0.62rem;
        // border-bottom: 1px solid #2a2e38;
        padding: 0.5rem 1.2rem;
        font-size: 0.875rem;
        font-weight: 700;
        display: flex;
        justify-content: start;
        transition: 0.2s all;
        position: relative;

        &:hover p:first-child {
          color: #886cff;
        }

        .NavigationToken_textContainer__V5wi9 {
          display: flex;
          flex-direction: column;
          justify-content: center;

          @media (max-width: 991px) {
            display: none;
          }

          p {
            text-align: left;
            transition: 0.2s color;
            margin: 0;

            .NavigationToken_code__59rbj {
              color: #fff;
            }
          }

          .NavigationToken_coming__w0kag {
            color: #3dd179;
            margin: 0;
          }
        }
      }

      .game {
        justify-content: unset;
        padding-left: 40px;
        padding-right: 40px;
        position: relative;
        white-space: nowrap;
        color: white !important;

        .liveCount {
          @include themed() {
            background: t("secondary");
            color: black;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 10px;
            font-size: 0.6em;
            font-weight: 600;
            position: absolute;
            top: 8px;
          }
        }

        i {
          width: 25px;
        }

        svg {
          margin-right: 11px;
        }

        div {
          display: block;
          opacity: 1;
          margin-left: 10px;
          max-width: 80%;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &:hover {
          color: #886cff !important;
        }
      }
    }

    .promotion {
      height: unset;

      .name,
      .description {
        opacity: 1;
        transition-delay: 0.4s;
        display: block;
      }

      .image {
        position: unset;
        top: unset;
        left: unset;
      }
    }
  }
}

.sidebar {
  width: $sidebar-width;
  flex-shrink: 0;
  z-index: 38002;
  transition: width 0.3s ease;

  .os-scrollbar-horizontal {
    display: none;
  }

  .sidebar-description {
    font-weight: 600;
    left: 0;
    height: 0;
    transition: height 0.3s ease, opacity 0.3s ease, margin-left 0.3s ease;
    margin-left: 5px;
    opacity: 0;
    text-transform: uppercase;
    font-size: 14px;
    margin-bottom: 10px;
  }

  .promotion {
    margin-top: 20px;
    background: linear-gradient(274.28deg,
        rgba(255, 195, 76, 0) 0%,
        rgb(25 32 46) 100%),
      #20293c;
    padding: 20px 40px;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    height: 90px;
    transition: height 0.3s ease;

    .image {
      width: 40px;
      height: 40px;
      background: url("/img/misc/treasure.png") no-repeat center;
      background-size: cover;
      margin-right: 20px;

      position: absolute;
      top: 25px;
      left: 20px;
    }

    .name,
    .description {
      transition: opacity 0.3s ease;
      opacity: 0;
      transition-delay: 0s;
      display: none;
    }

    .name {
      color: #ffc34c;
      text-shadow: 0 0 8px rgba(255, 195, 76, 0.62);
      font-size: 16.5px;
    }

    .description {
      margin-top: 2px;
      font-weight: 500;
      font-size: 14.5px;
    }
  }

  .fixed {
    position: fixed;
    top: 0;
    width: $sidebar-width;
    height: 100%;

    @include themed() {
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.56);
      background: t("sidebar");
      transition: background 0.15s ease, width 0.3s ease;

      .sidebar-header {
        height: $header-height;
        display: flex;

        @media (max-width: 768px) {
          display: none !important;
        }

        .toggle {
          display: flex;
          // padding: 10px 14px;
          // background: t('chat-accent');
          margin: auto;
          cursor: pointer;
          font-size: 1.5rem;
          transition: background 0.3s ease;
          border-radius: 4px;

          &:hover {
            background: t("header-block");
          }
        }
      }

      .games {
        // height: 100%;

        .logo {
          // background: url('/img/misc/logo.png') no-repeat center;
          width: 100%;
          // height: 100%;
          background-size: contain;
          margin-top: 12px;
          margin-bottom: 12px;
          margin-left: auto;
          display: flex;
          cursor: pointer;
          padding: 16px;

          position: relative;
          cursor: pointer;
          width: 100%;

          input {
            padding-left: 50px;
            pointer-events: none;
            border-radius: 0.375rem;
            background-color: #0000 !important;
            border-color: #2a2e38 !important;

            // @include themed() {
            //   background: t('input-dark');

            //   &::placeholder {
            //     color: t('link');
            //   }
            // }
          }

          svg,
          i {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 30px;
          }
        }

        &.sportSidebar {
          height: calc(100% - 35px);
        }

        border-radius: 3px;

        .divider {
          margin: 5px 0;
          transition: margin-top 0.3s ease;
          border-bottom: 1px solid #2a2e38 !important;
        }

        .btn {
          width: calc(100% - 30px);
          margin-left: 15px;
          margin-right: 15px;
          margin-bottom: 15px;
          border-radius: 20px;

          &.btn-primary {
            border-bottom: 3px solid darken(t("secondary"), 5%);
          }

          &.btn-secondary {
            // border-bottom: 3px solid darken($gray-600, 5%);
          }
        }
      }
    }

    .sidebar-header {
      .NavigationTab_root__3914H {
        display: none;
        opacity: 0;
        transition: opacity 1s ease;
      }
    }

    .NavigationToken_token__qSrff {
      gap: 0.62rem;
      // border-bottom: 1px solid #2a2e38;
      // padding: 1rem;
      font-size: 0.875rem;
      font-weight: 700;
      display: flex;
      transition: 0.2s all;
      position: relative;
      justify-content: center;

      .NavigationToken_textContainer__V5wi9 {
        display: none;
      }
    }

    .game {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 60px;
      font-size: 16px;
      cursor: pointer;
      position: relative;
      transition: color 0.3s ease;

      @include themed() {
        color: t("link");

        &.featured {
          color: #ffd92b;
        }
      }

      &.NuxtLink-exact-active {
        @include themed() {
          color: #886cff !important;
          border-left: solid 5px #886cff !important;
          background-color: #1b172d;
        }

        &:before {
          opacity: 1;
        }

        &:after {
          opacity: 1;
        }
      }

      @include themed() {
        &.highlight {
          color: t("secondary") !important;
        }
      }

      div {
        display: none;
        opacity: 0;
        transition: opacity 1s ease;
      }

      .vue-content-placeholders-img {
        display: block !important;
        opacity: 1 !important;
      }

      .vue-content-placeholders-img {
        height: 15px;
        width: 15px;
        border-radius: 3px;
      }

      img {
        width: 14px;
        height: 14px;
      }

      i {
        cursor: pointer;
      }

      &:hover {
        opacity: 1;
      }

      .online {
        position: absolute !important;
        top: 4px !important;
        left: 17px !important;
        border-radius: 50%;
        width: 15px;

        @include themed() {
          background: t("secondary");
        }

        color: white;
        height: 15px;
        font-size: 0.5em;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
    }

    .game.NuxtLink-exact-active {
      opacity: 1;
    }
  }

  &.hidden .fixed .NavigationToken_token__qSrff .NavigationToken_textContainer__V5wi9 {
    display: none;
  }

  &.visible .fixed .sidebar-header {
    // .logo {
    //   display: flex; // unset;
    //   align-items: center;
    // }

    .toggle {
      margin-left: 13px !important;
    }
  }

  &.hidden .fixed .sidebar-header {
    .NavigationTab_root__3914H {
      display: none;
      opacity: 0;
      transition: opacity 1s ease;
    }
  }

  &.visible .fixed .games {
    .logo {
      display: flex; // unset;
      align-items: center;
      height: 60px;
    }
  }
}

.game div {
  font-weight: bold;
}

@media (max-width: 991px) {
  .sidebar {
    display: none;
  }
}
</style>
