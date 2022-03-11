---
title: "UniApp(uViewUI)弹出层滚动穿透问题"
date: 2020-03-06T00:00:00+08:00
categories: ["js"]
---

1. 动态修改页面属性  

在网上搜了下，说要设置[page-meta](https://uniapp.dcloud.net.cn/component/page-meta.html#page-meta)样式  
```html
<page-meta :page-style="{'overflow': scroll ? 'visible' : 'hidden' }">
```

如果每个有弹窗的页面都要额外再设置一个[page-meta](https://uniapp.dcloud.net.cn/component/page-meta.html#page-meta)的话，这就很不方便了  


2. 我们看下[uViewUI](https://www.uviewui.com/)弹窗例子  

```html
<template>
    <view>
        <u-popup :show="show" @close="close" @open="open" @touchmove.stop="">
            <scroll-view scroll-y style="height: 123rpx">
                <text>出淤泥而不染，濯清涟而不妖</text>
                <text>出淤泥而不染，濯清涟而不妖</text>
                <text>出淤泥而不染，濯清涟而不妖</text>
                <text>出淤泥而不染，濯清涟而不妖</text>
                <text>出淤泥而不染，濯清涟而不妖</text>
                <text>出淤泥而不染，濯清涟而不妖</text>
            </scroll-view>
        </u-popup>
    </view>
</template>
```

只需要在[u-popup](https://www.uviewui.com/components/popup.html)加上  
```html
@touchmove.stop=""
```
就能阻止滚动事件向上传递  

如果里面的内容需要滚动，可以使用[scroll-view](https://uniapp.dcloud.net.cn/component/scroll-view.html), 设置高度并且y轴溢出可滚动即可  
