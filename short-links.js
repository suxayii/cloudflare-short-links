// --- 配置区域 ---
const CONFIG = {
  TITLE: "短链服务"
};

// --- HTML 页面 ---
const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${CONFIG.TITLE}</title>
  <style>
    /* 全局基础 */
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #f3f4f6; margin: 0; color: #333; -webkit-tap-highlight-color: transparent; }
    * { box-sizing: border-box; }

    .container { display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
    
    /* 生成卡片 */
    .card { background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); width: 100%; max-width: 400px; text-align: center; }
    h1 { margin: 0 0 20px 0; font-size: 1.5rem; letter-spacing: -0.5px; }
    
    .input-group { text-align: left; margin-bottom: 15px; }
    label { font-size: 12px; font-weight: 600; color: #666; display: block; margin-bottom: 6px; }
    input { width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; transition: 0.2s; -webkit-appearance: none; }
    input:focus { border-color: #000; }
    
    button { border: none; padding: 12px; border-radius: 8px; cursor: pointer; width: 100%; font-size: 14px; font-weight: 600; margin-top: 10px; transition: 0.2s; }
    .btn-black { background: #111; color: white; }
    .btn-black:hover { background: #333; }
    .btn-green { background: #10b981; color: white; display: flex; align-items: center; justify-content: center; gap: 6px;}
    
    #result { margin-top: 20px; padding: 16px; background: #ecfdf5; border: 1px solid #d1fae5; border-radius: 12px; display: none; text-align: left; }
    .short-url { font-size: 16px; font-weight: 700; color: #047857; text-decoration: none; word-break: break-all; display: block; margin-bottom: 12px; }

    /* ================= 后台核心样式 ================= */
    #adminPanel { display: none; width: 100%; max-width: 900px; margin: 0 auto; }
    .admin-card { background: white; padding: 24px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    
    .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .header-actions { display: flex; gap: 8px; }

    /* 表格基础样式 (PC端) */
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th { text-align: left; padding: 12px; background: #f9fafb; color: #6b7280; font-weight: 600; border-bottom: 2px solid #eee; }
    td { padding: 14px 12px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
    
    .tag { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; background: #eff6ff; color: #2563eb; font-family: monospace; }
    .visits-badge { background: #fff7ed; color: #c2410c; padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: bold; border: 1px solid #ffedd5; }
    
    /* 时间样式 */
    .date-text { color: #9ca3af; font-size: 13px; font-family: monospace; }

    .action-btns { display: flex; gap: 6px; justify-content: flex-end; }
    .btn-xs { padding: 6px 12px; width: auto; font-size: 12px; margin-top: 0; border-radius: 6px; }
    .btn-teal { background: #0d9488; color: white; }
    .btn-blue { background: #3b82f6; color: white; }
    .btn-red { background: #ef4444; color: white; }

    /* 分页栏 */
    .pagination-bar { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; }
    .btn-page { width: auto; padding: 8px 16px; background: white; border: 1px solid #e5e7eb; color: #333; }
    .btn-page:disabled { background: #f3f4f6; color: #999; }

    /* ================= 📱 移动端 核心适配 ================= */
    @media (max-width: 640px) {
        .container { padding: 10px; align-items: flex-start; }
        .card, .admin-card { padding: 20px 15px; border-radius: 12px; }

        thead { display: none; }
        table, tbody, tr, td { display: block; width: 100%; }

        tr {
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            margin-bottom: 15px;
            padding: 15px;
            position: relative;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        /* 第一列：ID (左上角) */
        td:nth-child(1) { padding: 0 0 5px 0; border: none; font-size: 16px; font-weight: bold; }

        /* 第二列：原始链接 (中间) */
        td:nth-child(2) { padding: 0 0 10px 0; border: none; font-size: 13px; color: #4b5563; word-break: break-all; }
        td:nth-child(2) div { max-width: 100% !important; }

        /* 第三列：创建时间 (左下角 - 新位置) */
        td:nth-child(3) { padding: 0 0 10px 0; border: none; text-align: left; }
        /* 手机端稍微改一下时间样式 */
        .date-text::before { content: '📅 '; opacity: 0.6; }

        /* 第四列：热度 (右上角 - 绝对定位) */
        td:nth-child(4) { position: absolute; top: 15px; right: 15px; padding: 0; border: none; text-align: right; }

        /* 第五列：操作按钮 (底部) */
        td:nth-child(5) { padding: 12px 0 0 0; border-top: 1px dashed #e5e7eb; }
        .action-btns { justify-content: space-between; gap: 10px; }
        .action-btns button { flex: 1; padding: 10px 0; font-size: 13px; margin: 0; }
        
        .admin-header { margin-bottom: 15px; }
    }
  </style>
</head>
<body>

  <div id="homeView" class="container">
    <div class="card">
      <h1>🔗 创建短链接</h1>
      <div class="input-group"><label>长链接 (必填)</label><input type="text" id="longUrl" placeholder="粘贴 https://..." /></div>
      <button onclick="generate()" id="btn" class="btn-black">生成短链</button>
      <div id="error" style="color:#ef4444; margin-top:10px; display:none; font-size:13px;"></div>
      <div id="result">
        <label style="color:#047857; margin-bottom:5px; font-size:12px; font-weight:bold; display:block;">生成成功：</label>
        <a id="shortLink" href="#" target="_blank" class="short-url"></a>
        <button onclick="copyLink()" id="copyBtn" class="btn-green">📄 一键复制链接</button>
      </div>
    </div>
  </div>

  <div id="adminView" class="container" style="display:none;">
    <div id="loginCard" class="card" style="max-width:320px;">
      <h2>🛡️ 后台登录</h2>
      <div class="input-group"><label>用户名</label><input type="text" id="adminUser" /></div>
      <div class="input-group"><label>密码</label><input type="password" id="adminPass" /></div>
      <button onclick="adminLogin()" class="btn-black">登录</button>
    </div>

    <div id="adminPanel">
      <div class="admin-card">
        <div class="admin-header">
          <h2 style="margin:0; font-size:18px;">📊 链接管理</h2>
          <div class="header-actions">
            <button onclick="refreshPage()" class="btn-xs" style="background:#eff6ff; color:#1d4ed8;">↻ 刷新</button>
            <button onclick="logout()" class="btn-xs" style="background:#f3f4f6; color:#374151;">退出</button>
          </div>
        </div>
        
        <table id="linkTable">
          <thead>
            <tr>
              <th style="width:90px">ID</th>
              <th>原始链接</th>
              <th style="width:110px">创建时间</th>
              <th style="width:80px; text-align:center;">热度</th>
              <th style="width:150px; text-align:right;">操作</th>
            </tr>
          </thead>
          <tbody id="tableBody"></tbody>
        </table>
        
        <div id="tableLoading" style="text-align:center; padding:30px; color:#999; display:none;">加载中...</div>

        <div id="pagination" class="pagination-bar" style="display:none;">
            <div style="font-size:13px; color:#666;">第 <b id="pageNum">1</b> 页</div>
            <div style="display:flex; gap:10px;">
                <button id="btnPrev" onclick="prevPage()" class="btn-page" disabled>上一页</button>
                <button id="btnNext" onclick="nextPage()" class="btn-page">下一页</button>
            </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const path = window.location.pathname;
    if (path === '/admin') { document.getElementById('homeView').style.display = 'none'; document.getElementById('adminView').style.display = 'flex'; setTimeout(checkLogin, 50); }

    async function generate() {
      const urlInput = document.getElementById('longUrl').value.trim();
      const btn = document.getElementById('btn'); const errorDiv = document.getElementById('error'); const resultDiv = document.getElementById('result');
      if (!urlInput) return;
      if (!urlInput.startsWith('http')) { errorDiv.innerText = '网址需包含 http:// 或 https://'; errorDiv.style.display = 'block'; return; }
      btn.innerText = '生成中...'; btn.disabled = true; errorDiv.style.display = 'none'; resultDiv.style.display = 'none';
      try {
        const res = await fetch('/api/create?url=' + encodeURIComponent(urlInput));
        const data = await res.json();
        if (data.short_url) {
          document.getElementById('shortLink').href = data.short_url; document.getElementById('shortLink').innerText = data.short_url; resultDiv.style.display = 'block'; copyBtnReset();
        } else { throw new Error(data.error); }
      } catch (e) { errorDiv.innerText = '生成失败: ' + e.message; errorDiv.style.display = 'block'; }
      finally { btn.innerText = '生成短链'; btn.disabled = false; }
    }
    function copyLink() { navigator.clipboard.writeText(document.getElementById('shortLink').innerText).then(() => { const btn = document.getElementById('copyBtn'); btn.innerText = '✅ 已复制'; btn.style.background = '#059669'; setTimeout(copyBtnReset, 2000); }); }
    function copyBtnReset() { const btn = document.getElementById('copyBtn'); btn.innerText = '📄 一键复制链接'; btn.style.background = '#10b981'; }

    let pageData = []; 
    let currentPage = 0;
    const pageSize = 10;

    function checkLogin() {
      if (localStorage.getItem('admin_auth')) { document.getElementById('loginCard').style.display = 'none'; document.getElementById('adminPanel').style.display = 'block'; fetchAllData(); } 
      else { document.getElementById('loginCard').style.display = 'block'; document.getElementById('adminPanel').style.display = 'none'; }
    }
    function adminLogin() {
      const u = document.getElementById('adminUser').value; const p = document.getElementById('adminPass').value;
      if (!u || !p) return alert('请输入完整'); localStorage.setItem('admin_auth', JSON.stringify({ u, p })); checkLogin();
    }
    function logout() { localStorage.removeItem('admin_auth'); location.reload(); }
    function getAuthParams() { try { const a = JSON.parse(localStorage.getItem('admin_auth')); return 'u=' + encodeURIComponent(a.u) + '&p=' + encodeURIComponent(a.p); } catch(e) { return ''; } }
    function refreshPage() { fetchAllData(); }

    async function fetchAllData() {
      const loading = document.getElementById('tableLoading'); const tbody = document.getElementById('tableBody'); const pagination = document.getElementById('pagination');
      tbody.innerHTML = ''; loading.style.display = 'block'; pagination.style.display = 'none';
      try {
        // 请求 API 获取排序后的列表
        const url = '/api/admin/list?' + getAuthParams() + '&t=' + Date.now();
        const res = await fetch(url);
        if (res.status === 401) { logout(); return alert('登录过期'); }
        const data = await res.json();
        
        // 存储所有数据用于前端分页
        pageData = data.list;
        currentPage = 0;
        renderCurrentPage();
        
      } catch (e) { alert('加载失败: ' + e.message); } finally { loading.style.display = 'none'; }
    }

    function renderCurrentPage() {
      const tbody = document.getElementById('tableBody');
      const start = currentPage * pageSize;
      const end = start + pageSize;
      const list = pageData.slice(start, end);
      
      if (pageData.length === 0) { tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#999;padding:20px;">暂无数据</td></tr>'; return; }

      const html = list.map(item => \`
        <tr>
          <td><span class="tag">\${item.id}</span></td>
          <td><div style="max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="\${item.url}">\${item.url}</div></td>
          <td><span class="date-text">\${item.created}</span></td>
          <td><span class="visits-badge">🔥 \${item.visits}</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-teal btn-xs" onclick="window.open('/api/stats?id=\${item.id}', '_blank')">统计</button>
              <button class="btn-blue btn-xs" onclick="editItem('\${item.id}')">修改</button>
              <button class="btn-red btn-xs" onclick="deleteItem('\${item.id}')">删除</button>
            </div>
          </td>
        </tr>
      \`).join('');
      tbody.innerHTML = html;
      
      // 更新分页按钮
      document.getElementById('pagination').style.display = 'flex';
      document.getElementById('pageNum').innerText = currentPage + 1;
      document.getElementById('btnPrev').disabled = (currentPage === 0);
      document.getElementById('btnNext').disabled = (end >= pageData.length);
    }

    function nextPage() { currentPage++; renderCurrentPage(); }
    function prevPage() { if (currentPage > 0) currentPage--; renderCurrentPage(); }

    async function deleteItem(id) { if (!confirm('确认删除?')) return; const res = await fetch(\`/api/admin/delete?id=\${id}&\${getAuthParams()}\`); if (res.ok) fetchAllData(); else alert('删除失败'); }
    async function editItem(id) { const newUrl = prompt('新跳转链接:', ''); if (!newUrl) return; const auth = JSON.parse(localStorage.getItem('admin_auth')); const res = await fetch('/api/admin/edit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, url: newUrl, u: auth.u, p: auth.p }) }); if (res.ok) fetchAllData(); else alert('修改失败'); }
  </script>
</body>
</html>
`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url); const path = url.pathname;
    const apiHeaders = { "Content-Type": "application/json", "Cache-Control": "no-store, no-cache, max-age=0" };

    if (path === "/" || path === "/admin") return new Response(html, { headers: { "Content-Type": "text/html;charset=UTF-8" } });

    // API: 创建 (增加 metadata 记录时间)
    if (path === "/api/create") {
      const targetUrl = url.searchParams.get("url"); if (!targetUrl || !targetUrl.startsWith("http")) return new Response(JSON.stringify({error:"Invalid URL"}));
      const part1 = Math.random().toString(36).substring(2); const part2 = Math.random().toString(36).substring(2); const shortId = (part1 + part2).substring(0, 9); 
      
      // 写入 KV 时增加 metadata: { c: Date.now() }
      await env.LINKS.put(shortId, targetUrl, { metadata: { c: Date.now() } });
      await env.STATS.put(shortId, JSON.stringify([]));
      return new Response(JSON.stringify({ short_id: shortId, short_url: `${url.origin}/${shortId}`, original_url: targetUrl }), { headers: apiHeaders });
    }

    if (path === "/api/stats") {
      const shortId = url.searchParams.get("id"); if (!shortId) return new Response("Error");
      const logsData = await env.STATS.get(shortId); const logs = logsData ? JSON.parse(logsData) : [];
      return new Response(renderStatsPage(shortId, logs), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }

    const checkAuth = (u, p) => (env.ADMIN_USER && env.ADMIN_PASSWORD && u === env.ADMIN_USER && p === env.ADMIN_PASSWORD);

    // API: 列表 (获取所有，后端排序)
    if (path === "/api/admin/list") {
      const u = url.searchParams.get("u"); const p = url.searchParams.get("p");
      if (!checkAuth(u, p)) return new Response("Auth Failed", { status: 401 });

      // 1. 获取 keys (一次最多 1000 条，适合中小型项目)
      // 如果项目很大，需要更复杂的逻辑，这里为了"新链接排前面"做全量获取后排序
      const listData = await env.LINKS.list({ limit: 1000 });
      
      // 2. 在内存中按时间倒序排序 (metadata.c)
      // 如果没有 c (旧数据)，则视为 0，排在最后
      const sortedKeys = listData.keys.sort((a, b) => {
          const tA = a.metadata?.c || 0;
          const tB = b.metadata?.c || 0;
          return tB - tA; // 倒序
      });

      // 3. 并行获取详情
      const detailPromises = sortedKeys.map(async (k) => {
        const originalUrl = await env.LINKS.get(k.name);
        let visitCount = 0; 
        try { const statsJson = await env.STATS.get(k.name); if(statsJson) visitCount = JSON.parse(statsJson).length; } catch(e){}
        
        // 格式化时间
        let dateStr = "-";
        if (k.metadata && k.metadata.c) {
            dateStr = new Date(k.metadata.c).toISOString().split('T')[0]; // YYYY-MM-DD
        }

        return { id: k.name, url: originalUrl || "已失效", visits: visitCount, created: dateStr };
      });
      
      const list = await Promise.all(detailPromises);
      return new Response(JSON.stringify({ list }), { headers: apiHeaders });
    }

    if (path === "/api/admin/delete") {
      const id = url.searchParams.get("id"); const u = url.searchParams.get("u"); const p = url.searchParams.get("p");
      if (!checkAuth(u, p)) return new Response("Auth Failed", { status: 401 });
      if (id) { await env.LINKS.delete(id); await env.STATS.delete(id); return new Response("OK", { status: 200, headers: apiHeaders }); }
    }

    if (path === "/api/admin/edit") {
      if (request.method !== "POST") return new Response("405");
      try {
        const body = await request.json();
        if (!checkAuth(body.u, body.p)) return new Response("Auth Failed", { status: 401 });
        // 更新时保留原有的 metadata (时间戳)
        const oldMeta = await env.LINKS.getWithMetadata(body.id);
        const meta = oldMeta.metadata || { c: Date.now() }; // 如果没有就补一个
        
        if (body.id && body.url) { await env.LINKS.put(body.id, body.url, { metadata: meta }); return new Response("OK", { status: 200, headers: apiHeaders }); }
      } catch(e) { return new Response("Error", { status: 500 }); }
    }

    if (path.length > 1 && !path.startsWith("/api/")) {
      const shortId = path.substring(1);
      const originalUrl = await env.LINKS.get(shortId, { cacheTtl: 60 });
      if (originalUrl) { ctx.waitUntil(recordVisit(env, shortId, request)); return Response.redirect(originalUrl, 302); }
    }
    return new Response("404 Not Found", { status: 404 });
  },
};

async function recordVisit(env, shortId, request) {
  try {
    const ip = request.headers.get("CF-Connecting-IP") || "Unknown";
    const time = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
    const country = request.cf?.country || ""; const city = request.cf?.city || ""; let locationStr = country; if (city) locationStr += ` - ${city}`; if (!locationStr) locationStr = "Unknown";
    let logs = await env.STATS.get(shortId, { type: "json" }); if (!Array.isArray(logs)) logs = []; if (logs.length > 50) logs.shift(); 
    logs.push({ ip, time, region: locationStr }); await env.STATS.put(shortId, JSON.stringify(logs));
  } catch (e) {}
}

function renderStatsPage(shortId, logs) {
  if (!logs) logs = [];
  const rows = logs.slice().reverse().map(log => `<tr><td><div style="font-weight:500;">${log.time.split(' ')[0]}</div><div style="font-size:11px;color:#888;">${log.time.split(' ')[1] || ''}</div></td><td>${log.ip}</td><td>${log.region}</td></tr>`).join('');
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>统计 - ${shortId}</title><style>body{font-family:-apple-system,sans-serif;background:#f3f4f6;padding:15px;margin:0;color:#333}.container{max-width:700px;margin:0 auto;background:white;padding:20px;border-radius:16px}table{width:100%;border-collapse:collapse;font-size:13px;table-layout:fixed}th,td{padding:10px 5px;border-bottom:1px solid #eee}th:nth-child(2){width:40%}td:nth-child(2){word-break:break-all;font-family:monospace}</style></head><body><div class="container"><h3>📊 ${shortId} (总计 ${logs.length})</h3><table><thead><tr><th>时间</th><th>IP</th><th>位置</th></tr></thead><tbody>${rows}</tbody></table><div style="text-align:center;margin-top:20px"><button onclick="window.close()" style="padding:10px 20px;border:none;background:#eee;border-radius:8px;">关闭页面</button></div></div></body></html>`;
}
