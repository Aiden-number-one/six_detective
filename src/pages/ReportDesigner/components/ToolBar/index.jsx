/* eslint-disable max-len */
import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import IconFont from '@/components/IconFont';
import StartMenu from './StartMenu';
import InsertMenu from './InsertMenu';

export default class ToolBar extends Component {
  state = {
    tabActive: 'Start',
  };

  setTabActive = tabActive => {
    this.setState({
      tabActive,
    });
  };

  render() {
    const { tabActive } = this.state;
    return (
      <>
        <div className={classNames(styles.switchTabs)}>
          <div className={styles.leftBlock} />
          <div className={styles.middleBlock}>
            <div className={styles.nameSpace}>
              <IconFont type="iconcengji-copy" />
              <span className={styles.inputName}>Untitled</span>
            </div>
            <div className={styles.tabsName}>
              <div
                onClick={() => {
                  this.setTabActive('Start');
                }}
                className={classNames(styles.tabButt, tabActive === 'Start' && styles.active)}
              >
                Start
              </div>
              <div
                onClick={() => {
                  this.setTabActive('Insert');
                }}
                className={classNames(styles.tabButt, tabActive === 'Insert' && styles.active)}
              >
                Insert
              </div>
            </div>
            <div className={styles.tabsAreaAction}>
              <div className={styles.actionButt}>
                <IconFont type="iconicon_previrew" />
                <span>Preview</span>
              </div>
              <div className={styles.actionButt}>
                <IconFont type="iconicon_previrew" />
                <span>Share</span>
              </div>
              <div className={styles.actionButt}>
                <IconFont type="iconicon_previrew" />
                <span>Save</span>
              </div>
            </div>
          </div>
          <div className={styles.rightBlock} />
        </div>
        <div style={{ display: tabActive === 'Start' ? 'block' : 'none' }}>
          <StartMenu {...this.props} />
        </div>
        <div style={{ display: tabActive === 'Insert' ? 'block' : 'none' }}>
          <InsertMenu />
        </div>
      </>
    );
  }
}
