import { Base64 } from 'js-base64';
import request from '@/utils/request';

const API_PREFFIX = '/api';
const VERSION = 'v2.0';
const BUSINESS_PREFFIX = 'bayconnect.superlop';

export default function(url) {
  const S = new Date().getTime();
  const URL = `${API_PREFFIX}/${VERSION}/${BUSINESS_PREFFIX}.${url}.json`;

  return async (params = {}) => {
    const { method = 'POST', ...options } = params;

    // console.table({ bcLangType: 'ZHCN', ...options });

    const crypto = Base64.encode(JSON.stringify({ bcLangType: 'ZHCN', ...options }));

    const reqOptions = {
      method,
      body: { bcp: crypto, s: S },
    };
    const others = {
      N: `${BUSINESS_PREFFIX}.${url}`,
      V: VERSION,
      P: crypto,
      S,
    };
    return request(URL, reqOptions, others);
  };
}
