import { ref } from 'vue'
import { useQuizStore } from '@/modules/quiz/store/quizStore'
import { useOfflineStore } from '@/modules/offline/store/offlineStore'

export function useEnvironmentStore() {
  const offline = ref(import.meta.env.VITE_demo_mode === 'true')

  if (!offline.value) {
    return useQuizStore()
  } else {
    return useOfflineStore()
  }
}
