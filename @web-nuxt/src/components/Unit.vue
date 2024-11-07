<script setup>
import bitcoin from 'bitcoin-units';

const props = defineProps(["value", "to", "fiat"]);

const store = useMainStore();
const { formatCurrency, tokenToFiat } = useUtils();

const computedValue = computed(() => {
    if (props.to.startsWith('local_')) return formatCurrency(props.value);
    if (props.fiat) return '$' + tokenToFiat(store.currencies[props.to].price, props.value ? props.value : 0).toFixed(props.to === 'commerce_shibainu' ? 2 : 2);

    return bitcoin(props.value ? props.value : 0, 'btc').to(store.unit).value().toFixed(store.unit === 'satoshi' ? 0 : 8);
});
</script>

<template>
    <span class="unit">{{ computedValue }}</span>
</template>

<style lang="scss" scoped>
.unit {
    margin-right: 5px;
}
</style>