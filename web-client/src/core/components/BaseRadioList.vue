<template>
    <legend class="rvt-ts-20">{{ label }}</legend>
    <ul class="rvt-list-plain">
        <base-radio-item v-for="(option, index) in radioOptions" :name="name" :id="id + index || index" :key="index"
            :correct="option.correct" :value="option.content" :label="option.content"
            :class="{ 'tlt-form--complete__list': completeClassSelector, 'tlt-form--complete__list--correct': completeClassSelector && option.correct }"></base-radio-item>
    </ul>
</template>

<script setup>
import { useQuizStore } from '@/modules/quiz/store/quizStore';
import { useOfflineStore } from '@/modules/offline/store/offlineStore';
import { ref, toRef, watch } from 'vue';
import BaseRadioItem from './BaseRadioItem.vue';

const store = useQuizStore();
const offline = useOfflineStore();

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

const label = toRef(props.label) || ref('');
const radioOptions = toRef(props.options) || ref([]);
const name = toRef(props.name) || ref('');
const id = ref('');
const completeClassSelector = ref(false)

if (!offline.offlineMode) {
    store.assignmentCompleted ? completeClassSelector.value = true : completeClassSelector.value = false;
} else {
    offline.assignmentCompleted ? completeClassSelector.value = true : completeClassSelector.value = false;
}

watch(() => props.index, (_, _2) => {
    name.value = `question-${props.index}`;
    id.value = `q${props.index}-a`;

    if (!offline.offlineMode) {
        label.value = `${props.index + 1}. ${store.questions[props.index]}`;
        radioOptions.value = store.returnRelatedAnswers(props.index);

    } else {
        label.value = `${props.index + 1}. ${offline.questions[props.index]}`;
        radioOptions.value = offline.returnRelatedAnswers(props.index);
    }
    console.log(radioOptions.value)

}, { immediate: true })
</script>