import React, { Component } from 'react';
import { Form, Table, Pagination, Drawer, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import IconFont from '@/components/IconFont';
// import { routerRedux } from 'dva/router';
import { templateTypeFormat } from '@/utils/filter';

import styles from './MessageContentTemplate.less';
import SearchForm from './components/SearchForm';
import ModifyTemplate from './components/ModifyTemplate';

const NewSearchForm = Form.create({})(SearchForm);

@connect(({ messageContentTemplate, loading }) => ({
  loading: loading.effects,
  messageTemplate: messageContentTemplate.data,
  updateTemplate: messageContentTemplate.updateData,
}))
export default class MessageContentTemplate extends Component {
  searchForm = React.createRef();

  constructor() {
    super();
    this.state = {
      modifyVisible: false,
      deleteVisible: false,
      updateFlag: false,
      searchTemplateName: undefined,
      searchTemplateId: undefined,
      searchType: undefined,
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
          title: formatMessage({ id: 'app.common.number' }),
          dataIndex: 'index',
          key: 'index',
          width: 60,
          render: (res, recode, index) => (
            <span>{(this.state.page.pageNumber - 1) * this.state.page.pageSize + index + 1}</span>
          ),
        },
        {
          title: formatMessage({ id: 'systemManagement.template.templateName' }),
          dataIndex: 'templateName',
          key: 'templateName',
          ellipsis: true,
          width: 150,
        },
        {
          title: formatMessage({ id: 'systemManagement.template.templateId' }),
          dataIndex: 'templateId',
          key: 'templateId',
          width: 120,
        },
        {
          title: formatMessage({ id: 'systemManagement.template.templateType' }),
          dataIndex: 'type',
          key: 'type',
          render: (res, obj) => <span>{templateTypeFormat(obj.type)}</span>,
          ellipsis: true,
          width: 120,
        },
        {
          title: formatMessage({ id: 'systemManagement.template.templateTitle' }),
          dataIndex: 'title',
          key: 'title',
          ellipsis: true,
          width: 120,
        },
        {
          title: formatMessage({ id: 'systemManagement.template.templateContent' }),
          dataIndex: 'content',
          key: 'content',
          ellipsis: true,
          width: 200,
        },
        {
          title: formatMessage({ id: 'systemManagement.template.keyword' }),
          dataIndex: 'keyWord',
          key: 'keyWord',
          ellipsis: true,
          width: 200,
        },
        {
          title: formatMessage({ id: 'app.common.operation' }),
          dataIndex: 'operation',
          key: 'operation',
          align: 'center',
          render: (res, obj) => (
            <span className={styles.operation}>
              <a href="#" onClick={() => this.updateUser(res, obj)}>
                <IconFont type="icon-edit" className={styles['btn-icon']} />
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
      type: 'messageContentTemplate/updateTemplate',
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
    this.searchForm.current.validateFields((err, values) => {
      // if (err) {
      //   return;
      // }
      this.setState(
        {
          searchTemplateName: values.templateName,
          searchTemplateId: values.templateId,
          searchType: values.type,
        },
        () => {
          this.queryUserList();
        },
      );
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
  queryUserList = () => {
    const { dispatch } = this.props;
    const { searchTemplateName, searchTemplateId, searchType } = this.state;
    const params = {
      templateName: searchTemplateName,
      templateId: searchTemplateId,
      type: searchType,
      pageNumber: this.state.page.pageNumber.toString(),
      pageSize: this.state.page.pageSize.toString(),
    };
    dispatch({
      type: 'messageContentTemplate/getTemplateList',
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
    const { loading, messageTemplate } = this.props;
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
            <ModifyTemplate
              onCancel={this.onClose}
              onSave={this.onSave}
              groupMenuInfo={groupMenuInfo}
              updateFlag={updateFlag}
              typeOptions={modifyTypeOptions}
            ></ModifyTemplate>
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
            loading={loading['messageContentTemplate/getTemplateList']}
            dataSource={messageTemplate.items}
            columns={columns}
            pagination={false}
          ></Table>
          {messageTemplate.items && messageTemplate.items.length > 0 && (
            <Pagination
              showSizeChanger
              current={page.pageNumber}
              showTotal={() =>
                `Page ${(messageTemplate.totalCount || 0) &&
                  page.pageNumber.toString()} of ${Math.ceil(
                  (messageTemplate.totalCount || 0) / page.pageSize,
                ).toString()}`
              }
              onShowSizeChange={this.onShowSizeChange}
              onChange={this.pageChange}
              total={messageTemplate.totalCount}
              pageSize={page.pageSize}
            />
          )}
        </div>
      </PageHeaderWrapper>
    );
  }
}
