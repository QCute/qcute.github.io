---
title: "Git工作流"
date: 2020-03-05T00:00:00+08:00
categories: ["git"]
---

### 本地开发流程
1. 克隆仓库(git clone git@xxx:xxx.git)
2. 创建并切换到xxx_dev分支(git checkout -b xxx_dev或者git switch -c xxx_dev)
3. 开发
4. 开发完成(git add/stage xxx)
5. 提交(git commit -m "xxx")
6. 切换到master分支(git checkout master或者git switch master)
7. 合并xxx_dev分支代码(git merge xxx_dev)
8. <span id="8"></span>推送更新(git push origin master)
9. 如果远端有更新, fast-forwards
10. 以rebase方式拉取和合并代码(git pull --rebase origin master)
11. 若有冲突, 解决冲突, 然后再次[推送更新](#8)


### 测试仓库流程
1. 克隆仓库(git clone git@xxx:xxx.git)
2. 创建并切换到dev分支(git checkout -b dev或者git switch -c dev)
3. 配置生成 ...
4. 储藏本地变更(git stash)
5. 以rebase方式拉取和合并代码(git pull --rebase origin master)
6. <span id="6">弹出储藏(git stash pop)
7. 若有冲突, 使用策划的生成的配置数据(本地)覆盖(远端)提交的数据(git checkout --theirs .)
8. 暂存(git add/stage .)已解决的冲突, 再次[弹出储藏](#6)完成更新
9. 构建
