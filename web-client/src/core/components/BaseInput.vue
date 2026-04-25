<template>
    <base-label :for="id" :label="label"></base-label>
    <input :type="type" :id="id" class="rvt-text-input" autocorrect="off" autocapitalize="none" autocomplete="off"
        :required="required" v-model="model" />
</template>

<script setup>
import { computed } from 'vue';

import BaseLabel from './BaseLabel.vue';

const model = defineModel({ type: String })

defineProps({
    id: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    required: {
        type: Boolean,
        required: false
    },
    type: {
        type: String,
        required: true,
    }
});
</script>

<style lang="scss">
@forward '/node_modules/rivet-core/sass/inputs/base.scss';
</style>