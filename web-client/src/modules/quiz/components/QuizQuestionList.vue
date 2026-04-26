<template>
    <quiz-question-item v-for="(question, index) in questions" :key="index"></quiz-question-item>
    <quiz-navigation></quiz-navigation>
</template>

<script setup>
import { ref } from 'vue';
import { useQuizStore } from '../store/quizStore';
import { useOfflineStore } from '@/modules/offline/store/offlineStore';
import QuizQuestionItem from './QuizQuestionItem.vue';
import QuizNavigation from './QuizNavigation.vue';

const store = useQuizStore();
const offline = useOfflineStore();

const questions = ref([])

if (!offline.offlineMode) {
    questions.value = store.questions
} else {
    questions.value = offline.questions
}
</script>