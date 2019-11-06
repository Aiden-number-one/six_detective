import Mock from 'mockjs';

const getUserList = count => {
  const userList = [];

  const menuList = [];
  // eslint-disable-next-line no-plusplus
  for (let k = 0; k < count; k++) {
    const menuCount = 10
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < menuCount; i++) {
      menuList.push(
        Mock.mock({
          'custStatus|1': ['0', '1'],
          'endtype|1': ['0', '1'],
          funcComment: '',
          icon: 'icon-home',
          'isdefault|1': ['0', '1'],
          'isonline|1': ['0', '1'],
          linecss: '',
          menuId: Mock.Random.id(),
          menuName: Mock.Random.ctitle(2, 20),
          'menuType|1': ['0', '1', '2'],
          page: Mock.Random.url(),
          parentMenuId: Mock.Random.id(),
          permission: Mock.Random.ctitle(2, 20),
          pos: Mock.Random.id(),
          textcss: Mock.Random.ctitle(2, 20),
        }),
      );
    }
    userList.push(
      Mock.mock({
        custCustomerno: Mock.Random.id(),
        'custStatus|1': ['0', '1'],
        custStatusName: Mock.Random.ctitle(2, 20),
        customerName: Mock.Random.ctitle(2, 20),
        customerno: Mock.Random.id(),
        departmentId: Mock.Random.id(),
        departmentName: Mock.Random.ctitle(2, 20),
        displaypath: Mock.Random.county(true),
        email: Mock.Random.email(),
        lastupdatetime: Mock.Random.datetime(),
        loginName: Mock.Random.ctitle(2, 20),
        menuList,
      }),
    );
  }
  return userList
};
// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    name: 'Serati Ma',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'antdesign@alipay.com',
    signature: '海纳百川，有容乃大',
    title: '交互专家',
    group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
    tags: [
      {
        key: '0',
        label: '很有想法的',
      },
      {
        key: '1',
        label: '专注设计',
      },
      {
        key: '2',
        label: '辣~',
      },
      {
        key: '3',
        label: '大长腿',
      },
      {
        key: '4',
        label: '川妹子',
      },
      {
        key: '5',
        label: '海纳百川',
      },
    ],
    notifyCount: 12,
    unreadCount: 11,
    country: 'China',
    geographic: {
      province: {
        label: '浙江省',
        key: '330000',
      },
      city: {
        label: '杭州市',
        key: '330100',
      },
    },
    address: '西湖区工专路 77 号',
    phone: '0752-268888888',
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;

    if (password === 'ant.design' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }

    if (password === 'ant.design' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }

    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /api/register': (req, res) => {
    res.send({
      status: 'ok',
      currentAuthority: 'user',
    });
  },
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  // 用户管理
  'POST /api/v2.0/bayconnect.superlop.get_user_list_impl.json': Mock.mock({
    'bcjson|1-10': {
      api: 'kingdom.kgrp.get_user_list_imp11111111111l',
      code: '0',
      detail: '',
      flag: '1',
      items: getUserList(20),
      len: 10,
      lengths: getUserList(20).length,
      msg: '查询成功',
      timespent: 61,
    },
  }),
};
