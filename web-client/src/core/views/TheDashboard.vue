<template>
    <div class="tlt-content-wrapper">
        <div class="rvt-container-lg">
            <div class="rvt-prose rvt-flow">
                <h1 class="rvt-m-top-xs">IU Student Dashboard</h1>
                <div class="rvt-m-top-xxl rvt-p-top-xxl rvt-border-top">
                    <base-card raised warning type="upcoming" title="Upcoming Assignments" badge="Due this week"
                        v-if="offline.upcomingAssignments || quizStore.upcomingAssignments"
                        :assignments="offline.upcomingAssignments || quizStore.upcomingAssignments"></base-card>
                    <base-card raised success type="previous" title="Previous Assignments"
                        v-if="offline.previousAssignments || quizStore.previousAssignments"
                        :assignments="offline.previousAssignments || quizStore.previousAssignments"></base-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue';
import { useQuizStore } from '../../modules/quiz/store/quizStore';
import { useOfflineStore } from '@/modules/offline/store/offlineStore';

import BaseCard from '../components/BaseCard.vue';

const quizStore = useQuizStore();
const offline = useOfflineStore();

watch(() => quizStore.activeClasses, (newVal, _) => {
    if (import.meta.env.VITE_demo_mode === false) {
        newVal.forEach((item) => {
            quizStore.fetchUpcomingAssignments(item);
            quizStore.fetchPreviousAssignments(item);
        })
    }
})

watch(() => offline.activeClasses, (newVal, _) => {
    newVal.forEach((item) => {
        offline.fetchUpcomingAssignments(item);
        offline.fetchPreviousAssignments(item);
    })
})

watch(() => offline.online, (newVal, _) => {
    if (newVal === false) {
        offline.fetchActiveClasses();
    }
})

onMounted(() => {
    if (import.meta.env.VITE_demo_mode === false) {
        quizStore.fetchActiveClasses();
    } else {
        offline.fetchActiveClasses();
    }
    window.addEventListener('online', offline.updateOnlineStatus);
    window.addEventListener('offline', offline.updateOnlineStatus);
})

onUnmounted(() => {
    window.removeEventListener('online', offline.updateOnlineStatus);
    window.removeEventListener('offline', offline.updateOnlineStatus);
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

    .rvt-card:not(:first-of-type) {
        margin-top: 2.5rem;
    }
}
</style>