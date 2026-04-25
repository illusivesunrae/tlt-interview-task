<template>
    <quiz-question-item v-for="(_, index) in store.questions" :key="index"></quiz-question-item>
    <quiz-navigation></quiz-navigation>
</template>

<script setup>
import { useQuizStore } from '../store/quizStore';
import QuizQuestionItem from './QuizQuestionItem.vue';
import QuizNavigation from './QuizNavigation.vue';

const store = useQuizStore();
</script>