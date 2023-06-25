import './assets/main.css'

import { createApp } from 'vue'
import router from './router'
import './assets/main.css';
import Notifications from '@kyvg/vue3-notification'

import App from './App.vue';

const app = createApp(App);
app.use(router)
app.use(Notifications)
app.mount('#app')
