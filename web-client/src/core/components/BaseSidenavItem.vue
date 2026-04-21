<template>
    <li class="rvt-sidenav__item">
        <RouterLink active-class="rvt-sidenav__link" :to="'/' + question.id">{{ question.content }}</RouterLink>
    </li>
</template>

<script setup>
defineProps(['question'])
</script>