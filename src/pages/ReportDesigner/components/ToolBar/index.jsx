import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import classNames from 'classnames';
import { FormattedMessage } from 'umi/locale';
import { Tabs, Button, Select, Menu, Icon, Dropdown, Popover } from 'antd';
import { borderMenu } from './menu';
// import { rowsAndColsMenu } from './menu';
import { fontSizeSelect, fontFamilySelect } from './select';
import CustomizeIcon from '../CustomizeIcon';
import styles from './index.less';
import IconFont from '@/components/IconFont';

const { TabPane } = Tabs;
const { Option } = Select;
const ButtonGroup = Button.Group;
// const RadioGroup = Radio.Group;
// const { SubMenu, ItemGroup } = Menu;

export default class ToolBar extends Component {
  state = {
    // rowHeightVisible: false, // 显示行高弹框
    // rowHeight: '', // 行高
    // colWidthVisible: false, // 显示列宽弹框
    // colWidth: '', // 列宽
    // insertCellVisible: false, // 显示插入单元格弹框
    // deleteCellVisible: false, // 显示删除单元格弹框/
    // radioValue: 1, // 单元格操作默认选择第一个
    // selectedRow: '', // 选中的行数
    // selectedCol: '', // 选中的列数
    // showAndHideVisible: false, // 显示和隐藏弹框
    // 默认无边框
    // borderParams: {
    //   icon: 'noBorder',
    //   param: '{"border":""}',
    // },
    // 默认白色背景
    backgroundColor: '#fff',
    // 默认黑色字体
    fontColor: '#000',
    // 默认样式
    btnActiveStatus: {
      autoLineBreak: false, // 是否自动换行
      textAlign: 'left', // 水平方向对齐
      // textAlignLast: 'inherit', // 最后一行两端对齐
      verticalAlign: 'middle', // 垂直方向对齐
      fontWeight: 'normal', // 字体加粗
      fontStyle: 'normal', // 斜体
      textDecoration: 'none', // 下划线
      fontSize: '10', // 默认字号
      fontFamily: 'Arial', // 默认字体
      isMerge: false, // 单元格是否合并
      freeze: false, // 单元格是否冻结
      paintformatActive: false, // 格式刷是否被激活
    },
    // 单元格的数据类型
    cellType: {},
  };

  cellType = [
    {
      label: '日期(yyyy-MM-dd)',
      key: 'dateyyyy-MM-dd',
      value: 'dateyyyy-MM-dd',
    },
    {
      label: '日期时间',
      key: 'datetimeyyyy-MM-dd hh:mm:ss',
      value: 'datetimeyyyy-MM-dd hh:mm:ss',
    },
    {
      label: '时间',
      key: 'timehh:mm:ss',
      value: 'timehh:mm:ss',
    },
    {
      label: '文本',
      key: 'text',
      value: 'text',
    },
    {
      label: '货币($)',
      key: 'currency$',
      value: 'currency$',
    },
    {
      label: '货币(￥)',
      key: 'currency￥',
      value: 'currency￥',
    },
    {
      label: '千分比',
      key: 'permillage',
      value: 'permillage',
    },
    {
      label: '百分比',
      key: 'percentage',
      value: 'percentage',
    },
    {
      label: '勾选框',
      key: 'checkbox',
      value: 'checkbox',
    },
  ];

  cellTypeMap = {
    'dateyyyy-MM-dd': {
      cellType: 'date',
      format: 'yyyy-MM-dd',
      type: 'date',
    },
    'datetimeyyyy-MM-dd hh:mm:ss': {
      cellType: 'datetime',
      format: 'yyyy-MM-dd hh:mm:ss',
      type: 'datetime',
    },
    'timehh:mm:ss': {
      cellType: 'time',
      format: 'hh:mm:ss',
      type: 'time',
    },
    text: {
      cellType: 'text',
    },
    currency$: {
      cellType: 'numeric',
      format: '$0,0.00',
      scale: '2',
      type: 'currency',
    },
    'currency￥': {
      cellType: 'numeric',
      format: '￥0,0.00',
      scale: '2',
      type: 'currency',
    },
    permillage: {
      cellType: 'numeric',
      format: '0.00%',
      scale: '2',
      type: 'permillage',
    },
    percentage: {
      cellType: 'numeric',
      format: '0.00%',
      scale: '2',
      type: 'percentage',
    },
    checkbox: {
      cellType: 'checkbox',
    },
  };

  componentDidMount() {
    const { setCellCallback } = this.props;
    const { btnActiveStatus } = this.state;
    setCellCallback(data => {
      const cellStyle = data.getSelectedCellStyle();
      const cell = data.getSelectedCell();
      const cellType = cell ? cell.cellProps || {} : {};
      let isMerge = false;
      let freeze = false;
      if (cell && cell.merge) {
        isMerge = true;
      }
      if (
        data.freeze[0] !== 0 &&
        data.freeze[1] !== 0 &&
        data.freeze[0] === data.selector.ri &&
        data.freeze[1] === data.selector.ci
      ) {
        freeze = true;
      }
      this.setState({
        backgroundColor: cellStyle.bgcolor,
        fontColor: cellStyle.color,
        btnActiveStatus: {
          // 回显按钮样式
          ...btnActiveStatus,
          autoLineBreak: cellStyle.textwrap,
          textAlign: cellStyle.align,
          verticalAlign: cellStyle.valign,
          fontWeight: cellStyle.font.bold ? 'bold' : 'normal',
          fontStyle: cellStyle.font.italic ? 'italic' : 'normal',
          fontSize: cellStyle.font.size,
          fontFamily: cellStyle.font.name,
          textDecoration: cellStyle.underline ? 'underline' : 'none',
          isMerge,
          freeze,
          paintformatActive: false,
        },
        cellType,
      });
    });
  }

  // 取消设置行高
  // cancelRowHeight = () => {
  //   this.setState({
  //     rowHeightVisible: false,
  //   });
  // };

  // 取消设置单元格
  // cancelInsertCell = () => {
  //   this.setState({
  //     insertCellVisible: false,
  //   });
  // };

  // 按钮下拉菜单
  creatMenu = (menu, type) => {
    const { setCellStyle, editRowColumn } = this.props;
    if (type === 'border') {
      return (
        <Menu
          onClick={() => {
            // this.handleMenuClick(type, e);
          }}
        >
          {menu.map(({ icon, name, params }) => (
            <Menu.Item
              params={params}
              icon={icon}
              key={name}
              onClick={() => {
                setCellStyle(type, {
                  mode: params,
                });
              }}
            >
              {icon && <Icon component={() => <CustomizeIcon type={icon} />} />}
              {name}
            </Menu.Item>
          ))}
        </Menu>
      );
    }
    if (type === 'rowAndCol') {
      return (
        <Menu>
          {menu.map(({ icon, name, operatype, value }) => (
            <Menu.Item
              key={name}
              onClick={() => {
                editRowColumn(operatype, value);
              }}
            >
              {icon && <Icon component={() => <CustomizeIcon type={icon} />} />}
              {name}
            </Menu.Item>
          ))}
        </Menu>
      );
    }
    return (
      <Menu
        onClick={() => {
          // this.handleMenuClick(type, e);
        }}
      >
        {menu.map(({ icon, name, params }) => (
          <Menu.Item params={params} icon={icon} key={name}>
            {icon && <Icon component={() => <CustomizeIcon type={icon} />} />}
            {name}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  render() {
    const { setCellStyle, setCellType } = this.props;
    const { btnActiveStatus, backgroundColor, fontColor, cellType, paintformatActive } = this.state;
    const popoverProps = {
      placement: 'bottom',
      mouseEnterDelay: 0.2,
      mouseLeaveDelay: 0,
    };
    const tabPanelStyle = {
      padding: '7px 12px',
      height: '70px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    };
    return (
      <div className={classNames(styles.tabs, 'card-container')}>
        {/* <div className={styles.fileBox}>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu style={{ width: 256 }} mode="vertical">
                <Menu.Item key="1">
                  <IconFont type="icon-xinjian" /> 新建报表
                </Menu.Item>
                <SubMenu
                  key="2"
                  title={
                    <span>
                      <IconFont type="icon-dakai" style={{ marginRight: '12px' }} />
                      <span>打开</span>
                    </span>
                  }
                >
                  <ItemGroup
                    title={
                      <span>
                        最近使用
                        <IconFont type="icon-shuaxin" title="清空" style={{ cursor: 'pointer' }} />
                      </span>
                    }
                  >
                    <Menu.Item key="21">
                      <IconFont type="icon-Excel" style={{ marginRight: '6px' }} />
                      haha1.xls
                    </Menu.Item>
                    <Menu.Item key="22">
                      <IconFont type="icon-Excel" style={{ marginRight: '6px' }} />
                      haha2.xls
                    </Menu.Item>
                  </ItemGroup>
                </SubMenu>
                <Menu.Item key="3">
                  <IconFont type="icon-baocun" /> 保存
                </Menu.Item>
                <SubMenu
                  key="4"
                  title={
                    <span>
                      <IconFont type="icon-lingcunwei" style={{ marginRight: '12px' }} />
                      <span>另存为</span>
                    </span>
                  }
                >
                  <ItemGroup title="保存文档副本">
                    <Menu.Item key="41">
                      <IconFont type="icon-Excel" style={{ marginRight: '6px' }} />
                      excel 97-2003 模板文件（*.xls）
                    </Menu.Item>
                    <Menu.Item key="42">
                      <IconFont type="icon-Excel" style={{ marginRight: '6px' }} />
                      excel 文件（*.xlsx）
                    </Menu.Item>
                  </ItemGroup>
                </SubMenu>
                <Menu.Item key="5">
                  <IconFont type="icon-fenxiang-copy" /> 分享文档
                </Menu.Item>
                <Menu.Item key="6">
                  <IconFont type="icon-icon" /> 帮助
                </Menu.Item>
                <Menu.Item key="7">
                  <IconFont type="icon-tuichu" /> 退出
                </Menu.Item>
              </Menu>
            }
          >
            <Button style={{ marginLeft: 8 }} className={styles.fileBoxBtn}>
              文件 <Icon type="down" />
            </Button>
          </Dropdown>
        </div> */}
        <Tabs type="card" defaultActiveKey="1">
          <TabPane tab={<FormattedMessage id="report-designer.start" />} key="1">
            <div style={tabPanelStyle}>
              <div className={styles.group}>
                <Button className={classNames('btn', 'btn2', 'mr6')}>
                  <div className={styles.topBottom}>
                    <IconFont type="iconicon_previrew" />
                    <p>Preview</p>
                  </div>
                </Button>
                <Button className={classNames('btn', 'btn2', 'mr6')}>
                  <div className={styles.topBottom}>
                    <IconFont type="icondaoru" />
                    <p>Import</p>
                  </div>
                </Button>
                <Button className={classNames('btn', 'btn2', 'mr6')}>
                  <div className={styles.topBottom}>
                    <IconFont type="iconfilesearch" />
                    <p>Search</p>
                  </div>
                </Button>
                <div className={styles.topBottomTwo}>
                  <div>
                    <Button
                      className={classNames('btn', 'mr6')}
                      onClick={() => {
                        setCellStyle('cut');
                      }}
                    >
                      <IconFont type="iconcut-solid-copy" />
                      <span>Cut</span>
                    </Button>
                  </div>
                  <div>
                    <Button
                      className={classNames('btn', 'mr6')}
                      onClick={() => {
                        setCellStyle('copy');
                      }}
                    >
                      <IconFont type="iconcopy" />
                      <span>Copy</span>
                    </Button>
                  </div>
                </div>
              </div>
              <div className={styles.group}>
                <Button className={classNames('btn', 'btn2', 'mr6', paintformatActive && 'active')}>
                  <div
                    className={classNames(styles.topBottom)}
                    onClick={() => {
                      setCellStyle('paintformat', true);
                    }}
                  >
                    <IconFont type="icongeshishua" />
                    <p className={styles.brP}>
                      <span>Format</span>
                      <br />
                      <span>Painter</span>
                    </p>
                  </div>
                </Button>
              </div>
              <div className={styles.divider} />
              <div className={styles.group}>
                <div className="mb4">
                  <Select
                    style={{ width: '140px' }}
                    defaultValue="3"
                    value={btnActiveStatus.fontFamily}
                    size="small"
                    suffixIcon={<Icon type="caret-down" />}
                    onChange={value => {
                      this.setState({
                        btnActiveStatus: {
                          ...btnActiveStatus,
                          fontFamily: value,
                        },
                      });
                      setCellStyle('font-name', value);
                    }}
                  >
                    {fontFamilySelect.map(item => (
                      <Option value={item.value}>{item.key}</Option>
                    ))}
                  </Select>
                  <Select
                    className="select mr6"
                    style={{ width: '66px' }}
                    defaultValue="6"
                    value={btnActiveStatus.fontSize}
                    size="small"
                    suffixIcon={<Icon type="caret-down" />}
                    onChange={value => {
                      this.setState({
                        btnActiveStatus: {
                          ...btnActiveStatus,
                          fontSize: value,
                        },
                      });
                      setCellStyle('font-size', value);
                    }}
                  >
                    {fontSizeSelect.map(item => (
                      <Option value={item}>{item}</Option>
                    ))}
                  </Select>

                  <Button
                    className="btn mr6"
                    onClick={() => {
                      let index = fontSizeSelect.findIndex(
                        item => item === btnActiveStatus.fontSize,
                      );
                      if (index === 16) {
                        index = 0;
                      } else {
                        index += 1;
                      }
                      this.setState({
                        btnActiveStatus: {
                          ...btnActiveStatus,
                          fontSize: fontSizeSelect[index],
                        },
                      });
                      setCellStyle('font-size', fontSizeSelect[index]);
                    }}
                  >
                    <span>A+</span>
                  </Button>

                  <Button
                    className="btn mr6"
                    onClick={() => {
                      let index = fontSizeSelect.findIndex(
                        item => item === btnActiveStatus.fontSize,
                      );
                      if (index === 0) {
                        index = 16;
                      } else {
                        index -= 1;
                      }
                      this.setState({
                        btnActiveStatus: {
                          ...btnActiveStatus,
                          fontSize: fontSizeSelect[index],
                        },
                      });
                      setCellStyle('font-size', fontSizeSelect[index]);
                    }}
                  >
                    <span>A-</span>
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      this.setState(() => ({
                        btnActiveStatus: {
                          ...btnActiveStatus,
                          fontWeight: btnActiveStatus.fontWeight === 'normal' ? 'bold' : 'normal',
                        },
                      }));
                      setCellStyle('font-bold', true);
                    }}
                    className={classNames(
                      'btn',
                      'mr6',
                      btnActiveStatus.fontWeight === 'bold' && 'active',
                    )}
                  >
                    <IconFont type="iconB" />
                  </Button>
                  <Button
                    className={classNames(
                      'btn',
                      'mr6',
                      btnActiveStatus.fontStyle === 'italic' && 'active',
                    )}
                    onClick={() => {
                      this.setState(() => ({
                        btnActiveStatus: {
                          ...btnActiveStatus,
                          fontStyle: btnActiveStatus.fontStyle === 'normal' ? 'italic' : 'normal',
                        },
                      }));
                      setCellStyle('font-italic', true);
                    }}
                  >
                    <IconFont type="iconI" />
                  </Button>

                  <Button
                    onClick={() => {
                      this.setState(() => ({
                        btnActiveStatus: {
                          ...btnActiveStatus,
                          textDecoration:
                            btnActiveStatus.textDecoration === 'none' ? 'underline' : 'none',
                        },
                      }));
                      setCellStyle('underline', true);
                    }}
                    className={classNames(
                      'btn',
                      'mr6',
                      btnActiveStatus.textDecoration === 'underline' && 'active',
                    )}
                  >
                    <IconFont type="iconU-copy" />
                  </Button>
                  <ButtonGroup className="btn-group mr6">
                    <Popover content="边框" {...popoverProps}>
                      <Button className="btn" onClick={() => {}}>
                        <IconFont type="iconborder-none-solid" />
                      </Button>
                    </Popover>
                    <Dropdown
                      overlay={this.creatMenu(borderMenu, 'border')}
                      trigger={['click']}
                      placement="bottomLeft"
                    >
                      <Button className="btn with-icon">
                        <Icon type="caret-down" />
                      </Button>
                    </Dropdown>
                  </ButtonGroup>
                  {/* <ButtonGroup className="btn-group mr6">
                  <Popover content="绘图边框" {...popoverProps}>
                    <Button className="btn" onClick={this.handleButtonClick}>
                      <Icon component={() => <CustomizeIcon type="drawingBorder" />} />
                    </Button>
                  </Popover>
                  <Dropdown
                    overlay={this.creatMenu(drawingBorderMenu)}
                    trigger={['click']}
                    placement="bottomLeft"
                  >
                    <Button className="btn with-icon">
                      <Icon type="down" style={{}} />
                    </Button>
                  </Dropdown>
                </ButtonGroup> */}
                  <ButtonGroup className="btn-group mr6">
                    <Button
                      className="btn"
                      onClick={() => {
                        setCellStyle('bgcolor', backgroundColor);
                      }}
                    >
                      <IconFont type="iconic_format_color_fill" />
                    </Button>
                    <Dropdown
                      overlay={
                        <SketchPicker
                          color={backgroundColor}
                          onChange={value => {
                            this.setState({
                              backgroundColor: value.hex,
                            });
                            setCellStyle('bgcolor', value.hex);
                          }}
                        />
                      }
                      trigger={['click']}
                      placement="bottomLeft"
                    >
                      <Button className="btn with-icon">
                        <Icon type="caret-down" />
                      </Button>
                    </Dropdown>
                  </ButtonGroup>
                  <ButtonGroup className="btn-group mr6">
                    <Button
                      className="btn"
                      onClick={() => {
                        setCellStyle('color', fontColor);
                      }}
                    >
                      <IconFont type="iconic_format_color_text_px" />
                    </Button>
                    <Dropdown
                      overlay={
                        <SketchPicker
                          color={fontColor}
                          onChange={value => {
                            this.setState({
                              fontColor: value.hex,
                            });
                            setCellStyle('color', value.hex);
                          }}
                        />
                      }
                      trigger={['click']}
                      placement="bottomLeft"
                    >
                      <Button className="btn with-icon">
                        <Icon type="caret-down" />
                      </Button>
                    </Dropdown>
                  </ButtonGroup>

                  {/* <ButtonGroup className="btn-group"> */}
                  <Button
                    className="btn"
                    onClick={() => {
                      setCellStyle('clearformat');
                    }}
                  >
                    <IconFont type="iconeraser-ps" />
                  </Button>
                  {/* <Dropdown
                    overlay={this.creatMenu(clearMenu, 'clear')}
                    trigger={['click']}
                    placement="bottomLeft"
                  >
                    <Button className="btn with-icon">
                      <Icon type="down" style={{}} />
                    </Button>
                  </Dropdown>
                </ButtonGroup> */}
                </div>
              </div>
              <div className={styles.divider} />
              <div className={classNames(styles.group, styles.iconGroup)}>
                <div className="mb4">
                  <Button
                    onClick={() => {
                      this.setState({
                        btnActiveStatus: {
                          ...btnActiveStatus,
                          verticalAlign: btnActiveStatus.verticalAlign === 'top' ? 'middle' : 'top',
                        },
                      });
                      setCellStyle('valign', 'top');
                    }}
                    className={classNames(
                      'btn',
                      'mr6',
                      btnActiveStatus.verticalAlign === 'top' && 'active',
                    )}
                  >
                    <IconFont type="icondingduiqi" />
                  </Button>
                  <Button
                    onClick={() => {
                      this.setState({
                        btnActiveStatus: {
                          ...btnActiveStatus,
                          verticalAlign: 'middle',
                        },
                      });
                      setCellStyle('valign', 'middle');
                    }}
                    className={classNames(
                      'btn',
                      'mr6',
                      btnActiveStatus.verticalAlign === 'middle' && 'active',
                    )}
                  >
                    <IconFont type="iconshuipingduiqi1" />
                  </Button>

                  <Button
                    onClick={() => {
                      this.setState({
                        btnActiveStatus: {
                          ...btnActiveStatus,
                          verticalAlign:
                            btnActiveStatus.verticalAlign === 'bottom' ? 'middle' : 'bottom',
                        },
                      });
                      setCellStyle('valign', 'bottom');
                    }}
                    className={classNames(
                      'btn',
                      'mr6',
                      btnActiveStatus.verticalAlign === 'bottom' && 'active',
                    )}
                  >
                    <IconFont type="icondiduiqi" />
                  </Button>
                  {/* <Popover content="减少缩进量" {...popoverProps} onClick={() => {}}>
                  <Button className="btn mr6">
                    <Icon component={() => <CustomizeIcon type="decreaseIndent" />} />
                  </Button>
                </Popover>
                <Popover content="增加缩进量" {...popoverProps} onClick={() => {}}>
                  <Button className="btn mr6">
                    <Icon component={() => <CustomizeIcon type="increaseIndent" />} />
                  </Button>
                </Popover> */}
                  {/* <Popover content="合并居中" {...popoverProps}>
                  <Button
                    className={classNames('btn', btnActiveStatus.isMerge && 'active')}
                    onClick={() => {
                      this.setState({
                        btnActiveStatus: {
                          ...btnActiveStatus,
                          isMerge: !btnActiveStatus.isMerge,
                        },
                      });
                      setCellStyle('merge', true);
                    }}
                  >
                    <Icon component={() => <CustomizeIcon type="mergeAndCentered" size="lg" />} />
                    合并居中
                  </Button>
                </Popover> */}
                </div>
                <div>
                  <Button
                    onClick={() => {
                      this.setState({
                        btnActiveStatus: {
                          ...btnActiveStatus,
                          textAlign: 'left',
                        },
                      });
                      setCellStyle('align', 'left');
                    }}
                    className={classNames(
                      'btn',
                      'mr6',
                      btnActiveStatus.textAlign === 'left' && 'active',
                    )}
                  >
                    <IconFont type="iconalign-left-solid" />
                  </Button>

                  <Button
                    onClick={() => {
                      this.setState({
                        btnActiveStatus: {
                          ...btnActiveStatus,
                          textAlign: btnActiveStatus.textAlign === 'center' ? 'left' : 'center',
                        },
                      });
                      setCellStyle('align', 'center');
                    }}
                    className={classNames(
                      'btn',
                      'mr6',
                      btnActiveStatus.textAlign === 'center' && 'active',
                    )}
                  >
                    <IconFont type="iconalign-center-solid" />
                  </Button>
                  <Button
                    onClick={() => {
                      this.setState({
                        btnActiveStatus: {
                          ...btnActiveStatus,
                          textAlign: btnActiveStatus.textAlign === 'right' ? 'left' : 'right',
                        },
                      });
                      setCellStyle('align', 'right');
                    }}
                    className={classNames(
                      'btn',
                      'mr6',
                      btnActiveStatus.textAlign === 'right' && 'active',
                    )}
                  >
                    <IconFont type="iconalign-right-solid" />
                  </Button>
                  {/* <Popover content="两端对齐" {...popoverProps} onClick={() => {}}>
                  <Button
                    className={classNames(
                      'btn',
                      'mr6',
                      btnActiveStatus.textAlign === 'justify' &&
                        btnActiveStatus.textAlignLast !== 'justify' &&
                        'active',
                    )}
                  >
                    <Icon component={() => <CustomizeIcon type="alignNormal" />} />
                  </Button>
                </Popover>
                <Popover content="分散对齐" {...popoverProps} onClick={() => {}}>
                  <Button
                    className={classNames(
                      'btn',
                      'mr6',
                      btnActiveStatus.textAlign === 'justify' &&
                        btnActiveStatus.textAlignLast === 'justify' &&
                        'active',
                    )}
                  >
                    <Icon component={() => <CustomizeIcon type="alignBoth" />} />
                  </Button>
                </Popover> */}
                  {/* <Popover content="自动换行" {...popoverProps}>
                  <Button
                    className={classNames('btn', btnActiveStatus.autoLineBreak && 'active')}
                    onClick={() => {
                      this.setState({
                        btnActiveStatus: {
                          ...btnActiveStatus,
                          autoLineBreak: !btnActiveStatus.autoLineBreak,
                        },
                      });
                      setCellStyle('textwrap', true);
                    }}
                  >
                    <Icon component={() => <CustomizeIcon type="autoLineBreak" size="lg" />} />
                    自动换行
                  </Button>
                </Popover> */}
                </div>
              </div>
              <div className={styles.divider} />
              <div className={styles.group}>
                <Button
                  className={classNames('btn', 'btn2', 'mr6', this.props.formatPainter && 'active')}
                >
                  <div
                    className={classNames(styles.topBottom)}
                    onClick={() => {
                      setCellStyle('paintformat', true);
                    }}
                  >
                    <IconFont type="iconhuanhang" />
                    <p className={styles.brP}>
                      <span>Merge and</span>
                      <br />
                      <span>center</span>
                    </p>
                  </div>
                </Button>
                <Button
                  className={classNames('btn', 'btn2', 'mr6', this.props.formatPainter && 'active')}
                >
                  <div
                    className={classNames(styles.topBottom, this.props.formatPainter && 'active')}
                    onClick={() => {
                      setCellStyle('paintformat', true);
                    }}
                  >
                    <IconFont type="iconhebingdanyuange_danyuangecaozuo_jurassic" />
                    <p className={styles.brP}>
                      <span>Wrap</span>
                      <br />
                      <span>Text</span>
                    </p>
                  </div>
                </Button>
              </div>
              <div className={styles.divider} />
              <div className={styles.group}>
                <div className="mb4">
                  <Popover content="数字格式" {...popoverProps}>
                    <Select
                      className="select"
                      style={{ width: '139px' }}
                      defaultValue="1"
                      suffixIcon={<Icon type="caret-down" />}
                      value={cellType.format ? cellType.format : undefined}
                      size="small"
                      onChange={value => {
                        this.setState({
                          cellType: {
                            format: value,
                          },
                        });
                        setCellType('cellType', this.cellTypeMap[value]);
                      }}
                    >
                      {this.cellType.map(item => (
                        <Option key={item.key} value={item.value}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  </Popover>
                </div>
                <div>
                  <Button className="btn mr6">
                    <IconFont type="iconrenminbi" />
                  </Button>
                  <Button className="btn mr6">
                    <IconFont type="iconpercent-solid" />
                  </Button>
                  <Button className="btn mr6">
                    <IconFont type="iconjisuan" />
                  </Button>
                  {/* <Popover content="千分位分隔样式" {...popoverProps} onClick={() => {}}>
                  <Button className="btn mr6">
                    <Icon component={() => <CustomizeIcon type="formatMoney" />} />
                  </Button>
                </Popover>
                <Popover content="增加小数位数" {...popoverProps} onClick={() => {}}>
                  <Button className="btn mr6">
                    <Icon component={() => <CustomizeIcon type="increaseDecimal" />} />
                  </Button>
                </Popover>
                <Popover content="减少小数位数" {...popoverProps} onClick={() => {}}>
                  <Button className="btn">
                    <Icon component={() => <CustomizeIcon type="decreaseDecimal" />} />
                  </Button>
                </Popover> */}
                </div>
              </div>
              <div className={styles.divider} />
              <div className={styles.group}>
                <div style={{ display: 'inline-block' }}>
                  <div className="mb4">
                    <Button className="btn mr6" onClick={() => {}}>
                      <IconFont type="iconfilter" />
                    </Button>
                    <Button className="btn mr6" onClick={() => {}}>
                      <IconFont type="iconfilter" style={{ color: '#949EA7FF' }} />
                    </Button>
                    <Button className="btn mr6" onClick={() => {}}>
                      <IconFont type="iconbiao-biaoge_jurassic" />
                    </Button>
                  </div>
                  <div>
                    <Button className="btn mr6" onClick={() => {}}>
                      <IconFont type="iconsort-amount-up-solid" />
                    </Button>
                    <Button className="btn mr6" onClick={() => {}}>
                      <IconFont type="iconsort-amount-down-solid" />
                    </Button>
                    <Button className="btn mr6" onClick={() => {}}>
                      <IconFont type="iconbiaoge1" />
                    </Button>
                  </div>
                </div>
                {/* <div className="btn-group-dropmenu">
                <Popover content="套用表格样式" {...popoverProps}>
                  <Button className="btn">
                    <Icon component={() => <CustomizeIcon type="formatCell" size="lg" />} />
                  </Button>
                </Popover>
                <ButtonGroup className="btn-group">
                  <Dropdown
                    overlay={<div />}
                    // overlay={<TableFormat />}
                    trigger={['click']}
                    placement="bottomLeft"
                  >
                    <Button className="btn">
                      表格样式
                      <Icon type="down" style={{}} />
                    </Button>
                  </Dropdown>
                </ButtonGroup>
              </div> */}
              </div>
              <div className={styles.group}>
                <Button
                  className={classNames('btn', 'btn2', 'mr6', this.props.formatPainter && 'active')}
                >
                  <div className={styles.topBottom}>
                    <IconFont type="iconlianjie" />
                    <p>Link</p>
                  </div>
                </Button>
                <Button
                  className={classNames('btn', 'btn2', 'mr6', this.props.formatPainter && 'active')}
                >
                  <div className={styles.topBottom}>
                    <IconFont type="iconfreeze" />
                    <p>Freeze</p>
                  </div>
                </Button>
                <Button
                  className={classNames('btn', 'btn2', 'mr6', this.props.formatPainter && 'active')}
                >
                  <div className={styles.topBottom}>
                    <IconFont type="iconfilesearch" />
                    <p>Picture</p>
                  </div>
                </Button>
              </div>
              <div className={styles.group}>
                {/* <div className="btn-group-dropmenu mr6">
                <Popover content="行和列" {...popoverProps}>
                  <Button
                    className="btn"
                    //  onClick={this.handleButtonClick}
                  >
                    <Icon component={() => <CustomizeIcon type="rowsAndCols" size="lg" />} />
                  </Button>
                </Popover>
                <ButtonGroup className="btn-group">
                  <Dropdown
                    overlay={this.creatMenu(rowsAndColsMenu, 'rowAndCol')}
                    trigger={['click']}
                    placement="bottomLeft"
                  >
                    <Button className="btn">
                      行和列
                      <Icon type="down" style={{}} />
                    </Button>
                  </Dropdown>
                </ButtonGroup>
              </div> */}
                {/* <div className="mr6" style={{ display: 'inline-block', verticalAlign: 'top' }}>
                <div className="mb4">
                  <Popover content="添加超链接" {...popoverProps}>
                    <Button
                      className="btn"
                      onClick={() => {
                        // let params ={
                        //   "type": "a",
                        //   typeOptions: {
                        //       a: [{
                        //           // path: this.state.imageUrl,
                        //           href:"https://www.baidu.com",
                        //       }]
                        //   }
                        // }
                        // hotTool.type(this.state.instance,params)
                      }}
                    >
                      <Icon component={() => <CustomizeIcon type="hyperlink" />} />
                      超链接
                    </Button>
                  </Popover>
                </div>
                <div>
                  <ButtonGroup className="btn-group">
                  <Popover content="冻结窗格" {...popoverProps}>
                    <Button
                      className={classNames('btn', btnActiveStatus.freeze && 'active')}
                      onClick={() => {
                        this.setState({
                          btnActiveStatus: {
                            ...btnActiveStatus,
                            freeze: !btnActiveStatus.freeze,
                          },
                        });
                        setCellStyle('freeze', true);
                      }}
                    >
                      <Icon component={() => <CustomizeIcon type="freeze" />} />
                      {btnActiveStatus.freeze ? '取消冻结' : '冻结'}
                    </Button>
                  </Popover>
                  <Dropdown
                      overlay={this.creatMenu(freezeMenu, 'freeze')}
                      trigger={['click']}
                      placement="bottomLeft"
                    >
                      <Button className="btn with-icon">
                        <Icon type="down" style={{}} />
                      </Button>
                    </Dropdown>
                  </ButtonGroup>
                </div>
              </div> */}
              </div>
            </div>
          </TabPane>
          <TabPane
            tab={<FormattedMessage id="report-designer.widgetcontrol" />}
            key="2"
            style={tabPanelStyle}
          >
            <div style={tabPanelStyle}></div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
