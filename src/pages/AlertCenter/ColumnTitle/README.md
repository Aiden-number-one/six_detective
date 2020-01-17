<!--
 * @Des: Please Modify First
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2020-01-14 19:02:43
 * @LastEditors  : iron
 * @LastEditTime : 2020-01-17 21:29:04
 -->

## table column filter

### file structure

```hooks.js --- separate state and func
index.jsx --- component entry
index.less --- component style
FilterContent.jsx --- select,checkbox and so on
```

### Get Started

1. import component and hooks

`import ColumnTitle, { actionType,useColumnFilter } from './ColumnTitle';`

2. use component

```js
const { clearFilter, fetchTableList, handlePageChange, getTitleProps } = useColumnFilter({
  dispatch,
  action: string,
  page: number|string,
  pageSize: number|string,
  reset?: Function,
});

<Table {...porps}>
 <Column
    dataIndex="userName"
    title={
      <ColumnTitle {...getTitleProps('userName')}>
        <FormattedMessage id="alert-center.owner" />
      </ColumnTitle>
    }
  />
</Table>
```

### MODEL (request)

- 'global/fetchTableFilterItems'
- 'global/fetchTableList'
- state

```
{
  filterItems: [],
  filterTables: [],
  filterTableTotal: 0,
  filterTalbePage: defaultPage,
  filterTalbePageSize: defaultPageSize,
  filterParams: {},
}
```

### API

- fetchTableList

```typescript
type Params = {
  page: string | number;
  pageSize: string | number;
  conditions: Array<{ column: string; value: string; condition: Condition }>;
  currentColumn: string;
  sort: '' | '0' | '1';
  isReset: boolean;
};

type fetchTableList = {
  (params?: Params, tableName?: string): void;
};
```

- handlePageChange

```typescript
type handlePageChange = {
  (page: string, pageSize: string): void;
};
```

- getTitleProps

```typescript
enum Condition = {
  'EQUAL'=1,
  'NOT EQUAL',
  'GREATER THAN',
  'GREATER THAN OR EQUAL',
  'LESS THAN',
  'LESS THAN OR EQUAL',
  'CONTAIN',
  'LIKE'
}

type Props = {
  curColumn: string,
  conditions:Array<{ column: string, value: string, condition: Condition }>,
  tableName:string,
  sort: ''|'0'|'1',
  onCommit: Function,
  onSort: Function,
}
type getTitleProps = {
 column?:string: Props;
}
```
