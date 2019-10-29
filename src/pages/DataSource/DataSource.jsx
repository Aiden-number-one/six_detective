import React, { PureComponent, Fragment, Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Icon, Input, Form, Row, Col, Button, Select, Checkbox, Popover } from 'antd';
import { connect } from 'dva';
import IconFont from '@/components/IconFont';
import classNames from 'classnames';
import styles from './DataSource.less';

const { Option } = Select;

const Title = ({ name, tableData, columnName, setVisible, visible }) => (
  <Fragment>
    <Popover
      trigger="click"
      placement="top"
      content={
        <PopoverContent columnName={columnName} tableData={tableData} setVisible={setVisible} />
      }
      onClick={() => {
        setVisible(columnName, !visible[columnName]);
      }}
      visible={visible[columnName] || false}
    >
      <IconFont
        type="iconfilter1"
        className={styles.icon}
        style={{
          marginRight: 3,
          color: visible[columnName] ? '#ea6473' : 'rgba(17, 65, 108, 0.6)',
        }}
      />
    </Popover>
    {name}
    <div className={styles.sortArea}>
      <IconFont type="iconarrow-up" className={classNames(styles.icon, styles.up)} />
      <IconFont type="iconarrow-down" className={classNames(styles.icon, styles.down)} />
    </div>
  </Fragment>
);

const FilterArr = [
  'Is not equal to',
  'Is equal to',
  'Start With',
  'Contains',
  'Does Not Contains',
  'Is Null',
  'Ends With',
  'Is not Null',
  'Is Empty',
  'Is not Empty',
  'Has No Value',
];

class PopoverContent extends Component {
  state = {
    checkAll: false,
  };

  onChange = checkedList => {
    const { tableData, columnName } = this.props;
    const columnItems = Array.from(new Set(tableData.map(value => value[columnName])));
    this.setState({
      checkedList,
      checkAll: checkedList.length === columnItems.length,
    });
  };

  onCheckAllChange = e => {
    const { tableData, columnName } = this.props;
    const columnItems = Array.from(new Set(tableData.map(value => value[columnName])));
    this.setState({
      checkedList: e.target.checked ? columnItems : [],
      checkAll: e.target.checked,
    });
  };

  render() {
    const { tableData, columnName, setVisible } = this.props;
    const columnItems = Array.from(new Set(tableData.map(value => value[columnName])));
    return (
      <div className={styles.filterContent}>
        <p>
          <Select
            className={styles.filterSelect}
            placeholder="please select"
            dropdownClassName="selectDropdown"
          >
            {FilterArr.map(value => (
              <Option value={value}>{value}</Option>
            ))}
          </Select>
          <Input className={styles.filterInput} />
        </p>
        <div className={styles.checkGroup}>
          <p>
            <Checkbox
              style={{ color: '#10416c' }}
              onChange={this.onCheckAllChange}
              checked={this.state.checkAll}
            >
              Check all
            </Checkbox>
          </p>
          <Checkbox.Group
            onChange={this.onChange}
            // options={columnItems}
            value={this.state.checkedList}
          >
            {columnItems.map(element => (
              <Row>
                <Checkbox style={{ color: '#10416c' }} value={element}>
                  {element}
                </Checkbox>
              </Row>
            ))}
          </Checkbox.Group>
        </div>
        <div className={styles.buttonGroup}>
          <div
            className={styles.buttonGreen}
            onClick={() => {
              setVisible(columnName, false);
            }}
          >
            <Icon type="check" />
          </div>
          <div
            className={styles.buttonRed}
            onClick={() => {
              setVisible(columnName, false);
            }}
          >
            <Icon type="close" />
          </div>
        </div>
      </div>
    );
  }
}

class AdvancedSearchForm extends Component {
  state = {
    expand: false,
  };

  // To generate mock Form.Item
  getFields() {
    const count = this.state.expand ? 10 : 6;
    const { getFieldDecorator } = this.props.form;
    // const children = [];
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
  state = {
    visible: {},
  };

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

  setVisible = (columnName, value) => {
    const { visible } = this.state;
    this.setState({
      visible: {
        ...visible,
        [columnName]: value,
      },
    });
  };

  render() {
    const { tableData, loading } = this.props;
    const { visible } = this.state;
    const columns = [
      {
        title: () => (
          <Title
            name="Parameter ID"
            columnName="ParameterID"
            visible={visible}
            setVisible={this.setVisible}
            tableData={tableData}
          />
        ),
        dataIndex: 'ParameterID',
        key: 'ParameterID',
        align: 'center',
      },
      {
        title: () => (
          <Title
            name="Parameter Name"
            columnName="ParameterName"
            visible={visible}
            setVisible={this.setVisible}
            tableData={tableData}
          />
        ),
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
      <PageHeaderWrapper>
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
      </PageHeaderWrapper>
    );
  }
}
