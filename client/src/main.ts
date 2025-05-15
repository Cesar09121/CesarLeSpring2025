import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Oruga } from '@oruga-ui/oruga-next'
import 'bulma/css/bulma.min.css'


const app = createApp(App)
app.use(Oruga)
app.use(router)
app.mount('#app')