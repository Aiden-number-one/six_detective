import React, { Component } from 'react';
import { Form, Table, Pagination, Drawer, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
import { templateTypeFormat } from '@/utils/filter';

import styles from './MessageContentTemplate.less';
import SearchForm from './components/SearchForm';
import NewUserGroup from './components/NewUserGroup';

const NewSearchForm = Form.create({})(SearchForm);

@connect(({ alertUserGroup, loading }) => ({
  loading: loading.effects,
  menuUserGroup: alertUserGroup.data,
  updateGroup: alertUserGroup.updateUserGroup,
}))
export default class MessageContentTemplate extends Component {
  searchForm = React.createRef();

  constructor() {
    super();
    this.state = {
      modifyVisible: false,
      deleteVisible: false,
      updateFlag: false,
      groupMenuInfo: {},
      typeOptions: [
        { key: '', value: '', title: 'All' },
        { key: '1', value: '1', title: 'Management Email' },
        { key: '2', value: '2', title: 'Alert Email' },
        { key: '3', value: '3', title: 'Information Email' },
        { key: '4', value: '4', title: 'Information Message' },
        { key: '5', value: '5', title: 'Alert Message' },
      ],
      columns: [
        {
          title: formatMessage({ id: 'systemManagement.template.templateName' }),
          dataIndex: 'templateName',
          key: 'templateName',
        },
        {
          title: formatMessage({ id: 'systemManagement.template.templateId' }),
          dataIndex: 'templateId',
          key: 'templateId',
        },
        {
          title: formatMessage({ id: 'systemManagement.template.templateType' }),
          dataIndex: 'type',
          key: 'type',
          render: (res, obj) => <span>{templateTypeFormat(obj.type)}</span>,
        },
        {
          title: formatMessage({ id: 'systemManagement.template.templateTitle' }),
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: formatMessage({ id: 'systemManagement.template.templateContent' }),
          dataIndex: 'content',
          key: 'content',
        },
        {
          title: formatMessage({ id: 'systemManagement.template.keyword' }),
          dataIndex: 'keyWord',
          key: 'keyWord',
        },
        {
          title: formatMessage({ id: 'app.common.operation' }),
          dataIndex: 'operation',
          key: 'operation',
          render: (res, obj) => (
            <span className={styles.operation}>
              <a href="#" onClick={() => this.updateUser(res, obj)}>
                {formatMessage({ id: 'app.common.modify' })}
              </a>
            </span>
          ),
        },
      ],
      page: {
        pageNumber: 1,
        pageSize: 10,
      },
    };
  }

  componentDidMount() {
    this.queryUserList();
  }

  newUser = () => {
    // this.props.dispatch(
    //   routerRedux.push({
    //     pathname: '/system-management/user-maintenance/new-menu-user',
    //   }),
    // );
    this.setState({
      modifyVisible: true,
      groupTitle: 'New Alert User Group',
      updateFlag: false,
    });
  };

  onClose = () => {
    this.setState({
      modifyVisible: false,
    });
  };

  onSave = () => {
    this.setState({
      modifyVisible: false,
    });
    const { pageSize } = this.state.page;
    const page = {
      pageNumber: 1,
      pageSize,
    };
    this.setState(
      {
        page,
      },
      () => {
        this.queryUserList();
      },
    );
  };

  updateUser = (res, obj) => {
    // this.props.dispatch(
    //   routerRedux.push({
    //     pathname: '/system-management/user-maintenance/modify-menu-user',
    //     query: { roleId: obj.roleId },
    //   }),
    // );
    const groupMenuInfo = Object.assign({}, obj);
    this.setState({
      modifyVisible: true,
      updateFlag: true,
      groupTitle: 'Message Content Template Modify',
      groupMenuInfo,
    });
  };

  deleteConfirm = () => {
    const { dispatch } = this.props;
    const { groupMenuInfo } = this.state;
    const params = {
      operType: 'deleteById',
      roleId: groupMenuInfo.roleId,
    };
    dispatch({
      type: 'alertUserGroup/updateUserAlert',
      payload: params,
      callback: () => {
        this.queryUserList();
        this.setState({
          deleteVisible: false,
        });
      },
    });
  };

  deleteCancel = () => {
    this.setState({
      deleteVisible: false,
    });
  };

  queryLog = () => {
    // const { dispatch } = this.props;
    // const params = {};
    // dispatch({
    //   type: 'menuUserGroup/getAlertUserGroup',
    //   payload: params,
    // });
    this.searchForm.current.validateFields((err, values) => {
      if (err) {
        return;
      }
      const params = {
        templateName: values.templateName,
        templateId: values.templateId,
        type: values.type,
      };
      this.queryUserList(params);
    });
  };

  /**
   * @description: This is for paging function.
   * @param {type} null
   * @return: undefined
   */
  pageChange = (pageNumber, pageSize) => {
    const page = {
      pageNumber,
      pageSize,
    };

    this.setState(
      {
        page,
      },
      () => {
        this.queryUserList();
      },
    );
  };

  /**
   * @description: This is for query user list function.
   * @param {type} null
   * @return: undefined
   */
  queryUserList = (
    param = {
      templateName: undefined,
      templateId: undefined,
      type: undefined,
    },
  ) => {
    const { dispatch } = this.props;
    const { templateName, templateId, type } = param;
    const params = {
      templateName,
      templateId,
      type,
      pageNumber: this.state.page.pageNumber.toString(),
      pageSize: this.state.page.pageSize.toString(),
    };
    dispatch({
      type: 'alertUserGroup/getAlertUserGroup',
      payload: params,
    });
  };

  onShowSizeChange = (current, pageSize) => {
    const page = {
      pageNumber: current,
      pageSize,
    };
    this.setState(
      {
        page,
      },
      () => {
        this.queryUserList();
      },
    );
  };

  render() {
    const { loading, menuUserGroup } = this.props;
    const { groupTitle, deleteVisible, groupMenuInfo, updateFlag } = this.state;
    const { typeOptions, columns, page, modifyVisible } = this.state;
    const modifyTypeOptions = Object.assign([], typeOptions);
    modifyTypeOptions.shift();
    return (
      <PageHeaderWrapper>
        <NewSearchForm
          search={this.queryLog}
          ref={this.searchForm}
          typeOptions={typeOptions}
        ></NewSearchForm>
        <Drawer
          // drawerStyle={
          //   {
          //     height: '200px',
          //   }
          // }
          closable={false}
          title={groupTitle}
          width={700}
          onClose={this.onClose}
          visible={modifyVisible}
        >
          {modifyVisible && (
            <NewUserGroup
              onCancel={this.onClose}
              onSave={this.onSave}
              groupMenuInfo={groupMenuInfo}
              updateFlag={updateFlag}
              typeOptions={modifyTypeOptions}
            ></NewUserGroup>
          )}
        </Drawer>
        {/* delete */}
        <Modal
          title="CONFIRM"
          visible={deleteVisible}
          onOk={this.deleteConfirm}
          onCancel={this.deleteCancel}
          cancelText={formatMessage({ id: 'app.common.cancel' })}
          okText={formatMessage({ id: 'app.common.confirm' })}
        >
          <span>Please confirm that you want to delete this record?</span>
        </Modal>
        <div className={styles.content}>
          <Table
            loading={loading['menuUserGroup/getAlertUserGroup']}
            // pagination={{ total: menuUserGroup.totalCount, pageSize: page.pageSize }}
            // rowSelection={rowSelection}
            // onChange={this.pageChange}
            dataSource={menuUserGroup.items}
            columns={columns}
            pagination={false}
          ></Table>
          <Pagination
            showSizeChanger
            current={page.pageNumber}
            showTotal={() =>
              `Page ${page.pageNumber.toString()} of ${Math.ceil(
                menuUserGroup.totalCount / page.pageSize,
              ).toString()}`
            }
            onShowSizeChange={this.onShowSizeChange}
            onChange={this.pageChange}
            total={menuUserGroup.totalCount}
            pageSize={page.pageSize}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}
