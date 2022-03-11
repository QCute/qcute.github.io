---
title: "Android Intent Filter问题"
date: 2020-03-03T00:00:00+08:00
categories: ["android"]
---

有一次在用[KWGT](https://play.google.com/store/apps/details?id=org.kustom.widget)选择文件夹的时候, 突然闪退了, 记得以前是没有问题的  

于是使用[ADB](https://developer.android.com/studio/command-line/adb)查看日志  
```shell
adb logcat *:E
```

看到了错误日志如下  

* No activity found to handle intent  
> android.intent.action.OPEN_DOCUMENT  

* No activity found to handle intent  
> android.intent.action.OPEN_DOCUMENT_TREE

奇怪了个怪, 按道理像文件管理器等应该会响应这个或者这类Intent吧  

然后查看[Intent Filters](https://developer.android.com/guide/components/intents-filters), 看下有哪些Activity响应这个Intent  
```shell
adb shell dumpsys package r
```

发现了[com.android.documentsui]()这个包有响应  
原来是我之前禁用那些无用的应用或者组件时把它禁用掉了  

问题解决~  
