<template>
    <div class="rvt-tabs" data-rvt-tabs="tabset-1">
        <base-tab-list :tabs="tabs"></base-tab-list>
        <base-tab-panel :tab="tab" v-for="tab in tabs"></base-tab-panel>
    </div>
</template>

<script setup>
import BaseTabList from './BaseTabList.vue'
import BaseTabPanel from './BaseTabPanel.vue'

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