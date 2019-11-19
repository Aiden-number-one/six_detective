import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Switch, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import TableHeader from '@/components/TableHeader';

import SearchForm from './compontents/SearchForm';
import Modify from './compontents/Modify';
import Add from './compontents/Add';

// import styles from './Scheduling.less';

@connect(({ schedule, loading }) => ({
  loading: loading.effects['schedule/getScheduleList'],
  scheduleListData: schedule.scheduleList,
  folderMenuData: schedule.folderMenuDatas,
}))
class Scheduling extends Component {
  state = {
    pageNum: '1',
    pageSize: '10',
    otherParam: {},
    selectedRows: [],
    modifyVisible: false,
    addVisible: false,
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '计划名称',
        dataIndex: 'scheduleName',
        key: 'scheduleName',
      },
      {
        title: '作业编号',
        dataIndex: 'jobNo',
        key: 'jobNo',
      },
      {
        title: '作业名称',
        dataIndex: 'jobName',
        key: 'jobName',
      },
      {
        title: '上次执行时间',
        dataIndex: 'modifiedTime',
        key: 'modifiedTime',
      },
      {
        title: '最后一次执行状态',
        dataIndex: 'lastExecStateName',
        key: 'lastExecStateName',
      },
      {
        title: '下次执行时间',
        dataIndex: 'nextTime',
        key: 'nextTime',
      },
      {
        title: '操作',
        dataIndex: 'startFlag',
        key: 'startFlag',
        render: (text, record) => ({
          children: (
            <Switch
              checkedChildren="NO"
              unCheckedChildren="OFF"
              onChange={checked => this.handleSetConfigStatus(checked, record)}
              defaultChecked={record.startFlag === '2'}
            />
          ),
        }),
      },
    ],
  };

  searchForm = React.createRef();

  componentDidMount() {
    this.getSchedul();
    this.getFolderMenuList();
  }

  getFolderMenuList = () => {
    const { dispatch } = this.props;
    const params = {
      fileType: '1',
    };
    dispatch({
      type: 'schedule/getFolderMenuList',
      payload: params,
    });
  };

  // 分页查询调度计划列表
  getSchedul = (otherParam = {}) => {
    const param = {
      pageNumber: `${this.state.pageNum}`,
      pageSize: `${this.state.pageSize}`,
    };
    Object.assign(param, otherParam);
    const { dispatch } = this.props;
    dispatch({
      type: 'schedule/getScheduleList',
      payload: param,
    });
  };

  // 切换分页
  pageChange = pagination => {
    const { otherParam } = this.state;
    this.setState(
      {
        pageNum: `${pagination.current}`,
        pageSize: pagination.pageSize,
      },
      () => {
        this.getSchedul(otherParam);
      },
    );
  };

  // 搜索查询列表
  queryScheduleList = () => {
    this.searchForm.current.validateFields((err, values) => {
      const startTime = values.startTime ? moment(values.startTime).format('YYYYMMDDHHmmss') : '';
      const endTime = values.endTime ? moment(values.endTime || '').format('YYYYMMDDHHmmss') : '';
      const type = values.operationType;
      const otherParam = {
        [type]: values.operationName,
        lastExecState: values.lastExecState,
        startTime,
        endTime,
      };
      this.setState({
        otherParam,
      });
      this.getSchedul(otherParam);
    });
  };

  // 重置
  operatorReset = () => {
    this.searchForm.current.resetFields();
  };

  // 选择表格行，checkbox
  selectedRow = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows,
    });
  };

  //  批量删除调度计划
  deleteScheduleRow = () => {
    const { selectedRows } = this.state;
    const scheduleIdList = selectedRows.map(item => item.scheduleId);
    const scheduleIdString = scheduleIdList.join(',');
    // console.log('scheduleIdString---->', scheduleIdString);
    const { dispatch } = this.props;
    dispatch({
      type: 'schedule/deleteScheduleBatch',
      payload: {
        scheduleId: scheduleIdString,
      },
      callback: this.getSchedul,
    });
  };

  handleSetConfigStatus = (checked, record) => {
    const { dispatch } = this.props;
    const startFlag = checked ? 2 : 3;
    dispatch({
      type: 'schedule/modifyScheduleBatch',
      payload: {
        scheduleId: record.scheduleId,
        startFlag,
      },
      callback: this.props.getSchedul,
    });
    // console.log('record-------->', checked, record);
  };

  modifySchedule = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length !== 1) {
      message.success('请选择一项进行修改');
      return;
    }
    this.setState({
      modifyVisible: true,
    });
  };

  modifyCancel = () => {
    this.setState({
      modifyVisible: false,
    });
  };

  addSchedule = () => {
    this.setState({
      addVisible: true,
    });
  };

  addCancel = () => {
    this.setState({
      addVisible: false,
    });
  };

  render() {
    const { scheduleListData, folderMenuData } = this.props;
    const { pageSize, modifyVisible, addVisible, selectedRows } = this.state;
    const scheduleList = scheduleListData.items;
    const totalCount = scheduleListData && scheduleListData.totalCount;
    // console.log('selectedRows-00000-->', selectedRows);
    // eslint-disable-next-line no-unused-expressions
    scheduleList &&
      scheduleList.forEach((item, index) => {
        item.index = (this.state.pageNum - 1) * pageSize + index + 1;
      });
    const rowSelection = {
      type: 'checkbox',
      onChange: this.selectedRow,
    };
    return (
      <PageHeaderWrapper>
        <SearchForm
          search={this.queryScheduleList}
          reset={this.operatorReset}
          ref={this.searchForm}
        />
        <TableHeader
          showEdit
          showSelect
          editTableData={this.modifySchedule}
          addTableData={this.addSchedule}
          deleteTableData={this.deleteScheduleRow}
        />
        <Table
          dataSource={scheduleList}
          pagination={{ total: totalCount, pageSize, showSizeChanger: true }}
          onChange={this.pageChange}
          columns={this.state.columns}
          rowSelection={rowSelection}
        />
        <Modify
          modifyVisible={modifyVisible}
          modifyCancel={this.modifyCancel}
          selectedRows={selectedRows}
          getSchedul={this.getSchedul}
          folderMenuData={folderMenuData}
        />
        <Add
          addVisible={addVisible}
          addCancel={this.addCancel}
          getSchedul={this.getSchedul}
          folderMenuData={folderMenuData}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Scheduling;
