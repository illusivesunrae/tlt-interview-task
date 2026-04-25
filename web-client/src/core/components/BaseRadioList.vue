<template>
    <legend class="rvt-ts-20">{{ label }}</legend>
    <ul class="rvt-list-plain">
        <base-radio-item v-for="(option, index) in radioOptions" :name="name" :id="id + index || index" :key="index"
            :value="option.content" :label="option.content"></base-radio-item>
    </ul>
</template>

<script setup>
import { useQuizStore } from '@/modules/quiz/store/quizStore';
import { ref, toRef, watch } from 'vue';
import BaseRadioItem from './BaseRadioItem.vue';

const store = useQuizStore();

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

watch(() => props.index, (_, _2) => {
    label.value = `${props.index + 1}. ${store.questions[props.index]}`;
    radioOptions.value = store.returnRelatedAnswers(props.index);
    name.value = `question-${props.index}`;
    id.value = `q${props.index}-a`;
}, { immediate: true })
</script>