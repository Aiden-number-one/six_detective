import React, { Component, Fragment } from 'react';
import { Form } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';

import SearchForm from './components/SearchForm';

const NewSearchForm = Form.create({})(SearchForm);

@connect(({ menuUserGroup, loading }) => ({
  loading: loading.effects,
  menuUserGroup: menuUserGroup.data,
}))
class MenuUserGroup extends Component {
  constructor() {
    super();
    this.sate = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const params = {};
    dispatch({
      type: 'menuUserGroup/getMenuUserGroup',
      payload: params,
    });
  }

  render() {
    return (
      <Fragment>
        <PageHeaderWrapper>
          <NewSearchForm
            search={this.queryLog}
            newUser={this.newUser}
            ref={this.searchForm}
          ></NewSearchForm>
        </PageHeaderWrapper>
      </Fragment>
    );
  }
}

export default MenuUserGroup;
