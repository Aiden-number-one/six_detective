import authRoutes from './router.config.auth';

export default [
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [{ path: '/login', name: 'login', component: './User/Login' }],
  },
  {
    path: '/report-designer',
    component: './ReportDesigner/ReportDesigner',
  },
  {
    path: '/sheet',
    component: './Sheet/Sheet',
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
        path: '/alert-center',
        name: 'alertCenter',
        component: './AlertCenter',
      },
      {
        path: '/data-source',
        name: 'dataSource',
        component: './DataSource/DataSource',
        hideInMenu: true,
      },
      {
        path: '/data-management',
        name: 'dataManagement',
        icon: 'icon-zhuxian',
        routes: [
          {
            path: 'data-import',
            name: 'dataImport',
            routes: [
              { path: 'lop-data-import', name: 'lop', component: './LopLog' },
              { path: 'market-data-import', name: 'market', component: './MarketLog' },
            ],
          },
          {
            path: '/data-management/dashboard',
            name: 'dashboard',
            component: './DataPanel/DataPanel',
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
            isIframe: true,
            iframeUrl: 'http://localhost:8000/ETL/index.html#data-source-configuration',
            path: '/data-management/data-maintenance',
            name: 'dataMaintenance',
            component: './IframePage/IframePage',
          },
          {
            isIframe: true,
            iframeUrl: 'http://localhost:8000/ETL/index.html#data-driven',
            path: '/data-management/drive-management',
            name: 'driveManagement',
            component: './IframePage/IframePage',
          },
          {
            isIframe: true,
            iframeUrl: 'http://localhost:8000/ETL/index.html#task-config-setting',
            path: '/data-management/task-config-setting',
            name: 'taskConfigSetting',
            component: './IframePage/IframePage',
          },
          {
            isIframe: true,
            iframeUrl: 'http://localhost:8000/ETL/index.html#report-table-info-manage',
            path: '/data-management/report-table-info-manage',
            name: 'jobManage',
            component: './IframePage/IframePage',
          },
          {
            isIframe: true,
            iframeUrl: 'http://localhost:8000/ETL/index.html#task-plan-setting',
            path: '/data-management/task-plan-setting',
            name: 'taskPlanSetting',
            component: './IframePage/IframePage',
          },
          {
            isIframe: true,
            iframeUrl: 'http://localhost:8000/ETL/index.html#perform-monitoring',
            path: '/data-management/perform-monitoring',
            name: 'performMonitoring',
            component: './IframePage/IframePage',
          },
          {
            isIframe: true,
            iframeUrl: 'http://localhost:8000/ETL/index.html#log-query',
            path: '/data-management/log-query',
            name: 'logQuery',
            component: './IframePage/IframePage',
          },
          {
            path: '/data-management/task-switch',
            name: 'taskSwitch',
            component: './TaskSwitch/TaskSwitch',
          },
        ],
      },
      {
        path: '/account-management',
        name: 'accountManagement',
        icon: 'icon-user',
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
        icon: 'icon-shipin',
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
        icon: 'icon-text',
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
          {
            path: '/report/dataset-management',
            name: 'datasetmanagement',
            component: './DatasetManagement/DatasetManagement',
          },
        ],
      },
      {
        path: '/analysis',
        name: 'analysis',
        icon: 'icon-chartpie',
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
        icon: 'icon-diannao',
        Routes: ['src/pages/Authorized'],
        routes: [
          {
            path: '/system-management/user-maintenance',
            name: 'userMaintenance',
            component: './UserManagement/UserManagement',
          },
          {
            path: '/system-management/menu-user-group',
            name: 'menuUserGroup',
            component: './MenuUserGroup/MenuUserGroup',
          },
          // {
          //   path: '/system-management/alert-user-group',
          //   name: 'menuUserGroup',
          //   component: './AlertUserGroup/AlertUserGroup',
          // },
          {
            path: '/system-management/user-maintenance/new-user',
            name: 'newUser',
            component: './NewUser/NewUser',
            hideInMenu: true,
          },
          {
            path: '/system-management/user-maintenance/new-menu-user',
            name: 'newMenuUserGroup',
            component: './NewMenuUserGroup/NewMenuUserGroup',
            hideInMenu: true,
          },
          {
            path: '/system-management/user-maintenance/modify-menu-user',
            name: 'modifyMenuUserGroup',
            component: './ModifyMenuUserGroup/ModifyMenuUserGroup',
            hideInMenu: true,
          },
          {
            path: '/system-management/user-maintenance/modify-user',
            name: 'modifyUser',
            component: './ModifyUser/ModifyUser',
            hideInMenu: true,
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
            path: '/system-management/workflow-auditor',
            name: 'ApprovalAuditor',
            component: './Approval/ApprovalAuditor/ApprovalAuditor',
          },
          {
            path: '/system-management/workflow-configuration',
            name: 'ApprovalConfiguration',
            component: './Approval/ApprovalConfiguration/ApprovalConfiguration',
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
            component: './SystemParameters/SystemParameters',
          },
          {
            path: '/system-management/code-maintenance',
            name: 'codeMaintenance',
            component: './CodeMaintenance/CodeMaintenance',
          },
          {
            path: '/system-management/audit-log',
            name: 'auditTrailLogging',
            component: './AuditLog/AuditLog',
          },
          {
            path: '/system-management/scheduling',
            name: 'scheduling',
            component: './Scheduling/Scheduling',
          },
          {
            path: '/system-management/job-monitor',
            name: 'jobMonitor',
            component: './JobMonitor',
          },
          ...authRoutes,
        ],
      },
      {
        path: '/alert-management',
        name: 'alertManagement',
        icon: 'icon-jinggao',
        routes: [
          {
            path: './alert-management/formItem',
            name: 'formItem',
            component: './FormItem/FormItem',
            // hideInMenu: true,
          },
          {
            path: './alert-management/stylespecification',
            name: 'Stylespecification',
            component: './Stylespecification/Stylespecification',
            // hideInMenu: true,
          },
        ],
      },
    ],
  },
  {
    component: './Page404',
  },
];
