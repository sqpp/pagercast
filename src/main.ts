import './assets/main.css'

import { createApp } from 'vue'
import router from './router'
import './assets/main.css';
import Vue3Toasity, { type ToastContainerOptions} from 'vue3-toastify';

import App from './App.vue';

const app = createApp(App);
app.use(router)
app.use(Vue3Toasity,
    {
      limit: 5,
    } as ToastContainerOptions)
app.mount('#app')
