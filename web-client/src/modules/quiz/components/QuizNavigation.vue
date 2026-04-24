<template>
    <div class="rvt-seriesnav">
        <button class="rvt-seriesnav__previous" type="button" :disabled="previousQuestion.index === null"
            @click="store.showPreviousQuestion(currentQuestion.index)">
            <div class="rvt-seriesnav__text">
                <span class="rvt-seriesnav__label" v-if="previousQuestion.index !== null">Previous:</span>
                <span class="rvt-seriesnav__item" v-if="previousQuestion.index !== null">Question #{{
                    previousQuestion.index + 1 }}</span>
            </div>
            <span class="rvt-seriesnav__icon" aria-hidden="true" v-if="previousQuestion.index !== null">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M15 7H4.156l4.107-4.854L6.737.854.69 8l6.047 7.146 1.526-1.292L4.156 9H15V7Z" />
                </svg>
            </span>
        </button>
        <button class="rvt-seriesnav__next" type="button" :disabled="nextQuestion.index === null"
            @click="store.showNextQuestion(currentQuestion.index)">
            <div class="rvt-seriesnav__text">
                <span class="rvt-seriesnav__label" v-if="nextQuestion.index !== null">Next:</span>
                <span class="rvt-seriesnav__item" v-if="nextQuestion.index !== null">Question #{{ nextQuestion.index + 1
                    }}</span>
            </div>
            <span class="rvt-seriesnav__icon" aria-hidden="true" v-if="nextQuestion.index !== null">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 7h10.844L7.737 2.146 9.263.854 15.31 8l-6.047 7.146-1.526-1.292L11.844 9H1V7Z" />
                </svg>
            </span>
        </button>
    </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { useQuizStore } from '../store/quizStore';

const store = useQuizStore()

defineProps({
    questions: {
        type: Array,
        required: true
    }
})

const currentQuestion = reactive({
    index: null
})

const nextQuestion = reactive({
    index: null
})

const previousQuestion = reactive({
    index: null
})

watch(() => store.currentQuestion.index, (newVal, _2) => {
    currentQuestion.index = newVal;
})

watch(() => store.previousQuestion.index, (newVal, _2) => {
    previousQuestion.index = newVal;
})

watch(() => store.nextQuestion.index, (newVal, _2) => {
    nextQuestion.index = newVal;
})
</script>

<style lang="scss" scoped>
@forward '/node_modules/rivet-core/sass/seriesnav/base.scss';

.rvt-seriesnav {
    margin-top: .5rem;

    &__previous,
    &__next {
        cursor: pointer;

        &:disabled {
            background: #75838f;
            cursor: default;
        }
    }
}
</style>