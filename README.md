<!--
 * @Des: Please Modify First
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-10-31 16:15:52
 * @LastEditors: iron
 * @LastEditTime: 2019-11-28 17:59:29
 -->

# Super LOP Web

## Environment Prepare

Install `node_modules`:

```bash
npm install --registry=https://registry.npm.taobao.org
```

or

```bash
yarn
```

## Provided Scripts

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```

### Requset Tips

1. common response data

```javascript
// ...code
+flag === 1 ? { items } : { msg: msg || 'response data error' };

// model
const { items, msg } = yield call(/* url */,/* params */)
```

2. unified error handle, just deal with status code

```javascript
function errorHandler(error) {
  const { response } = error;

  if (response.status) {
    const { status, statusText, url } = response;
    const errorText = codeMessage[status] || statusText;
    notification.error({
      message: errorText,
      description: `request error ${status}: ${/[^/]*\.json/.exec(url)}`,
    });
  }
  return response;
}
```

3. **model** error capture by manual

```javascript
*queryOrgs({params},{call,put}){
  // ...code
  throw new Error(/* error message*/)
}

```

```javascript
export const dva = {
  config: {
    onError(e) {
      // if it's comment,component can not capture error
      e.preventDefault();
      notification.error({
        message: 'oops error!!!',
        description: e.toString(),
      });
    },
  },
};
```

4. async request error capture in component

```javascript
*queryOrgs(action, { call, put }) {
  // ...code
  return Promise.reject(/* error message*/)
}
```

```javascript
dispatch({
  type:'queryOrgs'
  params: // {...}
}).catch(err=>{
  // receive err message
})
```

## abbreviation list
- LOP: Large Open Positions
- BI: Beneficial Identity
- TO: Transaction Originator
- ECP: Electronic Communication Platform
- EP: Exchange Participant
- CA: Capital
