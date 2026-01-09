import { createApp } from 'vue'
import Dev from './serve.vue'
import 'bootstrap/dist/css/bootstrap.css'

const app = createApp(Dev)
app.mount('#app')
