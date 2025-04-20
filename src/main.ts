import { createApp } from 'vue'
import ElementPlus from 'element-plus'
// import "element-plus/dist/index.css";
import './styles/tailwind.css'
import './styles/element.scss'
import App from './App.vue'
import router from './router'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('vue-json-pretty', VueJsonPretty)

app.use(router).use(ElementPlus).mount('#app')
