/*! RD_TemplatePackage_Contrib 2015-12-16 Build: 1.4.1.1 */
!function(window,document,undefined){window.CDC=window.CDC||{},window.CDC.Widget=window.CDC.Widget||{},window.CDC.Widget.load=function(){window.cdcCommon=window.CDC.Widget.Common,window.cdcMetrics=window.cdcCommon.metrics,window.cdcCommon.runtime.callParams.courseId=window.cdcCommon.runtime.callParams.courseId||"unknown_course_id",window.cdcCommon.runtime.callParams.theme=window.cdcCommon.runtime.callParams.theme||"none",document.body.id=window.cdcCommon.runtime.callParams.courseId,cdcMetrics.init({pageName:"Quiz Module | Quiz:"+window.cdcCommon.runtime.callParams.courseId,useMetrics:"false"}),cdcCommon.loadScript("./core/js/controllers.js",function(){cdcCommon.loadScript("./core/js/app.js",function(){})})},window.CDC.Widget.syndicatedLoad=function(cdcCommon){cdcCommon=cdcCommon||window.cdcCommon||window.CDC.Widget.Common,cdcCommon.log("I am widget.js, I am being syndicated!"),cdcCommon.log("Syndication specific handlers here!")}}(window,document);