<template>
    <div class="rvt-tabs__panel" data-rvt-tab-panel v-html="tab.content"></div>
</template>

<script setup>
defineProps({
    tab: {
        type: Object,
        required: true
    }
})
</script>

<style lang="scss" scoped>
@forward '/node_modules/rivet-core/sass/tabs/base';
</style>