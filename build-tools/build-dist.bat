@echo off
@title bayconnct-build-dist
@set current_dir=%~dp0
@cd %current_dir%..
@set DIST_PATH=%current_dir%..\dist
if exist %DIST_PATH% (  
	DEL /F /A /Q %DIST_PATH%
)
yarn run build
@pause