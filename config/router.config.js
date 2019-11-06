import authRoutes from './router.config.auth';
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
        icon: 'icon-jinbao',
        routes: [
          {
            path: '/data-management/dashboard',
            name: 'dashboard',
            component: './DataPanel/DataPanel',
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
                component: './Sheet/Sheet',
              },
            ],
          },
          {
            path: '/data-management/data-processing',
            name: 'dataProcessing',
            component: './RulesEngine/RulesEngine',
          },
          {
            path: '/data-management/data-enquiry',
            name: 'dataEnquiry',
            component: './Dragboard/Dragboard',
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
        icon: 'table',
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
        icon: 'table',
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
        icon: 'table',
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
        icon: 'table',
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
        icon: 'table',
        routes: [
          {
            path: '/system-management/user-maintenance',
            name: 'userMaintenance',
            component: './UserManagement/UserManagement',
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
          {
            path: '/system-management/email-parameter',
            name: 'emailParameter',
            component: './EmailParameter/EmailParameter',
          },
          {
            path: '/system-management/system-parameters',
            name: 'systemParameters',
            component: './SystemParams/SystemParams',
          },
          {
            path: '/system-management/code-maintenance',
            name: 'codeMaintenance',
            component: './CodeMaintenance/CodeMaintenance',
          },
          {
            path: '/system-management/audit-log',
            name: 'auditLog',
            component: './AuditLog/AuditLog',
          },
          ...authRoutes,
        ],
      },
      {
        path: './formItem',
        name: 'formItem',
        component: './FormItem/FormItem',
        hideInMenu: true,
      },
      {
        path: './stylespecification',
        name: 'Stylespecification',
        component: './Stylespecification/Stylespecification',
        hideInMenu: true,
      },
    ],
  },
  {
    component: './Page404',
  },
];
