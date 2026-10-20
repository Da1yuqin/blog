(() => {
  "use strict";
  const panel = document.getElementById("blog-posts");
  if (!panel) return;
  const tabs = [...document.querySelectorAll("[data-blog-filter]")];
  const description = document.getElementById("blog-category-description");
  const empty = document.getElementById("blog-category-empty");
  const pagination = document.getElementById("blog-pagination");
  const previous = document.getElementById("blog-page-prev");
  const next = document.getElementById("blog-page-next");
  const status = document.getElementById("blog-page-status");
  const loading = document.getElementById("blog-list-loading");
  const loadStatus = document.getElementById("blog-list-status");
  const retry = document.getElementById("blog-list-retry");
  const base = String(panel.dataset.api || window.BLOG_ACCESS_API_BASE || window.HAPPYLOG_API_BASE || "").replace(/\/+$/, "");
  const pageSize = 5;
  let posts = [], category = "all", page = 1, fetching = false;
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function safeUrl(value) {
    if (!value) return "";
    try {
      const url = new URL(value, location.origin + (panel.dataset.siteBase || "/"));
      return ["https:", "http:"].includes(url.protocol) ? url.href : "";
    } catch { return ""; }
  }
  function assetUrl(value) {
    const siteBase = String(panel.dataset.siteBase || "/").replace(/\/$/, "");
    if (siteBase && /^\/(?:images|assets)\//.test(String(value || ""))) value = siteBase + value;
    return safeUrl(value);
  }
  function image(source, alt, metadata) {
    const node = element("img", "");
    node.src = assetUrl(metadata?.src || source);
    node.alt = alt;
    node.loading = "lazy";
    node.decoding = "async";
    if (metadata?.width > 0 && metadata?.height > 0) {
      node.width = metadata.width;
      node.height = metadata.height;
      node.style.aspectRatio = `${metadata.width} / ${metadata.height}`;
    }
    if (metadata?.srcset) {
      const entries = Array.isArray(metadata.srcset) ? metadata.srcset : String(metadata.srcset).split(",").map(item => {
        const [src, width] = item.trim().split(/\s+/);
        return { src, width: Number(String(width || "").replace(/w$/, "")) };
      });
      const srcset = entries.map(item => {
        const url = assetUrl(item.src || item.url);
        const width = Number(item.width);
        return url && width > 0 ? `${url} ${width}w` : "";
      }).filter(Boolean).join(", ");
      if (srcset) { node.srcset = srcset; node.sizes = "(max-width: 640px) 110px, 210px"; }
    }
    return node;
  }
  function formatDate(value) {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return "";
    return new Intl.DateTimeFormat("sv-SE", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Shanghai" }).format(date);
  }
  function card(post) {
    const result = element("article", "az-post");
    result.dataset.blogCategory = ["travel", "planner"].includes(post.category) ? post.category : "misc";
    const route = safeUrl(post.route);
    if (post.cover && safeUrl(post.cover)) {
      const cover = element("a", "az-post__cover az-post__cover--image");
      if (["taichi", "strongresponse"].includes(post.coverFrame)) cover.classList.add(`az-post__cover--${post.coverFrame}`);
      cover.href = route;
      cover.setAttribute("aria-label", post.title);
      cover.append(image(post.cover, post.title, post.coverImage));
      result.append(cover);
    }
    const body = element("div", "az-post__body");
    const meta = element("div", "az-post__meta");
    if (post.pinned) meta.append(document.createTextNode("置顶 · "));
    const at = post.lastModifiedAt || post.date;
    const formatted = formatDate(at);
    if (formatted) {
      meta.append(document.createTextNode(post.lastModifiedAt ? "更新于 " : "发布于 "));
      const time = element("time", "", formatted);
      time.dateTime = new Date(at).toISOString();
      meta.append(time);
    }
    const words = Number(post.wordCount) || 0;
    if (words > 0) meta.append(document.createTextNode(`${formatted ? " · " : ""}${Math.floor(words / 260) + 1} min · ${words} words`));
    const title = element("h3", "az-post__title");
    const link = element("a", "", post.title);
    link.href = route;
    if (post.titleImage && safeUrl(post.titleImage)) {
      const titleImage = image(post.titleImage, post.title, post.titleImageMetadata);
      titleImage.className = "az-post__title-image";
      link.replaceChildren(titleImage);
    }
    title.append(link);
    body.append(meta, title);
    const excerpt = String(post.excerpt || "").trim();
    if (excerpt) body.append(element("p", "az-post__excerpt", excerpt.length > 140 ? excerpt.slice(0, 139) + "…" : excerpt));
    if (Array.isArray(post.tags) && post.tags.length) {
      const tags = element("div", "az-post__tags");
      for (const tag of post.tags) tags.append(element("span", "", tag));
      body.append(tags);
    }
    result.append(body);
    return result;
  }
  function renderPage() {
    const filtered = posts.filter(post => category === "all" || post.dataset.blogCategory === category);
    const total = Math.max(1, Math.ceil(filtered.length / pageSize));
    page = Math.max(1, Math.min(page, total));
    panel.replaceChildren(...filtered.slice((page - 1) * pageSize, page * pageSize));
    empty.hidden = filtered.length > 0 || fetching;
    pagination.hidden = filtered.length <= pageSize;
    previous.disabled = page === 1;
    next.disabled = page === total;
    status.textContent = `第 ${page} / ${total} 页`;
  }
  function selectTab(tab) {
    category = tab.dataset.blogFilter;
    page = 1;
    tabs.forEach(item => { const selected = item === tab; item.setAttribute("aria-selected", String(selected)); item.tabIndex = selected ? 0 : -1; });
    description.textContent = tab.dataset.description;
    panel.setAttribute("aria-labelledby", tab.id);
    renderPage();
  }
  async function load() {
    if (fetching) return;
    fetching = true;
    panel.setAttribute("aria-busy", "true");
    loading.hidden = false;
    loading.dataset.error = "false";
    retry.hidden = true;
    loadStatus.textContent = "正在加载文章……";
    empty.hidden = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      if (!base) throw new Error("Missing article service");
      const path = base.endsWith("/api") ? "/blog/posts" : "/api/blog/posts";
      // This endpoint returns only public posts. Never preload private metadata in the public page.
      const response = await fetch(base + path, { headers: { Accept: "application/json" }, cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error("Article list unavailable");
      const result = await response.json();
      if (!Array.isArray(result.posts)) throw new Error("Invalid article list");
      const entries = result.posts.filter(post => post.visibility === "public" && safeUrl(post.route));
      entries.sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || (Date.parse(b.lastModifiedAt || b.date) || 0) - (Date.parse(a.lastModifiedAt || a.date) || 0));
      posts = entries.map(card);
      for (const tab of tabs) {
        const count = entries.filter(post => tab.dataset.blogFilter === "all" || (post.category === "travel" || post.category === "planner" ? post.category : "misc") === tab.dataset.blogFilter).length;
        tab.querySelector(".az-blog__category-count").textContent = String(count);
      }
      loading.hidden = true;
      fetching = false;
      renderPage();
    } catch {
      loading.dataset.error = "true";
      loadStatus.textContent = "文章列表暂时没有加载成功。";
      retry.hidden = false;
    } finally {
      clearTimeout(timer);
      fetching = false;
      panel.setAttribute("aria-busy", "false");
    }
  }
  function turnPage(direction) {
    page += direction;
    renderPage();
    document.getElementById("articles").scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  previous.addEventListener("click", () => turnPage(-1));
  next.addEventListener("click", () => turnPage(1));
  retry.addEventListener("click", load);
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", event => {
      let target;
      if (event.key === "ArrowRight") target = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") target = (index + tabs.length - 1) % tabs.length;
      else if (event.key === "Home") target = 0;
      else if (event.key === "End") target = tabs.length - 1;
      else return;
      event.preventDefault(); tabs[target].focus(); selectTab(tabs[target]);
    });
  });
  load();
})();
