(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[49],{Mr0f:function(e,a,t){"use strict";var r=t("g09b"),n=t("tAuX");Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0,t("+L6B");var s=r(t("2/Rp"));t("14J3");var u=r(t("BMrR"));t("jCWc");var l=r(t("kPKH"));t("sRBo");var o=r(t("kaz8"));t("miYZ");var d=r(t("tsqr"));t("y8nQ");var c=r(t("Vl3Y"));t("5NDa");var i,p,m,f=r(t("5rEg")),g=r(t("2Taf")),h=r(t("vZ4D")),v=r(t("l4Ni")),y=r(t("ujKo")),I=r(t("MhPg")),M=n(t("q1tI")),N=t("LLXN"),U=t("MuoO"),k=r(t("qB6u")),b=function(e){function a(){var e;return(0,g.default)(this,a),e=(0,v.default)(this,(0,y.default)(a).call(this)),e.state={},e}return(0,I.default)(a,e),(0,h.default)(a,[{key:"render",value:function(){var e=this.props.form.getFieldDecorator,a=this.props,t=a.NewFlag,r=a.userInfo;return M.default.createElement(M.Fragment,null,M.default.createElement(c.default,null,M.default.createElement(c.default.Item,{label:(0,N.formatMessage)({id:"app.common.username"}),labelCol:{span:4},wrapperCol:{span:7}},e("userName",{rules:[{required:!0,message:"".concat((0,N.formatMessage)({id:"app.common.username"})," should not be empty")}],initialValue:r&&r.userName})(M.default.createElement(f.default,{placeholder:"Please Input ".concat((0,N.formatMessage)({id:"app.common.username"}))}))),t&&M.default.createElement(c.default.Item,{label:(0,N.formatMessage)({id:"app.common.password"}),labelCol:{span:4},wrapperCol:{span:7}},e("userPwd",{rules:[{required:!0,message:"Please input ".concat((0,N.formatMessage)({id:"app.common.password"}))}]})(M.default.createElement(f.default.Password,{placeholder:"Please Input ".concat((0,N.formatMessage)({id:"app.common.password"}))})))))}}]),a}(M.Component),C=c.default.create()(b),E=(i=(0,U.connect)(function(e){var a=e.userManagement,t=e.loading;return{loading:t.effects,newUserData:a.saveUser,menuUserGroup:a.menuData,alertUserGroups:a.alertData,modifyUserData:a.updateData}}),i((m=function(e){function a(e){var t;return(0,g.default)(this,a),t=(0,v.default)(this,(0,y.default)(a).call(this,e)),t.newUserRef=M.default.createRef(),t.queryLog=function(){var e=t.props.dispatch,a={};e({type:"userManagement/getMenuUserGroup",payload:a})},t.getAlertUserGroup=function(){var e=t.props.dispatch,a={};e({type:"userManagement/getAlertUserGroup",payload:a})},t.getRoalId=function(e){var a=t.props.dispatch,r={operType:"queryById",userId:e};a({type:"userManagement/updateUserModelDatas",payload:r,callback:function(){var e=t.props.modifyUserData.map(function(e){var a="";return"menu"===e.userGroupType&&(a=e.groupId),a}),a=t.props.modifyUserData.map(function(e){var a="";return"alert"===e.userGroupType&&(a=e.groupId),a});t.setState({groupIds:e,alertIds:a})}})},t.setRoleIds=function(e){if(!(e.length<=0)){var a=[];a.push(e[0].groupId),t.setState({groupIds:a})}},t.onCancel=function(){t.props.onCancel()},t.onChangeLocked=function(e){e.target.checked?t.setState({accountLock:"Y",locedChecked:!0}):t.setState({accountLock:"0",locedChecked:!1})},t.onChangeMenuUserGroup=function(e){t.setState({groupIds:e})},t.onChangeAlertUserGroup=function(e){t.setState({alertIds:e})},t.onSave=function(){var e=t.state,a=e.accountLock,r=e.groupIds,n=e.alertIds,s=t.props,u=s.NewFlag,l=s.userInfo;t.newUserRef.current.validateFields(function(e,s){if(!e)if(r.length<=0)d.default.warning("Please checked Menu User Group");else if(n.length<=0)d.default.warning("Please checked Alert User Group");else{var o=t.props.dispatch;if(u){var c={userName:s.userName,userPwd:window.kddes.getDes(s.userPwd),groupIds:r.join(","),alertIds:n.join(","),accountLock:a};o({type:"userManagement/newUser",payload:c,callback:function(){d.default.success("save success"),t.props.onSave(!0)}})}else{var i={operType:"updateUserById",userName:s.userName,groupIds:r.join(","),userId:l.userId,alertIds:n.join(","),accountLock:a};o({type:"userManagement/updateUserModelDatas",payload:i,callback:function(){d.default.success("save success"),t.props.onSave(!1)}})}}})},t.state={accountLock:"0",locedChecked:!1,groupIds:[],alertIds:[]},t}return(0,I.default)(a,e),(0,h.default)(a,[{key:"componentDidMount",value:function(){var e=this.props.userInfo,a=!1;e.accountLock&&"0"!==e.accountLock&&(a=!0),this.queryLog(),this.getAlertUserGroup(),this.setState({locedChecked:a}),e.userId&&this.getRoalId(e.userId)}},{key:"render",value:function(){var e=this.props,a=e.menuUserGroup,t=e.NewFlag,r=e.userInfo,n=e.alertUserGroups,d=this.state,c=d.locedChecked,i=d.groupIds,p=d.alertIds;return M.default.createElement(M.Fragment,null,M.default.createElement(C,{ref:this.newUserRef,NewFlag:t,userInfo:r}),M.default.createElement(u.default,null,M.default.createElement(l.default,{offset:4},M.default.createElement(o.default,{onChange:this.onChangeLocked,checked:c},"User Account Locked"))),M.default.createElement("ul",{className:k.default.userGroup},M.default.createElement("li",null,M.default.createElement("h3",{className:k.default.groupTitle},(0,N.formatMessage)({id:"systemManagement.userMaintenance.menuUserGroup"})),M.default.createElement(o.default.Group,{options:a,defaultValue:["Operator"],onChange:this.onChangeMenuUserGroup,value:i}))),M.default.createElement("ul",{className:k.default.userGroup},M.default.createElement("li",null,M.default.createElement("h3",{className:k.default.groupTitle},(0,N.formatMessage)({id:"systemManagement.userMaintenance.alertUserGroup"})),M.default.createElement(o.default.Group,{options:n,defaultValue:["Future Maker","Future Checker"],onChange:this.onChangeAlertUserGroup,value:p}))),M.default.createElement(u.default,{type:"flex",justify:"end",style:{position:"absolute",right:0,bottom:0,width:"100%",padding:"10px 16px",background:"#fff",textAlign:"right"}},M.default.createElement(l.default,null,M.default.createElement(s.default,{onClick:this.onCancel},"CANCEL"),M.default.createElement(s.default,{type:"primary",onClick:this.onSave},"SAVE"))))}}]),a}(M.Component),p=m))||p);a.default=E},esUI:function(e,a,t){"use strict";var r=t("tAuX"),n=t("g09b");Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0,t("+L6B");var s=n(t("2/Rp"));t("14J3");var u=n(t("BMrR"));t("jCWc");var l=n(t("kPKH"));t("y8nQ");var o=n(t("Vl3Y"));t("5NDa");var d=n(t("5rEg")),c=n(t("2Taf")),i=n(t("vZ4D")),p=n(t("l4Ni")),m=n(t("ujKo")),f=n(t("MhPg")),g=r(t("q1tI")),h=t("LLXN"),v=n(t("qB6u")),y=function(e){function a(){var e,t;(0,c.default)(this,a);for(var r=arguments.length,n=new Array(r),s=0;s<r;s++)n[s]=arguments[s];return t=(0,p.default)(this,(e=(0,m.default)(a)).call.apply(e,[this].concat(n))),t.state={},t}return(0,f.default)(a,e),(0,i.default)(a,[{key:"render",value:function(){var e=this.props.form.getFieldDecorator,a=this.props.search;return g.default.createElement(o.default,{className:"ant-advanced-search-form"},g.default.createElement(u.default,{gutter:{xs:24,sm:48,md:144,lg:48,xl:96}},g.default.createElement(l.default,{xs:12,sm:12,lg:8},g.default.createElement(o.default.Item,{label:(0,h.formatMessage)({id:"app.common.username"})},e("userName",{})(g.default.createElement(d.default,{className:v.default.inputvalue,placeholder:"Please input"}))))),g.default.createElement("div",{className:"btnArea"},g.default.createElement(s.default,{type:"primary",onClick:a},(0,h.formatMessage)({id:"app.common.search"}))))}}]),a}(g.Component);a.default=y},qB6u:function(e,a,t){e.exports={clearfix:"antd-pro-pages-user-management-user-management-clearfix",fl:"antd-pro-pages-user-management-user-management-fl",fr:"antd-pro-pages-user-management-user-management-fr",formWrap:"antd-pro-pages-user-management-user-management-formWrap","login-name":"antd-pro-pages-user-management-user-management-login-name",header:"antd-pro-pages-user-management-user-management-header",operation:"antd-pro-pages-user-management-user-management-operation",inputValue:"antd-pro-pages-user-management-user-management-inputValue",content:"antd-pro-pages-user-management-user-management-content",tableTop:"antd-pro-pages-user-management-user-management-tableTop",userGroup:"antd-pro-pages-user-management-user-management-userGroup",groupTitle:"antd-pro-pages-user-management-user-management-groupTitle","btn-icon":"antd-pro-pages-user-management-user-management-btn-icon",modifyBtn:"antd-pro-pages-user-management-user-management-modifyBtn"}},v32P:function(e,a,t){"use strict";var r=t("g09b"),n=t("tAuX");Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0,t("DjyN");var s=r(t("NUBc"));t("g9YV");var u=r(t("wCAj"));t("+L6B");var l=r(t("2/Rp"));t("2qtc");var o=r(t("kLXV"));t("bbsP");var d=r(t("/wGt"));t("miYZ");var c=r(t("tsqr")),i=r(t("2Taf")),p=r(t("vZ4D")),m=r(t("l4Ni")),f=r(t("ujKo")),g=r(t("MhPg"));t("y8nQ");var h,v,y,I=r(t("Vl3Y")),M=n(t("q1tI")),N=t("Hx5s"),U=t("LLXN"),k=t("MuoO"),b=r(t("qB6u")),C=t("fwgp"),E=r(t("BN5G")),w=r(t("esUI")),S=r(t("Mr0f")),L=I.default.create({})(w.default),T=(h=(0,k.connect)(function(e){var a=e.userManagement,t=e.loading;return{loading:t.effects,userManagementData:a.data,modifyUserData:a.updateData}}),h((y=function(e){function a(){var e,t;(0,i.default)(this,a);for(var r=arguments.length,n=new Array(r),s=0;s<r;s++)n[s]=arguments[s];return t=(0,m.default)(this,(e=(0,f.default)(a)).call.apply(e,[this].concat(n))),t.state={visible:!1,userTitle:"New User",NewFlag:!0,deleteVisible:!1,searchUserId:void 0,searchUserName:void 0,userInfo:{userId:"",userName:""},columns:[{title:(0,U.formatMessage)({id:"app.common.number"}),dataIndex:"index",key:"index",minWidth:60,render:function(e,a,r){return M.default.createElement("span",null,(t.state.page.pageNumber-1)*t.state.page.pageSize+r+1)}},{title:(0,U.formatMessage)({id:"app.common.username"}),dataIndex:"userName",key:"userName"},{title:(0,U.formatMessage)({id:"systemManagement.userMaintenance.lockedStatus"}),dataIndex:"accountLock",key:"accountLock"},{title:(0,U.formatMessage)({id:"systemManagement.userMaintenance.LastUpdateTime"}),dataIndex:"updateTime",key:"updateTime",render:function(e,a){return M.default.createElement("div",null,M.default.createElement("span",null,a.updateTime&&(0,C.timeFormat)(a.updateTime).t1),M.default.createElement("br",null),M.default.createElement("span",null,a.updateTime&&(0,C.timeFormat)(a.updateTime).t2))}},{title:(0,U.formatMessage)({id:"systemManagement.userMaintenance.LastUpdateUser"}),dataIndex:"updateBy",key:"updateBy"},{title:(0,U.formatMessage)({id:"app.common.operation"}),dataIndex:"operation",key:"operation",align:"center",render:function(e,a){return M.default.createElement("span",{className:b.default.operation},M.default.createElement("a",{href:"#",onClick:function(){return t.updateUser(e,a)}},M.default.createElement(E.default,{type:"icon-edit",className:b.default["btn-icon"]})),M.default.createElement("a",{href:"#",onClick:function(){return t.deleteUser(e,a)}},M.default.createElement(E.default,{type:"icon-delete",className:b.default["btn-icon"]})))}}],page:{pageNumber:1,pageSize:10}},t.newDepartmentId="",t.searchForm=M.default.createRef(),t.formRef=M.default.createRef(),t.updateFormRef=M.default.createRef(),t.passwordFormRef=M.default.createRef(),t.resetPasswordFormRef=M.default.createRef(),t.queryUserList=function(){var e=t.props.dispatch,a=t.state,r=a.searchUserId,n=a.searchUserName,s={userId:r,userName:n,operType:"queryAllList",pageNumber:t.state.page.pageNumber.toString(),pageSize:t.state.page.pageSize.toString()};e({type:"userManagement/userManagemetDatas",payload:s})},t.newUser=function(){t.setState({visible:!0,userTitle:"New User",NewFlag:!0,userInfo:{}})},t.addConfrim=function(){t.setState({visible:!1});var e=t.state.page.pageSize,a={pageNumber:1,pageSize:e};t.setState({page:a},function(){t.queryUserList()})},t.addCancel=function(){t.setState({visible:!1})},t.updateUser=function(e,a){var r={userName:a.userName,userId:a.userId,accountLock:a.accountLock};t.setState({visible:!0,userTitle:"Modify User",NewFlag:!1,userInfo:r})},t.deleteUser=function(e,a){var r={userName:a.userName,userId:a.userId,accountLock:a.accountLock};t.setState({deleteVisible:!0,userInfo:r})},t.deleteConfirm=function(){var e=t.props.dispatch,a={operType:"deleteUserById",userId:t.state.userInfo.userId};e({type:"userManagement/updateUserModelDatas",payload:a,callback:function(){c.default.success("delete success"),t.queryUserList(),t.setState({deleteVisible:!1})}})},t.deleteCancel=function(){t.setState({deleteVisible:!1})},t.queryLog=function(){var e=t.state.page,a={pageNumber:1,pageSize:e.pageSize};t.setState({page:a}),t.searchForm.current.validateFields(function(e,a){t.setState({searchUserId:a.userId,searchUserName:a.userName},function(){t.queryUserList()})})},t.pageChange=function(e,a){var r={pageNumber:e,pageSize:a};t.setState({page:r},function(){t.queryUserList()})},t.onShowSizeChange=function(e,a){var r={pageNumber:e,pageSize:a};t.setState({page:r},function(){t.queryUserList()})},t}return(0,g.default)(a,e),(0,p.default)(a,[{key:"componentDidMount",value:function(){this.queryUserList()}},{key:"render",value:function(){var e=this.props,a=e.loading,t=e.userManagementData,r=this.state,n=r.userInfo,c=r.page,i=r.userTitle,p=r.NewFlag;return M.default.createElement(N.PageHeaderWrapper,null,M.default.createElement("div",null,M.default.createElement("div",null,M.default.createElement(L,{search:this.queryLog,newUser:this.newUser,ref:this.searchForm})),M.default.createElement("div",null,M.default.createElement(d.default,{closable:!1,title:i,width:700,onClose:this.addCancel,visible:this.state.visible},this.state.visible&&M.default.createElement(S.default,{onCancel:this.addCancel,onSave:this.addConfrim,NewFlag:p,userInfo:n})),M.default.createElement(o.default,{title:(0,U.formatMessage)({id:"app.common.confirm"}),visible:this.state.deleteVisible,onOk:this.deleteConfirm,onCancel:this.deleteCancel,cancelText:(0,U.formatMessage)({id:"app.common.cancel"}),okText:(0,U.formatMessage)({id:"app.common.confirm"})},M.default.createElement("span",null,"Please confirm that you want to delete this record?"))),M.default.createElement("div",{className:b.default.content},M.default.createElement("div",{className:b.default.tableTop},M.default.createElement(l.default,{onClick:this.newUser,type:"primary",className:"btn_usual"},"+ New User")),M.default.createElement(u.default,{loading:a["userManagement/userManagemetDatas"],dataSource:t.items,columns:this.state.columns,pagination:!1}),M.default.createElement(s.default,{current:c.pageNumber,showSizeChanger:!0,showTotal:function(){return"Page ".concat(t.totalCount?c.pageNumber:0," of ").concat(Math.ceil((t.totalCount||0)/c.pageSize))},onShowSizeChange:this.onShowSizeChange,onChange:this.pageChange,total:t.totalCount,pageSize:c.pageSize}))))}}]),a}(M.Component),v=y))||v),D=T;a.default=D}}]);