<template>
    <form @submit.prevent="submitQuiz">
        <fieldset>
            <legend>{{ store.quizContext.name }}</legend>

        </fieldset>
        <button type="submit" @click="submitQuiz">Submit</button>
    </form>
</template>

<script setup>
import { onMounted } from 'vue';
import { useQuizStore } from '../store/quizStore';
import QuizQuestionList from './QuizQuestionList.vue';

const store = useQuizStore;

defineProps({
    quizContext: {
        type: Object,
        required: true
    }
})
</script>