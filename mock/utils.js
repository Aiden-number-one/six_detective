export function mp(name) {
  return `POST /mockapi/v2.0/bayconnect.superlop.${name}.json`;
}

export function baseRes(res) {
  return {
    bcjson: {
      flag: '1',
      items: res,
    },
  };
}
