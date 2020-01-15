## table column filter

### file structure

`hooks.js --- separate state and func index.jsx --- component entry index.less --- component style FilterContent.jsx --- select,checkbox and so on`

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
