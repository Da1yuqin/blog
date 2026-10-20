# Day / Journal

随笔、旅行记录和项目复盘：[阅读博客](https://da1yuqin.github.io/blog/)。

```sh
bundle install
bundle exec jekyll serve
```

本地访问 `http://127.0.0.1:4000/blog/`。本仓库的 `_posts/` 仅保存文章元数据；完整正文保存在私有 HappyLog 仓库的 `blog-source/_posts/`，由 `blog-source/sync.py` 生成目录和公开页面外壳。文章权限由后台动态控制，`images/` 中的图片是公开资源。评论使用既有服务，旧留言地址保持不变。

主题基于 [AcadHomepage](https://github.com/RayeRen/acad-homepage.github.io) 与 [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes)，保留原 MIT LICENSE；Font Awesome 保留其原许可。
