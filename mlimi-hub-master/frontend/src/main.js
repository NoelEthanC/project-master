import { createApp } from 'vue';
import App from './App.vue';
import router from './Router/index'
import './assets/style.css'
import VueSweetalert2 from 'vue-sweetalert2';
import VueHtmlToPaper from 'vue-html-to-paper';
import HighchartsVue from 'highcharts-vue';
import print from 'vue3-print-nb'
import 'sweetalert2/dist/sweetalert2.min.css';
import JsonCSV from 'vue-json-csv'

const app = createApp(App)

app.use(VueSweetalert2);
app.use(VueHtmlToPaper);
app.use(HighchartsVue)
app.component('downloadCsv', JsonCSV)
// Use the VueIcon plugin
app.use(router);

app.mount('#app');
