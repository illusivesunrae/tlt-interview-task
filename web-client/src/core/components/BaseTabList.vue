<template>
    <div class="rvt-tabs__tablist" aria-label="Rivet tabs" data-rvt-tablist>
        <base-tab-item :tabs="tabs" v-for="tab in tabs" :label="tab.label"></base-tab-item>
    </div>
</template>

<script setup>
import BaseTabItem from './BaseTabItem.vue'

defineProps({
    tabs: {
        type: Array,
        required: true
    }
})
</script>

<style lang="scss" scoped>
@forward '/node_modules/rivet-core/sass/tabs/base';
</style>