import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/'

const offline = import.meta.env.VITE_demo_mode === 'true'

if (!offline) {
  const { default: firebaseApp } = await import('./firebase')
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
