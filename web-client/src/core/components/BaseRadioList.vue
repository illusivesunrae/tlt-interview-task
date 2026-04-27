<template>
    <legend class="rvt-ts-20">{{ label }}</legend>
    <ul class="rvt-list-plain">
        <base-radio-item v-for="(option, index) in radioOptions" :name="name" :id="id + index || index" :key="index"
            :correct="option.correct" :value="option.content" :label="option.content"
            :class="{ 'tlt-form--complete__list': completeClassSelector, 'tlt-form--complete__list--correct': completeClassSelector && option.correct }"></base-radio-item>
    </ul>
</template>

<script setup>
import { useEnvironmentStore } from '../composables/useEnvironmentStore'
import { ref, toRef, watch } from 'vue'
import BaseRadioItem from './BaseRadioItem.vue'

const store = useEnvironmentStore()

const props = defineProps({
    index: {
        type: Number,
        required: false
    },
    label: {
        type: String,
        required: false
    },
    options: {
        type: Array,
        required: false
    }
})

const label = toRef(props.label) || ref('')
const radioOptions = toRef(props.options) || ref([])
const name = toRef(props.name) || ref('')
const id = ref('')
const completeClassSelector = ref(false)

store.assignmentCompleted ? completeClassSelector.value = true : completeClassSelector.value = false

watch(() => props.index, (_, _2) => {
    name.value = `question-${props.index}`
    id.value = `q${props.index}-a`
    label.value = `${props.index + 1}. ${store.questions[props.index]}`
    radioOptions.value = store.returnRelatedAnswers(props.index)

}, { immediate: true })
</script>