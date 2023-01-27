import { createApp } from 'vue';
import PluginApp from '@/PluginApp.vue';
import 'tdesign-vue-next/es/style/index.css';

createApp(PluginApp).mount(
  (() => {
    const app = document.createElement('div');
    app.classList.add('exbiliplayer-plugin-root');
    document.body.append(app);
    return app;
  })(),
);
