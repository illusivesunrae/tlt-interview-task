<template>
    <li class="rvt-radio rvt-radio--tile">
        <div class=" rvt-radio">
            <input type="radio" :name="props.name" :id="props.id" :value="props.value" v-model="radioSelection" />
            <base-label :for="props.id" :label="props.value"></base-label>
        </div>
    </li>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useQuizStore } from '@/modules/quiz/store/quizStore';
import BaseLabel from './BaseLabel.vue';

const store = useQuizStore();

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    value: {
        required: true
    },
    label: {
        type: String,
        required: true
    }
});

// break id apart, get post q, pre -
const questionIndex = props.id.match(/(?<=q)\d+(?=-)/g);

const radioSelections = ref([]);
const radioSelection = ref('');

watch(() => radioSelections.value, (newVal, oldVal) => {
    radioSelection.value = radioSelections.value[0].content
})

onMounted(() => {
    radioSelections.value = store.returnRelatedAnswers(questionIndex);
})
</script>

<style lang="scss">
.rvt-radio {
    &--tile {
        padding-left: 0;

        .rvt-radio {
            padding-left: 0;
            width: 100%;
        }

        input[type="radio"] {
            &:checked+label {
                background-color: rgba(0, 94, 162, .1) !important;
                border-color: #005ea2 !important;

                &::before {
                    background-color: #005ea2;
                }

                &.rvt-success {
                    &::before {
                        background-color: #056e41;
                        border-color: #056e41;
                    }
                }

                &.rvt-error {
                    background-color: #fff3f0 !important;
                    border-color: #df3603 !important;
                    color: #690a00;

                    &::before {
                        background-color: #df3603;
                        border-color: #df3603;
                    }
                }

            }

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

                &.rvt-success {
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
</style>