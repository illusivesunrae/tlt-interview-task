<template>
    <div class="tlt-content-wrapper">
        <div class="rvt-container-lg">
            <div class="rvt-row">
                <div class="tlt-form-content rvt-prose rvt-flow rvt-cols-md-up">
                    <form @submit.prevent="submitQuiz">
                        <fieldset class="rvt-fieldset">
                            <legend class="rvt-sr-only">{{ store.quizContext.name }}</legend>
                            <h1 class="rvt-p-top-sm rvt-m-bottom-lg">{{ store.quizContext.name }}</h1>
                            <quiz-question-list v-bind:questions="store.questions"
                                v-bind:options="store.answers"></quiz-question-list>
                        </fieldset>
                        <button class="rvt-button rvt-m-top-xs" type="submit" @click="submitQuiz"
                            v-if="store.currentQuestion.index === store.questions.length - 1">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useQuizStore } from '../store/quizStore';
import QuizQuestionList from '../components/QuizQuestionList.vue';

const route = useRoute();
const store = useQuizStore();

defineProps({
    classId: {
        type: String,
        required: true
    },
    assignmentId: {
        type: String,
        required: true
    }
})

const questions = ref(null)

watch(() => store.questions.value, (newVal, _2) => {
    questions.value = newVal;
})

onMounted(async () => {
    store.fetchQuiz(+route.params.classId, +route.params.assignmentId);
    // questions.value = await 
})

</script>

<style lang="scss" scoped>
@forward '/node_modules/rivet-core/sass/grid/base';
@forward '/node_modules/rivet-core/sass/utilities/flex';

.tlt-content-wrapper {
    @extend .rvt-row;
    @extend .rvt-flex-row;
    padding-bottom: $spacing-xxl;
    padding-top: $spacing-xxl;
    width: 100%;
}

.tlt-form-content {
    margin-left: auto;
    margin-right: auto;
    min-width: 720px;

    form {
        display: flex;
        flex-direction: column;

        button[type="submit"] {
            margin-left: auto;
        }
    }
}
</style>