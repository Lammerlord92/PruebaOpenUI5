/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/core/Control","sap/m/OverflowToolbar"],function(q,l,C,O){"use strict";var D=C.extend("sap.f.DynamicPageTitle",{metadata:{library:"sap.f",aggregations:{heading:{type:"sap.ui.core.Control",multiple:false,defaultValue:null},actions:{type:"sap.ui.core.Control",multiple:true,singularName:"action"},snappedContent:{type:"sap.ui.core.Control",multiple:true},expandedContent:{type:"sap.ui.core.Control",multiple:true},_overflowToolbar:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}}}});function i(o){return typeof o==="function";}D.prototype.init=function(){this._bShowSnappedContent=false;this._bShowExpandContent=true;this._fnActionSubstituteParentFunction=function(){return this;}.bind(this);};D.prototype.onBeforeRendering=function(){this._getOverflowToolbar();};D.prototype.onAfterRendering=function(){this._cacheDomElements();this._setShowSnapContent(this._getShowSnapContent());this._setShowExpandContent(this._getShowExpandContent());};D.prototype.ontap=function(e){if(e.srcControl===this||this.getAggregation("_overflowToolbar")===e.srcControl){this.fireEvent("_titlePress");}};D.prototype._cacheDomElements=function(){this.$snappedWrapper=this.$("snapped-wrapper");this.$expandWrapper=this.$("expand-wrapper");};D.prototype._getOverflowToolbar=function(){if(!this.getAggregation("_overflowToolbar")){this.setAggregation("_overflowToolbar",new O({id:this.getId()+"-overflowToolbar"}).addStyleClass("sapFDynamicPageTitleOverflowToolbar"));}return this.getAggregation("_overflowToolbar");};D.prototype._preProcessAction=function(a){if(i(a._fnOriginalGetParent)){return;}a._fnOriginalGetParent=a.getParent;a.getParent=this._fnActionSubstituteParentFunction;};D.prototype._postProcessAction=function(a){if(!i(a._fnOriginalGetParent)){return;}a.getParent=a._fnOriginalGetParent;};["addAction","insertAction","removeAction","indexOfAction","removeAllActions","destroyActions","getActions"].forEach(function(m){D.prototype[m]=function(c){var t=this._getOverflowToolbar(),T=m.replace(/Actions?/,"Content"),r;if(m==="addAction"||m==="insertAction"){r=t[T].apply(t,arguments);this._preProcessAction(c);return r;}else if(m==="removeAction"){this._postProcessAction(c);}else if(m==="removeAllActions"||m==="destroyActions"){this.getActions().forEach(this._postProcessAction,this);}return t[T].apply(t,arguments);};});D.prototype._setShowSnapContent=function(v){this._bShowSnappedContent=v;this.$snappedWrapper.toggleClass("sapUiHidden",!v);this.$snappedWrapper.parent().toggleClass("sapFDynamicPageSnapContentVisible",v);};D.prototype._getShowSnapContent=function(){return this._bShowSnappedContent;};D.prototype._setShowExpandContent=function(v){this._bShowExpandContent=v;this.$expandWrapper.toggleClass("sapUiHidden",!v);this.$snappedWrapper.parent().toggleClass("sapFDynamicPageExpandContentVisible",v);};D.prototype._getShowExpandContent=function(){return this._bShowExpandContent;};return D;},false);
