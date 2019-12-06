/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable */
/*
 * Activiti Modeler component part of the Activiti project
 * Copyright 2005-2014 Alfresco Software, Ltd. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */

var KISBPM = KISBPM || {};

KISBPM.URL = {
  getModel: function(modelId) {
    //return ACTIVITI.CONFIG.contextRoot + '/model/' + modelId + '/json';
    return 'test.json';
  },
  getStencilSet: function() {
    //return ACTIVITI.CONFIG.contextRoot + '/editor/stencilset?version=' + Date.now();
    return 'editor-app/stencilset.json';
  },

  putModel: function(modelId) {
    return ACTIVITI.CONFIG.contextRoot + '/model/' + modelId + '/save';
  },
  getParams: function({ N, V, P, S }, isEncoder = true) {
    const NVPS = {
      N,
      V,
      P,
      S,
    };
    P.bcLangType = 'ZHCN';
    // debugger;
    if (isEncoder) {
      NVPS.P = BASE64.encoder(JSON.stringify(NVPS.P));
      return {
        param: {
          bcp: NVPS.P,
          s: NVPS.S,
        },
        header: this.getHeader(NVPS),
      };
    }
    // debugger;
    if (window.btoa) {
      NVPS.P = window.btoa(unescape(encodeURIComponent(JSON.stringify(NVPS.P))));
    }

    return {
      param: {
        bcp: NVPS.P,
        s: NVPS.S,
      },
      header: this.getHeader(NVPS),
    };
  },
  getHeader: function(NVPS) {
    const rid = `RID${uuidv1().replace(/-/g, '')}`;
    return {
      'X-Bc-S': (() => {
        const randowNVPS = this.getRandowNVPS();
        const signMode = randowNVPS.join('');
        let signText = '';
        randowNVPS.forEach(value => {
          signText += value + NVPS[value];
        });
        signText += `I${rid}`;
        return signMode + MD5(signText).toUpperCase();
      })(),
      'X-Bc-T': (() => {
        return  `BCT${localStorage.getItem('BCTID')}`;
      })(),
      'X-Bc-I': rid,
    };
  },
  //     getParams: function(a, v, p) {
  //         /*   var random = Math.floor(Math.random() * 10) % 3;
  //     if (random == 0) {
  //       return this.get16(a, v, p);
  //     } else if (random == 1) {
  //       return this.getK(a, v, p);
  //     } else {
  //       return this.getL(a, v, p);
  //     }
  // */
  //         var test_param = {};
  //         test_param.a = a;
  //         test_param.v = v;
  //         test_param.p = JSON.stringify(p);
  //         test_param.href = document.location.href;
  //         return test_param;
  //     },
 
  get16: function(a, v, p) {
    var pp = {};
    var _t = new Date().getTime() + '';
    var _p = JSON.stringify(p);
    pp._0x0111 = BASE64.encoder(_t);
    pp._0x1011 = BASE64.encoder(a);
    pp._0x1100 = BASE64.encoder(v);
    pp._0x1110 = BASE64.encoder(encodeURIComponent(_p));
    pp._0x1001 = MD5(pp._0x0111 + pp._0x1011 + pp._0x1100 + pp._0x1110).toUpperCase();
    pp._0x1101 = BASE64.encoder(document.location.href);
    return pp;
  }, //get16
  getK: function(a, v, p) {
    //_params.._version .. _timestamp .. _api_name
    var pp = {};
    var _t = new Date().getTime() + '';
    var _p = JSON.stringify(p);
    pp.KInGDOM = BASE64.encoder(_t);
    pp.KINGdOM = BASE64.encoder(a);
    pp.KINGDoM = BASE64.encoder(v);
    pp.KiNGDOM = BASE64.encoder(encodeURIComponent(_p));
    pp.kINGDOM = MD5(pp.KiNGDOM + pp.KINGDoM + pp.KInGDOM + pp.KINGdOM).toUpperCase();
    pp.KINgDOM = BASE64.encoder(document.location.href);
    pp.KINGDOm = BASE64.encoder(document.location.protocol);
    return pp;
  }, //getK
  getL: function(a, v, p) {
    var pp = {};
    var _t = new Date().getTime() + '';
    var _p = JSON.stringify(p);
    pp.css = BASE64.encoder(_t);
    pp.android = BASE64.encoder(a);
    pp.html = BASE64.encoder(v);
    pp.ios = BASE64.encoder(encodeURIComponent(_p));
    pp.js = MD5(pp.ios + pp.android + pp.css + pp.html).toUpperCase();
    pp.wp = BASE64.encoder(document.location.href);
    return pp;
  },
  getRandowNVPS: () => {
    var array = ['N', 'V', 'P', 'S'];
    var newArray = [];
    while (array.length > 0) {
      var random = Math.floor(Math.random() * array.length);
      newArray.push(array.splice(random, 1)[0]);
    }
    return newArray;
  },
  APPROVE: '_approve',
  AUDITINFO: '_auditinfo',
};
