/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/Device','sap/ui/core/Component','sap/ui/core/UIComponent','sap/ui/core/mvc/Controller','sap/ui/model/json/JSONModel','sap/m/MessageToast','../data'],function(q,D,C,U,a,J,M,d){"use strict";return a.extend("sap.ui.demokit.explored.view.code",{_aMockFiles:["products.json","supplier.json","img.json"],onInit:function(){this.router=U.getRouterFor(this);this.router.attachRoutePatternMatched(this.onRouteMatched,this);this._viewData=sap.ui.getCore().byId("app").getViewData();this._viewData.component.codeCache={};},onRouteMatched:function(e){if(e.getParameter("name")!=="code"&&e.getParameter("name")!=="code_file"){return;}this._sId=e.getParameter("arguments").id;var f=decodeURIComponent(e.getParameter("arguments").fileName);var s=d.samples[this._sId];if(!s){this.router.myNavToWithoutHash("sap.ui.demokit.explored.view.notFound","XML",false,{path:this._sId});return;}if(!this._oData||s.id!==this._oData.id){var c='sampleComp-'+this._sId;var b=this._sId;var o=sap.ui.component(c);if(!o){o=sap.ui.getCore().createComponent({id:c,name:b});}var m=o.getMetadata();var g=(m)?m.getConfig():null;this._oData={id:s.id,title:"Code: "+s.name,name:s.name,stretch:g.sample?g.sample.stretch:false,files:[],iframe:g.sample.iframe,fileName:f,includeInDownload:g.sample.additionalDownloadFiles};if(g&&g.sample&&g.sample.files){var r=q.sap.getModulePath(s.id);for(var i=0;i<g.sample.files.length;i++){var F=g.sample.files[i];var h=this.fetchSourceFile(r,F);this._oData.files.push({name:F,raw:h,code:this._convertCodeToHtml(h)});}}}else{this._oData.fileName=f;}var j=new J(this._oData);this.getView().setModel(j);j.refresh(true);var p=this.getView().byId("page");p.scrollTo(0);},fetchSourceFile:function(r,f){var t=this;var u=r+"/"+f;var s=function(b){t._viewData.component.codeCache[u]=b;};var e=function(b){t._viewData.component.codeCache[u]="not found: '"+u+"'";};if(!(u in this._viewData.component.codeCache)){this._viewData.component.codeCache[u]="";q.ajax(u,{async:false,dataType:"text",success:s,error:e});}return t._viewData.component.codeCache[u];},onDownload:function(e){q.sap.require("sap.ui.thirdparty.jszip");var z=new JSZip();var o=this.getView().getModel().getData(),r=0;for(var i=0;i<o.files.length;i++){var f=o.files[i],R=f.raw,F=f.name.split("../").length-1,s=f.name.slice();if(F>r){r=F;}if(F>0){s=f.name.slice(f.name.lastIndexOf("../")+3);}if(s&&(s===o.iframe||s.split(".").pop()==="html")){R=this._changeIframeBootstrapToCloud(R);}z.file(s,R);for(var j=0;j<this._aMockFiles.length;j++){var m=this._aMockFiles[j];if(f.raw.indexOf(m)>-1){z.file("mockdata/"+m,this.downloadMockFile(m));}}}var b=q.sap.getModulePath(this._sId),E=o.includeInDownload||[],t=this;if(!o.iframe){z.file("Component.js",this.fetchSourceFile(b,"Component.js"));z.file("index.html",this._changeIframeBootstrapToCloud(this.createIndexFile(o,r)));}E.forEach(function(g,h){z.file(g,t.fetchSourceFile(b,g));});var c=z.generate({type:"blob"});this._openGeneratedFile(c);},_openGeneratedFile:function(c){q.sap.require("sap.ui.core.util.File");var F=sap.ui.require("sap/ui/core/util/File");F.save(c,this._sId,"zip","application/zip");},createIndexFile:function(o,r){var h,s;var R=q.sap.getModulePath("sap.ui.demokit.explored.tmpl");var I=this.fetchSourceFile(R,"index.html.tmpl");I=I.replace(/{{TITLE}}/g,o.name);I=I.replace(/{{SAMPLE_ID}}/g,o.id);var p="",O=o.id.slice();for(var i=0;i<r;i++){O=O.substring(0,O.lastIndexOf("."));p+="\""+O+"\" : \"./\", ";}I=I.replace(/{{PARENT_RESOURCES}}/g,p);h=o.stretch?'height : "100%", ':"";I=I.replace(/{{HEIGHT}}/g,h);s=!o.stretch;I=I.replace(/{{SCROLLING}}/g,s);return I;},downloadMockFile:function(f){var r=q.sap.getModulePath("sap.ui.demo.mock");var w="test-resources/sap/ui/demokit/explored/img/";var c="https://openui5.hana.ondemand.com/test-resources/sap/ui/demokit/explored/img/";var R=new RegExp(w,"g");var m=this.fetchSourceFile(r,f);if(m){m=m.replace(R,c);}return m;},onNavBack:function(){this.router.navTo("sample",{id:this._sId},true);},_convertCodeToHtml:function(c){q.sap.require("jquery.sap.encoder");c=c.toString();c=c.replace(/^function.+{/,"");c=c.replace(/}[!}]*$/,"");c=c.replace(/^[\n\s\S]*\/\/\s*CODESNIP_START\n/,"");c=c.replace(/\/\/\s*CODESNIP_END[\n\s\S]*$/,"");c=c.replace(/\t/g,"  ");return c;},_changeIframeBootstrapToCloud:function(r){var b=/src=(?:"[^"]*\/sap-ui-core\.js"|'[^']*\/sap-ui-core\.js')/;var c=new URI(window.location.href).search("");var R=new URI(q.sap.getResourcePath("","/sap-ui-core.js"));var B=R.absoluteTo(c).toString();return r.replace(b,'src="'+B+'"');},handleTabSelectEvent:function(e){var f=e.getParameter("selectedKey");this.router.navTo("code_file",{id:this._sId,fileName:encodeURIComponent(f)},false);}});},true);
