<script setup>
const route = useRoute();

const capitalizeWords = (value) => {
    return value.replace(/\b\w/g, (char) => char.toUpperCase());
};

const category = computed(() => capitalizeWords(route.params.category));
</script>

<template>
    <div>
        <div class="sub-header">
            <div class="container">
                {{ category }}
            </div>
        </div>
        <div class="container">
            <CategoryGameList :sort="{ type: 'category', by: route.params.category }" :isIndex="true" />
            <ProviderSlider />
        </div>
    </div>
</template>

<style lang="scss">
@import "@/assets/sass/themes";

.sub-header {
    font-size: 30px;
    padding-top: 10px;
    padding-bottom: 20px;
    border-bottom: .0625rem solid #2a2e38;
}
</style>