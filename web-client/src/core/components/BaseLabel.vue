<template>
    <label :for="control" :class="{ 'rvt-success': correct, 'rvt-error': !correct }">{{ label }}</label>
</template>

<script setup>
const props = defineProps(['label', 'control', 'correct']);
</script>

<style lang="scss">
label {
    display: inline-block;
    font-size: 0.875rem;
    line-height: 1;
    font-weight: 700;
    margin-bottom: 0.5rem;
}
</style>