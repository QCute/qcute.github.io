---
title: "Windows系统代理脚本"
date: 2020-03-03T00:00:00+08:00
categories: ["batch"]
---

Windows 10下设置系统代理老是要打开设置 -> 网络 -> 代理  
于是写了个脚本来设置和开启/关闭代理  

```bat
@echo off
chcp 65001>nul
SetLocal

:: status
for /f %%i in ('PowerShell -NoLogo -NonInteractive -NoProfile -Command "$(Get-ItemProperty -Path \"HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings\" -Name \"ProxyEnable\").ProxyEnable"') do (
    set status=%%i
)


:: server
for /f %%i in ('PowerShell -NoLogo -NonInteractive -NoProfile -Command "$(Get-ItemProperty -Path \"HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings\" -Name \"ProxyServer\").ProxyServer"') do (
    set server=%%i
)


:: toggle
if "%1" == "" goto toggle


:proxy
PowerShell -NoLogo -NonInteractive -NoProfile -Command "Write-Host 'Found proxy address ' -NoNewLine ; Write-Host -Fore Cyan '%server%' -NoNewLine ; Write-Host ' from argument, ' -NoNewLine ; Write-Host -Fore Green 'enable' -NoNewLine ; Write-Host ' system proxy...'"
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 1 /f >nul 2>nul
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyServer /d "%1" /f >nul 2>nul
goto end


:toggle
if "%server%" == "" goto disable
if "%status%" == "1" goto disable


:enable
PowerShell -NoLogo -NonInteractive -NoProfile -Command "Write-Host 'Found proxy address ' -NoNewLine ; Write-Host -Fore Blue '%server%' -NoNewLine ; Write-Host ' from registry, ' -NoNewLine ; Write-Host -Fore Green 'enable' -NoNewLine ; Write-Host ' system proxy...'"
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 1 /f >nul 2>nul
goto end


:disable
PowerShell -NoLogo -NonInteractive -NoProfile -Command "Write-Host 'Proxy ' -NoNewLine ; Write-Host -Fore Blue 'IP:PORT' -NoNewLine ; Write-Host ' not set, ' -NoNewLine ; Write-Host -Fore Red 'disable' -NoNewLine ; Write-Host ' system proxy...'"
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f >nul 2>nul
goto end


:end
EndLocal
```

* 设置并开启代理
```bat
proxy.bat 127.0.0.1:1080
```

* 开启/关闭代理

```bat
proxy.bat
```

注册表参考

> 是否开启代理  
> HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings\ProxyEnable

> 代理地址  
> HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings\ProxyServer
