import React, { PureComponent, Fragment, Component } from 'react';
// import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Layout, Card, Icon, Input, Form, Row, Col, Button, Select, Checkbox } from 'antd';
import { connect } from 'dva';
import IconFont from '@/components/IconFont';
import classNames from 'classnames';
import styles from './DataSource.less';

const { Content, Sider } = Layout;

const Title = ({ name }) => (
  <Fragment>
    <IconFont type="iconfilter1" className={styles.icon} style={{ marginRight: 3 }} />
    {name}
    <div className={styles.sortArea}>
      <IconFont type="iconarrow-up" className={classNames(styles.icon, styles.up)} />
      <IconFont type="iconarrow-down" className={classNames(styles.icon, styles.down)} />
    </div>
  </Fragment>
);

class AdvancedSearchForm extends Component {
  state = {
    expand: false,
  };

  // To generate mock Form.Item
  getFields() {
    const count = this.state.expand ? 10 : 6;
    const { getFieldDecorator } = this.props.form;
    const children = [];
    const itemArray = [
      'Source',
      'DataBase',
      'Generation Marker',
      'Generation Date',
      'Last Update Date',
      'Last Update Marker',
    ];
    return itemArray.map((value, i) => (
      <Col span={8} key={value} style={{ display: i < count ? 'block' : 'none' }}>
        <Form.Item label={value} colon={false}>
          {getFieldDecorator(value, {})(<Select placeholder="Please Select" />)}
        </Form.Item>
      </Col>
    ));
  }

  render() {
    return (
      <Form className="ant-advanced-search-form">
        <Row gutter={48}>{this.getFields()}</Row>
        <div className="clearFix">
          <span className="filterArea">
            <span className="text">More Filter</span>+
          </span>
        </div>
        <div className="clearFix btnArea">
          <Button icon="plus" className="btn2">
            New Data
          </Button>
          <Button type="primary" className="btn1">
            Search
          </Button>
        </div>
      </Form>
    );
  }
}

const WrappedAdvancedSearchForm = Form.create({ name: 'advanced_search' })(AdvancedSearchForm);

@connect(({ api, loading }) => ({
  loading: loading.effects['api/queryDatas'],
  tableData: api.data,
  dataSourceList: api.dataSourceList,
}))
export default class DataSource extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'api/queryDataSourceList',
      payload: { a: 1 },
    });
    dispatch({
      type: 'api/queryDatas',
      payload: { a: 1 },
    });
  }

  getData = connectionId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'api/queryDatas',
      payload: { a: 1 },
    });
    dispatch({
      type: 'api/changeActive',
      payload: connectionId,
    });
  };

  render() {
    const { tableData, dispatch, loading, dataSourceList } = this.props;
    const columns = [
      {
        title: () => <Title name="Parameter ID" />,
        dataIndex: 'ParameterID',
        key: 'ParameterID',
        align: 'center',
      },
      {
        title: 'Parameter Name',
        dataIndex: 'ParameterName',
        key: 'ParameterName',
        align: 'center',
      },
      {
        title: 'Generation Time',
        dataIndex: 'GenerationTime',
        key: 'GenerationTime',
        align: 'center',
      },
      {
        title: 'Source',
        dataIndex: 'Source',
        key: 'Source',
        align: 'center',
      },
      {
        title: 'Generation Maker',
        dataIndex: 'GenerationMaker',
        key: 'GenerationMaker',
        align: 'center',
      },
      {
        title: 'Last Update Time',
        dataIndex: 'LastUpdateTime',
        key: 'LastUpdateTime',
        align: 'center',
      },
      {
        title: 'Last Update Marker',
        dataIndex: 'LastUpdateMarker',
        key: 'LastUpdateMarker',
        align: 'center',
      },
    ];
    const rowSelection = {
      type: 'checkbox',
    };
    return (
      <Fragment>
        <div className={styles.newList}>
          <WrappedAdvancedSearchForm />
          <div className="tableHeader">
            <Checkbox>Select All</Checkbox>
          </div>
          <Table
            rowSelection={rowSelection}
            dataSource={tableData}
            columns={columns}
            loading={loading}
            pagination={{
              total: 12,
              size: 'small',
            }}
          />
        </div>
      </Fragment>
    );
  }
}
