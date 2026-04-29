<template>
    <div class="rvt-card" :class="{ 'rvt-card--clickable': clickable, 'rvt-card--raised': raised }">
        <div class=" rvt-flex rvt-items-center rvt-justify-space-between rvt-p-all-lg"
            :class="{ 'rvt-bg-gold-000': warning, 'rvt-bg-green-000': success }">
            <h2 class="rvt-ts-20">{{ title }}</h2>
            <span class="rvt-badge rvt-m-left-sm" :class="{ 'rvt-badge--warning': warning }" v-if="badge">{{ badge
                }}</span>
        </div>
        <div class="rvt-card__content [ rvt-p-top-none rvt-m-top-none rvt-border-top-none ]" v-if="assignments">
            <ul class="rvt-list-plain">
                <li class="rvt-flex-lg-up rvt-items-center rvt-justify-space-between rvt-border-top rvt-p-top-md rvt-p-bottom-sm rvt-p-lr-lg"
                    v-for="(assignment, index) in assignments"
                    :class="{ 'rvt-p-bottom-lg': index === assignments.length - 1 }">
                    <RouterLink :to="`/classes/${assignment.classId}/assignment-${assignment.index}`"
                        class="rvt-flex rvt-items-center rvt-p-bottom-sm rvt-p-bottom-none-lg-up"
                        style="text-decoration: none;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            viewBox="0 0 16 16">
                            <path d="M1 7h10.844L7.737 2.146 9.263.854 15.31 8l-6.047 7.146-1.526-1.292L11.844 9H1V7Z">
                            </path>
                        </svg>
                        <span class="rvt-p-left-sm">
                            {{ assignment.name }}
                        </span>
                    </RouterLink>
                    <span class="">
                        {{ formatDate(assignment.dueDate) }}
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { toRef } from 'vue'
const props = defineProps({
    assignments: {
        type: Array,
        required: true
    },
    badge: {
        type: String,
        required: false
    },
    clickable: {
        type: Boolean,
        default: false
    },
    raised: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true,
    },
    warning: {
        type: Boolean,
        default: false
    },
    success: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        required: true
    }
})

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday']

const formatDate = (date) => {
    return `${dayNames[new Date(date).getDay()]} at ${new Date(date).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })}`
}
</script>

<style lang="scss" scoped>
@forward '/node_modules/rivet-core/sass/card/base.scss';

.rvt-list-plain {
    margin-top: 0;
}
</style>