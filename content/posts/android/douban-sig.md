---
title: "豆瓣APIV2的sig(签名)算法"
date: 2020-03-03T00:00:00+08:00
categories: ["android"]
---

## 模拟豆瓣API请求, 抓包后看到请求参数带有这个签名数据, 服务器会进行校验。

### 豆瓣版本7.66.0

## 准备工具
- [jadx](https://github.com/skylot/jadx)
- ~~[frida](https://github.com/frida/frida)~~
- ~~[frida-node](https://www.npmjs.com/package/frida)~~
- [JsHook](https://jshook.org)

### 由于豆瓣无法使用[frida](https://github.com/frida/frida)和[frida-strong](https://github.com/hzzheyang/strongR-frida-android), 故转换成[JsHook](https://jshook.org)

### [Jadx]()全局搜索([Ctrl+Shift+F]())_sig, 找到重点函数[v6.b.intercept](), 核心[Smali]()代码如下
```Smali
                Pair R3 = e0.a.R(request);
                if (R3 != null) {
                    request = request.newBuilder().url(request.url().newBuilder().setQueryParameter("_sig", (String) R3.first).setQueryParameter(bl.f29262h, (String) R3.second).build()).build();
                }

```

### 从[e0.a.R]()跳转找到[e0.a.Q]()

### [e0.a.Q]()的核心[Smali]()代码如下
```Smali
    public static Pair Q(String str, String str2, String str3) {
        String decode;
        String str4 = null;
        if (TextUtils.isEmpty(str)) {
            return null;
        }
        String str5 = v6.e.d().e.b;
        if (TextUtils.isEmpty(str5)) {
            return null;
        }
        StringBuilder r10 = android.support.v4.media.a.r(str2);
        String encodedPath = HttpUrl.parse(str).encodedPath();
        if (encodedPath == null || (decode = Uri.decode(encodedPath)) == null) {
            return null;
        }
        if (decode.endsWith("/")) {
            decode = android.support.v4.media.e.q(decode, -1, 0);
        }
        r10.append("&");
        r10.append(Uri.encode(decode));
        if (!TextUtils.isEmpty(str3)) {
            r10.append("&");
            r10.append(str3);
        }
        long currentTimeMillis = System.currentTimeMillis() / 1000;
        r10.append("&");
        r10.append(currentTimeMillis);
        String sb2 = r10.toString();
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(str5.getBytes(), LiveHelper.HMAC_SHA1);
            Mac mac = Mac.getInstance(LiveHelper.HMAC_SHA1);
            mac.init(secretKeySpec);
            str4 = Base64.encodeToString(mac.doFinal(sb2.getBytes()), 2);
        } catch (Exception e10) {
            e10.printStackTrace();
        }
        return new Pair(str4, String.valueOf(currentTimeMillis));
    }

```

- ①[str]()是请求URL的[path]()编码
- ②[str2]()是请求的方法,例如GET/POST等
- ③[str3]()是抓包HTTP请求头上的Authorization字段去除Bearer和空格, 也就是后面的一串值
- ④[currentTimeMillis]()是秒级时间戳
- [str5]()是[HMAC_SHA1]()的key, 我抓到的值是[bf7dddc7c9cfe6f7]()

### 核心算法

#### 把上述的前四个参数用`&`拼接起来, 然后使用[HMAC_SHA1]()算法进行签名, 再进行[Base64]()编码
```python
#!/bin/env python
from urllib import parse
import time
import hmac
import base64

def sig(method, url, authorization, ts)
    path = parse.urlparse(url).path.replace('/', '%2F')
    message = "{method}&{path}&{authorization}&{ts}"
    digest = hmac.new(b'bf7dddc7c9cfe6f7', message.encode(), 'sha1').digest()
    return base64.base64encode(digest)

if __name__ == "__main__":
    ts = str(int(time.time()))
    url = 'https://frodo.douban.com/api/v2/group/123456/topics?'
    auth = 'dbfb33b4a67d968e93f19b1df378c3aa'
    print(sig('GET', url, auth, ts))
```

### Hook代码
```typescript
XposedBridge.hookAllMethods(XposedHelpers.findClass("e0.a", runtime.classLoader), "Q", XC_MethodReplacement({
    replaceHookedMethod: function (param) {
        // XposedHelpers.getStaticObjectField(XposedHelpers.findClass('com.test.test',runtime.classLoader),'name');
        console.log('v6.e.d().e.b:《', 
            XposedHelpers.getObjectField(
                XposedHelpers.getObjectField(
                    XposedHelpers.callStaticMethod(
                        XposedHelpers.findClass('v6.e', runtime.classLoader), 'd'),
                    'e'
                ),
                'b'
            ), 
        "》");
        console.log('hook:《', param.args[0], '》《', param.args[1], '》《', param.args[2], '》');
        return XposedBridge.invokeOriginalMethod(param.method, param.thisObject, param.args);
    }
}));
```

## 核心日志

```log
[com.douban.frodo]: hook:《https://frodo.douban.com/api/v2/group/123456/topics?count=20&sortby=hot&use_card_mode=true&screen_width=1080&boot_mark=5bb12f1b-4396-43ca-88d5-d0ac6b0f7e7a%0A&screen_height=1920&wx_api_ver=671099729&opensdk_ver=638058496&webview_ua=Mozilla%2F5.0%20%28Linux%3B%20Android%209%3B%20MI%206%20Build%2FPKQ1.190118.001%3B%20wv%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Version%2F4.0%20Chrome%2F103.0.5060.129%20Mobile%20Safari%2F537.36&sugar=46001&update_mark=1654910940.917463998&miui_ver=V11.0.5.0.PCACNXM&network=4G&enable_sdk_bidding=1&apikey=0dad551ec0f84ed02907ff5c42e8ec70&channel=Yingyongbao_Market&udid=a0f13b543f8b353ce3a78563d342481f1ad9f4bf&os_rom=miui6&oaid=Vzc%2FWIeQaLQy2nl8IUFIyJQZ4Mpulwe6tosmnjjujgM%3D%0A&timezone=Asia%2FShanghai》《GET》《dbfb33b4a67d968e93f19b1df378c3aa》
[com.douban.frodo]: v6.e.d().e.b:《bf7dddc7c9cfe6f7》
```
