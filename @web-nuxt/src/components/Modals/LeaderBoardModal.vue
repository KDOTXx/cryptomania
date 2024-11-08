<script setup>
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue';

const apiClient = useAxios();

const { openUserModal } = useAuthModal();
const { t } = useI18n();
const { isModalVisible } = useLeaderBoardModal();

const type = ref('today');
const leaderboard = ref(null);

const load = () => {
  leaderboard.value = null;

  apiClient.post('/api/leaderboard', {
    type: type.value
  }).then(({ data }) => leaderboard.value = data);
}

onMounted(() => {
  load();
});

watch(type, (n, o) => load());
</script>

<template>
  <Modal v-model="isModalVisible" className="rankings">
    <div class="sides">
      <div class="side-a">
        <OverlayScrollbarsComponent :options="{ scrollbars: { autoHide: 'scroll' } }" class="side-a-content os-host">
          <div class="title">
            <WebIcon icon="trophy-diamond" />
            Competition
          </div>
          <div class="description">
            Compete against other players in wager volume and earn rewards!
          </div>
          <div class="rewards">
            <div class="reward-title">
              Rewards
            </div>
            <div class="category">
              <div>Monthly</div>
              <div>Top 1: $400</div>
              <div>Top 2: $200</div>
              <div>Top 3: $150</div>
              <div>Top 4: $100</div>
              <div>Top 5: $50</div>
              <div>Top 6: $30</div>
              <div>Top 7: $25</div>
              <div>Top 8: $20</div>
              <div>Top 9: $15</div>
              <div>Top 10: $10</div>
            </div>
            <div class="category">
              <div>Weekly</div>
              <div>Top 1: $120</div>
              <div>Top 2: $80</div>
              <div>Top 3: $50</div>
              <div>Top 4: $30</div>
              <div>Top 5: $20</div>
            </div>
            <div class="category">
              <div>Daily</div>
              <div>Top 1: $24</div>
              <div>Top 2: $14</div>
              <div>Top 3: $10</div>
              <div>Top 4: $6</div>
              <div>Top 5: $4</div>
            </div>
          </div>
        </OverlayScrollbarsComponent>
      </div>
      <div class="side-b">
        <div class="dropdowns">
          <Dropdown :entries="[{ id: 'today', name: t('leaderboard.type.today') },
          { id: 'week', name: t('leaderboard.type.week') },
          { id: 'month', name: t('leaderboard.type.month') }]" :onSelect="(e) => { type = e.id }" :select="type" />
        </div>

        <!-- <OverlayScrollbarsComponent :options="{ scrollbars: { autoHide: 'leave' } }"
          class="os-theme-thin-light rankings-table" v-if="leaderboard">
          <table class="live-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{{ t('general.bets.player') }}</th>
                <th>{{ t('general.profile.wager') }}</th>
              </tr>
            </thead>
            <tbody class="live_games">
              <tr v-for="(entry, i) in leaderboard"
                :class="i === 0 ? 'first' : (i === 1 ? 'second' : (i === 2 ? 'third' : ''))">
                <th>
                  <div>
                    {{ i + 1 }}
                  </div>
                </th>
                <th>
                  <div class="playerTh">
                    <a href="javascript:void(0)" @click="openUserModal()">{{ entry.user.name }}</a>
                  </div>
                </th>
                <th>
                  <div>
                    $ {{ entry.entry.wager_usd.toFixed(2) }}
                  </div>
                </th>
              </tr>
            </tbody>
          </table>
        </OverlayScrollbarsComponent> -->
        <!-- <Loader v-else /> -->
      </div>
    </div>
  </Modal>

</template>

<style lang="scss">
@import "@/assets/sass/variables";

.xmodal.rankings {
  @include themed() {
    max-width: 600px;

    .sides {
      display: flex;
      flex-direction: row;
      height: 100%;

      .side-a {
        display: flex;
        flex-direction: column;
        width: 230px;
        flex-shrink: 0;
        position: relative;

        .side-a-content {
          position: absolute;
          width: 100%;
          background: t('sidebar');
          left: -20px;
          top: -20px;
          height: 390px;
          padding: 25px;

          .title {
            color: #ffd92b;
            font-size: 1.1em;
            margin-bottom: 15px;

            svg,
            i {
              margin-right: 5px;
            }
          }

          .description {
            font-size: .9em;
          }
        }

        .rewards {
          font-size: 0.9em;
          margin-top: 15px;
          padding-bottom: 20px;

          .reward-title {
            font-size: 1.2em;
            color: #ffd92b;
            margin-bottom: 15px;
          }

          .category {
            margin-top: 15px;

            div:first-child {
              font-size: 1.1em;
              margin-bottom: 5px;
              opacity: 1;
              font-weight: 600;
            }

            div {
              opacity: .3;

              &:nth-child(2) {
                opacity: .9;
              }

              &:nth-child(3) {
                opacity: .7;
              }

              &:nth-child(4) {
                opacity: .5;
              }
            }
          }
        }
      }

      .side-b {
        width: calc(100% - 230px);
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
      }

      @media(max-width: 560px) {
        .side-a {
          width: 170px;
          font-size: .9em;
        }

        .side-b {
          width: calc(100% - 165px);

          .reward {
            font-size: 2em;
          }
        }
      }
    }

    .first th div {
      color: #ffdf7c;

      a {
        color: #ffdf7c;
      }
    }

    .second th div {
      color: #bfdffb;

      a {
        color: #bfdffb;
      }
    }

    .third th div {
      color: #d0898f;

      a {
        color: #d0898f;
      }
    }

    .playerTh {
      max-width: 115px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .modal_content {
      padding-top: 20px;
    }

    .rankings-table {
      max-height: 350px;
      min-height: 300px;
    }
  }

  .dropdowns {
    margin-bottom: 15px;
    display: flex;

    .walletExchangeSelectors {
      margin-right: 15px;
    }
  }
}
</style>
