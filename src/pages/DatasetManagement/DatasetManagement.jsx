import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import // Tree,
'antd';
import ClassifyTree from '@/components/ClassifyTree';
// import styles from './DatasetManagement.less';

// const { TreeNode } = Tree;

@connect(({ dataSet }) => ({
  classifyTreeData: dataSet.classifyTreeData,
}))
export default class DatasetManagement extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSet/getClassifyTree',
    });
  }

  render() {
    const { classifyTreeData } = this.props;
    return (
      <PageHeaderWrapper>
        <div>
          <ClassifyTree
            treeData={classifyTreeData}
            treeKey={{
              currentKey: 'departmentId',
              currentName: 'departmentName',
              parentKey: 'parentDepartmentId',
            }}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}
