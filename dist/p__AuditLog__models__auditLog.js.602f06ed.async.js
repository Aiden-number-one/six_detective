(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[16],{UmWa:function(e,t,a){"use strict";var n=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(a("p0pE")),s=n(a("d6i3")),u=n(a("ywRk")),d=u.default.getAuditLog,o={namespace:"auditLog",state:{data:[]},effects:{getAuditLogList:s.default.mark(function e(t,a){var n,r,u,o;return s.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.payload,r=a.call,u=a.put,e.next=4,r(d,{param:n});case 4:if(o=e.sent,"1"!==o.bcjson.flag){e.next=9;break}if(!o.bcjson.items){e.next=9;break}return e.next=9,u({type:"getDatas",payload:o.bcjson});case 9:case"end":return e.stop()}},e)})},reducers:{getDatas:function(e,t){return(0,r.default)({},e,{data:t.payload})}}},c=o;t.default=c}}]);