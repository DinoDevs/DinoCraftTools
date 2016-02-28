#!/bin/sh

#
# DinoCraftTools
# Copyright (c) DinoDevs
#
# GNU/Linux execute script 
#

# Clear screen
printf "\033c"

# BEFORE EXECUTE
# READ THE "config readme" FILE AND
# EDIT THE "config.json" FILE

#
# To start execution :
# 		"<path to nodejs>" "<path to dinocrafttools.js>"
#
# Example, if nodejs.exe is on this folder :
# 		"%~dp0nodejs" "%~dp0scripts\dinocrafttools.js"
# Example, if nodejs is on global path :
# 		nodejs "%~dp0scripts\dinocrafttools.js"
#

# For this let the nodejs binary be next to this script
./nodejs ./scripts/dinocrafttools.js
