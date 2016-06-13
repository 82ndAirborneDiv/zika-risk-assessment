(function(window, document, undefined) {

	window.CDC = window.CDC || {};
	window.CDC.Widget = window.CDC.Widget || {};
	window.CDC.Widget.load = function () {

		// ADD POINTER/SHORTCUT FOR COMMON
		window.cdcCommon = window.CDC.Widget.Common;

		// ADD POINTER/SHORTCUT FOR METRICS
		window.cdcMetrics = window.cdcCommon.metrics;

		cdcCommon.log('*********** Hello World! ***********');
		cdcCommon.log('Common Framework Loaded!');
		cdcCommon.log('Widget Load Method Executing Loaded!');

		// SET COURSE ID
		window.cdcCommon.runtime.callParams.courseId = window.cdcCommon.runtime.callParams.courseId || 'unknown_course_id';

		// UPDATE ID OF BODY
		document.body.id = window.cdcCommon.runtime.callParams.courseId;

		cdcCommon.log('Initializing Common Framework Metrics...');
		cdcMetrics.init({
			useMetrics : 'false'
		});
		cdcCommon.log('Common Framework Metrics Initialized!');

		cdcCommon.loadScript('/TemplatePackage/contrib/libs/jquery/jquery-1.11.2.min.js', function(){
			cdcCommon.loadScript('/TemplatePackage/contrib/libs/bootstrap/3.3.4/js/bootstrap.min.js', function(){

				cdcCommon.log('****************** ');
				cdcCommon.log(window.CDC.Widget.Common);

				var strEnvironment, objVersion, objWc = window.CDC.Widget.Common;

				objVersion = {
					rd_two_x : {
						env_label : "/TP/2x/",
						row_selector : "#env_rd_two_x",
						sourcefile : '/TemplatePackage/build.txt',
						env_version : null,
						req_version : cdcCommon.getCallParam('verRdTwoX') || "No Source Found"
					},
					rd_three_x : {
						env_label : "/TP/3x/",
						row_selector : "#env_rd_three_x",
						sourcefile : '/TemplatePackage/3.0/build.txt',
						env_version : null,
						req_version : cdcCommon.getCallParam('verRdThreeX') || "No Source Found"
					},
					rd_contrib : {
						env_label : "/TP/contrib/",
						row_selector : "#env_rd_contrib",
						sourcefile : '/TemplatePackage/contrib/build.txt',
						env_version : null,
						req_version : cdcCommon.getCallParam('verRdContrib') || "No Source Found"
					},
					rd_jscript  : {
						env_label : "/JScript/",
						row_selector : "#env_rd_jscript",
						sourcefile : '/JScript/build.txt',
						env_version : null,
						req_version : cdcCommon.getCallParam('verRdJscript') || "No Source Found"
					}
				};

				cdcCommon.log(cdcCommon);

				function getEnvironmentVersion (strEnv) {
					var objEnvCfg = objVersion[strEnv];
					$.ajax({
						type : 'GET',
						url : objEnvCfg.sourcefile,
						success : function(version){
							objEnvCfg.env_version = version;
							console.log(strEnv + "Version: " + objEnvCfg.env_version + "\nStatus: " + status);
							console.log(objVersion);
							var jqRow = $(objEnvCfg.row_selector);
							$('.env_name',jqRow).text(objEnvCfg.env_label);
							$('.req_version_text',jqRow).text(objEnvCfg.req_version.replace('Template Package Version: ',''));
							$('.version_text',jqRow).text(objEnvCfg.env_version.replace('Template Package Version: ',''));
							jqRow.addClass((objEnvCfg.req_version == objEnvCfg.env_version) ? 'bg-success' : 'bg-danger');
						},
						error : function(error){
							objEnvCfg.env_version = 'unknown';
							console.log(strEnv + "Version: " + objEnvCfg.env_version + "\nStatus: " + status);
							console.log(objVersion);
							var jqRow = $(objEnvCfg.row_selector);
							$('.env_name',jqRow).text(objEnvCfg.env_label);
							$('.req_version_text',jqRow).text(objEnvCfg.req_version.replace('Template Package Version: ',''));
							$('.version_text',jqRow).text(objEnvCfg.env_version);
							jqRow.addClass('bg-warning');
						}
					});
				}

				$(function(){

					$('#env_host').text(window.location.host);

					for(strEnvironment in objVersion) {
						getEnvironmentVersion(strEnvironment);
					}

				}());

				cdcCommon.log('****************** ');
			});
		});
	};

} (window, document));