<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router'
import AuthFooter from '@/modules/auth/components/AuthFooter.vue';
import AuthHeader from '@/modules/auth/components/AuthHeader.vue';
import BaseFooter from '@/core/components/BaseFooter.vue';
import BaseHeader from '@/core/components/BaseHeader.vue';

const route = useRoute();

const authColor = computed(() => {
  route.meta.color || 'inherit';
})
</script>

<template>
  <base-header v-if="$route.meta.requiresAuth"></base-header>
  <auth-header v-if="$route.meta.requiresNotAuth"></auth-header>
  <main id="main-content">
    <RouterView />
  </main>
  <auth-footer v-if="$route.meta.requiresNotAuth"></auth-footer>
  <base-footer v-if="$route.meta.requiresAuth"></base-footer>
</template>

<style lang='scss'>
main {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 133px);
}

.tlt-auth {
  background-color: #eaeaea;

  main {
    min-height: inherit;
  }
}



main.tlt-auth {
  min-height: inherit;
}
</style>
