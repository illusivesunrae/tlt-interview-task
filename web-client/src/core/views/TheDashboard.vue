<template>
    <div class="tlt-content-wrapper">
        <div class="rvt-container-lg">
            <div class="rvt-prose rvt-flow">
                <h1 class="rvt-m-top-xs">IU Student Dashboard</h1>
                <div class="rvt-m-top-xxl rvt-p-top-xxl rvt-border-top">
                    <base-card raised warning type="upcoming" title="Upcoming Assignments" badge="Due this month(ish)"
                        v-if="store.upcomingAssignments" :assignments="store.upcomingAssignments"></base-card>
                    <base-card raised success type="previous" title="Previous Assignments"
                        v-if="store.previousAssignments" :assignments="store.previousAssignments"></base-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useEnvironmentStore } from '../composables/useEnvironmentStore'

import BaseCard from '../components/BaseCard.vue'

const store = useEnvironmentStore()

watch(() => store.activeClasses, (newVal, _) => {
    if (newVal.length) {
        store.fetchDashboard()
    }
}, { immediate: true })

onMounted(() => {
    store.fetchActiveClasses()
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