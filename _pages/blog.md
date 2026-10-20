---
permalink: /
title: "Blog"
excerpt: ""
comments_page: /blog/
author_profile: false
---

<script>document.body.classList.add('blog-page');</script>

<style>
  body.blog-page { background: var(--day-paper, #fcfbf8); }
  body.blog-page .sidebar { display: none !important; }
  body.blog-page #main { width: min(940px, calc(100% - 48px)); max-width: none; margin: 0 auto; padding: 0 0 64px; }
  body.blog-page .page { float: none; width: 100%; padding: 0; margin: 0; }
  body.blog-page .page .page__inner-wrap { padding: 0; border: 0; background: transparent; box-shadow: none; }
  .az-blog__profile { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,.85fr); gap: 64px; align-items: center; padding: 48px 0 56px; border-bottom: 1px solid var(--day-line); }
  .az-blog__identity { min-width: 0; }
  .az-blog .az-blog__eyebrow { margin: 0 0 28px; font-size: 11px; letter-spacing: .18em; color: var(--day-accent); }
  .az-blog__admin-link { margin-left: 14px; color: #747c6d; font-size: 10px; letter-spacing: .03em; text-decoration: none; }
  .az-blog__admin-link:hover { color: #526349; text-decoration: underline; }
  .az-blog__avatar { width: 88px; height: 106px; margin-bottom: 20px; }
  .az-blog__avatar img { display: block; width: 100%; height: 100%; object-fit: contain; }
  .az-blog .az-blog__quote { margin: 0 0 22px; font-family: "Iowan Old Style", "Palatino Linotype", "Songti SC", "Noto Serif CJK SC", serif; font-size: 34px; font-weight: 500; line-height: 1.55; color: var(--day-ink); }
  .az-blog__quote em { font-weight: 400; }
  .az-blog .az-blog__sub { margin: 8px 0 0; font-size: 13px; line-height: 1.8; color: #707667; }
  .az-blog__socials { display: flex; gap: 18px; margin-top: 22px; }
  .az-blog__socials a { font-size: 11px; letter-spacing: .06em; color: #626d58; text-decoration: none; border-bottom: 1px solid #bbc3b1; padding-bottom: 2px; }
  .az-blog__socials a:hover { color: #293e22; border-color: #293e22; }
  .az-blog__art { min-width: 0; width: 100%; max-width: 330px; margin: 0 auto; }
  .az-blog__art--original { position: relative; aspect-ratio: 1170 / 1590; overflow: hidden; }
  .az-blog__art--original img { position: absolute; top: -36.164%; left: 0; display: block; width: 100%; height: auto; }
  .az-blog .az-blog__section-title { scroll-margin-top: 85px; margin: 36px 0 22px; border: 0; font-size: 25px; font-weight: 500; }
  .az-blog__categories { display: flex; flex-wrap: wrap; gap: 10px 28px; border-bottom: 1px solid var(--day-line); }
  .az-blog__categories button { position: relative; margin: 0 0 -1px; padding: 8px 0 12px; border: 0; border-bottom: 2px solid transparent; border-radius: 0; background: transparent; color: #747c6d; font: inherit; font-size: 13px; cursor: pointer; }
  .az-blog__categories button[aria-selected="true"] { border-color: #526349; color: #303c2a; }
  .az-blog__categories button:hover { color: #526349; }
  .az-blog__category-count { margin-left: 7px; font-size: 10px; opacity: .7; }
  .az-blog .az-blog__category-description { margin: 14px 0 6px; color: #757d6d; font-size: 12px; }
  .az-blog__posts { display: flex; flex-direction: column; }
  .az-blog__posts:empty { min-height: 210px; }
  .az-blog__loading { display: flex; align-items: center; gap: 18px; min-height: 115px; margin-top: -180px; margin-bottom: 70px; color: #747c6d; font-size: 12px; }
  .az-blog__loading[hidden] { display: none; }
  .az-blog__loading .day-image-runner { flex: 0 0 auto; width: 84px; }
  .az-blog__loading .day-image-dog { width: 64px; }
  .az-blog__loading .day-image-treadmill { width: 76px; }
  .az-blog__loading .day-image-dog { animation: day-dog-run .7s step-end infinite, day-dog-bob .35s ease-in-out infinite; }
  .az-blog__loading .day-image-treadmill::before { animation: day-treadmill-belt 1s linear infinite; }
  .az-blog__loading .day-image-treadmill::after { animation: day-treadmill-progress 2.2s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) { .az-blog__loading .day-image-dog, .az-blog__loading .day-image-treadmill::before, .az-blog__loading .day-image-treadmill::after { animation: none; } }
  .az-blog__loading[data-error="true"] .day-image-runner { display: none; }
  .az-blog__loading button { border: 0; border-bottom: 1px solid #cdd3c6; padding: 4px 0; background: transparent; color: #526349; font: inherit; cursor: pointer; }

  .az-post { display: grid; grid-template-columns: 210px minmax(0,1fr); align-items: center; gap: 32px; padding: 28px 0; border-bottom: 1px solid var(--day-line); background: transparent; }
  .az-post__cover { display: block; position: relative; height: 170px; overflow: hidden; background: #fff; }
  .az-post__cover img { display: block; width: 100%; height: 170px; object-fit: contain; }
  .az-post__cover--taichi img { position: absolute; width: 125px; height: auto; top: -36.164%; left: 50%; transform: translateX(-50%); }
  .az-post__body { min-width: 0; }
  .az-post__body:only-child { grid-column: 1 / -1; }
  .az-post__meta { color: #757d6d; font-size: 11px; letter-spacing: .01em; }
  .az-post .az-post__title { margin: 8px 0 10px; font-size: 22px; font-weight: 600; line-height: 1.5; }
  .az-post__title a { color: #30362e; text-decoration: none; }
  .az-post__title a:hover { color: #526349; text-decoration: underline; }
  .az-post__title-image { display: block; width: min(360px, 100%); height: auto; }
  .az-post .az-post__excerpt { margin: 0; color: #707667; font-size: 13px; line-height: 1.85; }
  .az-post__tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; font-size: 11px; color: #68775b; }
  .az-post__tags span + span:before { content: '·'; margin-right: 10px; color: #b4b7aa; }
  .az-blog__pagination { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin: 24px 0; font-size: 12px; color: #747c6d; }
  .az-blog__pagination button { padding: 6px 0; border: 0; border-bottom: 1px solid #cdd3c6; border-radius: 0; background: transparent; color: #526349; font: inherit; font-size: 12px; cursor: pointer; }
  .az-blog__pagination button:disabled { opacity: .3; cursor: default; }
  .az-blog__empty { margin: 34px 0; font-size: 13px; color: #747c6d; }
  .az-post[hidden], .az-blog__empty[hidden], .az-blog__pagination[hidden] { display: none !important; }
  @media (max-width: 640px) {
    body.blog-page #main { width: calc(100% - 40px); }
    .az-blog__profile { gap: 18px; padding: 32px 0; grid-template-columns: minmax(0,1fr) minmax(0,.8fr); }
    .az-blog .az-blog__eyebrow { margin-bottom: 18px; font-size: 10px; }
    .az-blog__avatar { width: 65px; height: 78px; }
    .az-blog .az-blog__quote { font-size: 23px; }
    .az-blog .az-blog__sub { font-size: 11px; }
    .az-blog__art { max-width: 220px; }
    .az-blog__socials { gap: 12px; }
    .az-blog__categories { gap: 5px 18px; }
    .az-blog__categories button { font-size: 12px; }
    .az-post { grid-template-columns: 110px minmax(0,1fr); gap: 18px; padding: 24px 0; }
    .az-post__cover, .az-post__cover img { height: 120px; }
    .az-post__cover--taichi img { width: 88px; height: auto; }
    .az-post .az-post__title { font-size: 18px; }
    .az-post .az-post__excerpt { font-size: 12px; }
    .az-post__tags { margin-top: 9px; }
  }
  @media (max-width: 380px) {
    .az-blog__profile { grid-template-columns: 1fr; }
    .az-blog__art { max-width: 170px; }
    .az-post { grid-template-columns: 1fr; gap: 12px; }
    .az-post__cover { width: 100%; }
  }
</style>

<div class="az-blog">
  <section class="az-blog__profile">
    <div class="az-blog__identity">
    <p class="az-blog__eyebrow">DAY / JOURNAL <a class="az-blog__admin-link" href="{{ '/admin/' | relative_url }}" target="_self">管理总览</a></p>
    <div class="az-blog__avatar">
      {% include site-image.html src='/images/blog-day-plush-avatar.png' alt='Day 的呆呆小狗玩偶，穿着草莓上衣和绿色流苏裙' sizes='160px' loading='eager' %}
    </div>
    <div class="az-blog__intro">
      <p class="az-blog__quote">表达自己，才能<br /><em>make influence!</em></p>
      <p class="az-blog__sub">这里记录我的随笔、研究笔记和项目复盘。</p>
      <p class="az-blog__sub"><a href="#footprints">评论区：聊聊你的想法</a></p>
      <div class="az-blog__socials" aria-label="social links">
        <a href="https://github.com/Da1yuqin" title="GitHub">GH</a>
        <a href="{{ site.blog_access_api | append: '/api/blog/feed' | escape }}" title="订阅公开文章">RSS</a>
      </div>
    </div>
    </div>
    <figure class="az-blog__art az-blog__art--original">
      {% include site-image.html src='/images/blog-taichi-original.jpg' alt='太一骑在暴龙兽头上的原图' sizes='(max-width: 768px) 360px, 410px' loading='eager' %}
    </figure>
  </section>

  <h2 class="az-blog__section-title" id="articles">Articles</h2>

  <div class="az-blog__categories" role="tablist" aria-label="博客分类">
    <button type="button" role="tab" id="blog-tab-all" aria-selected="true" aria-controls="blog-posts" data-blog-filter="all" data-description="这里记录了全部的博客">全部<span class="az-blog__category-count" aria-hidden="true">—</span></button>
    <button type="button" role="tab" id="blog-tab-misc" aria-selected="false" aria-controls="blog-posts" tabindex="-1" data-blog-filter="misc" data-description="碎碎念，随便看看">杂七杂八<span class="az-blog__category-count" aria-hidden="true">—</span></button>
    <button type="button" role="tab" id="blog-tab-travel" aria-selected="false" aria-controls="blog-posts" tabindex="-1" data-blog-filter="travel" data-description="探索地球中">地球OL打卡<span class="az-blog__category-count" aria-hidden="true">—</span></button>
    <button type="button" role="tab" id="blog-tab-planner" aria-selected="false" aria-controls="blog-posts" tabindex="-1" data-blog-filter="planner" data-description="其实，我也有努力工作">J人模式副产物<span class="az-blog__category-count" aria-hidden="true">—</span></button>
  </div>
  <p class="az-blog__category-description" id="blog-category-description" role="status" aria-live="polite">这里记录了全部的博客</p>

  <section class="az-blog__posts" id="blog-posts" role="tabpanel" aria-labelledby="blog-tab-all" aria-busy="true" data-api="{{ site.blog_access_api | escape }}" data-site-base="{{ '/' | relative_url }}"></section>
  <div class="az-blog__loading" id="blog-list-loading" role="status" aria-live="polite">
    <span class="day-image-runner" aria-hidden="true"><span class="day-image-dog"></span><span class="day-image-treadmill"></span></span>
    <span id="blog-list-status">正在加载文章……</span>
    <button type="button" id="blog-list-retry" hidden>重新加载</button>
  </div>
  <p class="az-blog__empty" id="blog-category-empty" hidden>这个分类还没有文章。</p>
  <nav class="az-blog__pagination" id="blog-pagination" aria-label="文章翻页" hidden>
    <button type="button" id="blog-page-prev" aria-controls="blog-posts">上一页</button>
    <span id="blog-page-status" role="status" aria-live="polite"></span>
    <button type="button" id="blog-page-next" aria-controls="blog-posts">下一页</button>
  </nav>
  <noscript><p class="az-blog__empty">请启用 JavaScript 查看公开文章列表。</p></noscript>
  {% include blog-footprints.html %}
</div>

<script src="{{ '/assets/js/blog-index.js' | relative_url }}?v={{ site.time | date: '%s' }}" defer></script>
