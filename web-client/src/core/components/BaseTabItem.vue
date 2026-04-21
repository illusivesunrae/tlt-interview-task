<template>
    <button class="rvt-tabs__tab" data-rvt-tab>{{ label }}</button>
</template>

<script setup>
defineProps({
    label: {
        type: String,
        required: true
    }
})
</script>

<style lang="scss" scoped>
@forward '/node_modules/rivet-core/sass/tabs/base';
</style>