# Hugo Theme Graphite

[![GitHub](https://img.shields.io/github/license/QCute/hugo-theme-graphite.svg?color=4664DA&style=flat-square)](https://github.com/QCute/hugo-theme-graphite/blob/master/LICENSE)

A simple and beautiful theme for Hugo

> It's a port of [ZOZO](https://github.com/varkai/hugo-theme-zozo)  
> Remove [JQuery](https://github.com/jquery/jquery), instead of [elevator.js](https://github.com/tholman/elevator.js) and [dom-slider](https://github.com/BrentonCozby/dom-slider)  
> Use [CloudFlare](https://cdnjs.com) CDN instead of local asset  
> [Hugo --minify](https://gohugo.io/hugo-pipes/minification/) local js/css assets minify supported  
> Add [Fuse.js](https://fusejs.io) local search  

**Features**

+ **Responsive**
+ **Syntax highlighting with highlightjs**
+ **Math with mathjax** 
+ **Social links(Customize)**
+ **Tags page**
+ **Archive page**
+ **[Giscus](https://giscus.app) comment-system**
+ **[Fancybox](https://fancyapps.com)**

[Demo](https://qcute.github.io) | [中文说明](./README-zh.md)

## Sceenshots

![graphite](./images/showcase.png)

## Installation

```bash
$ git clone https://github.com/qcute/hugo-theme-graphite themes/graphite
```

**Important**: Take a look inside the [`exampleSite`](./exampleSite) folder of this theme. You'll find a file called [`config.toml`](./exampleSite/config.toml). To use it, copy the [`config.toml`](./exampleSite/config.toml) in the root folder of your Hugo site. Feel free to change it.

## ExampleSite

There is an example site with config file and markdown files in `exampleSite` directory.

## About Page

Use the about page to introduce yourself to your visitors. You can customize the content as you like in the `/content/about/index.md`.

## Shortcodes

This theme provides `img` shortcodes.

```markdown
{{< img src="path/to/xxx.png" >}}
```

## MathJax

This theme supports MathJax, which are turned off by default. If you want to use them, you need to set them in `config.toml`.

Set `mathjax = true` under the `[params]` to support the MathJax.

## Giscus Comment System

This theme provides Giscus comment system, the default is closed, if you want to use, need to set in `config. toml`.

Set the `enableGiscus = true` under `[params]` to open Giscus.

## Social Link Icons

You can add a social link panel in the header by adding entries to the social block in the `config.toml`.

[Remix icon](https://remixicon.com/) is used in this theme.

## Nearly Finished

In order to see your site in action, run Hugo's built-in local server.

```bash
$ hugo server
```

Now enter `localhost:1313` in the address bar of your browser.

## License

Released under the [MIT](https://github.com/QCute/hugo-theme-graphite/blob/master/LICENSE) License.

## Acknowledgements

- [Aragaki](https://github.com/PCDotFan/Aragaki)
- [菩提树下](https://blog.caicai.me/)
- [olOwOlo](https://olowolo.com/)