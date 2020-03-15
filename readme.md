# uni-dev-tools 是什么
uni-dev-tools是一个辅助开发 uni-app 的旁路辅助开发工具。对uni-app原目录设计只做优化，不做删除。他不是开发框架，也不是插件。
该工具只为简化开发人员工作,优化多人开发模式,负责将pages.json中的配置分解再合并的自动化工作。
解决pages.json混乱的问题。因此pages.json不需要提交,pages.json 将会由其他文件自动合并生成。

# pages.json 痛点
1.公有、私有混合，造成模块化开发，移植困难

2.团队开发，多人同时编辑该文件，代码提交，签出遇到若干问题

3.假若系统有50个view，那么pages.json 将会有1公里那么长，问谁能维护？



# uni-dev-tools 的愿望
1.满足系统功能模块化；

2.全局与私有解耦合；

3.避免团队开发不会同时编辑一个文件；

4.方便模块移植；

5.我希望的uni-app框架结构为：pages文件夹为各模块的根目录，其中一个文件夹就是一个模块，里面包含视图层，逻辑层，私有静态资源目录，私有路由配置文件。各功能模块的私有化配置，仅局限在各自的目录下，不与框架目录产生耦合关系。


# 因此 uni-dev-tools 干了以下这些事
1.应用根目录下增加了 config 目录，里面存放系统的全局配置文件，比如：condition.json,easy-com.json,global-style.json,tab-bar.json,通过各json文件的文件名可以看出，是对应pages.json 中的 各配置节点。

2.如果存在workers目录，在该目录下生成 config.json ,对应 pages.json 中的 workers 属性配置。

3.应用根目录下创建分包目录 sub-packages,并生成 preload-rule.json 对应 pages.json 中的preloadRule 分包下载规则 属性。今后所有分包都放在这个文件夹下，一个目录一个包，在该包下创建router.json文件，可对应pages.json 中的subPackages属性配置。

4.pages目录中存放主包页面模块，一个文件夹一个模块，该文件夹下的router.json 对应 pages.json 中的 pages 属性配置。

5.如果您对于以上的目录设计不满意，您可以自己进行精简，uni-dev-tools 监控的目录为"pages config workers sub-packages",监控的文件名为"router.json,condition.json,easy-com.json,global-style.json,config.json,tab-bar.json,preload-rule.json",

只要你确保是这项文件名和目录名，配置文件放置的层级结构你可以自定。比如你可以只创建config文件夹，并包配置都放在这个文件夹下，也是可以的啦。不需要强制按照我的目录编排。

5.监控以上各目录文件，发生新建或修改时，自动拉取配置，合并生成 pages.json


# 你要如何做
转到应用根目录下，运行
```
npm install uni-dev-tools

//对应用进行初始化,创建config目录、sub-packages目录、workers目录，这步不是必须，你也可以在今后的开发中，自己创建
npx uni-dev-tools init

//对文件进行监控
npx uni-dev-tools watch

```

# 下一步，你可以做什么
删除 pages.json