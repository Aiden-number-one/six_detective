(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[32],{"0qmb":function(e,t,n){"use strict";var a=n("tAuX"),r=n("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.Loading=E,t.TaskTable=O,t.FlowFrame=w,t.default=j,t.TaskDetailCharts=void 0,n("jCWc");var l=r(n("kPKH"));n("/zsF");var o=r(n("PArb"));n("14J3");var i=r(n("BMrR")),c=r(n("qIgq"));n("2qtc");var s=r(n("kLXV"));n("T2oS");var u=r(n("W9HT")),f=r(n("d6i3")),d=r(n("1l/V"));n("g9YV");var p=r(n("wCAj")),m=a(n("q1tI")),b=r(n("xKz9")),h=r(n("xcTF")),y=r(n("qGFu")),v=p.default.Column,g=(0,b.default)({loader:function(){var e=(0,d.default)(f.default.mark(function e(){return f.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.abrupt("return",Promise.all([n.e(66),n.e(67)]).then(n.t.bind(null,"povB",7)));case 1:case"end":return e.stop()}},e)}));function t(){return e.apply(this,arguments)}return t}()});function E(e){var t=e.visible,n=e.children;return m.default.createElement(u.default,{spinning:!!t},n)}function O(e){var t=e.loading,n=e.tasks;return m.default.createElement(p.default,{rowKey:"nodeName",dataSource:n,scroll:{x:"100%",y:400},pagination:!1,loading:t,defaultExpandAllRows:!0},m.default.createElement(v,{title:"\u8282\u70b9",ellipsis:!0,dataIndex:"nodeName",width:120}),m.default.createElement(v,{title:"\u4efb\u52a1\u540d\u79f0",ellipsis:!0,dataIndex:"jobname",width:150}),m.default.createElement(v,{title:"\u4efb\u52a1\u540d\u79f0",dataIndex:"memberTypeName",width:100}),m.default.createElement(v,{title:"\u5220\u9664",dataIndex:"deleteNum",width:50}),m.default.createElement(v,{title:"\u63d2\u5165",dataIndex:"insertNum",width:50}),m.default.createElement(v,{title:"\u5f00\u59cb\u65f6\u95f4",dataIndex:"startTime",width:150}),m.default.createElement(v,{title:"\u6267\u884c\u65f6\u957f",dataIndex:"zxsj",width:100}),m.default.createElement(v,{title:"\u6267\u884c\u72b6\u6001",dataIndex:"executeFlagName",width:100}),m.default.createElement(v,{ellipsis:!0,title:"\u6267\u884c\u4fe1\u606f(\u70b9\u51fb\u663e\u793a\u5168\u90e8\u4fe1\u606f)",dataIndex:"executeMsg",width:200,className:y.default.pointer,onCell:function(e){return{onClick:function(){var t=e.executeMsg.replace(/\n/g,"<br>").replace(/\t/g,"&nbsp;&nbsp;");s.default.warn({title:"\u67e5\u770b\u65e5\u5fd7",width:"60%",maxHeight:200,content:m.default.createElement("div",{dangerouslySetInnerHTML:{__html:t}})})}}}}))}function w(e){var t=e.visible,n=e.batch,a=e.onload;return m.default.createElement(E,{visible:t},m.default.createElement("iframe",{title:"flow chart",src:"http://10.60.69.69:9070/kweb/retl/monitor.html?jobId=".concat(n.jobId,"&batchNo=").concat(n.batchNo),frameBorder:"0",width:"100%",height:400,onLoad:a}))}function j(e){var t=e.loading,n=e.tasks,a=e.taskPoints,r=e.eachBatches,s=e.getTasks,u=(0,m.useState)(!0),f=(0,c.default)(u,2),d=f[0],p=f[1],b=(0,m.useState)(!1),v=(0,c.default)(b,2),j=v[0],x=v[1],k=(0,m.useState)(!0),P=(0,c.default)(k,2),C=P[0],S=P[1],N=(0,m.useState)({executeMsg:"-",nodeName:"-",memberNo:"-",batchNo:"-",errorNum:0,zxsjFormat:0,startTimeFormat:"-",endTimeFormat:"-",executeTypeName:"-"}),I=(0,c.default)(N,2),T=I[0],_=I[1];function q(e){_(e),s(e)}function F(){p(!d),d||S(!0)}return(0,m.useEffect)(function(){if(r.length>0){var e=(0,c.default)(r,1),t=e[0];_(t),s(t)}},[r]),m.default.createElement(m.default.Fragment,null,m.default.createElement(E,{visible:t["tm/queryEachBatch"]},m.default.createElement(i.default,{type:"flex",align:"middle"},m.default.createElement(h.default,{batch:T,taskPoints:a})),m.default.createElement(o.default,null),m.default.createElement(i.default,null,m.default.createElement(g,{dataSource:r,getEachBatch:q}))),m.default.createElement(o.default,null),m.default.createElement("div",{className:j?y.default.fullscreen:""},m.default.createElement(i.default,{style:{margin:"20px 0",fontSize:12}},m.default.createElement(l.default,{span:5},"\u4f5c\u4e1a\u6279\u6b21\uff1a",T.batchNo),m.default.createElement(l.default,{span:6},"\u5f00\u59cb\u65f6\u95f4\uff1a",T.startTimeFormat),m.default.createElement(l.default,{span:6},"\u7ed3\u675f\u65f6\u95f4\uff1a",T.endTimeFormat),m.default.createElement(l.default,{span:2},"\u9519\u8bef\u6570\uff1a",T.errorNum),m.default.createElement(l.default,{span:3},"\u6267\u884c\u7c7b\u578b\uff1a",T.executeTypeName),m.default.createElement(l.default,{span:2,align:"right"},m.default.createElement("a",{onClick:F},"\u5207\u6362"),m.default.createElement(o.default,{type:"vertical"}),m.default.createElement("a",{onClick:function(){return x(!j)}},"\u5168\u5c4f"))),d?m.default.createElement(O,{loading:t["tm/queryTasksOfJob"],tasks:n}):m.default.createElement(w,{visible:C,batch:T,onload:function(){return S(!1)}})))}t.TaskDetailCharts=g},"8txm":function(e,t,n){e.exports={"ant-steps":"ant-steps","ant-steps-item":"ant-steps-item","ant-steps-item-container":"ant-steps-item-container","ant-steps-item-content":"ant-steps-item-content","ant-steps-item-title":"ant-steps-item-title","ant-steps-item-tail":"ant-steps-item-tail","ant-steps-item-icon":"ant-steps-item-icon","ant-steps-icon":"ant-steps-icon","ant-steps-item-subtitle":"ant-steps-item-subtitle","ant-steps-item-description":"ant-steps-item-description","ant-steps-item-wait":"ant-steps-item-wait","ant-steps-icon-dot":"ant-steps-icon-dot","ant-steps-item-process":"ant-steps-item-process","ant-steps-item-finish":"ant-steps-item-finish","ant-steps-item-error":"ant-steps-item-error","ant-steps-next-error":"ant-steps-next-error","ant-steps-navigation":"ant-steps-navigation","ant-steps-item-active":"ant-steps-item-active","ant-steps-horizontal":"ant-steps-horizontal","ant-steps-label-vertical":"ant-steps-label-vertical","ant-steps-item-custom":"ant-steps-item-custom","ant-steps-vertical":"ant-steps-vertical","ant-steps-small":"ant-steps-small","ant-steps-label-horizontal":"ant-steps-label-horizontal","ant-steps-dot":"ant-steps-dot","ant-steps-flex-not-supported":"ant-steps-flex-not-supported"}},FJo9:function(e,t,n){"use strict";n.r(t);n("cIOH"),n("8txm")},L41K:function(e,t,n){"use strict";n.r(t);var a=n("q1tI"),r=n.n(a),l=n("17x9"),o=n.n(l),i=n("i8i4"),c=n("TSYQ"),s=n.n(c),u=n("sEfC"),f=n.n(u);function d(){if("undefined"!==typeof window&&window.document&&window.document.documentElement){var e=window.document.documentElement;return"flex"in e.style||"webkitFlex"in e.style||"Flex"in e.style||"msFlex"in e.style}return!1}function p(){return p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},p.apply(this,arguments)}function m(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function b(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?m(n,!0).forEach(function(t){P(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):m(n).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function h(e,t){if(null==e)return{};var n,a,r=y(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}function y(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}function v(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function g(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function E(e,t,n){return t&&g(e.prototype,t),n&&g(e,n),e}function O(e,t){return!t||"object"!==typeof t&&"function"!==typeof t?j(e):t}function w(e){return w=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},w(e)}function j(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function x(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&k(e,t)}function k(e,t){return k=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},k(e,t)}function P(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var C=function(e){function t(e){var n;return v(this,t),n=O(this,w(t).call(this,e)),P(j(n),"onStepClick",function(e){var t=n.props,a=t.onChange,r=t.current;a&&r!==e&&a(e)}),P(j(n),"calcStepOffsetWidth",function(){if(!d()){var e=n.state.lastStepOffsetWidth,t=Object(i["findDOMNode"])(j(n));t.children.length>0&&(n.calcTimeout&&clearTimeout(n.calcTimeout),n.calcTimeout=setTimeout(function(){var a=(t.lastChild.offsetWidth||0)+1;e===a||Math.abs(e-a)<=3||n.setState({lastStepOffsetWidth:a})}))}}),n.state={flexSupported:!0,lastStepOffsetWidth:0},n.calcStepOffsetWidth=f()(n.calcStepOffsetWidth,150),n}return x(t,e),E(t,[{key:"componentDidMount",value:function(){this.calcStepOffsetWidth(),d()||this.setState({flexSupported:!1})}},{key:"componentDidUpdate",value:function(){this.calcStepOffsetWidth()}},{key:"componentWillUnmount",value:function(){this.calcTimeout&&clearTimeout(this.calcTimeout),this.calcStepOffsetWidth&&this.calcStepOffsetWidth.cancel&&this.calcStepOffsetWidth.cancel()}},{key:"render",value:function(){var e,t=this,n=this.props,l=n.prefixCls,o=n.style,i=void 0===o?{}:o,c=n.className,u=n.children,f=n.direction,d=n.type,m=n.labelPlacement,y=n.iconPrefix,v=n.status,g=n.size,E=n.current,O=n.progressDot,w=n.initial,j=n.icons,x=n.onChange,k=h(n,["prefixCls","style","className","children","direction","type","labelPlacement","iconPrefix","status","size","current","progressDot","initial","icons","onChange"]),C="navigation"===d,S=this.state,N=S.lastStepOffsetWidth,I=S.flexSupported,T=r.a.Children.toArray(u).filter(function(e){return!!e}),_=T.length-1,q=O?"vertical":m,F=s()(l,"".concat(l,"-").concat(f),c,(e={},P(e,"".concat(l,"-").concat(g),g),P(e,"".concat(l,"-label-").concat(q),"horizontal"===f),P(e,"".concat(l,"-dot"),!!O),P(e,"".concat(l,"-navigation"),C),P(e,"".concat(l,"-flex-not-supported"),!I),e));return r.a.createElement("div",p({className:F,style:i},k),a["Children"].map(T,function(e,n){if(!e)return null;var r=w+n,o=b({stepNumber:"".concat(r+1),stepIndex:r,prefixCls:l,iconPrefix:y,wrapperStyle:i,progressDot:O,icons:j,onStepClick:x&&t.onStepClick},e.props);return I||"vertical"===f||(C?(o.itemWidth="".concat(100/(_+1),"%"),o.adjustMarginRight=0):n!==_&&(o.itemWidth="".concat(100/_,"%"),o.adjustMarginRight=-Math.round(N/_+1))),"error"===v&&n===E-1&&(o.className="".concat(l,"-next-error")),e.props.status||(o.status=r===E?v:r<E?"finish":"wait"),o.active=r===E,Object(a["cloneElement"])(e,o)}))}}]),t}(a["Component"]);function S(){return S=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},S.apply(this,arguments)}function N(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,a)}return n}function I(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?N(n,!0).forEach(function(t){B(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):N(n).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function T(e,t){if(null==e)return{};var n,a,r=_(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}function _(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}function q(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function F(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function M(e,t,n){return t&&F(e.prototype,t),n&&F(e,n),e}function D(e,t){return!t||"object"!==typeof t&&"function"!==typeof t?z(e):t}function W(e){return W=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},W(e)}function z(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function J(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&R(e,t)}function R(e,t){return R=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},R(e,t)}function B(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function A(e){return"string"===typeof e}P(C,"propTypes",{type:o.a.string,prefixCls:o.a.string,className:o.a.string,iconPrefix:o.a.string,direction:o.a.string,labelPlacement:o.a.string,children:o.a.any,status:o.a.string,size:o.a.string,progressDot:o.a.oneOfType([o.a.bool,o.a.func]),style:o.a.object,initial:o.a.number,current:o.a.number,icons:o.a.shape({finish:o.a.node,error:o.a.node}),onChange:o.a.func}),P(C,"defaultProps",{type:"default",prefixCls:"rc-steps",iconPrefix:"rc",direction:"horizontal",labelPlacement:"horizontal",initial:0,current:0,status:"process",size:"",progressDot:!1});var H=function(e){function t(){var e,n;q(this,t);for(var a=arguments.length,r=new Array(a),l=0;l<a;l++)r[l]=arguments[l];return n=D(this,(e=W(t)).call.apply(e,[this].concat(r))),B(z(n),"onClick",function(){var e=n.props,t=e.onClick,a=e.onStepClick,r=e.stepIndex;t&&t.apply(void 0,arguments),a(r)}),n}return J(t,e),M(t,[{key:"renderIconNode",value:function(){var e,t,n=this.props,a=n.prefixCls,l=n.progressDot,o=n.stepNumber,i=n.status,c=n.title,u=n.description,f=n.icon,d=n.iconPrefix,p=n.icons,m=s()("".concat(a,"-icon"),"".concat(d,"icon"),(e={},B(e,"".concat(d,"icon-").concat(f),f&&A(f)),B(e,"".concat(d,"icon-check"),!f&&"finish"===i&&p&&!p.finish),B(e,"".concat(d,"icon-close"),!f&&"error"===i&&p&&!p.error),e)),b=r.a.createElement("span",{className:"".concat(a,"-icon-dot")});return t=l?"function"===typeof l?r.a.createElement("span",{className:"".concat(a,"-icon")},l(b,{index:o-1,status:i,title:c,description:u})):r.a.createElement("span",{className:"".concat(a,"-icon")},b):f&&!A(f)?r.a.createElement("span",{className:"".concat(a,"-icon")},f):p&&p.finish&&"finish"===i?r.a.createElement("span",{className:"".concat(a,"-icon")},p.finish):p&&p.error&&"error"===i?r.a.createElement("span",{className:"".concat(a,"-icon")},p.error):f||"finish"===i||"error"===i?r.a.createElement("span",{className:m}):r.a.createElement("span",{className:"".concat(a,"-icon")},o),t}},{key:"render",value:function(){var e,t=this.props,n=t.className,a=t.prefixCls,l=t.style,o=t.itemWidth,i=t.active,c=t.status,u=void 0===c?"wait":c,f=(t.iconPrefix,t.icon),d=(t.wrapperStyle,t.adjustMarginRight),p=(t.stepNumber,t.disabled),m=t.description,b=t.title,h=t.subTitle,y=(t.progressDot,t.tailContent),v=(t.icons,t.stepIndex,t.onStepClick),g=t.onClick,E=T(t,["className","prefixCls","style","itemWidth","active","status","iconPrefix","icon","wrapperStyle","adjustMarginRight","stepNumber","disabled","description","title","subTitle","progressDot","tailContent","icons","stepIndex","onStepClick","onClick"]),O=s()("".concat(a,"-item"),"".concat(a,"-item-").concat(u),n,(e={},B(e,"".concat(a,"-item-custom"),f),B(e,"".concat(a,"-item-active"),i),B(e,"".concat(a,"-item-disabled"),!0===p),e)),w=I({},l);o&&(w.width=o),d&&(w.marginRight=d);var j={};return v&&!p&&(j.role="button",j.tabIndex=0,j.onClick=this.onClick),r.a.createElement("div",S({},E,{className:O,style:w}),r.a.createElement("div",S({onClick:g},j,{className:"".concat(a,"-item-container")}),r.a.createElement("div",{className:"".concat(a,"-item-tail")},y),r.a.createElement("div",{className:"".concat(a,"-item-icon")},this.renderIconNode()),r.a.createElement("div",{className:"".concat(a,"-item-content")},r.a.createElement("div",{className:"".concat(a,"-item-title")},b,h&&r.a.createElement("div",{title:h,className:"".concat(a,"-item-subtitle")},h)),m&&r.a.createElement("div",{className:"".concat(a,"-item-description")},m))))}}]),t}(r.a.Component);B(H,"propTypes",{className:o.a.string,prefixCls:o.a.string,style:o.a.object,wrapperStyle:o.a.object,itemWidth:o.a.oneOfType([o.a.number,o.a.string]),active:o.a.bool,disabled:o.a.bool,status:o.a.string,iconPrefix:o.a.string,icon:o.a.node,adjustMarginRight:o.a.oneOfType([o.a.number,o.a.string]),stepNumber:o.a.string,stepIndex:o.a.number,description:o.a.any,title:o.a.any,subTitle:o.a.any,progressDot:o.a.oneOfType([o.a.bool,o.a.func]),tailContent:o.a.any,icons:o.a.shape({finish:o.a.node,error:o.a.node}),onClick:o.a.func,onStepClick:o.a.func}),C.Step=H;var K=C,V=n("CtXQ"),X=n("wEI+");function L(e){return L="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},L(e)}function Y(){return Y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},Y.apply(this,arguments)}function G(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function Q(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function Z(e,t,n){return t&&Q(e.prototype,t),n&&Q(e,n),e}function U(e,t){return!t||"object"!==L(t)&&"function"!==typeof t?$(e):t}function $(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function ee(e){return ee=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},ee(e)}function te(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&ne(e,t)}function ne(e,t){return ne=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},ne(e,t)}n.d(t,"default",function(){return ae});var ae=function(e){function t(){var e;return G(this,t),e=U(this,ee(t).apply(this,arguments)),e.renderSteps=function(t){var n=t.getPrefixCls,r=n("steps",e.props.prefixCls),l=n("",e.props.iconPrefix),o={finish:a["createElement"](V["default"],{type:"check",className:"".concat(r,"-finish-icon")}),error:a["createElement"](V["default"],{type:"close",className:"".concat(r,"-error-icon")})};return a["createElement"](K,Y({icons:o},e.props,{prefixCls:r,iconPrefix:l}))},e}return te(t,e),Z(t,[{key:"render",value:function(){return a["createElement"](X["a"],null,this.renderSteps)}}]),t}(a["Component"]);ae.Step=K.Step,ae.defaultProps={current:0},ae.propTypes={prefixCls:l["string"],iconPrefix:l["string"],current:l["number"]}},N8ZD:function(e,t,n){"use strict";var a=n("tAuX"),r=n("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,n("T2oS");var l=r(n("W9HT"));n("14J3");var o=r(n("BMrR"));n("jCWc");var i=r(n("kPKH"));n("R9oj");var c=r(n("ECub")),s=a(n("q1tI")),u=n("MuoO"),f=r(n("lIJd")),d=r(n("0qmb")),p=r(n("qGFu"));function m(e){var t=e.dispatch,n=e.loading,a=e.jobs,r=e.tasks,u=e.taskPoints,m=e.eachBatches;function b(e){t({type:"tm/queryEachBatch",params:{jobId:e}})}function h(e){var n=e.jobId,a=e.batchNo;t({type:"tm/queryTasksOfJob",params:{jobId:n,batchNo:a}}),t({type:"tm/queryTaskPointsOfJob",params:{jobId:n}})}return(0,s.useEffect)(function(){t({type:"tm/queryJobs"})},[]),s.default.createElement("div",{className:p.default.container},s.default.createElement(l.default,{spinning:n["tm/queryJobs"]},!1===n["tm/queryJobs"]&&0===a.length?s.default.createElement(c.default,null):s.default.createElement(o.default,null,s.default.createElement(i.default,{span:5},s.default.createElement(f.default,{jobs:a,getJob:b})),s.default.createElement(i.default,{span:18,offset:1},s.default.createElement(d.default,{loading:n,tasks:r,taskPoints:u,eachBatches:m,getTasks:h})))))}var b=function(e){var t=e.loading,n=e.tm,a=n.jobs,r=n.tasks,l=n.taskPoints,o=n.eachBatches;return{loading:t.effects,jobs:a,tasks:r,taskPoints:l,eachBatches:o}},h=(0,u.connect)(b)(m);t.default=h},dMCj:function(e,t,n){"use strict";var a=n("tAuX"),r=n("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=P,n("2qtc");var l=r(n("kLXV"));n("+L6B");var o=r(n("2/Rp")),i=r(n("gWZ8")),c=r(n("qIgq"));n("7Kak");var s=r(n("9yH6"));n("y8nQ");var u=r(n("Vl3Y"));n("5NDa");var f=r(n("5rEg"));n("FJo9");var d=r(n("L41K"));n("g9YV");var p=r(n("wCAj"));n("OaEy");var m=r(n("2fM7")),b=a(n("q1tI")),h=m.default.Option,y=p.default.Column,v=d.default.Step,g=b.default.createContext();function E(e){var t=e.form,n=e.batch,a=e.visible,r=n.jobname,l=t.getFieldDecorator;return b.default.createElement(u.default,{labelCol:{span:5},wrapperCol:{span:16},style:{display:a?"block":"none"}},b.default.createElement(u.default.Item,{label:"\u4f5c\u4e1a\u6d41\u7a0b"},l("jobname",{initialValue:r,rules:[{required:!0,message:"Please input job name!"}]})(b.default.createElement(f.default,{disabled:!0}))),b.default.createElement(u.default.Item,{label:"\u662f\u5426\u5f3a\u5236\u6267\u884c"},l("isRequiredExcu",{initialValue:"1"})(b.default.createElement(s.default.Group,null,b.default.createElement(s.default,{value:"1"},"\u662f"),b.default.createElement(s.default,{value:"0"},"\u5426")))))}function O(e){var t=e.form,n=e.taskPoints,a=e.visible,r=e.getTaskIds,l=(0,b.useState)("1"),o=(0,c.default)(l,2),i=o[0],f=o[1],d=t.getFieldDecorator;function v(e){f(e.target.value)}function g(e){console.log(e)}return b.default.createElement(u.default,{labelCol:{span:5},wrapperCol:{span:16},style:{display:a?"block":"none"}},b.default.createElement(u.default.Item,{label:""},d("isPartialExcu",{initialValue:i})(b.default.createElement(s.default.Group,{onChange:v},b.default.createElement(s.default,{value:"1"},"\u4ece\u67d0\u70b9\u5f00\u59cb"),b.default.createElement(s.default,{value:"0"},"\u6267\u884c\u90e8\u5206\u4efb\u52a1")))),"1"===i&&b.default.createElement(u.default.Item,null,d("taskOption",{rules:[{required:!0,message:"Please select node name!"}]})(b.default.createElement(m.default,{placeholder:"Please select node name",onChange:g},n.map(function(e){var t=e.taskId,n=e.nodeName;return b.default.createElement(h,{value:t,key:t},n)})))),"0"===i&&b.default.createElement(p.default,{rowKey:"taskId",scroll:{y:220},dataSource:n,pagination:!1,rowSelection:{onChange:function(e){r(e)}}},b.default.createElement(y,{title:"\u8282\u70b9\u540d\u79f0",ellipsis:!0,dataIndex:"nodeName"}),b.default.createElement(y,{title:"\u4efb\u52a1\u540d\u79f0",ellipsis:!0,dataIndex:"taskName"}),b.default.createElement(y,{title:"\u4efb\u52a1\u7c7b\u578b",dataIndex:"taskType",width:80})))}function w(e){var t=e.editable,n=e.children,a=e.dataIndex,r=e.restProps;return b.default.createElement("td",r,t?b.default.createElement(g.Consumer,null,function(e){var t=e.getFieldDecorator;return b.default.createElement(u.default.Item,{style:{margin:0}},"title"===a&&t("envTitle",{rules:[{required:!0,message:"title is required."}]})(b.default.createElement(m.default,{placeholder:"please select title",style:{width:120}},b.default.createElement(h,{value:"aa"},"1231"),b.default.createElement(h,{value:"bb"},"789"))),"name"===a&&t("envName",{initialValue:"",rules:[{required:!0,message:"name is required."}]})(b.default.createElement(f.default,{placeholder:"please input name"})))}):n)}function j(e){var t=e.form,n=e.visible,a=e.taskIds,r=(0,b.useState)(1),l=(0,c.default)(r,2),s=l[0],u=l[1],f=(0,b.useState)([]),d=(0,c.default)(f,2),m=d[0],h=d[1];function v(){h([].concat((0,i.default)(m),[{no:s}])),u(s+1)}function E(){u(1),h([])}function O(e){var t=e.no;h(m.filter(function(e){return e.no!==t}))}function j(){t.validateFields(function(e,t){console.log(t),console.log(a)})}return b.default.createElement("div",{style:{display:n?"block":"none"}},b.default.createElement("div",null,b.default.createElement(o.default,{type:"primary",onClick:v},"\u65b0\u589e"),b.default.createElement(o.default,{type:"danger",onClick:E},"\u5220\u9664\u5168\u90e8")),b.default.createElement(g.Provider,{value:t},b.default.createElement(p.default,{rowKey:"no",dataSource:m,pagination:!1,scroll:{y:200},style:{margin:"20px 0"},components:{body:{cell:w}}},b.default.createElement(y,{title:"\u5e8f\u53f7",align:"center",dataIndex:"no",width:60}),b.default.createElement(y,{title:"\u540d\u79f0",align:"center",onCell:function(e){return{record:e,dataIndex:"title",editable:!0}}}),b.default.createElement(y,{title:"\u53d8\u91cf\u503c",align:"center",onCell:function(e){return{record:e,dataIndex:"name",editable:!0}}}),b.default.createElement(y,{title:"\u64cd\u4f5c",align:"center",width:80,dataIndex:"action",render:function(e,t){return b.default.createElement("a",{onClick:function(){return O(t)}},"\u5220\u9664")}}))),b.default.createElement(o.default,{type:"primary",onClick:j},"\u6267\u884c"))}function x(e){var t=e.step,n=e.batch,a=e.taskPoints,r=e.form,l=(0,b.useState)(""),o=(0,c.default)(l,2),i=o[0],s=o[1];function u(e){s(e)}return b.default.createElement(b.default.Fragment,null,b.default.createElement(E,{batch:n,form:r,visible:0===t}),b.default.createElement(O,{taskPoints:a,form:r,visible:1===t,getTaskIds:u}),b.default.createElement(j,{form:r,visible:2===t,taskIds:i}))}var k=u.default.create({name:"jobStep"})(x);function P(e){var t=e.visible,n=e.onCancelModal,a=e.batch,r=e.taskPoints,o=(0,b.useState)(0),i=(0,c.default)(o,2),s=i[0],u=i[1];function f(e){u(e)}return b.default.createElement(l.default,{title:"\u4f5c\u4e1a\u6267\u884c\u914d\u7f6e\u4fe1\u606f",visible:t,footer:null,onCancel:function(){return n(!1)}},b.default.createElement(d.default,{current:s,onChange:f,style:{marginBottom:24}},b.default.createElement(v,{title:"\u4f5c\u4e1a\u6279\u6b21"}),b.default.createElement(v,{title:"\u9009\u62e9\u4efb\u52a1"}),b.default.createElement(v,{title:"\u53d8\u91cf\u8bbe\u7f6e"})),b.default.createElement(k,{step:s,batch:a,taskPoints:r}))}},lIJd:function(e,t,n){"use strict";var a=n("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=f,n("Pwec");var r=a(n("CtXQ"));n("5NDa");var l=a(n("5rEg"));n("ozfa");var o=a(n("MJZm")),i=a(n("q1tI")),c=o.default.TreeNode,s=l.default.Search;function u(e){return e.map(function(e){var t=e.jobName,n=e.jobId,a=e.batchNo,l=e.type,o=e.name,s=e.color,f=e.icon,d=e.children;return d?i.default.createElement(c,{key:l,title:"".concat(o,"(").concat(d.length,")"),icon:i.default.createElement(r.default,{type:f,theme:"twoTone",twoToneColor:s})},u(d)):i.default.createElement(c,{key:n,title:t,jobId:n,batchNo:a,icon:i.default.createElement(r.default,{type:"folder",theme:"twoTone",twoToneColor:s})})})}function f(e){var t=e.jobs,n=e.getJob;function a(e,t){var a=t.node.props,r=a.jobId,l=a.batchNo;r&&n(r,l)}function l(e){var t=e.target.value;console.log(t)}return i.default.createElement(i.default.Fragment,null,i.default.createElement(s,{placeholder:"please input job name!",onChange:l}),i.default.createElement(o.default,{showIcon:!0,switcherIcon:i.default.createElement(r.default,{type:"down"}),onSelect:a,style:{maxHeight:800,overflowY:"auto"}},u(t)))}},qGFu:function(e,t,n){e.exports={container:"antd-pro-pages-job-monitor-index-container","chart-container":"antd-pro-pages-job-monitor-index-chart-container",pointer:"antd-pro-pages-job-monitor-index-pointer",fullscreen:"antd-pro-pages-job-monitor-index-fullscreen"}},xcTF:function(e,t,n){"use strict";var a=n("tAuX"),r=n("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=d,n("Pwec");var l=r(n("CtXQ"));n("14J3");var o=r(n("BMrR"));n("jCWc");var i=r(n("kPKH"));n("miYZ");var c=r(n("tsqr")),s=r(n("qIgq")),u=a(n("q1tI")),f=r(n("dMCj"));function d(e){var t=e.batch,n=e.taskPoints,a=(0,u.useState)(!1),r=(0,s.default)(a,2),d=r[0],p=r[1];function m(){t.jobId?p(!0):c.default.warn("please select one job first !!!")}return u.default.createElement(u.default.Fragment,null,u.default.createElement(f.default,{visible:d,taskPoints:n,batch:t,onCancelModal:function(){return p(!1)}}),u.default.createElement(i.default,{span:8},u.default.createElement(o.default,{type:"flex",align:"middle"},u.default.createElement(i.default,{span:12,align:"center"},t.executeMsg),u.default.createElement(i.default,{span:12},u.default.createElement(o.default,null,t.memberNo),u.default.createElement(o.default,null,t.nodeName)))),u.default.createElement(i.default,{span:8},u.default.createElement(o.default,{type:"flex",align:"middle"},u.default.createElement(i.default,{span:4},u.default.createElement(l.default,{type:"play-circle",theme:"filled",style:{fontSize:28,cursor:"pointer"},onClick:m})),u.default.createElement(i.default,{span:12},"\u65f6\u957f\uff1a",t.zxsjFormat))),u.default.createElement(i.default,{span:8},u.default.createElement(o.default,null,"\u5f00\u59cb\u65f6\u95f4\uff1a",t.startTimeFormat),u.default.createElement(o.default,null,"\u7ed3\u675f\u65f6\u95f4\uff1a",t.endTimeFormat)))}}}]);