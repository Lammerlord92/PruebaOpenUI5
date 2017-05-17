/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/model/BindingMode","sap/ui/model/ChangeReason","sap/ui/model/PropertyBinding","./lib/_Cache","./lib/_SyncPromise","./ODataBinding"],function(q,B,C,P,_,a,b){"use strict";var c="sap.ui.model.odata.v4.ODataPropertyBinding",s={AggregatedDataStateChange:true,change:true,dataReceived:true,dataRequested:true,DataStateChange:true};var O=P.extend("sap.ui.model.odata.v4.ODataPropertyBinding",{constructor:function(m,p,o,d){var e;P.call(this,m,p);if(p.slice(-1)==="/"){throw new Error("Invalid path: "+p);}e=this.oModel.buildBindingParameters(d,["$$groupId","$$updateGroupId"]);this.sGroupId=e.$$groupId;this.sUpdateGroupId=e.$$updateGroupId;this.mQueryOptions=this.oModel.buildQueryOptions(this.oModel.mUriParameters,d);this.oCachePromise=a.resolve();this.makeCache(o);this.oContext=o;this.bInitial=true;this.bRequestTypeFailed=false;this.vValue=undefined;m.bindingCreated(this);},metadata:{publicMethods:[]}});b(O.prototype);O.prototype.attachEvent=function(e){if(!(e in s)){throw new Error("Unsupported event '"+e+"': v4.ODataPropertyBinding#attachEvent");}return P.prototype.attachEvent.apply(this,arguments);};O.prototype.checkUpdate=function(f,d,g){var o={reason:d||C.Change},D=false,F=false,p,e,h=[],r,R=this.oModel.resolve(this.sPath,this.oContext),t=this;if(!R){e=Promise.resolve();if(t.vValue!==undefined){e=e.then(function(){t._fireChange(o);});}t.vValue=undefined;return e;}if(!this.bRequestTypeFailed&&!this.oType&&this.sInternalType!=="any"){h.push(this.oModel.getMetaModel().requestUI5Type(R).then(function(T){t.setType(T,t.sInternalType);})["catch"](function(E){t.bRequestTypeFailed=true;q.sap.log.warning(E.message,R,c);}));}r=this.oCachePromise.then(function(i){if(i){g=g||t.getGroupId();return i.fetchValue(g,undefined,function(){D=true;t.fireDataRequested();},t);}return t.oContext.fetchValue(t.sPath,t);});h.push(r.then(function(v){if(v&&typeof v==="object"){q.sap.log.error("Accessed value is not primitive",R,c);v=undefined;}F=t.vValue!==v;t.vValue=v;})["catch"](function(E){t.oModel.reportError("Failed to read path "+R,c,E);if(!E.canceled){F=t.vValue!==undefined;p={error:E};t.vValue=undefined;}return E.canceled;}));return Promise.all(h).then(function(i){var j=i[h.length-1];if(!j){t.bInitial=false;if(f||F){t._fireChange(o);}}if(D){t.fireDataReceived(p);}});};O.prototype.destroy=function(){var o=this.oCachePromise.getResult();if(o){o.deregisterChange(undefined,this);}else if(this.oContext){this.oContext.deregisterChange(this.sPath,this);}this.oModel.bindingDestroyed(this);this.oCachePromise=undefined;P.prototype.destroy.apply(this,arguments);};O.prototype.getValue=function(){return this.vValue;};O.prototype.getValueListType=function(){var r=this.getModel().resolve(this.sPath,this.oContext);if(!r){throw new Error(this+" is not resolved yet");}return this.getModel().getMetaModel().getValueListType(r);};O.prototype.makeCache=function(o){var d=this.oCachePromise.getResult(),r=this.sPath;if(d){d.setActive(false);}if(o&&!o.fetchValue){r=this.oModel.resolve(this.sPath,o);}if(r[0]==="/"){d=_.createProperty(this.oModel.oRequestor,r.slice(1),this.mQueryOptions);}else{d=undefined;}this.oCachePromise=a.resolve(d);};O.prototype.onChange=function(v){this.vValue=v;this._fireChange({reason:C.Change});};O.prototype.refreshInternal=function(g){this.makeCache(this.oContext);this.checkUpdate(true,C.Refresh,g);};O.prototype.requestValueListInfo=function(){var r=this.getModel().resolve(this.sPath,this.oContext);if(!r){throw new Error(this+" is not resolved yet");}return this.getModel().getMetaModel().requestValueListInfo(r);};O.prototype.setContext=function(o){var d=this.oCachePromise.getResult();if(this.oContext!==o){if(!d&&this.oContext){this.oContext.deregisterChange(this.sPath,this);}this.oContext=o;if(this.bRelative){this.makeCache(this.oContext);this.checkUpdate(false,C.Context);}}};O.prototype.setType=function(t){var o=this.oType;if(t&&t.getName()==="sap.ui.model.odata.type.DateTimeOffset"){t.setV4();}P.prototype.setType.apply(this,arguments);if(!this.bInitial&&o!==t){this._fireChange({reason:C.Change});}};O.prototype.setValue=function(v,g){var t=this;if(typeof v==="function"||typeof v==="object"){throw new Error("Not a primitive value");}this.oModel.checkGroupId(g);if(this.vValue!==v){this.oCachePromise.then(function(o){if(o){q.sap.log.error("Cannot set value on this binding",t.oModel.resolve(t.sPath,t.oContext),c);}else if(t.oContext){t.oContext.updateValue(g,t.sPath,v)["catch"](function(e){if(!e.canceled){t.oModel.reportError("Failed to update path "+t.oModel.resolve(t.sPath,t.oContext),c,e);}});}else{q.sap.log.warning("Cannot set value on relative binding without context",t.sPath,c);}});}};O.prototype.toString=function(){return c+": "+(this.bRelative?this.oContext+"|":"")+this.sPath;};return O;},true);
