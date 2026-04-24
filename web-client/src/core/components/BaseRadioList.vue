<template>
    <legend class="rvt-ts-20">{{ `${optionsId + 1}. ${content}` }}</legend>
    <ul class="rvt-list-plain">
        <base-radio-item v-for="(option, index) in options" v-bind:group="`Question ${optionsId}`" :key="index"
            v-bind:correct="option.correct" v-bind:options="options.value" v-bind:id="`q${optionsId}-a${index}`"
            v-bind:index="index" v-bind:value="option.content" v-bind:label="option.content"
            v-bind:studentAnswer="studentAnswer"></base-radio-item>
    </ul>
</template>

<script setup>
import { useQuizStore } from '../../modules/quiz/store/quizStore';
import { ref, toRef, watch } from 'vue';
import BaseRadioItem from './BaseRadioItem.vue';

const store = useQuizStore();

const props = defineProps({
    content: {
        type: String,
        required: true
    },
    options: {
        type: Array,
        required: true
    },
    optionsId: {
        type: Number,
        required: true
    },
    studentAnswer: {
        type: Number
    },
    index: {
        type: Number
    },
    correct: {
        type: Boolean
    }
})

// const selected = ref();
// const optionsRef = toRef(props, 'options');
// const optionsIdRef = toRef(props, 'optionsId');

// const selection = store.returnRelatedAnswers(optionsIdRef.value, optionsRef.value)
// console.log(selection)
// selected.value = selection[0].content
// console.log(selected.value)


</script>