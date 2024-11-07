<script setup>
import Bus from "@/composables/useBus";
import HomeSvg from "@/assets/img/icons/home.svg";
import OriginalSvg from "@/assets/img/icons/original.svg";
import SlotsSvg from "@/assets/img/icons/slots.svg";
import CasinoSvg from "@/assets/img/icons/casino.svg";

defineProps({
    IsHome: {
        type: Boolean,
        default: false,
    },
});

const { setSelectedTab } = useGameCategory();
const activeTab = ref('lobby');

const tabs = [
    { id: 'lobby', label: 'Lobby', icon: HomeSvg },
    { id: 'originals', label: 'Originals', icon: OriginalSvg },
    { id: 'slots', label: 'Slots', icon: SlotsSvg },
    { id: 'live', label: 'Live Casino', icon: CasinoSvg },
];

const setActiveTab = (tabId) => {
    setSelectedTab(tabId);
    activeTab.value = tabId;
};

const openSearch = () => {
    Bus.$emit('search:toggle');
};
</script>

<template>
    <div class="c-search">
        <div v-if="IsHome" class="tabview">
            <div class="tabview-container">
                <button v-for="tab in tabs" :key="tab.id" class="tabview-button tabview-button-hasIcon"
                    :class="{ 'tabview-button-active': activeTab === tab.id }" @click="setActiveTab(tab.id)"
                    :data-testid="tab.id.toUpperCase()" :id="tab.id.toUpperCase()">
                    <span class="tabview-button-icon">
                        <img :src="tab.icon" :alt="tab.label" color="currentColor" />
                    </span>
                    <label>{{ tab.label }}</label>
                </button>
            </div>
        </div>

        <div class="search-input" @click="openSearch">
            <WebIcon icon="fa fa-search" />
            <input :placeholder="$t('general.search')" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/themes";

.c-search {
    display: flex;
    width: 100%;
    gap: 1rem;
    margin-top: 20px;

    @include themed() {
        display: flex;
        align-items: center;

        @media (max-width: 991px) {
            background: transparent;
            flex-direction: column;
            align-items: unset;
            padding: unset;
            margin-top: 20px;

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
        cursor: pointer;
        width: 100%;

        input {
            padding-left: 50px;
            pointer-events: none;
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

    .tabview {
        @media (max-width: 992px) {
            // width: unset;
            width: calc(100vw - 24px);
        }

        display: flex;
        background-color: #242e42;
        border-radius: .375rem;
        padding: .375rem .375rem 0;
        gap: .2rem;
        overflow: hidden;
        overflow-x: auto;
        width: 100%;
    }

    .tabview-container {
        display: flex;
        overflow: auto;
        overflow-y: hidden;
        padding-bottom: .375rem;
        width: 100%;
        gap: .2rem;
    }

    .tabview-button {
        transition: 0.2s all;
        border: 0;
        position: relative;
        flex: 1 1;
        font-weight: 500;
        line-height: 1.625rem;
        border-radius: .375rem;
        height: 2.25rem;
        padding: .469rem 1rem;
        cursor: pointer;
        color: #bec6d1;
        font-size: 0.875rem;
        background-color: #0000;
        pointer-events: inherit;
        -webkit-user-select: inherit;
        user-select: inherit;
        opacity: 1;

        display: flex;
        justify-content: center;
        align-items: center;

        .tabview-button-icon {
            margin-right: .5rem;
            width: 1rem;
            height: 1rem;
            display: flex;
        }

        label {
            white-space: nowrap;
            cursor: inherit;
            line-height: 0;
        }
    }

    .tabview-button-active {
        color: #fff;
        background-color: #19202e;
        cursor: default;
    }

    .tabview-button-active:hover {
        color: #fff;
        background-color: #19202e !important;
        cursor: default;
    }

    // .tabview-button:active {
    //   color: #fff;
    //   background-color: #37206e;
    // }
    .tabview-button:not(.tabview-button-active):active {
        background: #4700ab;
        color: #fff;
        scale: .95;
    }

    .tabview-button:hover {
        color: #fff;
        background-color: #5d3db3;
    }

    .tabview-button-hasIcon {
        flex-direction: row;
    }
}
</style>