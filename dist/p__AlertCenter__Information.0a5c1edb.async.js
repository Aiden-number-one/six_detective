(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[8],{"18SL":function(e,t,a){"use strict";var n=a("g09b"),l=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=l(a("q1tI")),d=a("MuoO"),i=a("Hx5s"),u=n(a("OUdU")),o=n(a("H7wn"));function c(e){var t=e.dispatch,a=e.loading,n=e.informations,l=void 0===n?[]:n;return(0,r.useEffect)(function(){t({type:"alertCenter/fetch"})},[]),r.default.createElement(i.PageHeaderWrapper,null,r.default.createElement("div",{className:o.default["list-container"]},r.default.createElement(u.default,{dataSource:l,loading:a["alertCenter/fetch"]})))}var f=(0,d.connect)(function(e){var t=e.loading,a=e.alertCenter.informations;return{informations:a,loading:t.effects}})(c);t.default=f},OUdU:function(e,t,a){"use strict";var n=a("tAuX"),l=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=v,a("14J3");var r=l(a("BMrR"));a("jCWc");var d=l(a("kPKH"));a("+L6B");var i=l(a("2/Rp")),u=l(a("qIgq"));a("g9YV");var o=l(a("wCAj")),c=n(a("q1tI")),f=l(a("mOP9")),m=a("LLXN"),s=l(a("BN5G")),g=l(a("S58F")),E=l(a("H7wn")),p=o.default.Column;function v(e){var t=e.dataSource,a=e.loading,n=e.getInfomation,l=(0,c.useState)([]),v=(0,u.default)(l,2),b=v[0],w=v[1];return c.default.createElement("div",{className:E.default.list},c.default.createElement(r.default,{className:E.default.btns},c.default.createElement(d.default,{span:18},c.default.createElement(i.default,{disabled:!b.length},c.default.createElement(s.default,{type:"iconbatch-export",className:E.default["btn-icon"]}),c.default.createElement(m.FormattedMessage,{id:"alert-center.export"}))),c.default.createElement(d.default,{span:6,align:"right"},c.default.createElement(i.default,{type:"link"},c.default.createElement(f.default,{to:"/alert-center"},"Alert Center")))),c.default.createElement(o.default,{border:!0,dataSource:t,rowKey:"informationNo",loading:a,rowSelection:{onChange:function(e){w(e)}},onRow:function(e){return{onClick:function(){n(e)}}}},c.default.createElement(p,{ellipsis:!0,width:150,dataIndex:"informationNo",title:c.default.createElement(g.default,null,c.default.createElement(m.FormattedMessage,{id:"alert-center.information-no"}))}),c.default.createElement(p,{align:"center",dataIndex:"informationType",title:c.default.createElement(g.default,null,c.default.createElement(m.FormattedMessage,{id:"alert-center.information-type"}))}),c.default.createElement(p,{align:"center",dataIndex:"timestamp",title:c.default.createElement(m.FormattedMessage,{id:"alert-center.information-timestamp"})}),c.default.createElement(p,{align:"center",dataIndex:"market",title:c.default.createElement(m.FormattedMessage,{id:"alert-center.market"})}),c.default.createElement(p,{align:"center",dataIndex:"submitterCode",title:c.default.createElement(m.FormattedMessage,{id:"data-import.lop.submitter-code"})}),c.default.createElement(p,{align:"center",dataIndex:"submitterName",title:c.default.createElement(m.FormattedMessage,{id:"data-import.lop.submitter-name"})})))}}}]);