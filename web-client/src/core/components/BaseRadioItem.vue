<template>
    <li class="rvt-radio rvt-radio--tile">
        <div class=" rvt-radio">
            <input type="radio" :name="props.name" :id="props.id" :value="props.value"
                v-model="store.defaults[questionIndex]" />
            <base-label :for="props.id" :label="props.label">
                <div v-if="store.assignmentCompleted">
                    <svg aria-hidden="true" fill="currentColor" focusable="false" height="16" viewBox="0 0 16 16"
                        width="16" xmlns="http://www.w3.org/2000/svg" v-if="props.correct">
                        <path d="M7 11.414 11.914 6.5 10.5 5.086 7 8.586l-1.5-1.5L4.086 8.5 7 11.414Z"></path>
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8Z"></path>
                    </svg>
                    <svg aria-hidden="true" fill="currentColor" focusable="false" height="16" viewBox="0 0 16 16"
                        width="16" xmlns="http://www.w3.org/2000/svg"
                        v-else-if="props.correct !== true && store.defaults[questionIndex] === props.value">
                        <path d="m8 6.586-2-2L4.586 6l2 2-2 2L6 11.414l2-2 2 2L11.414 10l-2-2 2-2L10 4.586l-2 2Z">
                        </path>
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8Z"></path>
                    </svg>
                </div>
            </base-label>
        </div>
    </li>
</template>

<script setup>
import { useEnvironmentStore } from '../composables/useEnvironmentStore'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BaseLabel from './BaseLabel.vue'

const store = useEnvironmentStore()

const route = useRoute()

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: false
    },
    value: {
        required: true
    },
    correct: {
        type: Boolean,
        required: false
    }
});

// // break id apart, get post q, pre -
const questionIndex = props.id.match(/(?<=q)\d+(?=-)/g)

onMounted(() => {
    if (store.assignmentCompleted) {
        store.fetchStudentAnswers(+route.params.classId, +route.params.assignmentId)
    }
})
</script>

<style lang="scss">
.rvt-radio {
    &--tile {
        padding-left: 0;

        .rvt-radio {
            padding-left: 0;
            width: 100%;

            input[type="radio"] {
                &~label {
                    border: 2px solid #c9c9c9;
                    border-radius: .25rem;
                    color: #1b1b1b;
                    margin: 0;
                    padding: 1.5rem 1rem 1.5rem 2.5rem;
                    top: 1rem !important;
                    width: 100%;

                    &::before {
                        left: .5rem;
                        top: 1.6rem;
                    }
                }

                &:checked+label {
                    background-color: rgba(0, 94, 162, .1) !important;
                    border-color: #005ea2 !important;

                    &::before {
                        background-color: #005ea2;
                    }
                }
            }
        }

        &.tlt-form--complete__list {
            .rvt-radio {
                input[type="radio"] {
                    &:checked+label {
                        background-color: #fff3f0 !important;
                        border-color: #df3603 !important;
                        color: #690a00;

                        &::before {
                            background-color: #df3603;
                            border-color: #df3603;
                        }
                    }

                    +label {
                        align-items: center;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                    }
                }
            }

            &--correct {
                .rvt-radio {
                    input[type="radio"] {
                        &:checked+label {
                            background-color: #f9f9f0 !important;
                            border-color: #004421 !important;
                            color: #004421;

                            &::before {
                                background-color: #056e41;
                                border-color: #056e41;
                            }
                        }

                        &~label {
                            background-color: #f9f9f0 !important;
                            border-color: #004421 !important;
                            color: #004421;

                            &::before {
                                border-color: #056e41;
                            }

                        }
                    }
                }
            }
        }
    }
}
</style>