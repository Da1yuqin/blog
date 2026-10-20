(() => {
  "use strict";
  const panel = document.querySelector("[data-blog-access]");
  const article = document.querySelector("[data-blog-article]");
  if (!panel || !article) return;
  const form = panel.querySelector("[data-blog-login]");
  const message = panel.querySelector("[data-blog-status]");
  const retry = panel.querySelector("[data-blog-retry]");
  const bar = document.querySelector("[data-blog-reader-bar]");
  const barMessage = document.querySelector("[data-blog-reader-status]");
  const exit = document.querySelector("[data-blog-logout]");
  const comments = document.getElementById("footprints");
  const slug = panel.dataset.post;
  const route = panel.dataset.route;
  const base = String(panel.dataset.api || window.BLOG_ACCESS_API_BASE || window.HAPPYLOG_API_BASE || "").replace(/\/+$/, "");
  const tokenKey = "happylog-access-token-v1";
  let memoryToken = "";
  let storageAvailable = true;
  let reading = false;
  let loggingIn = false;
  let version = 0;
  let renderedHtml = "";
  function token() {
    if (!storageAvailable) return memoryToken;
    try { memoryToken = sessionStorage.getItem(tokenKey) || ""; return memoryToken; }
    catch { storageAvailable = false; return memoryToken; }
  }
  function saveToken(value) {
    memoryToken = value || "";
    try {
      if (memoryToken) sessionStorage.setItem(tokenKey, memoryToken);
      else sessionStorage.removeItem(tokenKey);
    } catch { storageAvailable = false; }
  }
  window.getHappylogAccessToken = token;
  const setStatus = (text, kind = "") => { message.textContent = text; message.dataset.kind = kind; };
  const busy = value => {
    form.setAttribute("aria-busy", String(value));
    form.querySelectorAll("input,button").forEach(node => { node.disabled = value; });
  };
  async function request(path, method = "GET", body) {
    const headers = { Accept: "application/json" };
    const bearer = token();
    if (bearer) headers.Authorization = `Bearer ${bearer}`;
    if (body !== undefined) headers["Content-Type"] = "application/json";
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      if (!base) throw new Error("文章暂时无法加载，请稍后再试。");
      const url = base + (base.endsWith("/api") ? path.replace(/^\/api(?=\/)/, "") : path);
      const response = await fetch(url, { method, headers, cache: "no-store", signal: controller.signal, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
      const result = await response.json();
      if (!response.ok) {
        const error = new Error(result.error || "文章暂时无法加载，请稍后再试。");
        error.status = response.status;
        throw error;
      }
      return result;
    } finally { clearTimeout(timer); }
  }
  function clearArticle() {
    article.replaceChildren();
    article.hidden = true;
    article.dataset.loaded = "false";
    document.body.dataset.blogArticleLoaded = "false";
    renderedHtml = "";
    if (comments) comments.hidden = true;
    bar.hidden = true;
    document.dispatchEvent(new CustomEvent("day-article-unloaded", { detail: { slug, route } }));
  }
  function gate(text) {
    clearArticle();
    panel.hidden = false;
    form.hidden = false;
    retry.hidden = true;
    setStatus(text);
    if (token()) {
      bar.hidden = false;
      barMessage.textContent = "当前邀请码没有此篇的阅读权限";
      exit.textContent = "退出登录，更换邀请码";
    }
  }
  async function loadArticle() {
    if (reading) return;
    reading = true;
    const current = ++version;
    if (!renderedHtml) { panel.hidden = false; setStatus("正在加载文章……"); form.hidden = true; retry.hidden = true; }
    try {
      const result = await request(`/api/blog/posts/${encodeURIComponent(slug)}`);
      if (current !== version) return;
      if (typeof result.html !== "string") throw new Error("文章暂时无法加载，请稍后再试。");
      const firstLoad = !renderedHtml;
      const changed = result.html !== renderedHtml;
      if (changed) {
        // Only the authenticated content service supplies this article fragment.
        // Public files contain the article shell, never a cached article body.
        article.innerHTML = result.html;
        renderedHtml = result.html;
      }
      article.hidden = false;
      article.dataset.loaded = "true";
      document.body.dataset.blogArticleLoaded = "true";
      panel.hidden = true;
      form.reset();
      if (comments) comments.hidden = false;
      bar.hidden = !token();
      barMessage.textContent = result.visibility === "private" ? "已获此篇文章的阅读权限" : "阅读中";
      exit.textContent = "退出登录";
      if (changed || firstLoad) document.dispatchEvent(new CustomEvent("day-article-loaded", { detail: { slug, route, visibility: result.visibility } }));
      if (firstLoad && location.hash) requestAnimationFrame(() => {
        let id;
        try { id = decodeURIComponent(location.hash.slice(1)); } catch { id = location.hash.slice(1); }
        document.getElementById(id)?.scrollIntoView({ block: "start" });
      });
    } catch (error) {
      if (current !== version) return;
      if (error.status === 401 || error.status === 403) {
        if (error.status === 401) saveToken("");
        gate(error.status === 403 ? "当前邀请码不能阅读这篇文章，请填写其他邀请码。" : "这篇文章需要邀请码。填写后即可继续阅读。");
      } else if (!renderedHtml) {
        clearArticle();
        panel.hidden = false;
        form.hidden = true;
        retry.hidden = false;
        setStatus("文章暂时无法加载，请稍后重试。", "error");
      }
    } finally { if (current === version) reading = false; }
  }
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (loggingIn || reading) return;
    const code = String(new FormData(form).get("code") || "").trim();
    if (!code) { setStatus("请填写邀请码。", "error"); return; }
    loggingIn = true;
    busy(true);
    setStatus("正在确认阅读权限……");
    try {
      const result = await request("/api/reader/login", "POST", { code });
      saveToken(result.token);
      form.reset();
      await loadArticle();
    } catch (error) { setStatus(error.status ? error.message : "暂时无法连接，请稍后再试。", "error"); }
    finally { loggingIn = false; busy(false); }
  });
  retry.addEventListener("click", loadArticle);
  exit.addEventListener("click", async () => {
    exit.disabled = true;
    ++version;
    reading = false;
    clearArticle();
    try { await request("/api/logout", "POST", {}); }
    catch {}
    finally { saveToken(""); exit.disabled = false; await loadArticle(); }
  });
  window.addEventListener("pagehide", () => { ++version; reading = false; clearArticle(); });
  window.addEventListener("pageshow", event => { if (event.persisted) loadArticle(); });
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") loadArticle(); });
  if (comments) comments.hidden = true;
  loadArticle();
})();
