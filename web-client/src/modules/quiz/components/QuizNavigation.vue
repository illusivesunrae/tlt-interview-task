<template>
    <div class="rvt-seriesnav" v-if="!offline.offlineMode">
        <button class="rvt-seriesnav__previous" type="button" :disabled="store.previousQuestion.index === null"
            @click="store.showPreviousQuestion()">
            <div class="rvt-seriesnav__text">
                <span class="rvt-seriesnav__label" v-if="store.previousQuestion.index !== null">Previous:</span>
                <span class="rvt-seriesnav__item" v-if="store.previousQuestion.index !== null">Question #{{
                    store.previousQuestion.index + 1 }}</span>
            </div>
            <span class="rvt-seriesnav__icon" aria-hidden="true" v-if="store.previousQuestion.index !== null">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M15 7H4.156l4.107-4.854L6.737.854.69 8l6.047 7.146 1.526-1.292L4.156 9H15V7Z" />
                </svg>
            </span>
        </button>
        <button class="rvt-seriesnav__next" type="button" :disabled="store.nextQuestion.index === null"
            @click="store.showNextQuestion()">
            <div class="rvt-seriesnav__text">
                <span class="rvt-seriesnav__label" v-if="store.nextQuestion.index !== null">Next:</span>
                <span class="rvt-seriesnav__item" v-if="store.nextQuestion.index !== null">Question #{{
                    store.nextQuestion.index + 1
                    }}</span>
            </div>
            <span class="rvt-seriesnav__icon" aria-hidden="true" v-if="store.nextQuestion.index !== null">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 7h10.844L7.737 2.146 9.263.854 15.31 8l-6.047 7.146-1.526-1.292L11.844 9H1V7Z" />
                </svg>
            </span>
        </button>
    </div>
    <div class="rvt-seriesnav" v-else>
        <button class="rvt-seriesnav__previous" type="button" :disabled="offline.previousQuestion.index === null"
            @click="offline.showPreviousQuestion()">
            <div class="rvt-seriesnav__text">
                <span class="rvt-seriesnav__label" v-if="offline.previousQuestion.index !== null">Previous:</span>
                <span class="rvt-seriesnav__item" v-if="offline.previousQuestion.index !== null">Question #{{
                    offline.previousQuestion.index + 1 }}</span>
            </div>
            <span class="rvt-seriesnav__icon" aria-hidden="true" v-if="offline.previousQuestion.index !== null">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M15 7H4.156l4.107-4.854L6.737.854.69 8l6.047 7.146 1.526-1.292L4.156 9H15V7Z" />
                </svg>
            </span>
        </button>
        <button class="rvt-seriesnav__next" type="button" :disabled="offline.nextQuestion.index === null"
            @click="offline.showNextQuestion()">
            <div class="rvt-seriesnav__text">
                <span class="rvt-seriesnav__label" v-if="offline.nextQuestion.index !== null">Next:</span>
                <span class="rvt-seriesnav__item" v-if="offline.nextQuestion.index !== null">Question #{{
                    offline.nextQuestion.index + 1
                    }}</span>
            </div>
            <span class="rvt-seriesnav__icon" aria-hidden="true" v-if="offline.nextQuestion.index !== null">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 7h10.844L7.737 2.146 9.263.854 15.31 8l-6.047 7.146-1.526-1.292L11.844 9H1V7Z" />
                </svg>
            </span>
        </button>
    </div>
</template>

<script setup>
import { useQuizStore } from '../store/quizStore';
import { useOfflineStore } from '@/modules/offline/store/offlineStore';

const store = useQuizStore()
const offline = useOfflineStore();

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