---
title: "求职网站发布日期"
date: 2020-03-07T00:00:00+08:00
categories: ["misc"]
---

现在招聘网站几乎都不展示职位的原始发布日期，很多发布了好几个月甚至是好几年的职位，放着用来吸引简历，极大的浪费了求职者的时间、精力和感情。 

个人推荐[BOSS直聘](https://www.zhipin.com)，无效职位相对较少，主动询问大多数有回复，而其他网站大多数已读不回  
而高端职位则推荐[猎聘](https://www.liepin.com)，无论是HR还是猎头，职位匹配度、专业程度和回复效率都比较高  

```js
// 查找数据
const scripts = Array
    // 找全部script
    .from(document.querySelectorAll('script'))
    // 筛选类型为application/ld+json
    .filter((s) => s.type == "application/ld+json")
    // 提取script内容
    .map((s) => s.innerText);

// 转JSON
const data = JSON.parse(scripts[0]);

// BOSS直聘内容样例
// {
//    "@context": "https://zhanzhang.baidu.com/contexts/cambrian.jsonld",
//    "@id": "https://www.zhipin.com/job_detail/example.html",
//    "title": "「标题」_公司名称招聘-BOSS直聘",
//    "description": "职位描述",
//    "pubDate": "2020-03-03T00:00:00",
//    "upDate":  "2022-03-03T00:00:00"
// }
// 
// 其中pubDate字段就是发布日期

// 猎聘内容样例
// {
//     "@context": "https://ziyuan.baidu.com/contexts/cambrian.jsonld",
//     "appid": "appid",
//     "@id": "https://www.liepin.com/job/example.shtml",
//     "title": "【标题】_公司名称招聘信息-猎聘",
//     "description": "职位描述",
//     "pubDate": "2020-05-05T00:00:00",
//     "upDate": "2022-05-05T00:00:00"
// }
//
// 其中pubDate字段就是发布日期

```

目前[前程无忧](https://www.51job.com)，[智联](https://www.zhaopin.com)，[拉钩](https://www.lagou.com)还无法获取到真实的发布日期  
