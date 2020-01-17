/*
 * @Description: app global config
 * @Author: lan
 * @Date: 2019-08-28 10:01:58
 * @LastEditTime : 2020-01-17 21:56:43
 * @LastEditors  : mus
 * @Description: umi 配置文件
 */
// eslint-disable-next-line import/no-extraneous-dependencies
import slash from 'slash2';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import router from './router.config';
import webpackPlugin from './plugin.config';

const {
  pwa,
  primaryColor,
  linkColor,
  fontSizeBase,
  headingColor,
  textColor,
  textColorSecondary,
  successColor,
  warningColor,
  errorColor,
  borderRadiusBase,
  borderColorBase,
  boxShadowBase,
} = defaultSettings;
// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN en-US
        default: 'en-US',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block', // A plugin for deliver umi block files like ant design pro structure
    {
      moveMock: false, // whether move _mock.js to mock, default to true
      moveService: false, // whether move service.js to src/services/, default to true
      // eslint-disable-next-line max-len
      modifyRequest: true, // whether modify umi-request to util(s)/request (if it exist), default to true
      // eslint-disable-next-line max-len
      autoAddMenu: true, // whether add name and icon config to route config when download a pro, default to true
    },
  ],
];

// 针对 preview.pro.ant.design 的 GA 统计代码
if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
}

export default {
  plugins,
  block: {
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: router,
  theme: {
    'primary-color': primaryColor,
    'link-color': linkColor,
    'font-size-base': fontSizeBase,
    'heading-color': headingColor,
    'text-color': textColor,
    'border-radius-base': borderRadiusBase,
    'border-color-base': borderColorBase,
    'success-color': successColor,
    'warning-color': warningColor,
    'error-color': errorColor,
    'box-shadow-base': boxShadowBase,
    'text-color-secondary': textColorSecondary,
  },
  treeShaking: true,
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  // externals: {
  //   react: 'window.React',
  //   'react-dom': 'window.ReactDOM',
  // },
  proxy: {
    '/api': {
      // target: 'http://10.60.62.60:7567/superlop/restv2/admin/', // 季旋
      // target: 'http://10.60.62.83:7567/superlop/restv2/admin/', // 张涛
      target: 'http://10.201.62.184:7567/superlop/restv2/admin/', // 线上
      // target: 'http://10.60.69.113:7567/superlop/restv2/admin/', // 测试
      // target: 'http://10.60.62.2:7567/superlop/restv2/admin/', // 李庆
      // target: 'http://10.60.62.46:7567/superlop/restv2/admin/', // 线上
      // target: 'http://10.60.69.42:9092/bct-api-admin/', // Mock数据
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
      timeout: 15000,
    },
    '/superlop': {
      // target: 'http://10.60.62.60:7567/superlop/restv2/admin/', // 季旋
      target: 'http://10.201.62.184:7567/superlop/', // 线上
      // target: 'http://10.60.69.113:7567/superlop/', // 测试
      // target: 'http://10.60.69.42:9092/bct-api-admin/', // Mock数据
      changeOrigin: true,
      pathRewrite: { '^/superlop': '' },
      timeout: 15000,
    },
    '/upload': {
      target:
        'http://10.201.62.184:7567/superlop/rest/admin/v2.0/bayconnect.superlop.file_upload.json', // 线上
      // target: 'http://10.60.69.42:9092/bct-api-admin/', // Mock数据
      changeOrigin: true,
      pathRewrite: { '^/upload': '' },
      timeout: 10000,
    },
    '/download': {
      target:
        'http://10.201.62.184:7567/superlop/restv2/admin/v2.0/bayconnect.superlop.file_download_quick.json', // 线上
      // target: 'http://10.60.69.42:9092/bct-api-admin/', // Mock数据
      changeOrigin: true,
      pathRewrite: { '^/download': '' },
      timeout: 10000,
    },
  },
};
