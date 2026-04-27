<template>
    <quiz-question-item v-for="(question, index) in store.questions" :key="index"></quiz-question-item>
    <quiz-navigation></quiz-navigation>
</template>

<script setup>
import { useEnvironmentStore } from '@/core/composables/useEnvironmentStore'
import QuizQuestionItem from './QuizQuestionItem.vue'
import QuizNavigation from './QuizNavigation.vue'

const store = useEnvironmentStore()
</script>