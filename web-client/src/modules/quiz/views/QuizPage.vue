<template>
    <div class="tlt-content-wrapper">
        <div class="rvt-container-lg">
            <div class="rvt-row">
                <div class="tlt-form-content rvt-prose rvt-flow rvt-cols-md-up">
                    <div>
                        <p v-if="offline">You are offline and will not be able to submit your work.</p>
                        <form @submit.prevent="handleSubmission" v-if="store.assignmentCompleted === false">
                            <fieldset class="rvt-fieldset">
                                <legend class="rvt-sr-only">{{ store.quizContext.name }}
                                </legend>
                                <h1 class="rvt-p-top-sm rvt-m-bottom-lg">{{ store.quizContext.name }}</h1>
                                <quiz-question-list :key="formKey"></quiz-question-list>
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
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useEnvironmentStore } from '@/core/composables/useEnvironmentStore'
import QuizQuestionList from '../components/QuizQuestionList.vue'

const offline = ref(import.meta.env.VITE_demo_mode === 'true')

// const instance = getCurrentInstance()

// const forceUpdate = () => {
//     instance.proxy.$forceUpdate()
// };

const store = useEnvironmentStore()

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

const formKey = ref(0)

const forceRefresh = () => {
    formKey.value += 1
    store.currentQuestion.index = 0
    store.previousQuestion.index = null
    store.nextQuestion.index = 1
}

const handleSubmission = () => {
    if (!offline.value) {

        store.submitForm(props.classId, props.assignmentId)
        forceRefresh()
    }
};

watch(() => [+props.classId, +props.assignmentId], store.fetchQuiz, { immediate: true })

watch(() => formKey.value, (newVal, _2) => {
    if (newVal !== 0) {
        store.checkIfAssignmentCompleted(+props.classId, +props.assignmentId)
    }
}, { immediate: true })

onMounted(() => {
    store.fetchQuiz(+props.classId, +props.assignmentId)
    store.checkIfAssignmentCompleted(+props.classId, +props.assignmentId)
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