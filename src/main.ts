import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css'
import './styles/main.scss'
import persist from 'pinia-plugin-persistedstate'
import 'virtual:svg-icons-register'
const app = createApp(App)

app.use(createPinia().use(persist))
app.use(router)

app.mount('#app')
