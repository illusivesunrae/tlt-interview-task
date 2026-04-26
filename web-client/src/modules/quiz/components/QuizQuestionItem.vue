<template>
    <fieldset class="rvt-fieldset" v-show="currentIndex.index == componentKey">
        <radio-list :index="componentKey"></radio-list>
    </fieldset>
</template>

<script setup>
import { getCurrentInstance, reactive, watch } from 'vue';
import { useQuizStore } from '../store/quizStore';
import { useOfflineStore } from '@/modules/offline/store/offlineStore';
import RadioList from '@/core/components/BaseRadioList.vue';

const store = useQuizStore();
const offline = useOfflineStore();
const instance = getCurrentInstance();

const componentKey = instance.vnode.key;

const currentIndex = reactive({
    index: 0
})

if (!offline.offlineMode) {
    currentIndex.index = store.currentQuestion.index
    console.log(componentKey)
} else {
    currentIndex.index = offline.currentQuestion.index
}

if (!offline.offlineMode) {
    watch(() => store.currentQuestion.index, (newVal, _2) => {
        currentIndex.index = newVal
    }, { immediate: true })
} else {
    watch(() => offline.currentQuestion.index, (newVal, _2) => {
        currentIndex.index = newVal
    }, { immediate: true })
}

</script>