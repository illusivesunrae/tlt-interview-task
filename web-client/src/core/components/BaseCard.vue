<template>
    <div class="rvt-card tlt-card" :class="{ 'rvt-card--clickable': clickable, 'rvt-card--raised': raised }">
        <div class="tlt-card--heading""
            :class="{ 'rvt-bg-gold-000': warning, 'rvt-bg-green-000': success }">
            <h2 class="rvt-ts-20">{{ title }}</h2>
            <span class="rvt-badge rvt-m-left-sm" :class="{ 'rvt-badge--warning': warning }" v-if="badge">{{ badge
            }}</span>
        </div>
        <div class="rvt-card__content tlt-card__content" v-if="assignments">
            <ul class="rvt-list-plain">
                <li class="" v-for="(assignment, index) in assignments">
                    <RouterLink :to="`/classes/${assignment.classId}/assignment-${assignment.index}`" class=""
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
                    <span>
                        {{ formatCourseId(assignment.courseId) }}
                    </span>
                    <span class="">
                        {{ formatDate(assignment.dueDate) }}
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
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

const formatCourseId = (id) => {
    return id.replace(/(\d)/, ' $1')
}

const formatDate = (date) => {
    return `${dayNames[new Date(date).getDay()]}, ${new Date(date).toLocaleString('default', { month: 'long' })} ${new Date(date).getDate()} at ${new Date(date).toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })}`
}
</script>

<style lang="scss" scoped>
@forward '/node_modules/rivet-core/sass/card/base.scss';
@forward '/node_modules/rivet-core/sass/utilities/flex';

.rvt-list-plain {
    margin-top: 0;
}

.tlt- {
    &card {
        &--heading {
            @extend .rvt-flex;
            @extend .rvt-justify-space-between;
            @extend .rvt-items-center;

            gap: 20rem;
            padding: 2rem;
        }

        &__content {
            margin-top: 0 !important;
            padding: 1.5rem !important;

            ul {
                display: grid;
                gap: 1.5rem 0;

                li {
                    display: grid;
                    grid-template-columns: 37% 13% 50%;

                    a {
                        align-items: center;
                        display: flex;
                        justify-content: flex-start;
                    }

                    span {
                        display: flex;
                        justify-content: flex-end;
                    }
                }
            }
        }

    }

}
</style>