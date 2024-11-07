<script setup>
import _404GameNotFound from "@/assets/img/404-game-not-found.webp";
const props = defineProps(["game"]);

const { openAuthModal } = useAuthModal();
const router = useRouter();
const store = useMainStore();

const openGame = (isDisabled, gameId) => {
    if (!isDisabled) {

        const game = store.games.filter((e) => e.id === gameId)[0];
        game.popularity = game.popularity + 1;

        if ((gameId.startsWith('external') && !isGuest) || !gameId.startsWith('external')) {
            router.push('/casino/game/' + gameId);
        }
        else {
            openAuthModal();
        }
    }
};

const getGameImage = (path) => {
    if (!path) {
        return _404GameNotFound;
    }

    if (path.includes("/img/game")) {
        return `/_nuxt/assets${path}`;
    }

    return path;
};
</script>

<template>
    <div class="TallGameCard_root__HJ_sr " @click="openGame(game.isDisabled, game.id)">
        <div class="TallGameCardElement_root__XBJWi">
            <a data-testid="Blackjack" href="javascript:;">
                <span
                    style="box-sizing: border-box; display: block; overflow: hidden; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; position: absolute; inset: 0px;">
                    <img alt="tall-game-card" sizes="180px" :src="getGameImage(game.image)" decoding="async"
                        data-nimg="fill"
                        style="position: absolute; inset: 0px; box-sizing: border-box; padding: 0px; border: none; margin: auto; display: block; width: 0px; height: 0px; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%; object-fit: fill;">
                    <noscript></noscript>
                </span>
                <div class="GameCardBorder_root__z0Mcd" style="border: 2px solid rgb(167, 10, 127);"></div>
            </a>
        </div>
    </div>
</template>

<style lang="scss">
@import "@/assets/sass/themes";

.CardGrid_cardGridElement__IfdAD {
    position: relative;
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-gap: 1rem;
    gap: 1rem;
    box-sizing: border-box;

    @media(max-width: 991px) {
        grid-template-columns: repeat(5, minmax(0, 1fr));
    }

    @media(max-width: 768px) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

.CardGrid_cardGridElement__IfdAD>div {
    min-width: 0;

}

.TallGameCardElement_root__XBJWi {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 140%;
    cursor: pointer;
    background-color: #231717;
    border-radius: 0.5rem;
    transition-duration: .3s;

    &:hover {
        transform: translateY(-.9375rem);
    }
}

.TallGameCardElement_root__XBJWi img {
    border-radius: 0.5rem;
}

.GameCardBorder_root__z0Mcd {
    position: absolute;
    inset: 0;
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: flex-start;
}
</style>