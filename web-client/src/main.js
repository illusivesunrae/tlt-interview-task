import { createApp } from 'vue'
import { firebaseApp } from './firebase'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
