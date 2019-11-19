import React, { PureComponent, Fragment, Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Table,
  Icon,
  Input,
  Form,
  Row,
  Col,
  Button,
  Select,
  Checkbox,
  Popover,
  DatePicker,
} from 'antd';
import { connect } from 'dva';
import classNames from 'classnames';
import IconFont from '@/components/IconFont';
import TableHeader from '@/components/TableHeader';
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
    const { expand } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Row gutter={{ xs: 24, sm: 48, md: 96, lg: 48, xl: 96 }}>
        <Col xs={12} sm={12} lg={8} key="Source">
          <Form.Item label="Source" colon={false}>
            {getFieldDecorator('Source', {})(
              <DatePicker placeholder="Please Select" dropdownClassName="selectDropdown" />,
            )}
          </Form.Item>
        </Col>
        <Col xs={12} sm={12} lg={8} key="DataBase">
          <Form.Item label="DataBase" colon={false}>
            {getFieldDecorator('DataBase', {})(
              <DatePicker placeholder="Please Select" dropdownClassName="selectDropdown" />,
            )}
          </Form.Item>
        </Col>
        <Col xs={12} sm={12} lg={8} key="Generation Marker">
          <Form.Item label="Generation Marker" colon={false}>
            {getFieldDecorator('Generation Marker', {})(
              <DatePicker placeholder="Please Select" dropdownClassName="selectDropdown" />,
            )}
          </Form.Item>
        </Col>
        <Col
          xs={12}
          sm={12}
          lg={8}
          key="Generation Date"
          style={{ display: expand ? 'block' : 'none' }}
        >
          <Form.Item label="Generation Date" colon={false}>
            {getFieldDecorator('Generation Date', {})(
              <DatePicker placeholder="Please Select" dropdownClassName="selectDropdown" />,
            )}
          </Form.Item>
        </Col>
        <Col
          xs={12}
          sm={12}
          lg={8}
          key="Last Update Date"
          style={{ display: expand ? 'block' : 'none' }}
        >
          <Form.Item label="Last Update Date" colon={false}>
            {getFieldDecorator('Last Update Date', {})(
              <DatePicker placeholder="Please Select" dropdownClassName="selectDropdown" />,
            )}
          </Form.Item>
        </Col>
        <Col
          xs={12}
          sm={12}
          lg={8}
          key="Last Update Marker"
          style={{ display: expand ? 'block' : 'none' }}
        >
          <Form.Item label="Last Update Marker" colon={false}>
            {getFieldDecorator('Last Update Marker', {})(
              <DatePicker placeholder="Please Select" dropdownClassName="selectDropdown" />,
            )}
          </Form.Item>
        </Col>
      </Row>
    );
  }

  render() {
    const { expand } = this.state;
    return (
      <Form className="ant-advanced-search-form">
        {this.getFields()}
        <div className="clearFix btnArea">
          <span className="filterArea">
            <span
              className="text"
              onClick={() => {
                this.setState({
                  expand: !expand,
                });
              }}
            >
              More Filter
            </span>
            +
          </span>
          <Button type="primary">Search</Button>
        </div>
      </Form>
    );
  }
}

const WrappedAdvancedSearchForm = Form.create({ name: 'advanced_search' })(AdvancedSearchForm);

@connect(({ api, loading }) => ({
  loading: loading.effects['api/queryDatas'],
  tableData: api.data,
}))
export default class DataSource extends PureComponent {
  state = {
    visible: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'api/queryDatas',
      payload: { a: 1 },
    });
  }

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
          <TableHeader showSelect showEdit />
          <Table
            className="basicTable"
            rowSelection={rowSelection}
            dataSource={tableData}
            columns={columns}
            loading={loading}
            pagination={{
              total: 12,
              size: 'small',
              showSizeChanger: true,
              // showTotal: total => `Total ${total} items`,
            }}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}
