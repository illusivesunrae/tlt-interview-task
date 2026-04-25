<template>
    <div class="tlt-content-wrapper">
        <div class="rvt-container-lg">
            <div class="rvt-row">
                <div class="tlt-form-content rvt-prose rvt-flow rvt-cols-md-up">
                    <!-- <form>
                        <fieldset class="rvt-fieldset">
                            <legend class="rvt-sr-only">Review: {{ store.quizContext.name }}</legend>
                            <h1 class="rvt-p-top-sm rvt-m-bottom-lg">{{ store.quizContext.name }}</h1>
                            <quiz-question-list></quiz-question-list>
                        </fieldset>
                    </form> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// import { onMounted, ref, watch } from 'vue';
// import { useRoute } from 'vue-router';
// import { useQuizStore } from '../store/quizStore';
// import QuizQuestionList from '../components/QuizQuestionList.vue';

// const route = useRoute();
// const store = useQuizStore();


// watch(() => store.studentAssignmentAnswers, (newVal, _) => {
//     console.log(newVal)
// })


// onMounted(async () => {
//     store.fetchQuiz(+route.params.classId, +route.params.assignmentId);
//     store.fetchStudentAnswers(+route.params.classId, +route.params.assignmentId);
// })

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