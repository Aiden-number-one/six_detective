export default [
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [{ path: '/login', name: 'login', component: './User/Login' }],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      {
        path: '/',
        name: 'index',
        icon: 'database',
        component: './DataSource/DataSource',
      },
      {
        path: '/test',
        name: 'datamanagement',
        routes: [
          {
            path: '/datapanel',
            name: 'datapanel',
            icon: 'environment',
            component: './DataPanel/DataPanel',
          },
          {
            path: '/sheet',
            name: 'sheet',
            icon: 'table',
            component: './Sheet/Sheet',
          },
        ],
      },
      {
        path: '/dragboard',
        name: 'dragboard',
        icon: 'table',
        component: './Dragboard/Dragboard',
      },
      {
        path: '/monitor',
        name: 'monitor',
        icon: 'table',
        component: './Monitor/Monitor',
      },
      {
        path: '/rulesEngine',
        name: 'rulesEngine',
        icon: 'build',
        component: './RulesEngine/RulesEngine',
      },
      {
        component: './Page404',
      },
    ],
  },
  {
    component: './Page404',
  },
];
