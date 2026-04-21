<template>
    <fieldset class="rvt-fieldset" v-show="currentIndex == optionsId">
        <radio-list v-bind:content="question" v-bind:options="options" v-bind:optionsId="optionsId"
            v-bind:studentAnswer="studentAnswer"></radio-list>
    </fieldset>

</template>

<script setup>
import { ref, watch } from 'vue';
import { useQuizStore } from '../store/quizStore';
import RadioList from '@/core/components/BaseRadioList.vue';

const store = useQuizStore();

const props = defineProps(['question', 'options', 'optionsId', 'currentIndex', 'studentAnswer'])

const currentIndex = ref('')

watch(() => store.currentQuestion.index, (newVal, _) => {
    currentIndex.value = newVal;
})
</script>