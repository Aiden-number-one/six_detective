(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[4],{si9C:function(e,a,s){"use strict";var r=s("g09b");Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var t=r(s("p0pE")),n=r(s("d6i3"));s("miYZ");var c=r(s("tsqr")),l=r(s("ywRk")),i=l.default.getClassifyTree,u=function e(a){var s=[];return a.forEach(function(a){a.children&&(a.children=e(a.children));var r={key:a.classId,value:a.classId,title:a.className,children:a.children};s.push(r)}),s},f={namespace:"getClassifyTree",state:{classifyTree:[]},effects:{getClassifyTree:n.default.mark(function e(a,s){var r,t,l,f,d;return n.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=a.payload,t=s.call,l=s.put,e.next=4,t(i,{param:r});case 4:if(f=e.sent,!f||"1"!==f.bcjson.flag){e.next=11;break}return d=u(f.bcjson.items),e.next=9,l({type:"setClassifyTree",payload:d});case 9:e.next=12;break;case 11:c.default.error(f.bcjson.msg.substring(0,1e3));case 12:case"end":return e.stop()}},e)})},reducers:{setClassifyTree:function(e,a){return(0,t.default)({},e,{classifyTree:a.payload})}}};a.default=f}}]);