<template>
    <label :for="props.for">{{ props.label }}<slot></slot></label>
</template>

<script setup>
const props = defineProps(['label', 'for'])
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