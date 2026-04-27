<template>
    <fieldset class="rvt-fieldset" v-show="currentIndex.index == componentKey">
        <radio-list :index="componentKey"></radio-list>
    </fieldset>
</template>

<script setup>
import { getCurrentInstance, reactive, watch } from 'vue'
import { useEnvironmentStore } from '@/core/composables/useEnvironmentStore'
import RadioList from '@/core/components/BaseRadioList.vue'

const store = useEnvironmentStore()
const instance = getCurrentInstance()

const componentKey = instance.vnode.key

const currentIndex = reactive({
    index: 0
})

currentIndex.index = store.currentQuestion.index

watch(() => store.currentQuestion.index, (newVal, _2) => {
    currentIndex.index = newVal
}, { immediate: true })
</script>