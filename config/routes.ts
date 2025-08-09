export default [
  {
    path: '/',
    redirect: '/demo',
  },
  // {
  //   name: 'Home',
  //   path: '/home',
  //   component: './Home',
  // },
  {
    name: '父子组件通信(ref方法)',
    path: '/reactDemo',
    component: './ReactDemo',
  },
  {
    name: '高阶组件(渲染性能监控)',
    path: '/hoc',
    component: './HOC',
  },
  {
    name: 'React生命周期执行顺序',
    path: '/renderSequence',
    component: './RenderSequence',
  },
  {
    name: '视频控制',
    path: '/videoControl',
    component: './VideoControl',
  },
  {
    name: '示例',
    path: '/demo',
    component: './Demo',
  },
  {
    name: 'TODOList',
    path: 'todoList',
    component: './TODO',
  },
  {
    name: 'DndKit',
    path: 'dndKit',
    component: './DndKit',
    layout: false
  }
];
