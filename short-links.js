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
    
    /* 后台样式 */
    #adminPanel { display: none; width: 100%; max-width: 1100px; margin: 0 auto; }
    .admin-card { background: white; padding: 24px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .header-actions { display: flex; gap: 8px; }
    
    table { width: 100%; border-collapse: collapse; font-size: 14px; table-layout: fixed; }
    th { text-align: left; padding: 12px; background: #f9fafb; color: #6b7280; font-weight: 600; border-bottom: 2px solid #eee; white-space: nowrap; user-select: none; }
    td { padding: 14px 12px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; word-wrap: break-word; }
    
    /* 可排序表头样式 */
    .sortable { cursor: pointer; transition: background 0.2s; }
    .sortable:hover { background: #f0fdfa; color: #000; }
    .sort-icon { display: inline-block; width: 12px; margin-left: 4px; color: #ccc; }
    .sort-active .sort-icon { color: #0d9488; font-weight: bold; }

    .tag { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; background: #eff6ff; color: #2563eb; font-family: monospace; }
    .visits-badge { background: #fff7ed; color: #c2410c; padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: bold; border: 1px solid #ffedd5; }
    .note-text { color: #4b5563; font-size: 13px; background: #f3f4f6; padding: 2px 6px; border-radius: 4px; display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .note-empty { color: #d1d5db; font-size: 12px; font-style: italic; }
    .date-text { color: #9ca3af; font-size: 12px; font-family: monospace; }
    
    .action-btns { display: flex; gap: 4px; justify-content: flex-end; flex-wrap: wrap; }
    .btn-xs { padding: 6px 10px; width: auto; font-size: 12px; margin-top: 0; border-radius: 6px; }
    .btn-emerald { background: #10b981; color: white; }
    .btn-teal { background: #0d9488; color: white; }
    .btn-blue { background: #3b82f6; color: white; }
    .btn-purple { background: #8b5cf6; color: white; }
    .btn-red { background: #ef4444; color: white; }
    
    .pagination-bar { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; }
    .btn-page { width: auto; padding: 8px 16px; background: white; border: 1px solid #e5e7eb; color: #333; }
    .btn-page:disabled { background: #f3f4f6; color: #999; }
    .loading { text-align: center; color: #999; padding: 20px; }
    .login-box { max-width: 320px; margin: 0 auto; }

    /* Modal */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: none; justify-content: center; align-items: center; padding: 20px; }
    .modal-content { background: white; width: 100%; max-width: 700px; max-height: 85vh; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); display: flex; flex-direction: column; overflow: hidden; }
    .modal-header { padding: 15px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #f9fafb; }
    .modal-header h3 { margin: 0; font-size: 16px; }
    .modal-close { background: none; border: none; font-size: 24px; color: #999; cursor: pointer; padding: 0; margin: 0; width: auto; }
    .modal-body { padding: 0; overflow-y: auto; flex: 1; }
    .ip-row { cursor: pointer; transition: background 0.1s; } .ip-row:hover { background: #f9fafb; }
    .history-row { display: none; background: #fdfbf7; }
    .history-list { padding: 10px 20px; font-family: monospace; font-size: 12px; color: #666; max-height: 200px; overflow-y: auto; }
    .history-item { padding: 4px 0; border-bottom: 1px dashed #eee; display: flex; justify-content: space-between; }
    .count-badge { background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 10px; font-weight: bold; font-size: 12px; }
    .toggle-icon { display: inline-block; width: 16px; text-align: center; transition: transform 0.2s; } .open .toggle-icon { transform: rotate(90deg); }

    @media (max-width: 640px) {
        .container { padding: 10px; align-items: flex-start; }
        .card, .admin-card { padding: 20px 15px; border-radius: 12px; }
        thead { display: none; }
        .stats-table thead { display: table-header-group !important; }
        #linkTable, #linkTable tbody, #linkTable tr, #linkTable td { display: block; width: 100%; }
        #linkTable tr { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 15px; padding: 15px; position: relative; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        #linkTable td:nth-child(1) { padding: 0 0 5px 0; border: none; font-size: 16px; font-weight: bold; }
        #linkTable td:nth-child(2) { padding: 0 0 8px 0; border: none; font-size: 13px; color: #4b5563; word-break: break-all; }
        #linkTable td:nth-child(2) div { max-width: 100% !important; }
        #linkTable td:nth-child(3) { padding: 0 0 10px 0; border: none; }
        .note-text { display: block; white-space: normal; background: #fffbeb; color: #92400e; border: 1px solid #fef3c7; }
        #linkTable td:nth-child(4) { padding: 0 0 10px 0; border: none; text-align: left; }
        .date-text::before { content: '📅 '; opacity: 0.6; }
        #linkTable td:nth-child(5) { position: absolute; top: 15px; right: 15px; padding: 0; border: none; text-align: right; }
        #linkTable td:nth-child(6) { padding: 12px 0 0 0; border-top: 1px dashed #e5e7eb; }
        .action-btns { justify-content: flex-start; gap: 8px; }
        .action-btns button { flex: 1 1 30%; padding: 8px 0; font-size: 13px; margin: 0; min-width: 60px; }
        .admin-header { margin-bottom: 15px; }
        .stats-table th, .stats-table td { font-size: 12px; padding: 8px 5px; }
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
              <th style="width:80px">ID</th>
              <th>原始链接</th>
              <th style="width:150px">备注</th>
              <th style="width:100px" class="sortable sort-active" onclick="toggleSort('time')" id="th-time">
                创建时间 <span class="sort-icon">⬇</span>
              </th>
              <th style="width:70px; text-align:center;" class="sortable" onclick="toggleSort('visits')" id="th-visits">
                访问次数 <span class="sort-icon"></span>
              </th>
              <th style="width:240px; text-align:right;">操作</th>
            </tr>
          </thead>
          <tbody id="tableBody"></tbody>
        </table>
        <div id="tableLoading" class="loading" style="display:none;">加载中...</div>
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
  <div id="statsModal" class="modal-overlay" onclick="closeModal(event)">
    <div class="modal-content" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h3 id="modalTitle">访问详情</h3>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">
        <table class="stats-table" style="width:100%; border-collapse:collapse;">
          <thead style="background:#f9fafb; position:sticky; top:0; z-index:10;">
            <tr>
              <th style="padding:10px;text-align:left;border-bottom:1px solid #eee;width:40px;"></th>
              <th style="padding:10px;text-align:left;border-bottom:1px solid #eee;">IP / 位置</th>
              <th style="padding:10px;text-align:center;border-bottom:1px solid #eee;width:60px;">次数</th>
              <th style="padding:10px;text-align:right;border-bottom:1px solid #eee;width:140px;">最近访问</th>
            </tr>
          </thead>
          <tbody id="statsBody"></tbody>
        </table>
        <div id="statsLoading" style="text-align:center; padding:20px; color:#999;">加载中...</div>
      </div>
    </div>
  </div>
  <script>
    const path = window.location.pathname;
    if (path === '/admin') { document.getElementById('homeView').style.display = 'none'; document.getElementById('adminView').style.display = 'flex'; setTimeout(checkLogin, 50); }
    function escapeHtml(unsafe) { if (typeof unsafe !== 'string') return unsafe; return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }
    async function generate() {
      const urlInput = document.getElementById('longUrl').value.trim(); const btn = document.getElementById('btn'); const errorDiv = document.getElementById('error'); const resultDiv = document.getElementById('result');
      if (!urlInput) return; 
      try { const u = new URL(urlInput); if(!['http:','https:'].includes(u.protocol)) throw new Error(); } 
      catch(e) { errorDiv.innerText = '请输入包含 http:// 或 https:// 的有效网址'; errorDiv.style.display = 'block'; return; }
      btn.innerText = '生成中...'; btn.disabled = true; errorDiv.style.display = 'none'; resultDiv.style.display = 'none';
      try {
        const res = await fetch('/api/create?url=' + encodeURIComponent(urlInput));
        const data = await res.json();
        if (data.short_url) { document.getElementById('shortLink').href = data.short_url; document.getElementById('shortLink').innerText = data.short_url; resultDiv.style.display = 'block'; copyBtnReset(); } 
        else { throw new Error(data.error); }
      } catch (e) { errorDiv.innerText = '生成失败: ' + e.message; errorDiv.style.display = 'block'; }
      finally { btn.innerText = '生成短链'; btn.disabled = false; }
    }
    function copyLink() { navigator.clipboard.writeText(document.getElementById('shortLink').innerText).then(() => { const btn = document.getElementById('copyBtn'); btn.innerText = '✅ 已复制'; btn.style.background = '#059669'; setTimeout(copyBtnReset, 2000); }); }
    function copyBtnReset() { const btn = document.getElementById('copyBtn'); btn.innerText = '📄 一键复制链接'; btn.style.background = '#10b981'; }
    let pageData = []; let currentPage = 0; const pageSize = 10;
    
    // --- 排序状态管理 ---
    let sortState = { field: 'time', order: 'desc' }; // 默认按时间倒序

    function checkLogin() { if (localStorage.getItem('admin_auth')) { document.getElementById('loginCard').style.display = 'none'; document.getElementById('adminPanel').style.display = 'block'; loadPage(0); } else { document.getElementById('loginCard').style.display = 'block'; document.getElementById('adminPanel').style.display = 'none'; } }
    function adminLogin() { const u = document.getElementById('adminUser').value; const p = document.getElementById('adminPass').value; if (!u || !p) return alert('请输入完整'); localStorage.setItem('admin_auth', JSON.stringify({ u, p })); checkLogin(); }
    function logout() { localStorage.removeItem('admin_auth'); location.reload(); }
    function getHeaders() { const a = JSON.parse(localStorage.getItem('admin_auth') || '{}'); return { 'Content-Type': 'application/json', 'X-Auth-User': a.u || '', 'X-Auth-Key': a.p || '' }; }
    function refreshPage() { loadPage(currentPage); }
    
    // --- 排序触发函数 ---
    function toggleSort(field) {
        if (sortState.field === field) {
            // 同字段切换顺序
            sortState.order = sortState.order === 'desc' ? 'asc' : 'desc';
        } else {
            // 新字段，默认倒序
            sortState.field = field;
            sortState.order = 'desc';
        }
        updateSortUI();
        loadPage(0); // 排序变化后回到第一页
    }

    function updateSortUI() {
        // 重置所有图标
        document.getElementById('th-time').className = 'sortable';
        document.getElementById('th-time').querySelector('.sort-icon').innerText = '';
        document.getElementById('th-visits').className = 'sortable';
        document.getElementById('th-visits').querySelector('.sort-icon').innerText = '';

        // 设置当前激活的列
        const activeTh = document.getElementById('th-' + sortState.field);
        activeTh.classList.add('sort-active');
        const icon = sortState.order === 'desc' ? '⬇' : '⬆';
        activeTh.querySelector('.sort-icon').innerText = icon;
    }

    async function loadPage(pageIndex) {
      const loading = document.getElementById('tableLoading'); const tbody = document.getElementById('tableBody'); const pagination = document.getElementById('pagination');
      tbody.innerHTML = ''; loading.style.display = 'block'; pagination.style.display = 'none';
      try {
        const offset = pageIndex * pageSize;
        // 传递排序参数给后端
        const url = \`/api/admin/list?limit=\${pageSize}&offset=\${offset}&sort=\${sortState.field}&order=\${sortState.order}&t=\${Date.now()}\`;
        const res = await fetch(url, { headers: getHeaders() });
        if (res.status === 401) { logout(); return alert('登录过期'); }
        const data = await res.json();
        pageData = data.list; 
        renderTable(pageData);
        currentPage = pageIndex;
        document.getElementById('pageNum').innerText = currentPage + 1;
        document.getElementById('btnPrev').disabled = (currentPage === 0);
        document.getElementById('btnNext').disabled = (data.list.length < pageSize);
        pagination.style.display = 'flex';
      } catch (e) { alert('加载失败: ' + e.message); } finally { loading.style.display = 'none'; }
    }
    function nextPage() { loadPage(currentPage + 1); }
    function prevPage() { if (currentPage > 0) loadPage(currentPage - 1); }
    
    function renderTable(list) {
      const tbody = document.getElementById('tableBody');
      if (!list || list.length === 0) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#999;padding:20px;">暂无数据</td></tr>'; return; }
      const html = list.map(item => \`
        <tr>
          <td><span class="tag">\${escapeHtml(item.id)}</span></td>
          <td><div style="max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="\${escapeHtml(item.url)}">\${escapeHtml(item.url)}</div></td>
          <td>\${item.note ? \`<span class="note-text">\${escapeHtml(item.note)}</span>\` : \`<span class="note-empty">无备注</span>\`}</td>
          <td><span class="date-text">\${item.created}</span></td>
          <td style="text-align:center;"><span class="visits-badge">🔥 \${item.visits}</span></td>
          <td>
            <div class="action-btns">
              <button class="btn-emerald btn-xs" onclick="copyShortLink(this, '\${escapeHtml(item.id)}')">📄 复制</button>
              <button class="btn-purple btn-xs" onclick="editNote('\${escapeHtml(item.id)}')">📝 备注</button>
              <button class="btn-teal btn-xs" onclick="showStats('\${escapeHtml(item.id)}')">📉 统计</button>
              <button class="btn-blue btn-xs" onclick="editItem('\${escapeHtml(item.id)}')">修改</button>
              <button class="btn-red btn-xs" onclick="deleteItem('\${escapeHtml(item.id)}')">删除</button>
            </div>
          </td>
        </tr>
      \`).join('');
      tbody.innerHTML = html;
    }
    function copyShortLink(btn, id) { const shortUrl = window.location.origin + "/" + id; navigator.clipboard.writeText(shortUrl).then(() => { const originalText = btn.innerText; btn.innerText = "✅"; setTimeout(() => btn.innerText = originalText, 2000); }).catch(err => alert("复制失败")); }
    async function showStats(id) {
        document.getElementById('statsModal').style.display = 'flex';
        document.getElementById('modalTitle').innerText = '访问详情: ' + id;
        document.getElementById('statsBody').innerHTML = '';
        document.getElementById('statsLoading').style.display = 'block';
        try {
            const res = await fetch(\`/api/stats?id=\${id}\`, { headers: getHeaders() });
            if (res.status === 401) { logout(); return; }
            const rawLogs = await res.json();
            if(!Array.isArray(rawLogs)) throw new Error("Err");
            const grouped = {};
            rawLogs.forEach(log => {
                const ip = log.ip;
                const timeStr = new Date(log.created_at).toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'});
                if (!grouped[ip]) { grouped[ip] = { ip: ip, region: log.region, count: 0, latest: 0, history: [] }; }
                grouped[ip].count++; 
                if (log.created_at > grouped[ip].latest) grouped[ip].latest = log.created_at;
                grouped[ip].history.push(timeStr); 
            });
            const sortedGroups = Object.values(grouped).sort((a, b) => b.latest - a.latest);
            renderGroupedStats(sortedGroups);
        } catch(e) { document.getElementById('statsBody').innerHTML = '<tr><td colspan="4" style="text-align:center;padding:20px;">加载失败或无数据</td></tr>'; } 
        finally { document.getElementById('statsLoading').style.display = 'none'; }
    }
    function renderGroupedStats(groups) {
        if (groups.length === 0) { document.getElementById('statsBody').innerHTML = '<tr><td colspan="4" style="text-align:center;padding:20px;color:#999;">暂无访问记录</td></tr>'; return; }
        const html = groups.map((g, index) => {
            const latestStr = new Date(g.latest).toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'});
            const historyHtml = g.history.map(t => \`<div class="history-item"><span>\${t.split(' ')[0]}</span><span>\${t.split(' ')[1]}</span></div>\`).join('');
            return \`
            <tr class="ip-row" onclick="toggleHistory('h-\${index}', this)">
                <td style="text-align:center;"><span class="toggle-icon">▶</span></td>
                <td style="padding:12px 5px;"><div style="font-weight:bold;font-family:monospace;font-size:13px;">\${escapeHtml(g.ip)}</div><div style="font-size:12px;color:#666;">\${escapeHtml(g.region)}</div></td>
                <td style="text-align:center;"><span class="count-badge">\${g.count}</span></td>
                <td style="text-align:right;padding-right:10px;font-size:12px;color:#888;"><div>\${latestStr.split(' ')[0]}</div><div>\${latestStr.split(' ')[1]}</div></td>
            </tr>
            <tr id="h-\${index}" class="history-row"><td colspan="4"><div class="history-list"><div style="font-weight:bold;margin-bottom:5px;color:#333;">📅 访问历史</div>\${historyHtml}</div></td></tr>
            \`;
        }).join('');
        document.getElementById('statsBody').innerHTML = html;
    }
    function toggleHistory(rowId, btn) { const row = document.getElementById(rowId); if (row.style.display === 'table-row') { row.style.display = 'none'; btn.classList.remove('open'); } else { row.style.display = 'table-row'; btn.classList.add('open'); } }
    function closeModal(e) { if (e && e.target !== document.getElementById('statsModal') && e.target.className !== 'modal-close') return; document.getElementById('statsModal').style.display = 'none'; }
    async function deleteItem(id) { if (!confirm('确认删除?')) return; const res = await fetch(\`/api/admin/delete?id=\${id}\`, { method: 'DELETE', headers: getHeaders() }); if (res.ok) refreshPage(); else alert('删除失败'); }
    async function editItem(id) {
        const item = pageData.find(i => i.id === id); const oldUrl = item ? item.url : '';
        const newUrl = prompt('新跳转链接:', oldUrl); 
        if (!newUrl) return; 
        const res = await fetch('/api/admin/edit', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ id, url: newUrl }) }); 
        if (res.ok) refreshPage(); else alert('修改失败'); 
    }
    async function editNote(id) {
        const item = pageData.find(i => i.id === id); const oldNote = item ? (item.note || '') : '';
        const newNote = prompt('设置备注:', oldNote); 
        if (newNote === null) return; 
        const res = await fetch('/api/admin/edit', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ id, note: newNote }) }); 
        if (res.ok) refreshPage(); else alert('设置失败'); 
    }
  </script>
</body>
</html>
`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url); const path = url.pathname;
    const apiHeaders = { "Content-Type": "application/json", "Cache-Control": "no-store, no-cache, max-age=0" };

    if (path === "/" || path === "/admin") return new Response(html, { headers: { "Content-Type": "text/html;charset=UTF-8" } });

    if (path === "/api/create") {
      const targetUrl = url.searchParams.get("url"); 
      try { const u = new URL(targetUrl); if(!['http:','https:'].includes(u.protocol)) throw new Error(); } 
      catch(e) { return new Response(JSON.stringify({error:"Invalid URL"})); }
      const part1 = Math.random().toString(36).substring(2); const part2 = Math.random().toString(36).substring(2); const shortId = (part1 + part2).substring(0, 9); 
      const now = Date.now();
      const exists = await env.DB.prepare('SELECT id FROM links WHERE id = ?').bind(shortId).first();
      if (exists) return new Response(JSON.stringify({error:"ID Collision, please retry"}), { status: 500 });
      await env.DB.prepare('INSERT INTO links (id, url, created_at) VALUES (?, ?, ?)').bind(shortId, targetUrl, now).run();
      return new Response(JSON.stringify({ short_id: shortId, short_url: `${url.origin}/${shortId}`, original_url: targetUrl }), { headers: apiHeaders });
    }

    const checkAuth = (req, env) => {
        const u = req.headers.get("X-Auth-User");
        const p = req.headers.get("X-Auth-Key");
        return (env.ADMIN_USER && env.ADMIN_PASSWORD && u === env.ADMIN_USER && p === env.ADMIN_PASSWORD);
    };

    if (path === "/api/stats") {
      const id = url.searchParams.get("id"); 
      if (!checkAuth(request, env)) return new Response("Auth Failed", { status: 401 });
      const results = await env.DB.prepare('SELECT * FROM visits WHERE link_id = ? ORDER BY created_at DESC LIMIT 1000').bind(id).all();
      return new Response(JSON.stringify(results.results), { headers: apiHeaders });
    }

    if (path === "/api/admin/list") {
      if (!checkAuth(request, env)) return new Response("Auth Failed", { status: 401 });
      const limit = parseInt(url.searchParams.get("limit")) || 10;
      const offset = parseInt(url.searchParams.get("offset")) || 0;
      
      // 1. 获取排序参数 (默认按时间倒序)
      const sort = url.searchParams.get("sort");
      const order = url.searchParams.get("order") === "asc" ? "ASC" : "DESC"; // 默认 DESC
      
      // 2. 构建排序 SQL 子句 (防止 SQL 注入，使用白名单)
      let orderByClause = "ORDER BY l.created_at DESC";
      if (sort === "visits") {
          orderByClause = `ORDER BY visits ${order}`;
      } else if (sort === "time") {
          orderByClause = `ORDER BY l.created_at ${order}`;
      }

      // 3. 执行查询 (COUNT(v.id) 自动计算别名 visits)
      const query = `
        SELECT l.id, l.url, l.note, l.created_at, COUNT(v.id) as visits 
        FROM links l 
        LEFT JOIN visits v ON l.id = v.link_id 
        GROUP BY l.id 
        ${orderByClause} 
        LIMIT ? OFFSET ?
      `;
      
      const { results } = await env.DB.prepare(query).bind(limit, offset).all();
      const formatted = results.map(item => ({ ...item, created: new Date(item.created_at).toISOString().split('T')[0] }));
      return new Response(JSON.stringify({ list: formatted }), { headers: apiHeaders });
    }

    if (path === "/api/admin/delete") {
      if (request.method !== "DELETE") return new Response("Method Not Allowed", { status: 405 });
      const id = url.searchParams.get("id");
      if (!checkAuth(request, env)) return new Response("Auth Failed", { status: 401 });
      await env.DB.batch([ env.DB.prepare('DELETE FROM links WHERE id = ?').bind(id), env.DB.prepare('DELETE FROM visits WHERE link_id = ?').bind(id) ]);
      return new Response("OK", { status: 200, headers: apiHeaders });
    }

    if (path === "/api/admin/edit") {
      if (request.method !== "POST") return new Response("405");
      if (!checkAuth(request, env)) return new Response("Auth Failed", { status: 401 });
      try {
        const body = await request.json();
        if (body.note !== undefined) { await env.DB.prepare('UPDATE links SET note = ? WHERE id = ?').bind(body.note, body.id).run(); } 
        else if (body.url) { await env.DB.prepare('UPDATE links SET url = ? WHERE id = ?').bind(body.url, body.id).run(); }
        return new Response("OK", { status: 200, headers: apiHeaders });
      } catch(e) { return new Response("Error", { status: 500 }); }
    }

    if (path.length > 1 && !path.startsWith("/api/")) {
      const shortId = path.substring(1);
      const link = await env.DB.prepare('SELECT url FROM links WHERE id = ?').bind(shortId).first();
      if (link) { ctx.waitUntil(recordVisit(env, shortId, request)); return Response.redirect(link.url, 302); }
    }
    return new Response("404 Not Found", { status: 404 });
  },
};

async function recordVisit(env, shortId, request) {
  try {
    const ip = request.headers.get("CF-Connecting-IP") || "Unknown";
    const now = Date.now();
    const country = request.cf?.country || ""; const city = request.cf?.city || ""; let locationStr = country; if (city) locationStr += ` - ${city}`; if (!locationStr) locationStr = "Unknown";
    await env.DB.prepare('INSERT INTO visits (link_id, ip, region, created_at) VALUES (?, ?, ?, ?)').bind(shortId, ip, locationStr, now).run();
  } catch (e) { console.log(e); }
}
