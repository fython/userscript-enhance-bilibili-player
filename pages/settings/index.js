import Vue from 'vue';
import vuetify from './plugins/vuetify';
import App from './App.vue';
import './assets/fonts.css';

new Vue({
    render: h => h(App),
    vuetify,
}).$mount('#app');
