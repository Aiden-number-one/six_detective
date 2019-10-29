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
        name: 'indexdashboard',
        component: './Monitor/Monitor',
        hideInMenu: true,
      },
      {
        path: '/data-management',
        name: 'dataManagement',
        routes: [
          {
            path: '/data-management/dashboard',
            name: 'dashboard',
            component: './Page404',
          },
          {
            path: '/data-management/data-import',
            name: 'dataImport',
            routes: [
              {
                path: '/data-management/data-import/lop-data-import',
                name: 'lopDataImport',
                component: './DataSource/DataSource',
              },
              {
                path: '/data-management/data-import/market-data-import',
                name: 'marketDataImport',
                component: './Page404',
              },
            ],
          },
          {
            path: '/data-management/data-processing',
            name: 'dataProcessing',
            component: './Page404',
          },
          {
            path: '/data-management/data-enquiry',
            name: 'dataEnquiry',
            component: './Page404',
          },
          {
            path: '/data-management/data-maintenance',
            name: 'dataMaintenance',
            component: './Page404',
          },
        ],
      },
      {
        path: '/account-management',
        name: 'accountManagement',
        routes: [
          {
            path: '/account-management/dashboard',
            name: 'dashboard',
            component: './Page404',
          },
          {
            path: '/account-management/account',
            name: 'account',
            component: './Page404',
          },
          {
            path: '/account-management/submitters',
            name: 'submitters',
            component: './Page404',
          },
        ],
      },
      {
        path: '/surveillance',
        name: 'surveillance',
        routes: [
          {
            path: '/surveillance/rule-engine',
            name: 'ruleEngine',
            routes: [
              {
                path: '/surveillance/rule-engine/rule-maintenance',
                name: 'ruleMaintenance',
                component: './Page404',
              },
              {
                path: '/surveillance/rule-engine/parameter-maintenance',
                name: 'parameterMaintenance',
                component: './Page404',
              },
            ],
          },
          {
            path: '/surveillance/modal-management',
            name: 'modalManagement',
            component: './Page404',
          },
        ],
      },
      {
        path: '/report',
        name: 'report',
        routes: [
          {
            path: '/report/high-sla-reports',
            name: 'highSlaReports',
            component: './Page404',
          },
          {
            path: '/report/visualization-dashboard',
            name: 'visualizationDashboard',
            component: './Page404',
          },
        ],
      },
      {
        path: '/analysis',
        name: 'analysis',
        routes: [
          {
            path: '/analysis/investor-segment-analysis',
            name: 'investorSegmentAnalysis',
            component: './Page404',
          },
        ],
      },
      {
        path: '/system-management',
        name: 'systemManagement',
        routes: [
          {
            path: '/system-management/user-maintenance',
            name: 'userMaintenance',
            component: './Page404',
          },
          {
            path: '/system-management/mail-content-template',
            name: 'mailContentTemplate',
            component: './TemplateSet/TemplateSet',
          },
          {
            path: '/system-management/workflow-design',
            name: 'workflowDesign',
            component: './Approval/ApprovalDesign/ApprovalDesign',
          },
          {
            path: '/system-management/workflow-config',
            name: 'workflowConfig',
            component: './Approval/ApprovalSet/ApprovalSet',
          },
          {
            path: '/system-management/workflow-history',
            name: 'workflowHistory',
            component: './Approval/ApprovalEheck/ApprovalEheck',
          },
        ],
      },
      {
        path: './formItem',
        name: 'formItem',
        component: './FormItem/FormItem',
        hideInMenu: true,
      },
    ],
  },
  {
    component: './Page404',
  },
];
