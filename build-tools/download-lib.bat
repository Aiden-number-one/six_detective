@echo off
@title bayconnct-download-lib
@set current_dir=%~dp0
@cd %current_dir%..
@set ANTV_PATH=%current_dir%..\node_modules\@antv
@echo ANTV_PATH=%ANTV_PATH%
if exist %ANTV_PATH% (  
	echo del old antv path
	rd /s /Q %ANTV_PATH%
)

yarn install --registry https://registry.npm.taobao.org
@pause
