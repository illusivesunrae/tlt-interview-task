<template>
    <nav class="rvt-sidenav" aria-labelledby="sidenav-label" data-rvt-sidenav>
        <span class="rvt-sidenav__label" id="sidenav-label">{{ section }}</span>
        <ul class="rvt-sidenav__list">
            <sidenav-item v-for="question in questions" :question="question" :key="question.id"></sidenav-item>
        </ul>
    </nav>
</template>

<script setup>
defineProps(['section', 'questions']);
</script>