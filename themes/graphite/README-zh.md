# Hugo Theme Graphite

[![GitHub](https://img.shields.io/github/license/QCute/hugo-theme-graphite.svg?color=4664DA&style=flat-square)](https://github.com/QCute/hugo-theme-graphite/blob/master/LICENSE)

> 该主题移植自 [ZOZO](https://github.com/varkai/hugo-theme-zozo)  
> 移除了[JQuery](https://github.com/jquery/jquery), 由[elevator.js](https://github.com/tholman/elevator.js)和[dom-slider](https://github.com/BrentonCozby/dom-slider)代替  
> 使用 [CloudFlare](https://cdnjs.com) CDN代替本地资源  
> 支持[hugo --minify](https://gohugo.io/hugo-pipes/minification/)本地js/css资源最小化  
> 添加[Fuse.js](https://fusejs.io)本地搜索  

**特点**

+ **响应式**
+ **语法高亮使用highlightjs**
+ **数学公式使用mathjax** 
+ **社交链接(自定义)**
+ **标签页**
+ **归档页**
+ **[Giscus](https://giscus.app)评论系统**
+ **[Fancybox](https://fancyapps.com)**

**在线预览**：[Demo](https://qcute.github.io)

## 截图

![graphite](./images/showcase.png)

## 安装

首先进入 hugo 的站点目录运行下面的命令：

```bash
$ git clone https://github.com/qcute/hugo-theme-graphite themes/graphite
```

本主题提供了一个示例配置文件是 [`exampleSite`](./exampleSite) 目录里的 [`config.toml`](./exampleSite/config.toml) 文件。

配置文件中对大部分配置都有详细的注释说明，复制该文件到站点目录下，根据自己的情况修改即可。

更多安装信息查看 Hugo 官方文档 [setup guide](https://gohugo.io/overview/installing/)。

## 示例站点

`exampleSite` 是本主题的一个示例站点，里面有配置文件、关于页面的一些示例。

## 关于页面

使用关于页面，首先要在你的站点目录的 [`content`](./exampleSite/content/) 目录下创建一个 [`about`](./exampleSite/content/about/) 目录，然后再创建一个 [`index.md`](./exampleSite/content/about/index.md) 文件，最后编写该文件即可。

## Shortcodes

主题提供了 `img` shortcode.

```markdown
{{< img src="path/to/xxx.png" >}}
```

## Math 公式

本主题支持 MathJax 数学公式，默认为关闭状态，如需使用，需要在 [`config.toml`](./exampleSite/config.toml) 中进行设置。

设置 `[params]` 下的 `mathjax = true` 来支持数学公式。

## Giscus 评论

本主题提供了 Giscus 评论系统，默认为关闭状态，如需使用，需要在 [`config.toml`](./exampleSite/config.toml) 中进行设置。

设置 `[params]` 下的 `enableGiscus = true` 来开启评论系统。


## 社交链接

本主题的社交链接是字体图标的样式，并放置在了页面头部。你可以通过在 [`config.toml`](./exampleSite/config.toml) 的 `[social]` 模块中修改添加你的社交链接。

## 部署主题

配置完成之后，就可以使用下面的命令来启动 hugo 服务编译 markdown 文件生成静态站点：

```bash
$ hugo server
```

然后在浏览器地址栏输入 [localhost:1313](http://localhost:1313) 来访问站点。

## License

Released under the [MIT](https://github.com/QCute/hugo-theme-graphite/blob/master/LICENSE) License.

## 致谢

- [Aragaki](https://github.com/PCDotFan/Aragaki)
- [菩提树下](https://blog.caicai.me/)
- [olOwOlo](https://olowolo.com/)