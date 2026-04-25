<template>
    <fieldset class="rvt-fieldset" v-show="store.currentQuestion.index == componentKey">
        <radio-list :index="componentKey"></radio-list>
    </fieldset>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
import { useQuizStore } from '../store/quizStore';
import RadioList from '@/core/components/BaseRadioList.vue';

const store = useQuizStore();
const instance = getCurrentInstance();

const componentKey = instance.vnode.key;
</script>