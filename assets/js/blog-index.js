(() => {
  "use strict";
  const panel = document.getElementById("blog-posts");
  if (!panel) return;
  const posts = [...panel.querySelectorAll("[data-blog-category]")].sort((a, b) =>
    Number(b.dataset.pinned === "true") - Number(a.dataset.pinned === "true") ||
    Number(b.dataset.updated) - Number(a.dataset.updated));
  panel.replaceChildren(...posts);
  const tabs = [...document.querySelectorAll("[data-blog-filter]")];
  const description = document.getElementById("blog-category-description");
  const empty = document.getElementById("blog-category-empty");
  const pagination = document.getElementById("blog-pagination");
  const previous = document.getElementById("blog-page-prev");
  const next = document.getElementById("blog-page-next");
  const status = document.getElementById("blog-page-status");
  const pageSize = 5;
  let category = "all", page = 1;
  function renderPage() {
    const filtered = posts.filter(post => category === "all" || post.dataset.blogCategory === category);
    const total = Math.max(1, Math.ceil(filtered.length / pageSize));
    page = Math.max(1, Math.min(page, total));
    const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
    posts.forEach(post => { post.hidden = !visible.includes(post); });
    empty.hidden = filtered.length > 0;
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
  function turnPage(direction) {
    page += direction;
    renderPage();
    document.getElementById("articles").scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  for (const tab of tabs) {
    tab.querySelector(".az-blog__category-count").textContent = String(posts.filter(post => tab.dataset.blogFilter === "all" || post.dataset.blogCategory === tab.dataset.blogFilter).length);
  }
  previous.addEventListener("click", () => turnPage(-1));
  next.addEventListener("click", () => turnPage(1));
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
  renderPage();
})();
