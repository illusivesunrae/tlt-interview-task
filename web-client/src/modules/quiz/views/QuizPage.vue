<template>
    <div class="tlt-content-wrapper">
        <div class="rvt-container-lg">
            <div class="rvt-row">
                <div class="tlt-form-content rvt-prose rvt-flow rvt-cols-md-up">
                    <div v-if="!offline.offlineMode">
                        <form @submit.prevent="store.submitForm(props.classId, props.assignmentId)"
                            v-if="store.assignmentCompleted === false">
                            <fieldset class="rvt-fieldset">
                                <legend class="rvt-sr-only">{{ store.quizContext.name }}
                                </legend>
                                <h1 class="rvt-p-top-sm rvt-m-bottom-lg">{{ store.quizContext.name }}</h1>
                                <quiz-question-list></quiz-question-list>
                            </fieldset>
                            <button class="rvt-button rvt-m-top-xs" type="submit"
                                v-if="store.currentQuestion.index === store.questions.length - 1">Submit</button>
                        </form>
                        <div v-else-if="store.assignmentCompleted === true">
                            <p>You've completed this assignment. Feel free to review your answers.</p>
                            <form :class="{ 'tlt-form--complete': store.assignmentCompleted }">
                                <fieldset class="rvt-fieldset">
                                    <legend class="rvt-sr-only">{{ store.quizContext.name }}
                                    </legend>
                                    <h1 class="rvt-p-top-sm rvt-m-bottom-lg">{{ store.quizContext.name }}</h1>
                                    <quiz-question-list></quiz-question-list>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                    <div v-else>
                        <form @submit.prevent="offline.submitForm(props.classId, props.assignmentId)"
                            v-if="offline.assignmentCompleted === false">
                            <fieldset class="rvt-fieldset">
                                <legend class="rvt-sr-only">{{ offline.quizContext.name }}
                                </legend>
                                <h1 class="rvt-p-top-sm rvt-m-bottom-lg">{{ offline.quizContext.name }}</h1>
                                <quiz-question-list></quiz-question-list>
                            </fieldset>
                            <button class="rvt-button rvt-m-top-xs" type="submit"
                                v-if="offline.currentQuestion.index === offline.questions.length - 1">Submit</button>
                        </form>
                        <div v-else-if="offline.assignmentCompleted === true">
                            <p>You've completed this assignment. Feel free to review your answers.</p>
                            <form :class="{ 'tlt-form--complete': offline.assignmentCompleted }">
                                <fieldset class="rvt-fieldset">
                                    <legend class="rvt-sr-only">{{ offline.quizContext.name }}
                                    </legend>
                                    <h1 class="rvt-p-top-sm rvt-m-bottom-lg">{{ offline.quizContext.name }}</h1>
                                    <quiz-question-list></quiz-question-list>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useQuizStore } from '../store/quizStore';
import { useOfflineStore } from '@/modules/offline/store/offlineStore';
import QuizQuestionList from '../components/QuizQuestionList.vue';

const store = useQuizStore();
const offline = useOfflineStore();

const props = defineProps({
    // Passed by the router as props
    assignmentId: {
        type: String,
        required: true
    },
    classId: {
        type: String,
        required: true
    }
})

if (!offline.offlineMode) {
    watch(() => [+props.classId, +props.assignmentId], store.fetchQuiz, { immediate: true })
} else {
    watch(() => [+props.classId, +props.assignmentId], offline.fetchQuiz, { immediate: true })
}

watch(() => store.questions, (newVal, _) => {
    if (newVal === false) {
        // console.log(store.questions.value)
    }
})

watch(() => offline.questions, (newVal, _) => {
    if (newVal === false) {
        // console.log(offline.questions.value)
    }
})

onMounted(() => {
    if (!offline.offlineMode) {
        store.fetchQuiz(+props.classId, +props.assignmentId);
        store.checkIfAssignmentCompleted(+props.classId, +props.assignmentId);
    } else {
        offline.fetchQuiz(+props.classId, +props.assignmentId)
        offline.checkIfAssignmentCompleted(+props.classId, +props.assignmentId);
    }
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