<script setup>
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue';

const props = defineProps(["entries", "onSelect", "select", "chevron"]);

const expand = ref(false);
const selected = ref(null);

onMounted(() => {
    if (!selected.value) {
        selected.value = props.entries[0];
    } else {
        selected.value = props.entries[0];
    }
});
</script>

<template>
    <div class="walletExchangeSelectors">
        <div class="walletExchangeSelector">
            <div class="wesContainer" @click="expand = !expand"
                :style="`${expand ? 'border: 1px solid #6f30d7;' : 'border: 1px solid #324468;'}`">
                <div class="icon" v-if="selected?.icon">
                    <WebIcon :icon="selected.icon" :style="{ color: selected.style }" />
                </div>
                <div class="name">{{ selected?.name ?? 'no name' }}</div>
                <div class="icon" v-if="chevron">
                    <WebIcon :icon="`fa fa-fw fa-chevron-${expand ? 'up' : 'down'}`" />
                </div>
            </div>
            <div class="exchangeList" v-if="expand">
                <OverlayScrollbarsComponent :options="{ scrollbars: { autoHide: 'leave' } }"
                    class="os-theme-thin-light">
                    <div class="elEntry" v-for="currency in entries"
                        @click="selected = currency; expand = false; onSelect(selected)"
                        :style="`background-color: ${currency.id === select ? '#39417d' : '#1d2b47'}`">
                        <div class="icon" v-if="currency.icon"><web-icon :icon="currency.icon"
                                :style="{ color: currency.style }"></web-icon></div>
                        <div class="name" :style="`color: ${currency.id === select ? '#ffffff' : '#6ba6f1'}`">{{
                            currency.name }}</div>
                    </div>
                </OverlayScrollbarsComponent>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/themes";

.walletExchangeSelectors {
    display: flex;

    @include themed() {
        i {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 15px;
        }

        .walletExchangeSelector {
            position: relative;
            cursor: pointer;
            // margin-right: 15px;

            &:last-child {
                margin-right: 0;
            }

            .exchangeList {
                position: absolute;
                left: 0;
                width: 100%;
                z-index: 5;
                background: #2a51a1 !important;
                margin-top: 5px;

                .os-host {
                    max-height: 300px;
                    border: 1px solid #7e53af;
                    border-radius: 3px;
                }

                .elEntry {
                    background-color: #172135; // t('body');
                    transition: background .3s ease;
                    display: flex;
                    align-items: center;
                    padding: 10px 8px;
                    white-space: nowrap;
                    border-bottom: 1px solid #2e3554;

                    &:hover {
                        background-color: #5a61c4 !important;
                    }

                    .icon {
                        width: 25px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        // margin-left: 5px;
                    }
                }
            }

            .wesContainer {
                display: flex;
                padding: 6px 13px;
                border-radius: 3px;
                background: t('body');
                transition: background .3s ease;
                white-space: nowrap;
                justify-content: space-between;

                &:hover {
                    background: lighten(t('body'), 5%);
                }

                .icon {
                    width: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    // margin-right: 5px;
                }

                .name {
                    margin-right: 10px;
                }
            }
        }
    }
}
</style>