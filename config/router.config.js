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
    path: '/add-dataset',
    component: './AddDataSet/AddDataSet',
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      {
        path: '/',
        name: 'Homepage',
        component: './Monitor/Monitor',
        // component: './HomePage/HomePage',
      },
      {
        path: '/homepage',
        name: 'Homepage',
        routes: [
          // {
          //   path: '/homepage/homepage',
          //   name: 'Homepage',
          //   component: './Monitor/Monitor',
          // },
          {
            path: '/homepage/alert-center',
            name: 'Alert Center',
            component: './AlertCenter/Alert',
          },
          {
            path: '/homepage/information',
            name: 'Information Center',
            component: './AlertCenter/Information',
            hideInMenu: true,
          },
          {
            path: '/homepage/Approval-Process-Center',
            name: 'ApprovalProcessCenter',
            component: './ApprovalProcessCenter/index',
          },
        ],
      },
      // Report
      {
        path: '/report',
        name: 'Report',
        routes: [
          {
            path: '/report/report-designer',
            name: 'Report Designer',
            routes: [
              {
                path: '/report/report-designer/report-designer',
                name: 'Report Designer',
                // component: './ReportDesigner/ReportDesigner',
                component: './Page404',
              },
              {
                path: '/report/report-designer/dataset-mamagement',
                name: 'Dataset Mamagement',
                component: './DatasetManagement/DatasetManagement',
              },
            ],
          },
          {
            path: '/report/report-designer/high-sla-reports',
            name: 'highSlaReports',
            component: './Page404',
            hideInMenu: true,
          },
          {
            path: '/report/report-designer/visualization-dashboard',
            name: 'visualizationDashboard',
            component: './Page404',
            hideInMenu: true,
          },
        ],
      },
      // Data Module
      {
        path: '/data-module',
        name: 'Data Module',
        routes: [
          {
            path: '/data-module/data-import',
            name: 'Data Import',
            routes: [
              {
                path: '/data-module/data-import/lop-data-import',
                name: 'LOP Data Import',
                component: './DataImportLog/Lop',
              },
              {
                path: '/data-module/data-import/market-data-dirs-import',
                name: 'Market Data DIRS Import',
                component: './DataImportLog/Market',
              },
              {
                path: '/data-module/data-import/market-data-omd-import',
                name: 'Market Data OMD Import',
                component: './DataImportLog/Market',
              },
            ],
          },
          {
            path: '/data-module/data-enquiry',
            name: 'Data Enquiry',
            routes: [
              {
                path: '/data-module/data-enquiry/hkfe-market-data',
                name: 'HKFE Market Data',
                component: './Page404',
              },
              {
                path: '/data-module/data-enquiry/hkfe-lop-data',
                name: 'HKFE LOP Data',
                component: './Page404',
              },
              {
                path: '/data-module/data-enquiry/sehk-market-data',
                name: 'SEHK Market Data',
                component: './Page404',
              },
              {
                path: '/data-module/data-enquiry/sehk-lop-data',
                name: 'SEHK LOP Data',
                component: './Page404',
              },
            ],
          },
          {
            path: '/data-module/data-processing',
            name: 'Data Processing',
            component: './DataProcessing/DataProcessing',
          },
        ],
      },
      // Account Module
      {
        path: '/account-module',
        name: 'Account Module',
        routes: [
          {
            path: '/account-module/data-import',
            name: 'Data Import',
            component: './Page404',
          },
          {
            path: '/account-module/account-information',
            name: 'Account Information',
            component: './Page404',
          },
          {
            path: '/account-module/submitter-information',
            name: 'Submitter Information',
            component: './Page404',
          },
        ],
      },
      // ETL center
      {
        path: '/etl-center',
        name: 'ETL Center',
        routes: [
          {
            path: '/etl-center/data-management',
            name: 'Data Management',
            routes: [
              {
                path: '/etl-center/data-management/data-driver-management',
                name: 'Data Driver Management',
                component: './IframePage/IframePage',
              },
              {
                path: '/etl-center/data-management/data-sourcemanagement',
                name: 'Data Source Management',
                component: './IframePage/IframePage',
              },
            ],
          },
          {
            path: '/etl-center/task-management',
            name: 'Task Management',
            component: './IframePage/IframePage',
          },
          {
            path: '/etl-center/job-management',
            name: 'Job Management',
            component: './IframePage/IframePage',
          },
          {
            path: '/etl-center/schedule-management',
            name: 'Schedule Management',
            component: './IframePage/IframePage',
          },
          {
            path: '/etl-center/monitoring-management',
            name: 'Monitoring Management',
            routes: [
              {
                path: '/etl-center/monitoring-management/monitoring',
                name: 'Monitoring',
                component: './IframePage/IframePage',
              },
              {
                path: '/etl-center/monitoring-management/log-monitoring',
                name: 'Log Monitoring',
                component: './IframePage/IframePage',
              },
            ],
          },
          {
            path: '/etl-center/datasource-change',
            name: 'Data Source Change',
            component: './IframePage/IframePage',
          },
        ],
      },
      // System Management
      {
        path: '/system-management',
        name: 'System Management',
        routes: [
          {
            path: '/system-management/approval-process-management',
            name: 'Approval Process Management',
            routes: [
              {
                path: '/system-management/approval-process-management/approval-process-flow-design',
                name: 'Approval Process Flow Design',
                component: './Approval/ApprovalDesign/ApprovalDesign',
              },
              {
                path: '/system-management/approval-process-management/approval-process-auditor',
                name: 'Approval Process Auditor',
                component: './Approval/ApprovalAuditor/ApprovalAuditor',
              },
              {
                path:
                  '/system-management/approval-process-management/approval-process-configuration',
                name: 'Approval Process Configuration',
                component: './Approval/ApprovalConfiguration/ApprovalConfiguration',
              },
            ],
          },
          {
            path: '/system-management/user-maintenance',
            name: 'User Maintenance',
            component: './UserManagement/UserManagement',
          },
          {
            path: '/system-management/menu-user-group',
            name: 'Menu User Group',
            component: './MenuUserGroup/MenuUserGroup',
          },
          {
            path: '/system-management/alert-user-group',
            name: 'Alert User Group',
            component: './AlertUserGroup/AlertUserGroup',
          },
          {
            path: '/system-management/email-parameter',
            name: 'Email Parameter',
            component: './EmailParameter/EmailParameter',
          },
          {
            path: '/system-management/message-content-template',
            name: 'Message Content Template',
            component: './MessageContentTemplate/MessageContentTemplate',
          },
          {
            path: '/system-management/audit-trail-logging',
            name: 'Audit Trail Logging',
            component: './AuditLog/AuditLog',
          },
          {
            path: '/system-management/code-maintenance',
            name: 'Code Maintenance',
            component: './CodeMaintenance/CodeMaintenance',
          },
          {
            path: '/system-management/system-parameters',
            name: 'System Parameters',
            component: './SystemParameters/SystemParameters',
          },
        ],
      },

      // 后面的没改过
      {
        path: '/data-management',
        name: 'dataManagement',
        icon: 'icon-zhuxian',
        routes: [
          {
            path: '/data-management/data-processing',
            name: 'dataProcessing',
            component: './RulesEngine/RulesEngine',
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
          {
            path: '/system-management/alert-user-group',
            name: 'menuUserGroup',
            component: './AlertUserGroup/AlertUserGroup',
          },
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
            path: '/system-management/user-maintenance/modify-user',
            name: 'modifyUser',
            component: './ModifyUser/ModifyUser',
            hideInMenu: true,
          },
          {
            path: '/system-management/message-content-template',
            name: 'messageContentTemplate',
            component: './MessageContentTemplate/MessageContentTemplate',
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
            path: '/system-management/audit-trail-logging',
            name: 'auditTrailLogging',
            component: './AuditLog/AuditLog',
          },
          {
            path: '/system-management/scheduling',
            name: 'scheduling',
            component: './Scheduling/Scheduling',
          },
        ],
      },
    ],
  },
  {
    component: './Page404',
  },
];
