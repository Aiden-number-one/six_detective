## table column filter

### file structure

`hooks.js --- separate state and func index.jsx --- component entry index.less --- component style FilterContent.jsx --- select,checkbox and so on`

### Get Started

1. import component and hooks

`import ColumnTitle, { useColumnFilter } from './ColumnTitle';`

2. use component

```js
const { handlePageChange, getTitleProps } = useColumnFilter({
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
type Fn = {
 column:string: Props;
}
let getTitleProps:Fn
```
