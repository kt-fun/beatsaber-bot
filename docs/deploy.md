### 部署相关
该 bot 基于 koishi 框架，作为一个 koishi 插件开发。

因此你可以参考 [koishi](https://koishi.chat) 的框架进行部署，只需安装该插件即可使用。

::: tip
koishi 官方的文档完成度不高。且使用的部分工具链是经过二次封装的，这部分工具链甚至没有文档。因此，推荐的方式是使用 docker。

但是经过测试，当前（2024.03.01）使用官方的 docker 镜像安装部分插件会出现问题（而通过 template 安装同样的插件不会），因此也可以
自行打包 docker 镜像。

具体可参考其 template 项目的 [build action](https://github.com/koishijs/boilerplate/blob/master/.github/workflows/build.yml)
:::
