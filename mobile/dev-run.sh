#!/bin/sh
adb reverse tcp:4000 tcp:4000
adb reverse tcp:5173 tcp:5173
CAPACITOR_DEV=true bunx cap copy android
CAPACITOR_DEV=true bunx cap run android --target="8B6X148YH"
