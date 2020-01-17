/* eslint-disable max-len */
import React, { Component } from 'react';
import { connect } from 'dva';
import { SketchPicker } from 'react-color';
import classNames from 'classnames';
import { Button, Select, Menu, Icon, Dropdown, Popover, Upload, message } from 'antd';
import { convertXml } from '../SpreadSheet/spreadSheetUtil';
import { borderMenu } from './menu';
import { fontSizeSelect, fontFamilySelect } from './select';
import { getColIndexRowIndex, setCellTypeAndValue } from '../../utils';
import CustomizeIcon from '../CustomizeIcon';
import styles from './index.less';
import IconFont from '@/components/IconFont';

const { Option } = Select;
const ButtonGroup = Button.Group;

@connect(({ reportDesigner }) => ({
  showFmlModal: reportDesigner.showFmlModal,
  showHylModal: reportDesigner.showHylModal,
  cellPosition: reportDesigner.cellPosition,
  reportId: reportDesigner.reportId,
  paging: reportDesigner.paging,
}))
class ToolBar extends Component {
  state = {
    // 默认白色背景
    backgroundColor: 'rgb(255, 255, 255)',
    // 默认黑色字体
    fontColor: 'rgb(0, 0, 0)',
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
      label: 'General',
      key: 'text',
      value: 'text',
    },
    {
      label: 'Number',
      key: 'numeric',
      value: 'numeric',
    },
    {
      label: 'Percentage',
      key: 'percentage',
      value: 'percentage',
    },
    {
      label: 'Date',
      key: 'dateyyyy-MM-dd',
      value: 'dateyyyy-MM-dd',
    },
    {
      label: 'Currency￥',
      key: 'currency￥',
      value: 'currency￥',
    },
    /* {
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
      label: '货币($)',
      key: 'currency$',
      value: 'currency$',
    },
    {
      label: '千分比',
      key: 'permillage',
      value: 'permillage',
    },
    {
      label: '勾选框',
      key: 'checkbox',
      value: 'checkbox',
    }, */
  ];

  // *** 每项中的 label 对应 this.cellType 中的 value ***
  cellTypeMap = {
    'dateyyyy-MM-dd': {
      cellType: 'date',
      format: 'yyyy-MM-dd',
      type: 'date',
      label: 'dateyyyy-MM-dd',
    },
    text: {
      cellType: 'text',
      label: 'text',
    },
    numeric: {
      cellType: 'numeric',
      format: '123',
      label: 'numeric',
    },
    percentage: {
      cellType: 'numeric',
      format: '0.00%',
      scale: '2',
      type: 'percentage',
      label: 'percentage',
    },
    'currency￥': {
      cellType: 'numeric',
      format: '￥0,0.00',
      scale: '2',
      type: 'currency',
      label: 'currency￥',
    },
    /* 'datetimeyyyy-MM-dd hh:mm:ss': {
      cellType: 'datetime',
      format: 'yyyy-MM-dd hh:mm:ss',
      type: 'datetime',
    },
    'timehh:mm:ss': {
      cellType: 'time',
      format: 'hh:mm:ss',
      type: 'time',
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
    checkbox: {
      cellType: 'checkbox',
    }, */
  };

  componentDidMount() {
    const { setCellCallback } = this.props;
    const { btnActiveStatus } = this.state;
    setCellCallback(
      data => {
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
          backgroundColor:
            cellStyle.bgcolor === '#ffffff' ? 'rgb(255, 255, 255)' : cellStyle.bgcolor,
          fontColor: cellStyle.color === '#0a0a0a' ? 'rgb(0, 0, 0)' : cellStyle.color,
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
          },
          cellType,
        });
      },
      paintformatActive => {
        this.setState({
          paintformatActive,
        });
      },
    );
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
    if (type === 'eraser') {
      return (
        <Menu>
          {[
            {
              name: 'Clear Style',
              params: 'clearStyle',
            },
            {
              name: 'Clear Content',
              params: 'clearContent',
            },
            {
              name: 'Clear All',
              params: 'clearAll',
            },
          ].map(({ name, params }) => (
            <Menu.Item
              key={name}
              onClick={() => {
                const { cellPosition, dispatch } = this.props;
                if (params === 'clearStyle') {
                  setCellStyle('clearformat');
                }
                if (params === 'clearContent') {
                  setCellTypeAndValue({
                    value: '',
                    cellPosition,
                  });
                  // setCellStyle('clearContent');
                }
                if (params === 'clearAll') {
                  setCellStyle('clearformat');
                  setCellTypeAndValue({
                    value: '',
                    type: 'text',
                    cellPosition,
                  });
                  dispatch({
                    type: 'reportDesigner/modifyTemplateArea',
                    deleteAll: true,
                  });
                }
              }}
            >
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

  // 小数位递增/递减
  inOrDecreaseDecimal = action => {
    const { cellPosition, setCellType } = this.props;
    const [ri, ci] = getColIndexRowIndex(cellPosition);
    // eslint-disable-next-line no-underscore-dangle
    const cell = window.xsObj._getCell({ ri, ci });
    let tail = 0;
    if (cell && cell.cellProps && cell.cellProps.scale) {
      tail = parseInt(cell.cellProps.scale, 10); // 替换为旧值
    }

    if (action === 'increase') {
      // 递增
      tail += 1;
    } else {
      // 递减
      tail = tail >= 1 ? tail - 1 : 0;
    }
    // 设置
    setCellType('cellType', {
      cellType: 'numeric',
      format: '100.00',
      scale: `${tail}`,
    });
    // console.log('inOrDecreaseDecimal -> ', action, cell, tail);
  };

  // 上传文件
  importFileStatus = async info => {
    if (info.file.status === 'done') {
      const { dispatch } = this.props;
      const url = info.file.response.bcjson.items.relativeUrl;
      // 得到解析到的JSON串
      const reportDefinition = await dispatch({
        type: 'reportDesigner/importExcel',
        payload: {
          filePath: url,
        },
      });
      if (reportDefinition) {
        const spreadSheetObj = convertXml(JSON.parse(reportDefinition));
        window.xsObj.instanceArray[window.xsObj.instanceArray.length - 1].data.setData(
          spreadSheetObj,
        );
        setTimeout(() => {
          window.xsObj.instanceArray[0].sheet.toolbar.change();
        }, 100);
      }
    } else if (info.file.status === 'error') {
      message.infp(`${info.file.name} file upload failed.`);
    }
  };

  // 显示超链接|公式处理面板
  displayHandlerModal = (type, snappet) => {
    const { dispatch } = this.props;
    dispatch({
      type: `reportDesigner/${snappet}`,
      payload: { [type]: true },
    });
  };

  render() {
    const {
      setCellStyle,
      setCellType,
      changeDisplaySearchArea,
      displayArea,
      reportId,
      paging,
    } = this.props;
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
      <>
        <div className={classNames(styles.tabs, 'card-container')}>
          <div style={tabPanelStyle}>
            <div className={styles.group}>
              <Button
                className={classNames('btn', 'btn2Report', 'mr6')}
                onClick={() => {
                  if (!reportId) {
                    message.warn('Please save the report template.');
                    return;
                  }
                  window.open(
                    `/report-designer-preview?reportId=${reportId}&paging=${paging ? '1' : '0'}`,
                  );
                }}
              >
                <div className={styles.topBottom}>
                  <IconFont type="iconicon_previrew" />
                  <p>Preview</p>
                </div>
              </Button>
              <Upload
                accept=".xlsx, .xls"
                onChange={info => this.importFileStatus(info)}
                action="/upload"
              >
                <Button className={classNames('btn', 'btn2Report', 'mr6')}>
                  <div className={styles.topBottom}>
                    <IconFont type="icondaoru" />
                    <p>Import</p>
                  </div>
                </Button>
              </Upload>
            </div>
            <div className={styles.group}>
              {/* </Upload> */}
              <Button
                className={classNames('btn', 'btn2Report', 'mr6', displayArea && 'active')}
                onClick={changeDisplaySearchArea}
              >
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
              <Button
                className={classNames('btn', 'btn2Report', 'mr6', paintformatActive && 'active')}
              >
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
                  style={{ width: '140px', borderRight: 0 }}
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
                <Popover content="Increase Font Size" {...popoverProps}>
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
                </Popover>
                <Popover content="Decrease Font Size" {...popoverProps}>
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
                </Popover>
              </div>
              <div>
                <Popover content="Bold" {...popoverProps}>
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
                </Popover>
                <Popover content="Italic" {...popoverProps}>
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
                </Popover>
                <Popover content="Underline" {...popoverProps}>
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
                    <IconFont type="iconxiahuaxian1" />
                  </Button>
                </Popover>
                <Popover content="All Borders" {...popoverProps}>
                  <ButtonGroup className="btn-group mr6">
                    <Button className="btn" onClick={() => {}}>
                      <IconFont type="iconborder-none-solid" />
                    </Button>
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
                </Popover>
                <Popover content="Fill Color" {...popoverProps}>
                  <ButtonGroup className="btn-group mr6">
                    <Button
                      className="btn"
                      onClick={() => {
                        setCellStyle('bgcolor', backgroundColor);
                      }}
                      style={{
                        borderBottom: `3px solid ${backgroundColor}`,
                      }}
                    >
                      <IconFont style={{ fontSize: 16 }} type="iconiconic_format_color_fill1" />
                    </Button>
                    <Dropdown
                      overlay={
                        <SketchPicker
                          color={backgroundColor}
                          onChange={value => {
                            this.setState({
                              backgroundColor: `rgb(${value.rgb.r},${value.rgb.g},${value.rgb.b})`,
                            });
                            setCellStyle(
                              'bgcolor',
                              `rgb(${value.rgb.r},${value.rgb.g},${value.rgb.b})`,
                            );
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
                </Popover>
                <Popover content="Fill Color" {...popoverProps}>
                  <ButtonGroup className="btn-group mr6">
                    <Button
                      className="btn"
                      onClick={() => {
                        setCellStyle('color', fontColor);
                      }}
                      style={{
                        borderBottom: `3px solid ${fontColor}`,
                      }}
                    >
                      <IconFont style={{ fontSize: 12 }} type="iconiconic_format_color_text_px1" />
                    </Button>
                    <Dropdown
                      overlay={
                        <SketchPicker
                          color={fontColor}
                          onChange={value => {
                            this.setState({
                              fontColor: `rgb(${value.rgb.r},${value.rgb.g},${value.rgb.b})`,
                            });
                            setCellStyle(
                              'color',
                              `rgb(${value.rgb.r},${value.rgb.g},${value.rgb.b})`,
                            );
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
                </Popover>
                <Popover content="Clear" {...popoverProps}>
                  <ButtonGroup className="btn-group mr6">
                    <Button className="btn">
                      <IconFont type="iconeraser-ps" />
                    </Button>
                    <Dropdown
                      overlay={this.creatMenu(borderMenu, 'eraser')}
                      trigger={['click']}
                      placement="bottomLeft"
                    >
                      <Button className="btn with-icon">
                        <Icon type="caret-down" />
                      </Button>
                    </Dropdown>
                  </ButtonGroup>
                </Popover>
              </div>
            </div>
            <div className={styles.divider} />
            <div className={classNames(styles.group, styles.iconGroup)}>
              <div className="mb4">
                <Popover content="Top Align" {...popoverProps}>
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
                </Popover>
                <Popover content="Middle Align" {...popoverProps}>
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
                </Popover>
                <Popover content="Bottom Align" {...popoverProps}>
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
                </Popover>
              </div>
              <div>
                <Popover content="Align Text Left" {...popoverProps}>
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
                </Popover>
                <Popover content="Center" {...popoverProps}>
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
                </Popover>
                <Popover content="Align Text Right" {...popoverProps}>
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
                </Popover>
              </div>
            </div>
            <div className={styles.divider} />
            <div className={styles.group}>
              <Popover content="Merge and Center" {...popoverProps}>
                <Button
                  className={classNames(
                    'btn',
                    'btn2Report',
                    'mr6',
                    btnActiveStatus.isMerge && 'active',
                  )}
                  onClick={() => {
                    setCellStyle('merge', true);
                    setCellStyle('align', 'center');
                  }}
                >
                  <div className={classNames(styles.topBottom)}>
                    <IconFont type="iconhuanhang" />
                    <p className={styles.brP}>
                      <span>Merge and</span>
                      <br />
                      <span>center</span>
                    </p>
                  </div>
                </Button>
              </Popover>
              <Popover content="Wrap Text" {...popoverProps}>
                <Button
                  className={classNames(
                    'btn',
                    'btn2Report',
                    'mr6',
                    btnActiveStatus.autoLineBreak && 'active',
                  )}
                >
                  <div
                    className={classNames(styles.topBottom)}
                    onClick={() => {
                      setCellStyle('textwrap', !btnActiveStatus.autoLineBreak);
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
              </Popover>
            </div>
            <div className={styles.divider} />
            <div className={styles.group}>
              <div className="mb4">
                <Popover content="Format" {...popoverProps}>
                  <Select
                    className="select"
                    style={{ width: '139px' }}
                    suffixIcon={<Icon type="caret-down" />}
                    value={cellType.label ? cellType.label : 'text'}
                    size="small"
                    onChange={value => {
                      this.setState({
                        cellType: { label: value },
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
                <Popover content="Currency" {...popoverProps}>
                  <Button
                    className="btn mr6"
                    onClick={() => setCellType('cellType', this.cellTypeMap['currency￥'])}
                  >
                    <IconFont type="iconrenminbi" />
                  </Button>
                </Popover>
                <Popover content="Percent Style" {...popoverProps}>
                  <Button
                    className="btn mr6"
                    onClick={() => setCellType('cellType', this.cellTypeMap.percentage)}
                  >
                    <IconFont type="iconpercent-solid" />
                  </Button>
                </Popover>
                {/* 格式化为三位一逗号 */}
                <Popover content="Comma Style" {...popoverProps}>
                  <Button
                    className="btn mr6"
                    onClick={() =>
                      setCellType('cellType', {
                        cellType: 'numeric',
                        format: '1,000.00',
                        scale: '2',
                      })
                    }
                  >
                    <IconFont type="icon_commastylex" />
                  </Button>
                </Popover>
                <Popover content="Increase Decimal" {...popoverProps}>
                  <Button className="btn mr6" onClick={() => this.inOrDecreaseDecimal('increase')}>
                    <IconFont type="icon_increasedecimalx" />
                  </Button>
                </Popover>
                <Popover content="Decrease Decimal" {...popoverProps}>
                  <Button className="btn mr6" onClick={() => this.inOrDecreaseDecimal('decrease')}>
                    <IconFont type="icon_decreasedecimalx" />
                  </Button>
                </Popover>
              </div>
            </div>
            <div className={styles.divider} style={{ marginLeft: 12 }} />
            {/* <div className={styles.group}>
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
            </div> */}
            <div className={styles.group}>
              <Button
                className={classNames(
                  'btn',
                  'btn2Report',
                  'mr6',
                  // this.props.formatPainter && 'active',
                )}
                onClick={() => this.displayHandlerModal('showHylModal', 'triggerHylModal')}
              >
                <div className={styles.topBottom}>
                  <IconFont type="iconlianjie" />
                  <p>Link</p>
                </div>
              </Button>
              {/* <Button
                className={classNames(
                  'btn',
                  'btn2Report',
                  'mr6',
                  this.props.formatPainter && 'active',
                )}
              >
                <div className={styles.topBottom}>
                  <IconFont type="iconfreeze" />
                  <p>Freeze</p>
                </div>
              </Button>
              <Button
                className={classNames(
                  'btn',
                  'btn2Report',
                  'mr6',
                  this.props.formatPainter && 'active',
                )}
              >
                <div className={styles.topBottom}>
                  <IconFont type="iconfilesearch" />
                  <p>Picture</p>
                </div>
              </Button> */}
              <Button
                className={classNames(
                  'btn',
                  'btn2Report',
                  'mr6',
                  // this.props.formatPainter && 'active',
                )}
                onClick={() => this.displayHandlerModal('showFmlModal', 'triggerFmlModal')}
              >
                <div className={styles.topBottom}>
                  <IconFont type="icon_function" />
                  <p>Function</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ToolBar;
