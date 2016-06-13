$(function(){
	var strEnvironment, objVersion;

	objVersion = {
		rd_two_x : {
			sourcefile : '/TemplatePackage/build.txt',
			req_version : null,
			attribute: 'data-ver-rd-two-x'
		},
		rd_three_x : {
			sourcefile : '/TemplatePackage/3.0/build.txt',
			req_version : null,
			attribute: 'data-ver-rd-three-x'
		},
		rd_contrib : {
			sourcefile : '/TemplatePackage/contrib/build.txt',
			req_version : null,
			attribute: 'data-ver-rd-contrib'
		},
		rd_jscript  : {
			sourcefile : '/JScript/build.txt',
			req_version : null,
			attribute: 'data-ver-rd-jscript'
		}
	};

	function getEnvironmentVersion (strEnv, jqWorkers) {
		var objEnvCfg = objVersion[strEnv];
		$.ajax({
			type : 'GET',
			url : objEnvCfg.sourcefile,
			success : function(version){
				objEnvCfg.req_version = version;
				console.log(strEnv + " Version: " + objEnvCfg.req_version);
				jqWorkers.each(function(idx){
					$(this).attr(objEnvCfg.attribute, objEnvCfg.req_version)
				});
			},
			error : function(error){
				objEnvCfg.req_version = 'unknown';
				console.log(strEnv + " Version: " + objEnvCfg.req_version);
			},
			complete : function () {
				setTimeout(function() {
					window.CDC.Widget.Loader.init();
				}, 500);
			}
		});
	};

	$(function(){
		var jqWorkers =  $('[data-cdc-widget="deploymentCheck"]');
		if (jqWorkers.length) {
			for(strEnvironment in objVersion) {
				getEnvironmentVersion(strEnvironment,jqWorkers);
			}
		}
	}());
});