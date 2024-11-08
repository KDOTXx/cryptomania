<script setup>

const props = defineProps({
    isCategory: {
        type: Boolean,
        default: true,
    },
    sort: {
        type: Object,
        default: null,
    },
    isIndex: {
        type: Boolean,
        default: false,
    },
});

const store = useMainStore();

const icons = ref({
    default: 'originals',
    'Slots (Originals)': 'slots',
    'Originals (Classic)': 'casino'
})

const gamesPerView = ref(0);
const page = ref([]);
const width = ref(0);
const search = ref('');
const visibleGames = ref([]);
const dropdownProvider = ref(null);
const dropdownSort = ref(0);
const curIdx = ref(0);
const isLastPage = ref(false);
const popularGames = ref(null);

watch(store.games, () => {
    updateGames();
    setDefaultDropdownProvider();
}, { deep: true });

const providers = computed(() => {
    let allProviders = ['All Providers']; // New provider 'All Providers'
    let gameTypes = store.games ? [...new Set(store.games.filter(e => !e.isHidden).map(e => e.type))] : [];
    let uniqueProviders = [...new Set([...allProviders, ...gameTypes])].sort(e => e !== 'Originals' ? 0 : -1);
    return uniqueProviders;
});

const setDefaultDropdownProvider = () => {
    const providers = findDropdownProviders();
    let index = 0;
    dropdownProvider.value = providers[index];
}

const findDropdownProviders = () => providers.value;

const findDropdownSorts = () => ['Normal', 'Popular', 'Alphabetical', 'Random'];

const sortGames = (provider, sort) => {
    let games = null;

    if (provider === 'All Providers') {
        if (!props.sort) {
            games = store.games.slice(findPage(provider).current * gamesPerView.value, (findPage(provider).current + 1) * gamesPerView.value);
        } else if (props.sort.type === 'category') {
            games = store.games.filter(e => e.category.includes(props.sort.by));
        } else {
            games = store.games;
        }
    } else {
        if (!props.sort) {
            games = store.games.filter(e => e.type === provider).slice(findPage(provider).current * gamesPerView, (findPage(provider).current + 1) * gamesPerView.value);
        } else if (props.sort.type === 'category') {
            games = store.games.filter(e => e.type === provider && e.category.includes(props.sort.by));
        } else {
            games = store.games.filter(e => e.type === provider);
        }
    }

    games = games.filter(e => !e.isHidden).filter(e => e.name.toLowerCase().includes(search.value.toLowerCase()));

    if (props.sort === 'Popular') {
        games.sort((a, b) => {
            if (!isNaN(a.popularity) & !isNaN(b.popularity)) {
                return b.popularity - a.popularity;
            } else {
                return 0;
            }
        });
    } else if (props.sort === 'Alphabetical') {
        games.sort((a, b) => {
            return a.name.localeCompare(b.name);
        })
    } else if (props.sort === 'Random') {
        games = shuffleArray(games);
    }

    return games;
}

const loadMoreGames = () => {
    curIdx.value += gamesPerView.value;
    isLastPage.value = curIdx.value + gamesPerView.value >= sortGames(dropdownProvider.value, dropdownSort.value).length;
}

const updateGamesPerView = () => {
    width.value = window.innerWidth;

    let prev = gamesPerView.value;
    if (window.innerWidth <= 991) gamesPerView.value = 9;
    else gamesPerView.value = 24;

    if (prev !== gamesPerView.value) updateGames();
}

const findPage = (type) => {
    return page.value.filter((e) => e.id === type)[0];
}

const updatePage = (object) => {
    page.value = page.value.filter((e) => e.id !== object.id);
    page.value.push(object);
}

const updateGames = () => {
    providers.value.forEach(providerName => {
        let filteredGames = store.games;
        if (providerName !== 'All Providers') {
            filteredGames = store.games.filter(e => e.type === providerName);
        }
        updatePage({
            id: providerName,
            current: 0,
            max: Math.floor((filteredGames.length - 1) / gamesPerView.value)
        });
    });
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

onMounted(() => {
    updateGamesPerView();
    window.addEventListener('resize', updateGamesPerView());
    setDefaultDropdownProvider();
    visibleGames.value = sortGames(dropdownProvider.value, dropdownSort.value).slice(0, gamesPerView.value)
});

</script>

<template>
    <div v-if="store.games" class="game-list">
        <template v-if="dropdownProvider">
            <div v-if="isCategory" class="category">
                <div class="search-input">
                    <WebIcon icon="fa fa-search" />
                    <input :placeholder="$t('general.search')" id="searchInput" v-model="search">
                </div>
                <div style="display: flex;">
                    <div class="name" style="flex-grow: 1;">
                        <Dropdown class="providerDropdown" :chevron="true" style="font-size: 14px"
                            :entries="findDropdownProviders().map(e => { return { id: e, name: e }; })"
                            :onSelect="(e) => { dropdownProvider = e.id; curIdx = 0; isLastPage = false; }"
                            :select="dropdownProvider" />
                    </div>
                    <div class="name">
                        <div style="font-size: 14px; margin-right: 5px;">Sort by:</div>
                        <Dropdown class="sortDropdown" :chevron="true" style="font-size: 14px"
                            :entries="findDropdownSorts().map(e => { return { id: e, name: e }; })"
                            :onSelect="(e) => { dropdownSort = e.id; curIdx = 0; isLastPage = false; }"
                            :select="dropdownSort" />
                    </div>
                </div>

                <div class="viewAll" @click="$router.push('/casino/game/provider/' + dropdownProvider)" v-if="!sort">
                    {{ $t('general.viewAll') }}
                </div>
                <div class="arrows" v-if="!sort">
                    <div class="arrow"
                        @click="findPage(dropdownProvider).current > 0 ? updatePage(Object.assign(findPage(dropdownProvider), { current: findPage(dropdownProvider).current - 1 })) : null"
                        :class="findPage(dropdownProvider).current <= 0 ? 'disabled' : ''"><web-icon
                            icon="fal fa-chevron-left"></web-icon></div>
                    <div class="arrow"
                        @click="findPage(dropdownProvider).current < findPage(dropdownProvider).max ? updatePage(Object.assign(findPage(dropdownProvider), { current: findPage(dropdownProvider).current + 1 })) : null"
                        :class="findPage(dropdownProvider).current >= findPage(dropdownProvider).max ? 'disabled' : ''">
                        <WebIcon icon="fa fa-chevron-right" />
                    </div>
                </div>
            </div>
            <div class="CardGrid_cardGridElement__IfdAD" :key="dropdownProvider + '2'"
                :class="(dropdownProvider.replaceAll(' ', '_').replaceAll('(', '').replaceAll(')', '') + ' ') + (!sort ? '' : 'sorted')">
                <GameListEntry
                    v-for="(game) in sortGames(dropdownProvider, dropdownSort).slice(0, curIdx + gamesPerView)"
                    :key="game.id" :game="game" />
            </div>
            <div class="more-games-container">
                <button @click="loadMoreGames" v-if="!isLastPage" class="more-games-button">More games</button>
            </div>
        </template>
    </div>
</template>

<style lang="scss">
@import "@/assets/sass/themes";

.game-list {

    .category {
        margin-top: 25px;
        display: flex;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 25px;
        width: 100%;
        gap: 1rem;
        margin-top: 20px;

        @media(max-width: 991px) {
            font-size: 12px;
            margin-top: 15px;
            margin-bottom: 10px;
        }

        @include themed() {
            display: flex;
            align-items: center;

            @media (max-width: 991px) {
                background: transparent;
                flex-direction: column;
                align-items: unset;
                padding: unset;
                margin-top: 0;

                .search-input {
                    margin-left: unset;
                    margin-top: 10px;

                    input {
                        background: transparent;
                        border: 1px solid t('input');
                    }
                }
            }
        }

        .search-input {
            position: relative;
            // cursor: pointer;
            flex-grow: 1;
            // width: 100%;

            input {
                padding-left: 50px;
                // pointer-events: none;
                border-radius: .375rem;

                @include themed() {
                    background: t('input-dark');

                    &::placeholder {
                        color: t('link');
                    }
                }
            }

            svg,
            i {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: 20px;
            }
        }

        .icon {
            margin-right: 15px;
            display: flex;
            align-items: center;
        }

        .name {
            display: flex;
            align-items: center;
            font-size: 22px;
            font-weight: 100;
            margin-top: -1px;

            @media(max-width: 500px) {
                font-size: 14px;
            }

            .providerDropdown {
                font-size: 14px !important;
                margin-right: 10px;

                .wesContainer {
                    @include themed() {
                        background: t('border') !important;
                        border-radius: 5px;
                        padding-top: 13px;
                        padding-bottom: 13px;
                        min-width: 150px;
                    }
                }

                .exchangeList {
                    @include themed() {
                        background: t('body') !important;
                    }
                }

                .name {
                    font-size: 14px !important;
                }
            }

            .sortDropdown {
                font-size: 14px !important;
                // margin-right: 10px;

                .wesContainer {
                    @include themed() {
                        background: t('border') !important;
                        border-radius: 5px;
                        padding-top: 13px;
                        padding-bottom: 13px;
                    }
                }

                .exchangeList {
                    @include themed() {
                        background: t('body') !important;
                    }
                }

                .name {
                    font-size: 14px !important;
                }
            }
        }

        @include themed() {
            .viewAll {
                margin-left: auto;
                margin-right: 15px;
                background: t('block');
                padding: 10px 15px;
                cursor: pointer;
                color: t('link');
                border-radius: 6px;
            }

            .arrows {
                display: flex;

                .arrow {
                    padding: 15px 20px;
                    background: t('block');
                    color: t('text');
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;

                    @media(max-width: 991px) {
                        padding: 5px 10px;
                    }

                    &.disabled {
                        cursor: default;

                        i,
                        svg {
                            opacity: .5;
                            pointer-events: none;
                        }
                    }

                    &:first-child {
                        border-top-left-radius: 10px;
                        border-bottom-left-radius: 10px;
                    }

                    &:last-child {
                        border-top-right-radius: 10px;
                        border-bottom-right-radius: 10px;
                        margin-left: -1px;
                    }

                    i,
                    svg {
                        font-size: .9em;
                        transition: all .3s ease;
                    }

                    &:not(.disabled):hover {

                        i,
                        svg {
                            transform: scale(1.15);
                        }
                    }
                }
            }
        }
    }

    .category-subtitle {
        flex-direction: row !important;

        @media (max-width: 991px) {
            padding: 10px !important
        }
    }
}

// .search-input {
//   position: relative;
//   cursor: pointer;
//   width: 100%;

//   input {
//     padding-left: 50px;
//     pointer-events: none;
//     border-radius: .375rem;

//     @include themed() {
//       background: t('input-dark');

//       &::placeholder {
//         color: t('link');
//       }
//     }
//   }

//   svg, i {
//     position: absolute;
//     top: 50%;
//     transform: translateY(-50%);
//     left: 20px;
//   }
// }
.more-games-container {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.more-games-button {
    transition: 0.2s all;
    border: 0;
    position: relative;
    // flex: 1 1;
    font-weight: 500;
    line-height: 1.625rem;
    border-radius: .375rem;
    height: 2.25rem;
    padding: .469rem 1rem;
    cursor: pointer;
    color: #bec6d1;
    font-size: 0.875rem;
    background-color: #19202e;
    pointer-events: inherit;
    -webkit-user-select: inherit;
    user-select: inherit;
    opacity: 1;

    display: flex;
    justify-content: center;
    align-items: center;
}
</style>