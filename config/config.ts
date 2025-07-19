import { defineConfig } from '@umijs/max';
import routes from './routes';
export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '前端Demo',
  },
  routes,
  npmClient: 'yarn',
});
