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
            <!-- <index-slider></index-slider> -->
            <!-- <game-category-search></game-category-search> -->
            <category-game-list :sort="{ type: 'category', by: route.params.category }"
                :isIndex="true"></category-game-list>
            <provider-slider></provider-slider>
            <!-- <game-list :sort="{ type: 'category', by: $route.params.category }"></game-list> -->
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
    // margin-left: 20px;
}
</style>