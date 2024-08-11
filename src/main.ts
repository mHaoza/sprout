import './assets/styles/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setupNProgress } from './utils/nprogress'

const app = createApp(App)

app.use(router)

setupNProgress(router)

app.mount('#app')
