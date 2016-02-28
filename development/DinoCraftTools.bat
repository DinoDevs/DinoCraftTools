::
:: DinoCraftTools
:: Copyright (c) DinoDevs
::
:: Windows execute script 
::

:: Do not display commands
ECHO OFF
:: Clear screen
CLS

:: BEFORE EXECUTE
:: READ THE "config readme" FILE AND
:: EDIT THE "config.json" FILE

::
:: To start execution :
:: 		"<path to nodejs>" "<path to dinocrafttools.js>"
::
:: Example, if nodejs.exe is on this folder :
:: 		"%~dp0nodejs.exe" "%~dp0scripts\dinocrafttools.js"
:: Example, if nodejs is on global path :
:: 		nodejs "%~dp0scripts\dinocrafttools.js"
::

:: For this let the nodejs.exe be next to this script
"%~dp0nodejs.exe" "%~dp0scripts\dinocrafttools.js"

:: Pause before exit
PAUSE
