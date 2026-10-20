(function () {
  'use strict';
  const bell = document.querySelector('.day-message-bell'), panel = document.getElementById('day-messages');
  if (!bell || !panel) return;
  document.body.append(panel);
  // The service exposes only public comments. Seen state is local to this browser.
  const badge = bell.querySelector('.day-message-badge'), list = panel.querySelector('.day-messages__list');
  const status = panel.querySelector('.day-messages__status'), more = panel.querySelector('[data-messages-more]');
  const close = panel.querySelector('[data-messages-close]'), refresh = panel.querySelector('[data-messages-refresh]');
  const titles = new Map(Array.from(panel.querySelectorAll('[data-path]'), el => [el.dataset.path, el.dataset.title]));
  const storageKey = 'day-comments-seen';
  let seen = 0, cursor = null, busy = false, returnFocus;
  try { seen = Number(localStorage.getItem(storageKey)) || 0; } catch (_) {}
  const el = (tag, cls, text) => {const node = document.createElement(tag); node.className = cls; if (text !== undefined) node.textContent = text; return node;};
  async function request(query) {
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(panel.dataset.api.replace(/\/$/, '') + '/messages?' + query, {signal: controller.signal});
      if (!response.ok) throw new Error('消息暂时加载失败，请点击刷新。');
      return await response.json();
    } finally { clearTimeout(timer); }
  }
  function updateBadge(count) {
    badge.hidden = !count; badge.textContent = count > 99 ? '99+' : String(count);
    bell.setAttribute('aria-label', count ? '全站评论消息，' + count + ' 条未读' : '全站评论消息');
  }
  function markSeen(id) {
    seen = Math.max(seen, id || 0);
    try { localStorage.setItem(storageKey, String(seen)); } catch (_) {}
    updateBadge(0);
  }
  function render(comment) {
    const item = el('li', 'day-messages__item'), meta = el('div', 'day-messages__meta');
    const author = comment.author_role === 'admin';
    if (author) {
      const avatar = el('img', 'day-messages__avatar'); avatar.src = '/blog/images/blog-day-plush-avatar.png'; avatar.alt = 'Me 的头像'; avatar.width = avatar.height = 28; avatar.loading = 'lazy'; meta.append(avatar);
    }
    meta.append(el('strong', '', author ? 'Me' : comment.name || '匿名'));
    const date = new Date(comment.created_at), time = el('time', '', Number.isNaN(date.getTime()) ? '' : date.toLocaleString('zh-CN', {month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit'}));
    time.dateTime = comment.created_at; meta.append(time);
    if (author && comment.edited_at) meta.append(el('span', 'day-messages__edited', '已编辑'));
    item.append(meta);
    if (comment.anchor) item.append(el('blockquote', '', comment.anchor.exact));
    item.append(el('p', '', comment.content));
    // Restrict links to same-site paths. Text is rendered with textContent throughout.
    if (/^\/[\w\-/.%]+\/$/.test(comment.page) && !comment.page.includes('..')) {
      const link = el('a', '', (comment.anchor ? '批注 · ' : comment.parent_id ? '回复 · ' : '') + (titles.get(comment.page) || '文章留言') + ' ↗');
      link.href = comment.page + '#footprints'; link.target = '_self';
      link.addEventListener('click', hide); item.append(link);
    }
    list.append(item);
  }
  async function load(append = false) {
    if (busy) return;
    busy = true; refresh.disabled = more.disabled = true; status.textContent = '正在加载…';
    try {
      const result = await request('since=' + seen + (append && cursor ? '&before=' + cursor : ''));
      if (!append) list.replaceChildren();
      result.comments.forEach(render); cursor = result.next_cursor; more.hidden = !cursor;
      status.textContent = result.total ? '共 ' + result.total + ' 条评论' : '还没有评论，来聊聊吧。';
      markSeen(result.latest_id);
    } catch (error) { status.textContent = '消息暂时加载失败，请点击刷新。'; }
    finally { busy = false; refresh.disabled = more.disabled = false; }
  }
  async function summary() {
    if (document.hidden || busy || !panel.hidden) return;
    try { const data = await request('summary=1&since=' + seen); updateBadge(data.unread); } catch (_) {}
  }
  function hide() {
    panel.hidden = true; bell.setAttribute('aria-expanded', 'false'); document.body.classList.remove('day-messages-open');
    if (returnFocus) returnFocus.focus();
  }
  bell.addEventListener('click', () => {
    returnFocus = document.activeElement; panel.hidden = false; bell.setAttribute('aria-expanded', 'true');
    document.body.classList.add('day-messages-open'); close.focus(); load();
  });
  close.addEventListener('click', hide);
  panel.addEventListener('click', event => {if (event.target === panel) hide();});
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') {event.preventDefault(); hide();}
    if (event.key !== 'Tab') return;
    const nodes = Array.from(panel.querySelectorAll('button:not(:disabled), a[href]')).filter(node => !node.hidden && node.getClientRects().length);
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {event.preventDefault(); last.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first.focus();}
  });
  refresh.addEventListener('click', () => load()); more.addEventListener('click', () => load(true));
  document.addEventListener('visibilitychange', summary);
  document.addEventListener('day-comment-published', () => panel.hidden ? summary() : load());
  window.addEventListener('storage', event => {if (event.key === storageKey) {seen = Number(event.newValue) || 0; summary();}});
  summary(); setInterval(summary, 60000);
}());
