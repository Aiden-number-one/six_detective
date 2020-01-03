export default [
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [{ path: '/login', name: 'login', component: './User/Login' }],
  },
  // 报表设计器页面
  {
    path: '/report-designer',
    component: './ReportDesigner/ReportDesigner',
  },
  // 预览页面
  {
    path: '/report-designer-preview',
    component: './ReportDesigner/ReportDesignerPreview',
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
        // component: './Monitor/Monitor',
        component: './HomePage/HomePage',
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
            path: '/homepage/quick-menu-management',
            name: 'quick-menu-management',
            component: './HomePage/QuickMenu',
            hideInMenu: true,
          },
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
                component: './DatasetManagement/ReportDesignerList',
              },
              {
                path: '/report/report-designer/dataset-management',
                name: 'Dataset Management',
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
            component: './DataImportLog/NewAccount',
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
            path: '/etl-center/database-import',
            name: 'Database Import',
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
            component: './SystemManagement/UserMaintenance/UserMaintenance',
          },
          {
            path: '/system-management/menu-user-group',
            name: 'Menu User Group',
            component: './SystemManagement/MenuUserGroup/MenuUserGroup',
          },
          {
            path: '/system-management/alert-user-group',
            name: 'Alert User Group',
            component: './SystemManagement/AlertUserGroup/AlertUserGroup',
          },
          {
            path: '/system-management/email-parameter',
            name: 'Email Parameter',
            component: './SystemManagement/EmailParameter/EmailParameter',
          },
          {
            path: '/system-management/message-content-template',
            name: 'Message Content Template',
            component: './SystemManagement/MessageContentTemplate/MessageContentTemplate',
          },
          {
            path: '/system-management/audit-trail-logging',
            name: 'Audit Trail Logging',
            component: './SystemManagement/AuditTrailLogging/AuditTrailLogging',
          },
          {
            path: '/system-management/code-maintenance',
            name: 'Code Maintenance',
            component: './SystemManagement/CodeMaintenance/CodeMaintenance',
          },
          {
            path: '/system-management/system-parameters',
            name: 'System Parameters',
            component: './SystemManagement/SystemParameter/SystemParameter',
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
    ],
  },
  {
    component: './Page404',
  },
];
