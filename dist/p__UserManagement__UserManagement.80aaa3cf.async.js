(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[69],{F6Wx:function(e,t,a){"use strict";var r=a("tAuX"),s=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("y8nQ");var l=s(a("Vl3Y"));a("5NDa");var n=s(a("5rEg")),u=s(a("2Taf")),o=s(a("vZ4D")),d=s(a("l4Ni")),i=s(a("ujKo")),c=s(a("MhPg"));a("nRaC");var m=s(a("5RzL")),f=r(a("q1tI")),p=a("LLXN"),g=s(a("qB6u")),h=m.default.TreeNode;function v(e){return e.map(function(e){var t=e.children,a=e.departmentId,r=e.departmentName,s=e.parentDepartmentId;return t?f.default.createElement(h,{key:a,departmentId:a,value:r,title:r,parentId:s},v(t)):f.default.createElement(h,{key:a,departmentId:a,value:r,title:r,parentId:s})})}var y=function(e){function t(){var e,a;(0,u.default)(this,t);for(var r=arguments.length,s=new Array(r),l=0;l<r;l++)s[l]=arguments[l];return a=(0,d.default)(this,(e=(0,i.default)(t)).call.apply(e,[this].concat(s))),a.state={selectValue:void 0,departmentId:""},a.validateToNextPassword=function(e,t,r){var s=a.props.form;t&&a.state.confirmDirty&&s.validateFields(["confirm"],{force:!0}),r()},a.compareToFirstPassword=function(e,t,r){var s=a.props.form;t&&t!==s.getFieldValue("password")?r("Two passwords that you enter is inconsistent!"):r()},a.selectChange=function(e,t){a.setState({selectValue:e,departmentId:t.props.eventKey})},a}return(0,c.default)(t,e),(0,o.default)(t,[{key:"componentDidUpdate",value:function(){this.props.getDepartmentId(this.state.departmentId)}},{key:"render",value:function(){var e=this.props.form.getFieldDecorator,t=this.props.orgs,a=this.state.selectValue;return f.default.createElement(f.Fragment,null,f.default.createElement("div",null,f.default.createElement(l.default,{layout:"inline",className:g.default.formWrap},f.default.createElement(l.default.Item,{label:"\u767b\u9646\u540d\uff1a"},e("login",{rules:[{required:!0,message:"Please input your \u767b\u9646\u540d"}]})(f.default.createElement(n.default,{className:g.default.inputValue}))),f.default.createElement(l.default.Item,{label:(0,p.formatMessage)({id:"app.common.username"})},e("name",{rules:[{required:!0,message:"Please input your \u5458\u5de5\u59d3\u540d"}]})(f.default.createElement(n.default,{className:g.default.inputValue}))),f.default.createElement(l.default.Item,{label:"\u6240\u5c5e\u90e8\u95e8\uff1a"},e("departmentId",{rules:[{required:!0,message:"Please input your \u6240\u5c5e\u90e8\u95e8"}]})(f.default.createElement(m.default,{value:a,style:{width:220},onSelect:this.selectChange,placeholder:"Please select",dropdownStyle:{height:"300px",width:"220px"}},v(t)))),f.default.createElement(l.default.Item,{label:(0,p.formatMessage)({id:"app.common.password"})},e("password",{rules:[{required:!0,message:"Please input your \u767b\u9646\u5bc6\u7801"},{validator:this.validateToNextPassword}]})(f.default.createElement(n.default.Password,{className:g.default.inputValue}))),f.default.createElement(l.default.Item,{label:"\u786e\u8ba4\u5bc6\u7801\uff1a"},e("confirm",{rules:[{required:!0,message:"Please confirm your password!"},{validator:this.compareToFirstPassword}]})(f.default.createElement(n.default.Password,{className:g.default.inputValue}))),f.default.createElement(l.default.Item,{label:"\u8054\u7cfb\u7535\u8bdd\uff1a"},e("phone",{rules:[]})(f.default.createElement(n.default,{className:g.default.inputValue}))),f.default.createElement(l.default.Item,{label:"\u90ae\u7bb1\u5730\u5740\uff1a"},e("email",{rules:[{type:"email",message:"The input is not valid E-mail!"}]})(f.default.createElement(n.default,{className:g.default.inputValue}))))))}}]),t}(f.Component);t.default=y},JA7R:function(e,t,a){"use strict";var r=a("tAuX"),s=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("y8nQ");var l=s(a("Vl3Y"));a("5NDa");var n=s(a("5rEg")),u=s(a("2Taf")),o=s(a("vZ4D")),d=s(a("l4Ni")),i=s(a("ujKo")),c=s(a("MhPg"));a("nRaC");var m=s(a("5RzL")),f=r(a("q1tI")),p=a("LLXN"),g=s(a("qB6u")),h=m.default.TreeNode;function v(e){return e.map(function(e){var t=e.children,a=e.departmentId,r=e.departmentName,s=e.parentDepartmentId;return t?f.default.createElement(h,{key:a,departmentId:a,value:r,title:r,parentId:s},v(t)):f.default.createElement(h,{key:a,departmentId:a,value:r,title:r,parentId:s})})}var y=function(e){function t(){var e,a;(0,u.default)(this,t);for(var r=arguments.length,s=new Array(r),l=0;l<r;l++)s[l]=arguments[l];return a=(0,d.default)(this,(e=(0,i.default)(t)).call.apply(e,[this].concat(s))),a.state={selectValue:void 0,departmentId:""},a.selectChange=function(e,t){a.setState({selectValue:e,departmentId:t.props.eventKey})},a}return(0,c.default)(t,e),(0,o.default)(t,[{key:"componentDidUpdate",value:function(){this.props.getDepartmentId(this.state.departmentId)}},{key:"render",value:function(){var e=this.props.form.getFieldDecorator,t=this.props,a=t.orgs,r=t.userInfo,s=this.state.selectValue;return f.default.createElement(f.Fragment,null,f.default.createElement("div",null,f.default.createElement(l.default,{layout:"inline",className:g.default.formWrap},f.default.createElement(l.default.Item,{label:"\u767b\u9646\u540d\uff1a"},e("login",{rules:[{required:!0,message:"Please input your \u767b\u9646\u540d"}],initialValue:r.login})(f.default.createElement(n.default,{className:g.default.inputValue}))),f.default.createElement(l.default.Item,{label:(0,p.formatMessage)({id:"app.common.username"})},e("name",{rules:[{required:!0,message:"Please input your \u5458\u5de5\u59d3\u540d"}],initialValue:r.name})(f.default.createElement(n.default,{className:g.default.inputValue}))),f.default.createElement(l.default.Item,{label:"\u6240\u5c5e\u90e8\u95e8\uff1a"},e("departmentId",{rules:[{required:!0,message:"Please input your \u6240\u5c5e\u90e8\u95e8"}],initialValue:r.departmentName})(f.default.createElement(m.default,{value:s,style:{width:220},onSelect:this.selectChange,placeholder:"Please select",dropdownStyle:{height:"300px",width:"220px"}},v(a)))),f.default.createElement(l.default.Item,{label:"\u90ae\u7bb1\u5730\u5740\uff1a"},e("email",{rules:[{type:"email",message:"The input is not valid E-mail!"},{required:!0,message:"Please confirm your \u90ae\u7bb1\u5730\u5740!"}],initialValue:r.email})(f.default.createElement(n.default,{className:g.default.inputValue}))))))}}]),t}(f.Component);t.default=y},Mr0f:function(e,t,a){"use strict";var r=a("g09b"),s=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("+L6B");var l=r(a("2/Rp"));a("14J3");var n=r(a("BMrR"));a("jCWc");var u=r(a("kPKH"));a("sRBo");var o=r(a("kaz8"));a("miYZ");var d=r(a("tsqr"));a("y8nQ");var i=r(a("Vl3Y"));a("5NDa");var c,m,f,p=r(a("5rEg")),g=r(a("2Taf")),h=r(a("vZ4D")),v=r(a("l4Ni")),y=r(a("ujKo")),w=r(a("MhPg")),I=s(a("q1tI")),E=a("LLXN"),b=a("MuoO"),N=r(a("qB6u")),M=function(e){function t(){var e;return(0,g.default)(this,t),e=(0,v.default)(this,(0,y.default)(t).call(this)),e.state={},e}return(0,w.default)(t,e),(0,h.default)(t,[{key:"render",value:function(){var e=this.props.form.getFieldDecorator,t=this.props,a=t.NewFlag,r=t.userInfo;return I.default.createElement(I.Fragment,null,I.default.createElement(i.default,null,I.default.createElement(i.default.Item,{label:"User Id\uff1a",labelCol:{span:4},wrapperCol:{span:7}},e("userId",{rules:[{required:!0,message:"".concat((0,E.formatMessage)({id:"app.common.userId"})," should not be empty")}],initialValue:r&&r.userId})(I.default.createElement(p.default,{disabled:!!r.userId,placeholder:"Please input ".concat((0,E.formatMessage)({id:"app.common.userId"}))}))),I.default.createElement(i.default.Item,{label:(0,E.formatMessage)({id:"app.common.username"}),labelCol:{span:4},wrapperCol:{span:7}},e("userName",{rules:[{required:!0,message:"".concat((0,E.formatMessage)({id:"app.common.username"})," should not be empty")}],initialValue:r&&r.userName})(I.default.createElement(p.default,{placeholder:"Please Input ".concat((0,E.formatMessage)({id:"app.common.username"}))}))),a&&I.default.createElement(i.default.Item,{label:(0,E.formatMessage)({id:"app.common.password"}),labelCol:{span:4},wrapperCol:{span:7}},e("userPwd",{rules:[{required:!0,message:"Please input ".concat((0,E.formatMessage)({id:"app.common.password"}))}]})(I.default.createElement(p.default.Password,{placeholder:"Please Input ".concat((0,E.formatMessage)({id:"app.common.password"}))})))))}}]),t}(I.Component),C=i.default.create()(M),P=(c=(0,b.connect)(function(e){var t=e.userManagement,a=e.loading;return{loading:a.effects,newUserData:t.saveUser,menuUserGroup:t.menuData,alertUserGroups:t.alertData,modifyUserData:t.updateData}}),c((f=function(e){function t(e){var a;return(0,g.default)(this,t),a=(0,v.default)(this,(0,y.default)(t).call(this,e)),a.newUserRef=I.default.createRef(),a.queryLog=function(){var e=a.props.dispatch,t={};e({type:"userManagement/getMenuUserGroup",payload:t})},a.getAlertUserGroup=function(){var e=a.props.dispatch,t={};e({type:"userManagement/getAlertUserGroup",payload:t})},a.getRoalId=function(e){var t=a.props.dispatch,r={operType:"queryById",userId:e};t({type:"userManagement/updateUserModelDatas",payload:r,callback:function(){var e=a.props.modifyUserData.map(function(e){var t="";return"menu"===e.userGroupType&&(t=e.groupId),t}),t=a.props.modifyUserData.map(function(e){var t="";return"alert"===e.userGroupType&&(t=e.groupId),t});a.setState({groupIds:e,alertIds:t})}})},a.setRoleIds=function(e){if(!(e.length<=0)){var t=[];t.push(e[0].groupId),a.setState({groupIds:t})}},a.onCancel=function(){a.props.onCancel()},a.onChangeLocked=function(e){e.target.checked?a.setState({accountLock:"Y",locedChecked:!0}):a.setState({accountLock:"N",locedChecked:!1})},a.onChangeMenuUserGroup=function(e){a.setState({groupIds:e})},a.onChangeAlertUserGroup=function(e){a.setState({alertIds:e})},a.onSave=function(){var e=a.state,t=e.accountLock,r=e.groupIds,s=e.alertIds,l=a.props.NewFlag;a.newUserRef.current.validateFields(function(e,n){if(!e)if(r.length<=0)d.default.warning("Please checked Menu User Group");else if(s.length<=0)d.default.warning("Please checked Alert User Group");else{var u=a.props.dispatch;if(l){var o={userName:n.userName,userPwd:window.kddes.getDes(n.userPwd),groupIds:r.join(","),userId:n.userId,alertIds:s.join(","),accountLock:t};u({type:"userManagement/newUser",payload:o,callback:function(){d.default.success("save success"),a.props.onSave(!0)}})}else{var i={operType:"updateUserById",userName:n.userName,groupIds:r.join(","),userId:n.userId,alertIds:s.join(","),accountLock:t};u({type:"userManagement/updateUserModelDatas",payload:i,callback:function(){d.default.success("save success"),a.props.onSave(!1)}})}}})},a.state={accountLock:"N",locedChecked:!1,groupIds:[],alertIds:[]},a}return(0,w.default)(t,e),(0,h.default)(t,[{key:"componentDidMount",value:function(){var e=this.props.userInfo,t=!1;e.accountLock&&"N"!==e.accountLock&&(t=!0),this.queryLog(),this.getAlertUserGroup(),this.setState({locedChecked:t}),e.userId&&this.getRoalId(e.userId)}},{key:"render",value:function(){var e=this.props,t=e.menuUserGroup,a=e.NewFlag,r=e.userInfo,s=e.alertUserGroups,d=this.state,i=d.locedChecked,c=d.groupIds,m=d.alertIds;return I.default.createElement(I.Fragment,null,I.default.createElement(C,{ref:this.newUserRef,NewFlag:a,userInfo:r}),I.default.createElement(n.default,null,I.default.createElement(u.default,{offset:4},I.default.createElement(o.default,{onChange:this.onChangeLocked,checked:i},"User Account Locked"))),I.default.createElement("ul",{className:N.default.userGroup},I.default.createElement("li",null,I.default.createElement("h3",{className:N.default.groupTitle},(0,E.formatMessage)({id:"systemManagement.userMaintenance.menuUserGroup"})),I.default.createElement(o.default.Group,{options:t,defaultValue:["Operator"],onChange:this.onChangeMenuUserGroup,value:c}))),I.default.createElement("ul",{className:N.default.userGroup},I.default.createElement("li",null,I.default.createElement("h3",{className:N.default.groupTitle},(0,E.formatMessage)({id:"systemManagement.userMaintenance.alertUserGroup"})),I.default.createElement(o.default.Group,{options:s,defaultValue:["Future Maker","Future Checker"],onChange:this.onChangeAlertUserGroup,value:m}))),I.default.createElement(n.default,{type:"flex",justify:"end",style:{position:"absolute",right:0,bottom:0,width:"100%",padding:"10px 16px",background:"#fff",textAlign:"right"}},I.default.createElement(u.default,null,I.default.createElement(l.default,{onClick:this.onCancel},"CANCEL"),I.default.createElement(l.default,{type:"primary",onClick:this.onSave},"SAVE"))))}}]),t}(I.Component),m=f))||m);t.default=P},esUI:function(e,t,a){"use strict";var r=a("tAuX"),s=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("+L6B");var l=s(a("2/Rp"));a("14J3");var n=s(a("BMrR"));a("jCWc");var u=s(a("kPKH"));a("y8nQ");var o=s(a("Vl3Y"));a("5NDa");var d=s(a("5rEg")),i=s(a("2Taf")),c=s(a("vZ4D")),m=s(a("l4Ni")),f=s(a("ujKo")),p=s(a("MhPg")),g=r(a("q1tI")),h=a("LLXN"),v=s(a("qB6u")),y=function(e){function t(){var e,a;(0,i.default)(this,t);for(var r=arguments.length,s=new Array(r),l=0;l<r;l++)s[l]=arguments[l];return a=(0,m.default)(this,(e=(0,f.default)(t)).call.apply(e,[this].concat(s))),a.state={},a}return(0,p.default)(t,e),(0,c.default)(t,[{key:"render",value:function(){var e=this.props.form.getFieldDecorator,t=this.props.search;return g.default.createElement(o.default,{className:"ant-advanced-search-form"},g.default.createElement(n.default,{gutter:{xs:24,sm:48,md:144,lg:48,xl:96}},g.default.createElement(u.default,{xs:12,sm:12,lg:8},g.default.createElement(o.default.Item,{label:(0,h.formatMessage)({id:"app.common.userId"})},e("userId",{})(g.default.createElement(d.default,{className:v.default.inputvalue,placeholder:"Please input"})))),g.default.createElement(u.default,{xs:12,sm:12,lg:8},g.default.createElement(o.default.Item,{label:(0,h.formatMessage)({id:"app.common.username"})},e("userName",{})(g.default.createElement(d.default,{className:v.default.inputvalue,placeholder:"Please input"}))))),g.default.createElement("div",{className:"btnArea"},g.default.createElement(l.default,{type:"primary",onClick:t},(0,h.formatMessage)({id:"app.common.search"}))))}}]),t}(g.Component);t.default=y},qB6u:function(e,t,a){e.exports={clearfix:"antd-pro-pages-user-management-user-management-clearfix",fl:"antd-pro-pages-user-management-user-management-fl",fr:"antd-pro-pages-user-management-user-management-fr",formWrap:"antd-pro-pages-user-management-user-management-formWrap","login-name":"antd-pro-pages-user-management-user-management-login-name",header:"antd-pro-pages-user-management-user-management-header",operation:"antd-pro-pages-user-management-user-management-operation",inputValue:"antd-pro-pages-user-management-user-management-inputValue",content:"antd-pro-pages-user-management-user-management-content",tableTop:"antd-pro-pages-user-management-user-management-tableTop",userGroup:"antd-pro-pages-user-management-user-management-userGroup",groupTitle:"antd-pro-pages-user-management-user-management-groupTitle"}},r7Fp:function(e,t,a){"use strict";var r=a("tAuX"),s=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("y8nQ");var l=s(a("Vl3Y"));a("5NDa");var n=s(a("5rEg")),u=s(a("2Taf")),o=s(a("vZ4D")),d=s(a("l4Ni")),i=s(a("ujKo")),c=s(a("MhPg")),m=r(a("q1tI")),f=s(a("qB6u")),p=function(e){function t(){var e,a;(0,u.default)(this,t);for(var r=arguments.length,s=new Array(r),l=0;l<r;l++)s[l]=arguments[l];return a=(0,d.default)(this,(e=(0,i.default)(t)).call.apply(e,[this].concat(s))),a.state={},a.validateToNextPassword=function(e,t,r){var s=a.props.form;t&&a.state.confirmDirty&&s.validateFields(["confirm"],{force:!0}),r()},a.compareToFirstPassword=function(e,t,r){var s=a.props.form;t&&t!==s.getFieldValue("password")?r("Two passwords that you enter is inconsistent!"):r()},a}return(0,c.default)(t,e),(0,o.default)(t,[{key:"render",value:function(){var e=this.props.form.getFieldDecorator;return m.default.createElement(m.Fragment,null,m.default.createElement("div",null,m.default.createElement(l.default,{layout:"inline",className:f.default.formWrap},m.default.createElement(l.default.Item,{label:"\u539f\u5bc6\u7801\uff1a"},e("oldPassword",{rules:[{required:!0,message:"Please input your \u539f\u5bc6\u7801"}]})(m.default.createElement(n.default,{className:f.default.inputValue}))),m.default.createElement(l.default.Item,{label:"\u767b\u9646\u5bc6\u7801\uff1a"},e("password",{rules:[{required:!0,message:"Please input your \u767b\u9646\u5bc6\u7801"},{validator:this.validateToNextPassword}]})(m.default.createElement(n.default,{className:f.default.inputValue}))),m.default.createElement(l.default.Item,{label:"\u786e\u8ba4\u5bc6\u7801\uff1a"},e("confirmPassword",{rules:[{required:!0,message:"Please confirm your password!"},{validator:this.compareToFirstPassword}]})(m.default.createElement(n.default.Password,{className:f.default.inputValue}))))))}}]),t}(m.Component);t.default=p},v32P:function(e,t,a){"use strict";var r=a("g09b"),s=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("DjyN");var l=r(a("NUBc"));a("g9YV");var n=r(a("wCAj"));a("+L6B");var u=r(a("2/Rp"));a("bbsP");var o=r(a("/wGt"));a("2qtc");var d=r(a("kLXV"));a("miYZ");var i=r(a("tsqr")),c=r(a("2Taf")),m=r(a("vZ4D")),f=r(a("l4Ni")),p=r(a("ujKo")),g=r(a("MhPg"));a("y8nQ");var h,v,y,w=r(a("Vl3Y")),I=s(a("q1tI")),E=a("Hx5s"),b=a("LLXN"),N=a("MuoO"),M=r(a("qB6u")),C=a("+n12"),P=a("fwgp"),k=r(a("esUI")),U=r(a("Mr0f")),S=r(a("F6Wx")),V=r(a("JA7R")),D=r(a("r7Fp")),T=r(a("vxNX")),F=w.default.create({})(k.default),q=w.default.create({})(S.default),L=w.default.create({})(V.default),x=w.default.create({})(D.default),R=w.default.create({})(T.default),A=(h=(0,N.connect)(function(e){var t=e.userManagement,a=e.loading;return{loading:a.effects,userManagementData:t.data,orgs:t.orgs,modifyUserData:t.updateData}}),h((y=function(e){function t(){var e,a;(0,c.default)(this,t);for(var r=arguments.length,s=new Array(r),l=0;l<r;l++)s[l]=arguments[l];return a=(0,f.default)(this,(e=(0,p.default)(t)).call.apply(e,[this].concat(s))),a.state={visible:!1,userTitle:"New User",NewFlag:!0,updateVisible:!1,deleteVisible:!1,closingVisible:!1,updatePasswordVisible:!1,resetPasswordVisible:!1,customerno:null,searchUserId:void 0,searchUserName:void 0,userInfo:{userId:"",userName:""},columns:[{title:(0,b.formatMessage)({id:"app.common.number"}),dataIndex:"index",key:"index",render:function(e,t,r){return I.default.createElement("span",null,(a.state.page.pageNumber-1)*a.state.page.pageSize+r+1)}},{title:(0,b.formatMessage)({id:"app.common.userId"}),dataIndex:"userId",key:"userId"},{title:(0,b.formatMessage)({id:"app.common.username"}),dataIndex:"userName",key:"userName"},{title:(0,b.formatMessage)({id:"systemManagement.userMaintenance.lockedStatus"}),dataIndex:"accountLock",key:"accountLock"},{title:(0,b.formatMessage)({id:"systemManagement.userMaintenance.LastUpdateTime"}),dataIndex:"updateTime",key:"updateTime",render:function(e,t){return I.default.createElement("div",null,I.default.createElement("span",null,(0,P.timeFormat)(t.updateTime).t1),I.default.createElement("br",null),I.default.createElement("span",null,(0,P.timeFormat)(t.updateTime).t2))}},{title:(0,b.formatMessage)({id:"systemManagement.userMaintenance.LastUpdateUser"}),dataIndex:"updateBy",key:"updateBy"},{title:(0,b.formatMessage)({id:"app.common.operation"}),dataIndex:"operation",key:"operation",render:function(e,t){return I.default.createElement("span",{className:M.default.operation},I.default.createElement("a",{href:"#",onClick:function(){return a.updateUser(e,t)}},(0,b.formatMessage)({id:"app.common.modify"})),I.default.createElement("a",{href:"#",onClick:function(){return a.deleteUser(e,t)}},(0,b.formatMessage)({id:"app.common.delete"})))}}],page:{pageNumber:1,pageSize:10}},a.newDepartmentId="",a.searchForm=I.default.createRef(),a.formRef=I.default.createRef(),a.updateFormRef=I.default.createRef(),a.passwordFormRef=I.default.createRef(),a.resetPasswordFormRef=I.default.createRef(),a.queryUserList=function(){var e=a.props.dispatch,t=a.state,r=t.searchUserId,s=t.searchUserName,l={userId:r,userName:s,operType:"queryAllList",pageNumber:a.state.page.pageNumber.toString(),pageSize:a.state.page.pageSize.toString()};e({type:"userManagement/userManagemetDatas",payload:l})},a.queryDepartments=function(){var e=a.props.dispatch;e({type:"userManagement/queryOrgs",params:{treeLevel:"2"}})},a.getDepartmentId=function(e){a.newDepartmentId=e},a.newUser=function(){a.setState({visible:!0,userTitle:"New User",NewFlag:!0,userInfo:{}})},a.addConfrim=function(){a.setState({visible:!1});var e=a.state.page.pageSize,t={pageNumber:1,pageSize:e};a.setState({page:t},function(){a.queryUserList()})},a.addCancel=function(){a.setState({visible:!1})},a.updateUser=function(e,t){console.log("res=======",e),console.log("obj============",t);var r={userName:t.userName,userId:t.userId,accountLock:t.accountLock};a.setState({visible:!0,userTitle:"Modify User",NewFlag:!1,userInfo:r})},a.updateConfirm=function(){var e=a.props.dispatch,t=a.state.customerno;a.updateFormRef.current.validateFields(function(r,s){var l={custCustomerno:t,loginName:s.login,customerName:s.name,departmentId:a.newDepartmentId||a.state.userInfo.departmentId,email:s.email};e({type:"userManagement/updateUserModelDatas",payload:l,callback:function(){a.queryUserList()}})}),a.setState({updateVisible:!1})},a.updateCancel=function(){a.setState({updateVisible:!1})},a.deleteUser=function(e,t){console.log("delete=",e,t);var r={userName:t.userName,userId:t.userId,accountLock:t.accountLock};a.setState({deleteVisible:!0,userInfo:r})},a.deleteConfirm=function(){var e=a.props.dispatch,t={operType:"deleteUserById",userId:a.state.userInfo.userId};e({type:"userManagement/updateUserModelDatas",payload:t,callback:function(){i.default.success("delete success"),a.queryUserList(),a.setState({deleteVisible:!1})}})},a.deleteCancel=function(){a.setState({deleteVisible:!1})},a.closingUser=function(){a.setState({closingVisible:!0})},a.closingConfirm=function(){var e=a.props.dispatch,t={operationType:"3"};e({type:"userManagement/operationUserModelDatas",payload:t,callback:function(){a.queryUserList(),a.setState({closingVisible:!1})}})},a.closingCancel=function(){a.setState({closingVisible:!1})},a.updatePassword=function(){a.setState({updatePasswordVisible:!0})},a.updatePasswordConfirm=function(){var e=a.props.dispatch,t=a.state.customerno;a.passwordFormRef.current.validateFields(function(r,s){var l=(0,C.passWordStrength)(s.password),n={custCustomerno:t,operationType:"5",oldPassword:window.kddes.getDes(s.oldPassword),password:window.kddes.getDes(s.password),passwordStrength:l};e({type:"userManagement/operationUserModelDatas",payload:n,callback:function(){a.setState({updatePasswordVisible:!1})}})})},a.updatePasswordCancel=function(){a.setState({updatePasswordVisible:!1})},a.resetPassword=function(){a.setState({resetPasswordVisible:!0})},a.resetPasswordConfirm=function(){var e=a.props.dispatch;a.resetPasswordFormRef.current.validateFields(function(t,r){var s=(0,C.passWordStrength)(r.password),l={operationType:"6",password:window.kddes.getDes(r.password),passwordStrength:s};e({type:"userManagement/operationUserModelDatas",payload:l,callback:function(){a.setState({resetPasswordVisible:!1})}})})},a.resetPasswordCancel=function(){a.setState({resetPasswordVisible:!1})},a.queryLog=function(){var e=a.state.page,t={pageNumber:1,pageSize:e.pageSize};a.setState({page:t}),a.searchForm.current.validateFields(function(e,t){a.setState({searchUserId:t.userId,searchUserName:t.userName},function(){a.queryUserList()})})},a.pageChange=function(e,t){var r={pageNumber:e,pageSize:t};a.setState({page:r},function(){a.queryUserList()})},a.onShowSizeChange=function(e,t){var r={pageNumber:e,pageSize:t};a.setState({page:r},function(){a.queryUserList()})},a}return(0,g.default)(t,e),(0,m.default)(t,[{key:"componentDidMount",value:function(){this.queryUserList()}},{key:"render",value:function(){var e=this.props,t=e.loading,a=e.orgs,r=e.userManagementData,s=this.state,i=s.userInfo,c=s.page,m=s.userTitle,f=s.NewFlag;return console.log("userManagementData.items=",r.items),I.default.createElement(E.PageHeaderWrapper,null,I.default.createElement("div",null,I.default.createElement("div",null,I.default.createElement(F,{search:this.queryLog,newUser:this.newUser,ref:this.searchForm})),I.default.createElement("div",null,I.default.createElement(d.default,{title:"\u65b0\u589e\u7528\u6237",visible:!1,onOk:this.addConfrim,onCancel:this.addCancel,cancelText:(0,b.formatMessage)({id:"app.common.cancel"}),okText:(0,b.formatMessage)({id:"app.common.save"})},I.default.createElement(q,{ref:this.formRef,orgs:a,getDepartmentId:this.getDepartmentId})),I.default.createElement(o.default,{closable:!1,title:m,width:700,onClose:this.addCancel,visible:this.state.visible},this.state.visible&&I.default.createElement(U.default,{onCancel:this.addCancel,onSave:this.addConfrim,NewFlag:f,userInfo:i})),I.default.createElement(d.default,{title:"\u4fee\u6539\u7528\u6237",visible:this.state.updateVisible,onOk:this.updateConfirm,onCancel:this.updateCancel,cancelText:(0,b.formatMessage)({id:"app.common.cancel"}),okText:(0,b.formatMessage)({id:"app.common.save"})},I.default.createElement(L,{ref:this.updateFormRef,orgs:a,userInfo:i,getDepartmentId:this.getDepartmentId})),I.default.createElement(d.default,{title:"CONFIRM",visible:this.state.deleteVisible,onOk:this.deleteConfirm,onCancel:this.deleteCancel,cancelText:(0,b.formatMessage)({id:"app.common.cancel"}),okText:(0,b.formatMessage)({id:"app.common.confirm"})},I.default.createElement("span",null,"Please confirm that you want to delete this record?")),I.default.createElement(d.default,{title:"\u63d0\u793a",visible:this.state.closingVisible,onOk:this.closingConfirm,onCancel:this.closingCancel,cancelText:(0,b.formatMessage)({id:"app.common.cancel"}),okText:(0,b.formatMessage)({id:"app.common.confirm"})},I.default.createElement("span",null,"\u662f\u5426\u9500\u6237\uff1f")),I.default.createElement(d.default,{title:"\u5bc6\u7801\u4fee\u6539",visible:this.state.updatePasswordVisible,onOk:this.updatePasswordConfirm,onCancel:this.updatePasswordCancel,cancelText:(0,b.formatMessage)({id:"app.common.cancel"}),okText:(0,b.formatMessage)({id:"app.common.confirm"})},I.default.createElement(x,{ref:this.passwordFormRef})),I.default.createElement(d.default,{title:"\u5bc6\u7801\u91cd\u7f6e",visible:this.state.resetPasswordVisible,onOk:this.resetPasswordConfirm,onCancel:this.resetPasswordCancel,cancelText:(0,b.formatMessage)({id:"app.common.cancel"}),okText:(0,b.formatMessage)({id:"app.common.save"})},I.default.createElement(R,{ref:this.resetPasswordFormRef}))),I.default.createElement("div",{className:M.default.content},I.default.createElement("div",{className:M.default.tableTop},I.default.createElement(u.default,{onClick:this.newUser,type:"primary",className:"btn_usual"},"+ New User")),I.default.createElement(n.default,{loading:t["userManagement/userManagemetDatas"],dataSource:r.items,columns:this.state.columns,pagination:!1}),I.default.createElement(l.default,{current:c.pageNumber,showSizeChanger:!0,showTotal:function(){return"Page ".concat(c.pageNumber," of ").concat(Math.ceil(r.totalCount/c.pageSize))},onShowSizeChange:this.onShowSizeChange,onChange:this.pageChange,total:r.totalCount,pageSize:c.pageSize}))))}}]),t}(I.Component),v=y))||v),G=A;t.default=G},vxNX:function(e,t,a){"use strict";var r=a("tAuX"),s=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("y8nQ");var l=s(a("Vl3Y"));a("5NDa");var n=s(a("5rEg")),u=s(a("2Taf")),o=s(a("vZ4D")),d=s(a("l4Ni")),i=s(a("ujKo")),c=s(a("MhPg")),m=r(a("q1tI")),f=s(a("qB6u")),p=function(e){function t(){var e,a;(0,u.default)(this,t);for(var r=arguments.length,s=new Array(r),l=0;l<r;l++)s[l]=arguments[l];return a=(0,d.default)(this,(e=(0,i.default)(t)).call.apply(e,[this].concat(s))),a.state={},a.validateToNextPassword=function(e,t,r){var s=a.props.form;t&&a.state.confirmDirty&&s.validateFields(["confirm"],{force:!0}),r()},a.compareToFirstPassword=function(e,t,r){var s=a.props.form;t&&t!==s.getFieldValue("password")?r("Two passwords that you enter is inconsistent!"):r()},a}return(0,c.default)(t,e),(0,o.default)(t,[{key:"render",value:function(){var e=this.props.form.getFieldDecorator;return m.default.createElement(m.Fragment,null,m.default.createElement("div",null,m.default.createElement(l.default,{layout:"inline",className:f.default.formWrap},m.default.createElement(l.default.Item,{label:"\u767b\u9646\u5bc6\u7801\uff1a"},e("password",{rules:[{required:!0,message:"Please input your \u767b\u9646\u5bc6\u7801"},{validator:this.validateToNextPassword}]})(m.default.createElement(n.default,{className:f.default.inputValue}))),m.default.createElement(l.default.Item,{label:"\u786e\u8ba4\u5bc6\u7801\uff1a"},e("confirmPassword",{rules:[{required:!0,message:"Please confirm your password!"},{validator:this.compareToFirstPassword}]})(m.default.createElement(n.default.Password,{className:f.default.inputValue}))))))}}]),t}(m.Component);t.default=p}}]);