<template>
    <quiz-question-item v-for="(question, index) in questions" :key="index"></quiz-question-item>
    <quiz-navigation></quiz-navigation>
</template>

<script setup>
import { ref } from 'vue'
import { useEnvironmentStore } from '@/core/composables/useEnvironmentStore'
import QuizQuestionItem from './QuizQuestionItem.vue'
import QuizNavigation from './QuizNavigation.vue'

const store = useEnvironmentStore()

const questions = ref([])

questions.value = store.questions
</script>