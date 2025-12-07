// --- 配置区域 ---
const CONFIG = {
  // 注意：不再这里写密码了，全部从 Cloudflare 环境变量 (env) 读取
  TITLE: "短链服务"
};

// --- HTML 页面 ---
const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${CONFIG.TITLE}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #f9fafb; margin: 0; color: #333; }
    
    .container { display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
    .card { background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); width: 100%; max-width: 400px; text-align: center; }
    h1 { margin: 0 0 20px 0; font-size: 1.5rem; }
    
    .input-group { text-align: left; margin-bottom: 15px; }
    label { font-size: 12px; font-weight: bold; color: #555; display: block; margin-bottom: 5px; }
    input { width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; box-sizing: border-box; font-size: 14px; outline: none; transition: 0.2s; }
    input:focus { border-color: #000; }
    
    button { border: none; padding: 12px; border-radius: 8px; cursor: pointer; width: 100%; font-size: 14px; font-weight: 600; margin-top: 10px; transition: 0.2s; }
    .btn-black { background: #000; color: white; }
    .btn-black:hover { background: #333; }
    
    .btn-green { background: #22c55e; color: white; display: flex; align-items: center; justify-content: center; gap: 5px;}
    .btn-green:hover { background: #16a34a; }

    /* 后台按钮 */
    .btn-xs { padding: 6px 12px; width: auto; font-size: 12px; margin-top: 0; }
    .btn-blue { background: #3b82f6; color: white; }
    .btn-red { background: #ef4444; color: white; }
    .btn-teal { background: #0d9488; color: white; } 

    #result { margin-top: 25px; padding: 15px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; display: none; text-align: left; }
    .short-url { font-size: 16px; font-weight: 700; color: #166534; text-decoration: none; word-break: break-all; display: block; margin-bottom: 10px; }

    /* 后台面板 */
    #adminPanel { display: none; width: 100%; max-width: 1000px; }
    .admin-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
    
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th { text-align: left; padding: 12px; background: #f3f4f6; color: #666; font-weight: 600; }
    td { padding: 12px; border-bottom: 1px solid #eee; word-break: break-all; vertical-align: middle; }
    
    .action-btns { display: flex; gap: 6px; justify-content: flex-end; }
    .tag { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: bold; background: #e0f2fe; color: #0369a1; font-family: monospace; }
    
    .loading { text-align: center; color: #999; padding: 20px; }
    .login-box { max-width: 320px; margin: 0 auto; }
  </style>
</head>
<body>

  <div id="homeView" class="container">
    <div class="card">
      <h1>🔗 创建短链接</h1>
      <div class="input-group">
        <label>长链接 (必填)</label>
        <input type="text" id="longUrl" placeholder="粘贴 https://..." />
      </div>
      <button onclick="generate()" id="btn" class="btn-black">生成短链</button>
      <div id="error" style="color:red; margin-top:10px; display:none;"></div>
      
      <div id="result">
        <label style="color:#166534; margin-bottom:5px; font-size:12px; font-weight:bold;">生成成功：</label>
        <a id="shortLink" href="#" target="_blank" class="short-url"></a>
        <button onclick="copyLink()" id="copyBtn" class="btn-green">📄 一键复制链接</button>
      </div>
    </div>
  </div>

  <div id="adminView" class="container" style="display:none;">
    <div id="loginCard" class="card login-box">
      <h2>🛡️ 后台登录</h2>
      <div class="input-group">
        <label>用户名</label>
        <input type="text" id="adminUser" placeholder="请输入用户名" />
      </div>
      <div class="input-group">
        <label>密码</label>
        <input type="password" id="adminPass" placeholder="请输入密码" />
      </div>
      <button onclick="adminLogin()" class="btn-black">登录</button>
    </div>

    <div id="adminPanel">
      <div class="admin-card">
        <div class="admin-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <h2>📊 链接管理</h2>
            <button onclick="loadLinks(true)" class="btn-xs" style="background:#e0f2fe; color:#0369a1;">↻ 刷新</button>
          </div>
          <button onclick="logout()" class="btn-xs" style="background:#f3f4f6; color:#333;">退出</button>
        </div>
        
        <div style="overflow-x: auto;">
          <table id="linkTable">
            <thead>
              <tr>
                <th style="width:100px">短链 ID</th>
                <th>原始链接</th>
                <th style="width:60px; text-align:center;">热度</th>
                <th style="width:180px; text-align:right;">操作</th>
              </tr>
            </thead>
            <tbody id="tableBody"></tbody>
          </table>
        </div>
        <div id="tableLoading" class="loading" style="display:none;">加载中...</div>
        <div id="pagination" style="text-align:center; margin-top:20px; display:none;">
          <button onclick="loadMore()" class="btn-black btn-xs">加载更多</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    // --- 路由初始化 ---
    const path = window.location.pathname;
    if (path === '/admin') {
      document.getElementById('homeView').style.display = 'none';
      document.getElementById('adminView').style.display = 'flex';
      setTimeout(checkLogin, 50);
    }

    // ================= 前端逻辑 =================
    async function generate() {
      const urlInput = document.getElementById('longUrl').value;
      const btn = document.getElementById('btn');
      const errorDiv = document.getElementById('error');
      const resultDiv = document.getElementById('result');
      if (!urlInput) return;
      if (!urlInput.startsWith('http')) { errorDiv.innerText = '网址需包含 http:// 或 https://'; errorDiv.style.display = 'block'; return; }
      btn.innerText = '生成中...'; btn.disabled = true; errorDiv.style.display = 'none'; resultDiv.style.display = 'none';
      try {
        const res = await fetch('/api/create?url=' + encodeURIComponent(urlInput));
        const data = await res.json();
        if (data.short_url) {
          document.getElementById('shortLink').href = data.short_url;
          document.getElementById('shortLink').innerText = data.short_url;
          resultDiv.style.display = 'block';
          copyBtnReset();
        } else { throw new Error(data.error); }
      } catch (e) { errorDiv.innerText = '生成失败'; errorDiv.style.display = 'block'; }
      finally { btn.innerText = '生成短链'; btn.disabled = false; }
    }

    function copyLink() {
      const url = document.getElementById('shortLink').innerText;
      navigator.clipboard.writeText(url).then(() => {
        const btn = document.getElementById('copyBtn');
        btn.innerText = '✅ 复制成功'; btn.style.background = '#15803d';
        setTimeout(copyBtnReset, 2000);
      });
    }
    function copyBtnReset() {
       const btn = document.getElementById('copyBtn');
       btn.innerText = '📄 一键复制链接'; btn.style.background = '#22c55e';
    }

    // ================= 后台逻辑 (升级为 User/Pass) =================
    let currentCursor = null;

    function checkLogin() {
      // 检查本地存储中是否有账号密码
      const auth = localStorage.getItem('admin_auth');
      if (auth) {
        document.getElementById('loginCard').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadLinks(true);
      } else {
        document.getElementById('loginCard').style.display = 'block';
        document.getElementById('adminPanel').style.display = 'none';
      }
    }

    function adminLogin() {
      const u = document.getElementById('adminUser').value;
      const p = document.getElementById('adminPass').value;
      if (!u || !p) return alert('请输入用户名和密码');
      
      // 保存为 JSON 字符串
      localStorage.setItem('admin_auth', JSON.stringify({ u, p }));
      checkLogin();
    }

    function logout() {
      localStorage.removeItem('admin_auth');
      location.reload();
    }

    // 辅助：获取认证参数字符串
    function getAuthParams() {
      try {
        const auth = JSON.parse(localStorage.getItem('admin_auth'));
        return 'u=' + encodeURIComponent(auth.u) + '&p=' + encodeURIComponent(auth.p);
      } catch(e) { return ''; }
    }

    async function loadLinks(isRefresh = false) {
      if (isRefresh) {
        document.getElementById('tableBody').innerHTML = '';
        currentCursor = null;
      }
      const loading = document.getElementById('tableLoading');
      const pagBtn = document.getElementById('pagination');
      loading.style.display = 'block';
      pagBtn.style.display = 'none';

      try {
        // 请求参数改为 u 和 p
        let url = '/api/admin/list?' + getAuthParams() + '&t=' + new Date().getTime();
        if (currentCursor) url += '&cursor=' + currentCursor;

        const res = await fetch(url);
        if (res.status === 401) { logout(); return alert('账号或密码错误'); }
        if (res.status === 500) { return alert('服务器未配置环境变量'); }
        
        const data = await res.json();
        renderTable(data.list);
        
        currentCursor = data.cursor;
        if (currentCursor) pagBtn.style.display = 'block';
        
      } catch (e) { alert('加载失败: ' + e.message); } 
      finally { loading.style.display = 'none'; }
    }

    function loadMore() { loadLinks(false); }

    function renderTable(list) {
      const tbody = document.getElementById('tableBody');
      const html = list.map(item => \`
        <tr>
          <td><span class="tag">\${item.id}</span></td>
          <td>
             <div style="max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="\${item.url}">\${item.url}</div>
          </td>
          <td style="text-align:center;"><b>\${item.visits}</b></td>
          <td>
            <div class="action-btns">
              <button class="btn-teal btn-xs" onclick="window.open('/api/stats?id=\${item.id}', '_blank')">📉 统计</button>
              <button class="btn-blue btn-xs" onclick="editItem('\${item.id}')">修改</button>
              <button class="btn-red btn-xs" onclick="deleteItem('\${item.id}')">删除</button>
            </div>
          </td>
        </tr>
      \`).join('');
      tbody.insertAdjacentHTML('beforeend', html);
    }

    async function deleteItem(id) {
      if (!confirm('确定要删除 ID: ' + id + ' 吗？')) return;
      const res = await fetch(\`/api/admin/delete?id=\${id}&\${getAuthParams()}\`);
      if (res.ok) loadLinks(true); else alert('操作失败');
    }

    async function editItem(id) {
      const newUrl = prompt('请输入新的跳转链接:', '');
      if (!newUrl) return;
      if (!newUrl.startsWith('http')) return alert('链接格式错误');
      
      const auth = JSON.parse(localStorage.getItem('admin_auth'));
      const res = await fetch('/api/admin/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, url: newUrl, u: auth.u, p: auth.p })
      });
      if (res.ok) loadLinks(true); else alert('操作失败');
    }
  </script>
</body>
</html>
`;

// --- 后端 Worker 逻辑 ---
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. 页面路由
    if (path === "/" || path === "/admin") {
      return new Response(html, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }

    // --- API 通用头 ---
    const apiHeaders = {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    };

    // 2. API: 创建 (无需认证)
    if (path === "/api/create") {
      const targetUrl = url.searchParams.get("url");
      if (!targetUrl || !targetUrl.startsWith("http")) return new Response(JSON.stringify({error:"Invalid URL"}));
      const part1 = Math.random().toString(36).substring(2);
      const part2 = Math.random().toString(36).substring(2);
      const shortId = (part1 + part2).substring(0, 9); 
      await env.LINKS.put(shortId, targetUrl);
      await env.STATS.put(shortId, JSON.stringify([]));
      return new Response(JSON.stringify({
        short_id: shortId,
        short_url: `${url.origin}/${shortId}`,
        original_url: targetUrl
      }), { headers: apiHeaders });
    }

    // 3. API: 统计页面 (无需认证)
    if (path === "/api/stats") {
      const shortId = url.searchParams.get("id");
      if (!shortId) return new Response("Error");
      const logsData = await env.STATS.get(shortId);
      const logs = logsData ? JSON.parse(logsData) : [];
      return new Response(renderStatsPage(shortId, logs), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }

    // --- 认证辅助函数 ---
    const checkAuth = (u, p, env) => {
      // 如果没有配置环境变量，直接报错
      if (!env.ADMIN_USER || !env.ADMIN_PASSWORD) return false; 
      return (u === env.ADMIN_USER && p === env.ADMIN_PASSWORD);
    };

    // 4. API: 后台列表 (需认证)
    if (path === "/api/admin/list") {
      const u = url.searchParams.get("u");
      const p = url.searchParams.get("p");
      
      // 校验用户名密码
      if (!checkAuth(u, p, env)) {
         return new Response("Auth Failed", { status: 401 });
      }

      const cursor = url.searchParams.get("cursor");
      const listData = await env.LINKS.list({ limit: 10, cursor: cursor ? cursor : undefined });
      const detailPromises = listData.keys.map(async (k) => {
        const originalUrl = await env.LINKS.get(k.name);
        let visitCount = 0;
        try {
          const statsJson = await env.STATS.get(k.name);
          if (statsJson) visitCount = JSON.parse(statsJson).length;
        } catch(e) {}
        return { id: k.name, url: originalUrl || "已失效", visits: visitCount };
      });
      const list = await Promise.all(detailPromises);
      return new Response(JSON.stringify({ list, cursor: listData.list_complete ? null : listData.cursor }), { headers: apiHeaders });
    }

    // 5. API: 删除 (需认证)
    if (path === "/api/admin/delete") {
      const id = url.searchParams.get("id");
      const u = url.searchParams.get("u");
      const p = url.searchParams.get("p");
      
      if (!checkAuth(u, p, env)) return new Response("Auth Failed", { status: 401 });
      
      if (id) { await env.LINKS.delete(id); await env.STATS.delete(id); return new Response("OK", { status: 200, headers: apiHeaders }); }
    }

    // 6. API: 修改 (需认证)
    if (path === "/api/admin/edit") {
      if (request.method !== "POST") return new Response("405");
      try {
        const body = await request.json();
        
        if (!checkAuth(body.u, body.p, env)) return new Response("Auth Failed", { status: 401 });

        if (body.id && body.url) { await env.LINKS.put(body.id, body.url); return new Response("OK", { status: 200, headers: apiHeaders }); }
      } catch(e) { return new Response("Error", { status: 500 }); }
    }

    // 7. 跳转
    if (path.length > 1 && !path.startsWith("/api/")) {
      const shortId = path.substring(1);
      const originalUrl = await env.LINKS.get(shortId, { cacheTtl: 60 });
      if (originalUrl) {
        ctx.waitUntil(recordVisit(env, shortId, request));
        return Response.redirect(originalUrl, 302);
      }
    }

    return new Response("404 Not Found", { status: 404 });
  },
};

// 辅助函数
async function recordVisit(env, shortId, request) {
  try {
    const ip = request.headers.get("CF-Connecting-IP") || "Unknown";
    const time = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
    const country = request.cf?.country || "";
    const city = request.cf?.city || "";
    let locationStr = country;
    if (city) locationStr += ` - ${city}`;
    if (!locationStr) locationStr = "Unknown";
    let logs = await env.STATS.get(shortId, { type: "json" });
    if (!Array.isArray(logs)) logs = [];
    if (logs.length > 50) logs.shift(); 
    logs.push({ ip, time, region: locationStr });
    await env.STATS.put(shortId, JSON.stringify(logs));
  } catch (e) {}
}

function renderStatsPage(shortId, logs) {
  if (!logs) logs = [];
  const rows = logs.slice().reverse().map(log => `
    <tr>
      <td><div style="font-weight:500;">${log.time.split(' ')[0]}</div><div style="font-size:11px;color:#888;">${log.time.split(' ')[1] || ''}</div></td>
      <td>${log.ip}</td>
      <td>${log.region}</td> 
    </tr>
  `).join('');
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>访问统计 - ${shortId}</title><style>body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#f3f4f6;padding:15px;margin:0;color:#333}.container{max-width:700px;margin:0 auto;background:white;padding:20px;border-radius:16px;box-shadow:0 4px 6px rgba(0,0,0,0.05)}.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-bottom:1px solid #eee;padding-bottom:15px}h1{margin:0;font-size:18px}.badge{background:#e0f2fe;color:#0284c7;padding:4px 10px;border-radius:12px;font-size:14px;font-weight:bold}.summary-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}.stat-card{background:#f9fafb;padding:12px;border-radius:10px;text-align:center;border:1px solid #e5e7eb}.stat-num{font-size:20px;font-weight:bold;color:#1a1a1a;display:block;margin-bottom:5px}.stat-label{font-size:12px;color:#666}table{width:100%;border-collapse:collapse;font-size:13px;table-layout:fixed}th{text-align:left;padding:10px 5px;border-bottom:2px solid #eee;color:#666;font-weight:600;background:#fff}td{padding:10px 5px;border-bottom:1px solid #eee;vertical-align:top}th:nth-child(1){width:85px}th:nth-child(2){width:40%}td:nth-child(2){word-break:break-all;font-family:monospace;color:#444}th:nth-child(3){width:auto}td:nth-child(3){word-break:break-word}tr:hover{background:#f9fafb}.back-btn{display:inline-block;text-decoration:none;color:#666;margin-top:20px;font-size:14px}.back-btn:hover{color:#000}.empty-state{text-align:center;padding:40px 0;color:#999}</style></head><body><div class="container"><div class="header"><h1>📊 访问统计报告</h1><span class="badge">${shortId}</span></div><div class="summary-grid"><div class="stat-card"><span class="stat-num">${logs.length}</span><span class="stat-label">总点击</span></div><div class="stat-card"><span class="stat-num">${logs.length>0?logs[logs.length-1].region.split('-')[0]:'-'}</span><span class="stat-label">最近来源</span></div></div>${logs.length===0?`<div class="empty-state">暂无访问记录</div>`:`<table><thead><tr><th>时间</th><th>IP 地址</th><th>位置</th></tr></thead><tbody>${rows}</tbody></table>`}<div style="text-align:center;"><a href="/admin" class="back-btn">← 返回后台</a></div></div></body></html>`;
}
