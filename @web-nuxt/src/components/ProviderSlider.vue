<script setup>
import Glide from '@glidejs/glide';

const store = useMainStore();

const initSlider = () => {
    new Glide('#provider-slider', {
        type: 'carousel',
        perView: 5,
        autoplay: 2500,
        //autoplay: false, // Disable autoplay
        hoverpause: true,
        keyboard: false,

        breakpoints: {
            1024: {
                perView: 4
            },
            768: {
                perView: 3
            },
            640: {
                perView: 2
            },
            320: {
                perView: 1
            }
        }

    }).mount();
};

onMounted(() => {
    if (store.providers.length > 0) {
        initSlider();
    }
})

watch(() => store.providers, (n, o) => {
    if (n.length > 0) {
        initSlider();
    }
}, { deep: true });

</script>

<template>
    <div class="home-head" v-if="store.providers.length > 0">
        <div class="slider provider-slider">
            <div class="glide" id="provider-slider">
                <div class="glide__track" data-glide-el="track">
                    <ul class="glide__slides">
                        <li class="glide_slide" v-for="provider in store.providers" :key="provider.id"
                            :provider="provider">
                            <router-link :to="'/casino/game/provider/' + provider.name">
                                <img :src="provider.logo" width="125" alt="">
                            </router-link>
                        </li>
                    </ul>
                </div>
                <div class="glide__arrows" data-glide-el="controls">
                    <button class="glide__arrow glide__arrow--left" data-glide-dir="<"></button>
                    <button class="glide__arrow glide__arrow--right" data-glide-dir=">"></button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.provider-slider {
    height: 100px !important;
    margin: 50px 0px;
    padding: 0px 50px;
    width: 100%;

    @media(max-width: 1440px) {
        max-width: calc(100vw - 380px);
    }

    .slider {
        height: auto;
    }

    img {
        max-width: 100%;
        max-height: 80px;
    }

    .glide_slide {
        text-align: center;
        padding: 0px !important;
        display: flex;
        justify-content: center;
        align-items: center;
        // background-color: #535abd;
        border: 1px solid #b0c8f9 !important;
        background: linear-gradient(180deg, rgba(14, 38, 45, 0) 0%, #9eb6e5 100%) !important;
        box-shadow: inset 0 0 #fff, inset 0 0 0 1px #44403c, 0 1px 2px #0000000d;
        border-radius: .75rem;
        padding: 0px 40px;
        height: auto !important;
        transition-duration: .3s;

        &:hover {
            transform: translateY(-.5rem);
            background: linear-gradient(180deg, rgba(14, 38, 45, 0) 0%, #8684de 100%) !important;
            position: relative;
        }
    }

    .glide__arrow--left {
        left: -40px;
    }

    .glide__arrow--right {
        right: -40px;
    }
}

@keyframes movingBlink {
    0% {
        left: -40px;
    }

    75%,
    100% {
        left: calc(100% + 40px);
    }
}

.btn-green-outline {
    padding: 8px 19px;
    background: rgb(5 46 22);
    border-radius: .75rem;
    color: #ffffff;
    box-shadow: inset 0 0 #fff, inset 0 0 0 1px #00ec66, 0 1px 2px #0000000d;
    display: block;
    width: fit-content;
    font-weight: bold;
    margin-bottom: 70px;
}

.home-head {
    display: flex;
    justify-content: center;
}
</style>