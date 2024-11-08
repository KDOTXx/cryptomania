<script setup>
import Bus from '@/composables/useBus';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue';

const store = useMainStore();
const apiClient = useAxios();

const { t } = useI18n()
const toast = useToast();

const { betSlip, isGuest, currencies, currency, user } = storeToRefs(store);

const bets = ref([]);
const isSingle = ref(true);
const noOddsChanges = ref(true);
const multiBet = ref(0);
const betting = ref(false);
const tab = ref('betSlip');
const betsTab = ref('ongoing');
const userGames = ref(null);
const userGamesPage = ref(0);

const money = ref({
    decimal: '.',
    thousands: '',
    prefix: '',
    suffix: '',
    precision: 8,
    masked: false,
});

function acceptAllChanges() {
    bets.value.forEach(bet => (bet.verifyOddsChange = false));
}

function openAuthModal(type) {
    AuthModal.methods.open(type);
}

function loadNextBetsPage() {
    apiClient
        .get(`/api/user/sportGames/${user.value._id}/${userGamesPage.value}/${betsTab.value}`)
        .then(({ data }) => {
            if (!userGames.value) userGames.value = [];
            userGamesPage.value += 1;
            userGames.value = data;
        });
}

function bet() {
    if (hasUnverifiedOddsChanges() || betting.value) return;
    betting.value = true;

    const balance = currencies.value[currency.value].balance.real;

    if ((isSingle.value && balance < total()) || (!isSingle.value && balance < multiBet.value)) {
        $toast.error(t('sport.not_enough_balance'));
        betting.value = false;
        return;
    }

    const betsToPlace = bets.value.map(bet => ({
        value: bet.value,
        game: { id: bet.game.id },
        runner: bet.runner,
        market: bet.market,
        category: bet.category,
    }));

    apiClient
        .post('/api/sport/bet', {
            type: isSingle.value ? 'single' : 'multi',
            bets: betsToPlace,
            multiBetValue: multiBet.value,
        })
        .then(() => {
            bets.value.forEach(bet => {
                Bus.$emit('betSlip:remove:' + bet.hash);
            });
            betting.value = false;
            bets.value = [];
            $toast.success(t('sport.created'));
        })
        .catch(error => {
            handleBettingError(error);
            betting.value = false;
        });
}

function handleBettingError(error) {
    const errorMsg = error.response?.data.code;
    const messages = {
        1: 'This game is finished',
        3: 'Insufficient balance',
        8: "You can't place multibet on multiple options on the same match.",
        9: 'Max. bet amount per option: $100',
    };
    const message = messages[errorMsg] || t('sport.error');
    $toast.error(message);
}

function clearBetSlip() {
    bets.value = [];
    Bus.$emit('betSlip:clear');
}

function hasUnverifiedOddsChanges() {
    return bets.value.some(bet =>
        !bet.disabled && bet.runner.open && bet.game.open && bet.market.open && bet.verifyOddsChange
    );
}

function removeBet(bet) {
    Bus.$emit('betSlip:remove:' + bet.hash);
    bets.value = bets.value.filter(
        v => !(bet.market.name === v.market.name && bet.game.id === v.game.id && bet.runner.name === v.runner.name)
    );
}

function total() {
    if (isSingle.value) {
        return bets.value.reduce((sum, bet) => sum + parseFloat(bet.value), 0);
    } else {
        return bets.value.reduce((product, bet) => (product === 0 ? parseFloat(bet.runner.price) : product * parseFloat(bet.runner.price)), 0);
    }
}

function estPayout() {
    if (!isSingle.value) return multiBet.value * total();
    return bets.value.reduce((sum, bet) => sum + parseFloat(bet.value) * bet.runner.price, 0);
}

// Lifecycle hooks
onMounted(() => {
    Bus.$on('betSlip:add', data => {
        const existingBet = bets.value.find(
            bet =>
                bet.game.id === data.game.id &&
                bet.market.name === data.market.name &&
                bet.runner.name === data.runner.name
        );
        if (existingBet) {
            removeBet(existingBet);
            return;
        }
        data.value = 0;
        bets.value.push(data);
        setTimeout(() => $refs.betSlipScrollbar._osInstace.scroll({ y: '100%' }), 50);
    });

    Bus.$retrieve('betSlip:includes', data => {
        return bets.value.some(
            bet =>
                bet.game.id === data.game.id &&
                bet.market.name === data.market.name &&
                bet.runner.name === data.runner.name
        );
    });

    Bus.$retrieve('betSlip:size', () => bets.value.length);
});

watch(tab, () => {
    if (tab.value !== 'betSlip' && userGames.value === null) loadNextBetsPage();
});

watch(betsTab, () => {
    userGames.value = null;
    userGamesPage.value = 0;
    loadNextBetsPage();
});
</script>

<template>
    <div :class="'betSlip ' + (betSlip ? 'visible' : 'hidden')">
        <div class="betSlipHeader">
            <div :class="'tab ' + (tab === 'betSlip' ? 'active' : '')" @click="tab = 'betSlip'">{{
                $t('sport.bet_slip')
                }}
            </div>
            <div :class="'tab ' + (tab === 'myBets' ? 'active' : '')" @click="tab = 'myBets'" v-if="!isGuest">
                {{ $t('sport.my_bets') }}
            </div>
            <i class="fal fa-times" @click="$store.dispatch('toggleBetSlip', false)"></i>
        </div>
        <template v-if="tab === 'betSlip'">
            <div class="betSlipSubHeader">
                <div class="betSlipTabs">
                    <div :class="'betSlipTab ' + (isSingle ? 'active' : '')" @click="isSingle = true">
                        {{ $t('sport.single') }}
                    </div>
                    <div :class="'betSlipTab ' + (!isSingle ? 'active' : '')" @click="isSingle = false">
                        {{ $t('sport.multi') }}
                    </div>
                </div>
                <div class="betSlipControls">
                    <div class="custom-control custom-checkbox mb-2">
                        <label>
                            <input type="checkbox" class="custom-control-input" v-model="noOddsChanges">
                            <div class="custom-control-label" v-html="$t('sport.no_odds_changes')"></div>
                        </label>
                    </div>
                    <i class="fal fa-times" @click="clearBetSlip()" v-if="bets.length > 0"></i>
                </div>
            </div>
            <div v-if="bets.length === 0" class="bets empty">
                <WebIcon icon="sport" />
                <div class="title">{{ $t('sport.empty_bet_slip_title') }}</div>
                <div class="subtitle">{{ $t('sport.empty_bet_slip_subtitle') }}</div>
            </div>

            <button class="btn btn-primary acceptAll"
                v-if="!isSingle && bets.filter(e => e.verifyOddsChange).length > 0" @click="acceptAllChanges">
                {{ $t('sport.accept_all_odds_changes') }}
            </button>

            <OverlayScrollbarsComponent ref="betSlipScrollbar"
                :options="{ scrollbars: { autoHide: 'leave' }, className: 'os-theme-thin-light' }" class="bets"
                v-if="bets.length > 0">
                <div :class="'bet ' + (bet.disabled || !bet.runner.open || !bet.game.open || !bet.market.open ? 'disabled' : '')"
                    v-for="bet in bets">
                    <div class="betHeader">
                        <div class="game">{{ bet.game.name }}</div>
                        <i class="fal fa-times" @click="removeBet(bet)"></i>
                    </div>
                    <div class="betContainer">
                        <div class="oddsChange"
                            v-if="bet.game.open && bet.market.open && bet.runner.open && !bet.disabled && bet.verifyOddsChange">
                            <div>{{ $t('sport.odds_change', { odds: bet.runner.price }) }}</div>
                            <div>
                                <button class="btn btn-sm btn-primary" @click="bet.verifyOddsChange = false">
                                    {{ $t('sport.accept') }}
                                </button>
                                <button class="btn btn-sm btn-primary" @click="removeBet(bet)">
                                    {{ $t('sport.decline') }}
                                </button>
                            </div>
                        </div>

                        <div class="controls">
                            <div class="market">
                                {{ $t(bet.runner.translation.market.key, bet.runner.translation.market.data) }}
                            </div>
                            <div class="runner">
                                {{ $t(bet.runner.translation.runner.key, bet.runner.translation.runner.data) }}
                            </div>
                            <div class="control" v-if="isSingle && currencies">
                                <input v-model="bet.value" type="number" min="0">
                                <!-- <WebIcon :icon="currencies[currency].icon"
                                    :style="{ color: currencies[currency].style }" /> -->
                            </div>
                        </div>
                        <div class="info">
                            <div class="payout">{{ bet.runner.price }}</div>
                            <template v-if="isSingle && currencies">
                                <div class="estPayout">{{ $t('sport.estimate_payout') }}</div>
                                <div class="estPayoutValue">
                                    <!-- <Unit :to="currency" :value="bet.value * bet.runner.price" /> -->
                                    <!-- <WebIcon :icon="currencies[currency].icon"
                                        :style="{ color: currencies[currency].style }" /> -->
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </OverlayScrollbarsComponent>
            <div class="betSlipManagement">
                <div class="multiBet" v-if="!isSingle && currencies">
                    <input v-model="multiBet" type="number" min="0">
                    <!-- <WebIcon :icon="currencies[currency].icon" :style="{ color: currencies[currency].style }" /> -->
                </div>
                <div class="value">
                    <div class="name">
                        {{ $t(isSingle ? 'sport.total_bet' : 'sport.total_odds') }}
                    </div>
                    <div class="val">
                        <!-- <Unit v-if="isSingle" :to="currency" :value="total()" /> -->
                        <!-- <span v-else>{{ total().toFixed(2) }}</span> -->
                        <!-- <WebIcon v-if="isSingle && currencies" :icon="currencies[currency].icon"
                            :style="{ color: currencies[currency].style }" /> -->
                    </div>
                </div>
                <div class="value">
                    <div class="name">
                        {{ $t('sport.estimate_payout') }}
                    </div>
                    <div class="val" v-if="currencies">
                        <!-- <Unit :to="currency" :value="estPayout()" /> -->
                        <!-- <WebIcon :icon="currencies[currency].icon" :style="{ color: currencies[currency].style }" /> -->
                    </div>
                </div>
                <div :class="'btn btn-primary btn-block ' + (hasUnverifiedOddsChanges() || betting || bets.length === 0 ? 'disabled' : '')"
                    :disabled="hasUnverifiedOddsChanges() || betting || bets.length === 0"
                    @click="isGuest ? openAuthModal('auth') : bet()">{{ $t(isGuest ? 'sport.register_to_bet' :
                        'sport.bet') }}
                </div>
            </div>
        </template>
        <template v-else-if="!isGuest">
            <div class="betSlipSubHeader noFooter">
                <div class="betSlipTabs">
                    <div :class="'betSlipTab ' + (betsTab === 'ongoing' ? 'active' : '')" @click="betsTab = 'ongoing'">
                        {{ $t('sport.ongoing') }}
                    </div>
                    <div :class="'betSlipTab ' + (betsTab === 'finished' ? 'active' : '')"
                        @click="betsTab = 'finished'">
                        {{ $t('sport.finished') }}
                    </div>
                </div>
            </div>
            <div class="bets noFooter empty" v-if="userGames == null">
                <Loader />
            </div>
            <div v-else-if="userGames.length === 0" class="bets noFooter empty">
                <WebIcon icon="scroll" />
                <div class="title">{{ $t('sport.no_bets_title') }}</div>
            </div>
            <OverlayScrollbarsComponent ref="betSlipScrollbar" :options="{ scrollbars: { autoHide: 'leave' } }"
                class="bets noFooter os-theme-thin-light" v-if="userGames && Object.keys(userGames).length > 0">
                <div :class="key.startsWith('multi') ? 'multiBetGroup' : 'singleBet'" v-for="(value, key) in userGames">
                    <div class="title" v-if="key.startsWith('multi')">{{ $t('sport.multi') }}</div>
                    <div class="bet" v-for="bet in value">
                        <div class="betHeader">
                            <div class="game">{{ bet.game }}</div>
                        </div>
                        <div class="betContainer">
                            <div class="controls">
                                <div class="market">
                                    {{ bet.market }}
                                </div>
                                <div class="runner">
                                    {{ bet.runner }}
                                </div>
                                <!-- <Unit :to="bet.currency" :value="bet.bet" /> -->
                                <!-- <WebIcon :icon="currencies[bet.currency].icon" v-if="currencies"
                                    :style="{ color: currencies[bet.currency].style }" /> -->
                            </div>
                            <div class="info">
                                <div class="payout">{{ bet.odds }}</div>
                            </div>
                        </div>
                        <div class="gameOutcome" :class="bet.status" v-if="betsTab === 'finished'">
                            {{ $t('sport.outcome.' + bet.status) }}
                        </div>
                    </div>
                </div>
            </OverlayScrollbarsComponent>
        </template>
    </div>
</template>

<style lang="scss">
@import "@/assets/sass/variables";

$management-height: 160px;

.betSlip.hidden {
    opacity: 0;
    pointer-events: none;
}

.betSlip {
    z-index: 38500;
    opacity: 1;
    transition: opacity 0.3s ease;
    position: fixed;
    height: 100%;
    width: $chat-width;
    top: 0;
    right: 0;

    .custom-control label {
        display: flex;
        white-space: nowrap;

        div {
            margin-left: 5px;
        }
    }

    @include themed() {
        background: t('sidebar');
        border-left: 2px solid t('border');

        @media(max-width: 991px) {
            border: none;
        }

        .betSlipHeader {
            background: t('header');
            height: 73px;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            font-weight: 600;

            @media(max-width: 991px) {
                height: 40px;
                padding: 5px 10px;
            }

            i {
                @media(max-width: 991px) {
                    font-size: 1.5em;
                }
            }

            .tab {
                margin-right: 15px;
                transition: opacity 0.3s ease;
                opacity: 1;
                cursor: pointer;

                &:not(.active) {
                    font-weight: 100;
                    opacity: 0.6;
                }

                &:last-child {
                    margin-right: 0;
                }
            }

            i {
                margin-left: auto;
                cursor: pointer;
            }
        }

        .betSlipSubHeader {
            height: 100px;

            @media(max-width: 991px) {
                padding: 7px;
                font-size: 0.9em;
                height: unset;
            }

            &.noFooter {
                height: 65px;
            }

            border-bottom: 2px solid t('border');
            padding: 14px 18px 15px 15px;

            .betSlipTabs {
                display: flex;

                .betSlipTab {
                    margin-right: 5px;
                    position: relative;
                    font-weight: 600;
                    cursor: pointer;
                    padding: 5px 10px;
                    background: transparent;
                    transition: background .3s ease;
                    border-radius: 3px;
                    box-shadow: 0 0 0 1px t('body');

                    &.active {
                        background: t('body');
                        box-shadow: none;
                    }

                    &:last-child {
                        margin-right: 0;
                    }
                }
            }

            .betSlipControls {
                display: flex;
                margin-top: 14px;

                @media(max-width: 991px) {
                    margin-top: 7px;
                    margin-bottom: -8px;
                }

                i {
                    cursor: pointer;
                    margin-left: auto;
                    margin-top: 5px;
                }
            }
        }

        .acceptAll {
            position: absolute;
            z-index: 5;
            left: 50%;
            transform: translateX(-50%);
            bottom: 200px;
        }

        .bets {
            height: calc(100% - #{$management-height} - 73px - 102px);

            .singleBet {
                margin-top: 15px;
            }

            .multiBetGroup {
                padding: 10px;
                background: t('body');
                margin-top: 15px;

                .title {
                    text-align: center;
                    margin-bottom: 10px;
                }

                .bet {
                    margin-bottom: 0;
                }
            }

            &.noFooter {
                height: calc(100% - 73px - 67px);
            }

            padding: 15px;
            position: relative;

            .bet {
                border-radius: 3px;
                margin-bottom: 10px;
                background: lighten(t('sidebar'), 3%);

                &.disabled {
                    opacity: 0.6;

                    .betContainer {
                        pointer-events: none;
                    }
                }

                .betHeader {
                    background: lighten(t('sidebar'), 6%);
                    font-size: 0.9em;
                    padding: 10px;
                    display: flex;
                    align-items: center;

                    .game {
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        width: 90%;
                    }

                    i {
                        margin-left: auto;
                        margin-right: 3px;
                        cursor: pointer;
                    }
                }

                .gameOutcome {
                    padding: 10px;
                    border-top: 1px solid rgba(white, .25);
                    font-weight: 600;
                    font-size: 0.9em;

                    &.refund,
                    &.win {
                        color: #28c228;
                    }

                    &.lose {
                        color: #ef4b4b;
                    }
                }

                .betContainer {
                    padding: 10px;
                    display: flex;
                    position: relative;

                    .oddsChange {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(lighten(t('sidebar'), 3%), .8);
                        backdrop-filter: blur(5px);
                        z-index: 5;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;

                        div:first-child {
                            margin-bottom: 8px;
                        }

                        div:last-child {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 0.9em;

                            .btn {
                                font-size: 1em;
                            }

                            .btn:first-child {
                                margin-right: 5px;
                            }
                        }
                    }

                    .controls {
                        width: 50%;

                        .market,
                        .runner {
                            width: 90%;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                            font-size: 0.9em;
                        }

                        .runner {
                            font-weight: 600;
                            font-size: 0.95em;
                            margin-top: 2px;
                        }

                        .control {
                            margin-top: 10px;
                            position: relative;

                            input {
                                font-size: 0.9em;
                                padding: 5px 33px 5px 10px;
                            }

                            svg,
                            i {
                                position: absolute;
                                top: 9px;
                                right: 10px;
                            }
                        }
                    }

                    .info {
                        width: 50%;
                        text-align: right;
                        display: flex;
                        margin-top: auto;
                        flex-direction: column;
                        font-size: 0.9em;

                        .payout {
                            font-weight: 600;
                            font-size: 1.1em;
                        }

                        .estPayout,
                        .estPayoutValue {
                            opacity: 0.8;
                            font-size: 0.9em;
                        }

                        .estPayoutValue {
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            width: 90%;
                            margin-left: auto;
                        }
                    }
                }

                &:last-child {
                    margin-bottom: 0;
                }
            }

            &.empty {
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;

                svg,
                i {
                    font-size: 5em;
                    margin-bottom: 15px;
                }

                .subtitle {
                    opacity: 0.7;
                    font-size: 0.95em;
                    margin-top: 5px;
                    text-align: center;
                }
            }
        }

        .betSlipManagement {
            height: $management-height;
            padding: 15px;
            display: flex;
            flex-direction: column;
            position: relative;
            background: rgba(lighten(t('border'), 2%), .8);
            margin-top: auto;

            .multiBet {
                margin-bottom: 5px;
                position: relative;

                input {
                    font-size: 0.9em;
                    padding: 5px 33px 5px 10px;
                }

                svg,
                i {
                    position: absolute;
                    top: 9px;
                    right: 10px;
                }
            }

            .value {
                display: flex;
                margin-bottom: 5px;
                font-size: 0.9em;

                .name {
                    opacity: 0.8;
                }

                .val {
                    margin-left: auto;
                }
            }

            .btn {
                margin-top: auto;
            }
        }
    }
}

@media(max-width: 991px) {
    .betSlip {
        left: 0;
        top: $header-height;
        width: 100vw !important;
        height: calc(100% - 55px - #{$header-height});

        .bets {
            height: calc(100% - 294px) !important;
        }
    }
}
</style>
