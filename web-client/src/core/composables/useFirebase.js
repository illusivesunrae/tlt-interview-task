import { ref } from 'vue'
import { useFirebaseStore } from '@/modules/auth/store/authStore'

export function useFirebase() {
  const offline = ref(import.meta.env.VITE_demo_mode === 'true')

  if (!offline.value) {
    return useFirebaseStore()
  } else {
    return ref(null)
  }
}
