<template>
    <quiz-question-item v-for="(question, index) in questionsArray" :key="index" v-bind:question="question"
        v-bind:optionsId="index" v-bind:studentAnswer="studentAnswers[index]"
        v-bind:options="store.returnRelatedAnswers(index, options)"></quiz-question-item>
    <quiz-navigation v-bind:questions="questionsArray"></quiz-navigation>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useQuizStore } from '../store/quizStore';
import QuizQuestionItem from './QuizQuestionItem.vue';
import QuizNavigation from './QuizNavigation.vue';

const store = useQuizStore();

const props = defineProps({
    questions: {
        type: Array
    },
    currentIndex: {
        type: Number
    },
    options: {
        type: Array
    },
    studentAnswers: {
        type: Array
    },
    studentAnswer: {
        type: Number
    }
})

console.log(props.studentAnswers)

const questionsArray = ref([]);

const currentIndex = ref(0)


watch(() => store.questions, (newVal, _) => {
    questionsArray.value = newVal;
    store.setInitialQuestion(0);
})
</script>