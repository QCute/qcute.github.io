---
title: "微信小程序登录(wx.login)的 code 获取"
date: 2020-03-03T00:00:00+08:00
categories: ["android"]
---

闲来无事分析了一下, 微信版本是8.0.43

## 准备工具
- [jadx](https://github.com/skylot/jadx)
- [frida](https://github.com/frida/frida)
- [frida-node](https://www.npmjs.com/package/frida)

## 微信日志hook代码
```typescript
Java.perform(function () {

    const log = Java.use("com.tencent.mm.sdk.platformtools.Log");

    log.i.overload('java.lang.String', 'java.lang.String', '[Ljava.lang.Object;').implementation = function(tag: string, format: string, ...args: any) {
        console.info(tag, format, args);
    }

    log.w.overload('java.lang.String', 'java.lang.String', '[Ljava.lang.Object;').implementation = function(tag: string, format: string, ...args: any) {
        console.warn(tag, format, args);
    }

    log.e.overload('java.lang.String', 'java.lang.String', '[Ljava.lang.Object;').implementation = function(tag: string, format: string, ...args: any) {
        console.error(tag, format, args);
    }

    log.f.overload('java.lang.String', 'java.lang.String', '[Ljava.lang.Object;').implementation = function(tag: string, format: string, ...args: any) {
        console.debug(tag, format, args);
    }

});

```

## 核心日志

```log
MicroMsg.JsApiLogin start login
MicroMsg.JsApiLogin onSceneEnd errType = %d, errCode = %d ,errMsg = %s 0,0,
MicroMsg.JsApiLogin stev NetSceneJSLogin jsErrcode %d 0
MicroMsg.JsApiLogin onSuccess !
MicroMsg.JsApiLogin resp data code [%s] 0e1U1KHa1Sp0qG0ripJa1QYvlB2U1KHm
```

可以看出, 最后一行得到的就是[wx.login](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html)的code

在[jadx](https://github.com/skylot/jadx)搜索找到几个类
* [com.tencent.mm.plugin.appbrand.jsapi.auth.JsApiLogin.i]()
* [com.tencent.mm.plugin.appbrand.jsapi.auth.JsApiLogin.g]()
* [com.tencent.mm.plugin.appbrand.jsapi.auth.g0.a]()
* [com.tencent.mm.plugin.appbrand.jsapi.auth.h0.a]()


在[com.tencent.mm.plugin.appbrand.jsapi.auth.g0.a]()这个函数了, 找到最后一个参数的实体类[a50.c](), 并且找到字符串["/cgi-bin/mmbiz-bin/js-login"]()


而在[com.tencent.mm.plugin.appbrand.jsapi.auth.h0.a]()这个函数, 找到最后一个参数的实体类[a50.d](), 并且找到字符串["/cgi-bin/mmbiz-bin/js-login-confirm"](), 那就是说这是弹窗确认的API

