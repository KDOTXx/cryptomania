<script setup>
import Bus from "@/composables/useBus";
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue';

const store = useMainStore();
const router = useRouter();

const show = ref(false);
const search = ref('');
const results = ref([]);

const closeSearch = () => {
    search.value = '';
    results.value = [];
    show.value = false;
}

onMounted(() => {
    Bus.$on('search:toggle', () => (show.value = !show.value));
})

watch(show, (n, o) => {
    if (n) {
        setTimeout(() => {
            document.querySelector('#searchInput').focus();
        });
    }
})

watch(search, (n, o) => {
    if (n === '' || n.length < 3) {
        results.value = [];
        return;
    }

    let localResults = [];

    const isMobile = window.innerWidth <= 991;

    store.games.forEach((game) => {
        if (game.isMobile !== null) {
            if ((game.isMobile && !isMobile) || (!game.isMobile && isMobile)) return;
        }


        if (
            game.name.toLowerCase().includes(search.value.toLowerCase()) ||
            game.id.toLowerCase().includes(search.value.toLowerCase())
        ) {
            game._searchUrl = '/casino/game/' + game.id;
            localResults.push(game);
        }
    });

    results.value = localResults;
});
</script>

<template>
    <div class="search" :class="show ? 'show' : ''">
        <div class="container">
            <div class="input">
                <input id="searchInput" v-model="search" placeholder="Search...">
                <WebIcon icon="fal fa-search" class="search" />
                <div @click="closeSearch()" class="close">
                    <WebIcon icon="fa fa-times" class="close" />
                </div>
            </div>
            <OverlayScrollbarsComponent :options="{ scrollbars: { autoHide: 'leave' } }" class="os-theme-thin-light">
                <div class="results">
                    <div class="result" @click="show = false; router.push(result._searchUrl)" v-for="result in results"
                        :key="result.id">
                        <img :src="result.image" alt onerror="this.src = '/img/misc/unknown-game-image.jpg'">
                    </div>
                </div>
            </OverlayScrollbarsComponent>
        </div>
    </div>
</template>

<style lang="scss">
@import "@/assets/sass/themes";

.search {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(black, .8);
    backdrop-filter: blur(15px);
    z-index: 99999;
    pointer-events: none;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity .3s ease;

    &.show {
        opacity: 1;
        pointer-events: unset;
    }

    .results {
        // height: calc(100vh - 250px);
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 20px; // Add padding for better spacing

        .os-content {
            display: flex;
            flex-wrap: wrap;
        }
    }

    .result {
        cursor: pointer;
        transition: transform .3s ease;
        margin-right: 15px;
        margin-bottom: 15px;
        width: 140px; // 294px;
        // height: 400px;
        border-radius: 10px;
        overflow: hidden; // Ensure image overflow is hidden

        @include themed() {
            background-color: t('sidebar');
        }

        &:hover {
            transform: scale(1.05); // Increase scale on hover for subtle effect
        }

        img {
            width: 100%; // Make image responsive within container
            height: auto; // Maintain aspect ratio
            border-radius: 10px;
            object-fit: cover; // Ensure image covers container without distortion
        }
    }

    .input {
        margin-top: 50px;
        margin-bottom: 30px; // Reduce bottom margin for better spacing
        position: relative;

        .icon {
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            opacity: .7; // Adjust opacity for better visibility
            color: white; // Ensure icon color is consistent
        }

        .close {
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            opacity: .7; // Adjust opacity for better visibility
            cursor: pointer;
            transition: opacity .3s ease;
            color: white;

            &:hover {
                opacity: 1;
            }
        }

        input {
            background: rgba(163, 190, 245, .1);
            border: none;
            border-radius: 30px; // Update border-radius for a softer look
            box-shadow: 0 0 0 3px transparent;
            color: #fff;
            font-size: 18px; // Reduce font size for better readability
            padding: 15px 50px; // Adjust padding for better input field size
            width: calc(100% - 80px); // Adjust width to accommodate icons
            height: 50px; // Reduce height for a more compact look
            outline: none;

            &::placeholder {
                color: rgba(255, 255, 255, 0.7); // Adjust placeholder color for better visibility
            }
        }
    }
}
</style>
