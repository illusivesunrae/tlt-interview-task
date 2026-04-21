<template>
    <div class="tlt-content-wrapper">
        <div class="rvt-container-lg">
            <div class="rvt-prose rvt-flow">
                <h1 class="rvt-m-top-xs">IU Student Dashboard</h1>
                <div class="rvt-m-top-xxl rvt-p-top-xxl rvt-border-top">
                    <base-card raised warning type="upcoming" title="Upcoming Assignments" badge="Due this week"
                        v-if="quizStore.upcomingAssignments" :assignments="quizStore.upcomingAssignments"></base-card>
                    <base-card raised success type="previous" title="Previous Assignments"
                        v-if="quizStore.previousAssignments" :assignments="quizStore.previousAssignments"></base-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useQuizStore } from '../modules/quiz/store/quizStore';

import BaseCard from '../components/BaseCard.vue';

const quizStore = useQuizStore();

watch(() => quizStore.activeClasses, (newVal, _) => {
    newVal.forEach((item) => {
        quizStore.fetchUpcomingAssignments(item);
        quizStore.fetchPreviousAssignments(item);
    })
})

onMounted(() => {
    quizStore.fetchActiveClasses();
})

// const widgets = [
//     { title: 'You have a quiz due today', content: 'Take your quiz now before time runs out!' },
//     { title: 'You have an assignment due tomorrow', content: 'Turn in your homework.' },
//     { title: 'You have a quiz due soon', content: 'Take your quiz now before time runs out!' }
// ]
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

    .rvt-card:not(:first-of-type) {
        margin-top: 2.5rem;
    }
}
</style>