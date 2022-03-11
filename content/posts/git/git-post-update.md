---
title: "Git Hooks 脚本问题"
date: 2020-03-05T00:00:00+08:00
categories: ["git"]
---

最近在做git hooks自动更新，偶然发现服务器仓库的[hooks]()脚本，命令里面[cd]()已经进入了一个仓库，准备拉取，但还是会报错
```shell
fatal: not a git repository
```

怀疑是环境变量的问题
```shell
env
```

发现
```shell
GIT_DIR=.
GIT_EXEC_PATH=/usr/libexec/git-core
GIT_PUSH_OPTION_COUNT=0
```

果然是git的环境变量影响了

直接[unset]()变量就好了
```shell
unset GIT_DIR
```
