---
title: "C#的一些'冷'知识"
date: 2020-03-04T00:00:00+08:00
categories: ["cs"]
---

1. 所有源代码文件，默认编码为 UTF-8(with [BOM](https://simple.wikipedia.org/wiki/Byte_order_mark))  
2. 源文件所有的[string](https://learn.microsoft.com/zh-cn/dotnet/api/system.string)字面值，默认编码均为 Unicode (UTF-16)  
3. 使用不带[BOM](https://simple.wikipedia.org/wiki/Byte_order_mark)的UTF-8的源文件，编译时需要添加-codepage:65001选项，不然会出现奇怪的[CS0103](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/compiler-messages/cs0103)问题，而且在[控制台](https://learn.microsoft.com/zh-cn/dotnet/api/system.console.writeline)打印字符串会乱码  
