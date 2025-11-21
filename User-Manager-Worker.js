/**
 * 部署说明：
 * 1. 在 Cloudflare Workers 创建一个新的 Worker (例如: uuid-manager)
 * 2. 在 Workers -> Settings -> Variables 中添加：
 * - ADMIN_PASSWORD: 你的后台登录密码 (例如: uuid)
 * 3. 在 Workers -> Settings -> KV Namespace Bindings 绑定该 KV，Variable Name 填 "VLESS_KV"
 */

const SYSTEM_CONFIG_KEY = "SYSTEM_SETTINGS_V1";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. API 接口：供节点端拉取 (仅返回有效用户)
    if (path === '/api/users') {
      return await handleApiData(request, env);
    }

    // 2. 管理操作 API
    if (request.method === 'POST') {
      if (path === '/api/admin/add') return await handleAdminAdd(request, env);
      if (path === '/api/admin/update') return await handleAdminUpdate(request, env);
      if (path === '/api/admin/delete') return await handleAdminDeleteBatch(request, env);
      if (path === '/api/admin/status') return await handleAdminStatusBatch(request, env);
      if (path === '/api/admin/saveSettings') return await handleAdminSaveSettings(request, env);
    }

    // 3. 返回管理页面 HTML
    return await handleHtml(request, env);
  }
};

// 获取数据
async function handleApiData(request, env) {
  const settingsJson = await env.VLESS_KV.get(SYSTEM_CONFIG_KEY);
  const settings = settingsJson ? JSON.parse(settingsJson) : null;
  const list = await env.VLESS_KV.list();
  
  const users = {};
  const now = Date.now();

  for (const key of list.keys) {
    if (key.name === SYSTEM_CONFIG_KEY) continue;

    let userData = key.metadata;
    if (!userData) userData = await env.VLESS_KV.get(key.name, { type: 'json' });

    const isEnabled = userData && (userData.enabled !== false);
    const isNotExpired = userData && (!userData.expiry || userData.expiry > now);

    if (isEnabled && isNotExpired) {
      users[key.name] = userData.name; 
    }
  }

  return new Response(JSON.stringify({
    users: users,
    settings: settings || {} 
  }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}

// 添加用户
async function handleAdminAdd(request, env) {
  if (!(await checkAuth(request, env))) return new Response('Unauthorized', { status: 401 });
  
  const formData = await request.formData();
  let name = formData.get('name');
  const expiryDateStr = formData.get('expiryDate');
  const customUUIDsInput = formData.get('uuids');
  
  if (!name || name.trim() === "") name = "未命名";

  let expiry = null;
  if (expiryDateStr) {
    const date = new Date(expiryDateStr);
    date.setHours(23, 59, 59, 999);
    expiry = date.getTime();
  }

  const userData = { name, expiry, createAt: Date.now(), enabled: true };
  
  let targetUUIDs = [];
  if (customUUIDsInput && customUUIDsInput.trim().length > 0) {
      const rawList = customUUIDsInput.split(/[,，\n\s]+/);
      targetUUIDs = [...new Set(rawList.map(u => u.trim()).filter(u => u.length > 0))];
  } else {
      targetUUIDs.push(crypto.randomUUID());
  }

  const writeJobs = targetUUIDs.map(uuid => 
      env.VLESS_KV.put(uuid, JSON.stringify(userData), { metadata: userData })
  );
  await Promise.all(writeJobs);

  return new Response('OK', { status: 200 });
}

// 编辑用户
async function handleAdminUpdate(request, env) {
  if (!(await checkAuth(request, env))) return new Response('Unauthorized', { status: 401 });

  const formData = await request.formData();
  const uuid = formData.get('uuid');
  const name = formData.get('name');
  const expiryDateStr = formData.get('expiryDate');

  if (!uuid) return new Response('UUID required', { status: 400 });

  const oldData = await env.VLESS_KV.get(uuid, { type: 'json' });
  const createAt = oldData ? oldData.createAt : Date.now();
  const enabled = oldData ? (oldData.enabled !== false) : true;

  let expiry = null;
  if (expiryDateStr) {
    const date = new Date(expiryDateStr);
    date.setHours(23, 59, 59, 999);
    expiry = date.getTime();
  }

  const userData = { name: name || "未命名", expiry, createAt, enabled };
  
  await env.VLESS_KV.put(uuid, JSON.stringify(userData), { metadata: userData });
  return new Response('OK', { status: 200 });
}

// 批量修改状态
async function handleAdminStatusBatch(request, env) {
  if (!(await checkAuth(request, env))) return new Response('Unauthorized', { status: 401 });
  
  const formData = await request.formData();
  const uuids = formData.get('uuids'); 
  const enabledStr = formData.get('enabled');
  
  if (!uuids) return new Response('UUIDs required', { status: 400 });
  
  const targetEnabled = enabledStr === 'true';
  const uuidList = uuids.split(',');

  const jobs = uuidList.map(async (uuid) => {
      const userData = await env.VLESS_KV.get(uuid, { type: 'json' });
      if (userData) {
          userData.enabled = targetEnabled;
          await env.VLESS_KV.put(uuid, JSON.stringify(userData), { metadata: userData });
      }
  });

  await Promise.all(jobs);
  return new Response('OK', { status: 200 });
}

// 批量删除用户
async function handleAdminDeleteBatch(request, env) {
  if (!(await checkAuth(request, env))) return new Response('Unauthorized', { status: 401 });
  const formData = await request.formData();
  const uuids = formData.get('uuids');
  
  if (uuids) {
      const uuidList = uuids.split(',');
      await Promise.all(uuidList.map(u => env.VLESS_KV.delete(u)));
  }
  return new Response('OK', { status: 200 });
}

// 保存全局配置
async function handleAdminSaveSettings(request, env) {
  if (!(await checkAuth(request, env))) return new Response('Unauthorized', { status: 401 });
  const formData = await request.formData();
  
  const proxyIPStr = formData.get('proxyIP');
  const bestDomainsStr = formData.get('bestDomains');
  const subUrl = formData.get('subUrl'); 

  let proxyIPs = proxyIPStr ? proxyIPStr.split(/[\n,]+/).map(d => d.trim()).filter(d => d.length > 0) : [];
  let bestDomains = bestDomainsStr ? bestDomainsStr.split(/[\n,]+/).map(d => d.trim()).filter(d => d.length > 0) : [];

  const settings = { proxyIPs, bestDomains, subUrl };
  await env.VLESS_KV.put(SYSTEM_CONFIG_KEY, JSON.stringify(settings));
  return new Response('OK', { status: 200 });
}

async function checkAuth(request, env) {
  const cookie = request.headers.get('Cookie');
  if (cookie && cookie.includes(`auth=${env.ADMIN_PASSWORD}`)) return true;
  try {
    const clone = request.clone();
    const formData = await clone.formData();
    if (formData.get('password') === env.ADMIN_PASSWORD) return true;
  } catch(e) {}
  return false;
}

async function handleHtml(request, env) {
  const cookie = request.headers.get('Cookie');
  const isLogged = cookie && cookie.includes(`auth=${env.ADMIN_PASSWORD}`);

  if (request.method === 'POST' && !isLogged) {
    const formData = await request.formData();
    if (formData.get('password') === env.ADMIN_PASSWORD) {
      return new Response('', {
        status: 302, headers: { 'Set-Cookie': `auth=${env.ADMIN_PASSWORD}; Path=/; Max-Age=3600; HttpOnly`, 'Location': '/' }
      });
    }
  }

  if (!isLogged) {
    return new Response(`<!DOCTYPE html><html lang="zh-CN"><head><title>VLESS 登录</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{background:#f0f2f5;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:system-ui}.box{background:white;padding:30px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);width:300px}input{width:100%;padding:10px;margin:10px 0;border:1px solid #ddd;border-radius:4px}button{width:100%;padding:10px;background:#1890ff;color:white;border:none;border-radius:4px;cursor:pointer}</style></head><body><div class="box"><h2>系统登录</h2><form method="POST"><input type="password" name="password" placeholder="密码" required><button type="submit">登录</button></form></div></body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  const list = await env.VLESS_KV.list();
  const settingsJson = await env.VLESS_KV.get(SYSTEM_CONFIG_KEY);
  let settings = settingsJson ? JSON.parse(settingsJson) : { proxyIPs: [], bestDomains: [], subUrl: "" };
  
  let proxyIPsList = settings.proxyIPs || (settings.proxyIP ? [settings.proxyIP] : []);
  let bestDomainsList = settings.bestDomains || [];
  let subUrl = settings.subUrl || "";

  let usersData = [];
  for (const key of list.keys) {
    if (key.name === SYSTEM_CONFIG_KEY) continue;
    let data = key.metadata;
    if (!data) data = await env.VLESS_KV.get(key.name, { type: 'json' });
    if (data) usersData.push({ uuid: key.name, ...data });
  }
  usersData.sort((a, b) => (b.createAt || 0) - (a.createAt || 0));

  const rows = usersData.map(u => {
    const isExpired = u.expiry && u.expiry < Date.now();
    const isEnabled = u.enabled !== false; 
    const expiryDateObj = u.expiry ? new Date(u.expiry) : null;
    const expiryText = expiryDateObj ? expiryDateObj.toLocaleDateString('zh-CN') : '永久有效';
    const expiryVal = expiryDateObj ? expiryDateObj.toISOString().split('T')[0] : '';
    const createDate = u.createAt ? new Date(u.createAt).toLocaleDateString('zh-CN') : '-';
    
    let statusHtml = isExpired ? '<span class="tag expired">已过期</span>' : (!isEnabled ? '<span class="tag disabled">已禁用</span>' : '<span class="tag active">正常</span>');
    const safeName = u.name.replace(/'/g, "\\'");
    
    return `<tr data-uuid="${u.uuid}">
      <td><input type="checkbox" class="u-check" value="${u.uuid}"></td>
      <td class="mono" onclick="copy('${u.uuid}')">${u.uuid}</td>
      <td>${u.name}</td>
      <td>${createDate}</td>
      <td>${expiryText}</td>
      <td>${statusHtml}</td>
      <td class="actions">
        <button class="btn-action btn-copy" onclick="copySub('${u.uuid}')">订阅</button>
        <button class="btn-action btn-edit" onclick="openEdit('${u.uuid}', '${safeName}', '${expiryVal}')">编辑</button>
        ${isEnabled && !isExpired ? `<button class="btn-action btn-danger" onclick="toggleStatus('${u.uuid}', false)">禁用</button>` : ''}
        ${!isEnabled && !isExpired ? `<button class="btn-action btn-success" onclick="toggleStatus('${u.uuid}', true)">启用</button>` : ''}
        ${isExpired ? `<button class="btn-action btn-secondary" disabled>过期</button>` : ''}
        <button class="btn-action btn-del" onclick="delUser('${u.uuid}')">删除</button>
      </td>
    </tr>`;
  }).join('');

  return new Response(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <title>VLESS 控制面板</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        :root { --primary: #1890ff; --bg: #f0f2f5; --danger: #ff4d4f; --success: #52c41a; --warning: #faad14; --purple: #722ed1; --grey: #bfbfbf; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg); padding: 20px; max-width: 1200px; margin: 0 auto; color: #333; }
        h1 { margin: 0 0 15px 0; font-size: 24px; }
        .card { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media(max-width:768px) { .grid { grid-template-columns: 1fr; } }
        label { display: block; margin-bottom: 8px; font-size: 14px; color: #666; font-weight: 600; }
        input[type=text], input[type=date], textarea { width: 100%; padding: 10px; border: 1px solid #d9d9d9; border-radius: 4px; box-sizing: border-box; font-family: inherit; transition: 0.2s; }
        input:focus, textarea:focus { border-color: var(--primary); outline: none; }
        textarea { resize: vertical; min-height: 80px; font-family: monospace; font-size: 13px; }
        button { padding: 8px 16px; color: white; border: none; border-radius: 4px; cursor: pointer; transition: 0.2s; font-size: 14px; }
        button:hover { opacity: 0.9; }
        button:disabled { background: #ccc !important; cursor: not-allowed; }
        .btn-primary { background: var(--primary); }
        .btn-danger { background: var(--danger); }
        .btn-success { background: var(--success); }
        .actions { white-space: nowrap; }
        .btn-action { padding: 4px 10px; font-size: 12px; margin-right: 4px; }
        .btn-copy { background: var(--purple); }
        .btn-edit { background: var(--warning); }
        .btn-del { background: #ff7875; }
        .btn-secondary { background: var(--grey); }
        .config-list-container { border: 1px solid #eee; border-radius: 4px; padding: 10px; max-height: 200px; overflow-y: auto; background: #fafafa; }
        .config-item { display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: white; border-bottom: 1px solid #eee; font-family: monospace; font-size: 13px; }
        .config-item:last-child { border-bottom: none; }
        .config-item .del-btn { color: var(--danger); cursor: pointer; font-weight: bold; padding: 0 5px; }
        .config-add-box { display: flex; gap: 10px; margin-bottom: 10px; }
        .config-add-box textarea { flex: 1; min-height: 60px; }
        .config-add-box button { align-self: flex-start; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th, td { padding: 12px 10px; text-align: left; border-bottom: 1px solid #f0f0f0; }
        th { background: #fafafa; color: #666; font-weight: 600; }
        tr:hover { background: #fdfdfd; }
        .mono { font-family: monospace; color: var(--primary); cursor: pointer; }
        .tag { font-size: 12px; padding: 2px 8px; border-radius: 10px; font-weight: 500; }
        .tag.active { color: var(--success); background: #f6ffed; border: 1px solid #b7eb8f; }
        .tag.expired { color: var(--danger); background: #fff1f0; border: 1px solid #ffa39e; }
        .tag.disabled { color: #999; background: #f5f5f5; border: 1px solid #d9d9d9; }
        .batch-bar { margin-bottom: 15px; display: flex; gap: 10px; align-items: center; background: #e6f7ff; padding: 10px; border-radius: 4px; border: 1px solid #91d5ff; display: none; }
        .batch-bar.show { display: flex; }
        .modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); justify-content: center; align-items: center; z-index: 100; }
        .modal { background: white; padding: 25px; border-radius: 8px; width: 90%; max-width: 400px; }
        #toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: white; padding: 10px 20px; border-radius: 4px; opacity: 0; pointer-events: none; transition: 0.3s; z-index: 200; }
        #toast.show { opacity: 1; bottom: 50px; }
      </style>
    </head>
    <body>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h1>VLESS 控制面板</h1>
        <span style="font-size:12px;color:#888">${new Date().toLocaleDateString('zh-CN')}</span>
      </div>

      <div class="card">
        <h3>全局节点配置</h3>
        <div style="margin-bottom: 20px; padding: 15px; background: #fff7e6; border: 1px solid #ffd591; border-radius: 4px;">
            <label style="color: #d46b08;">节点订阅地址 (用于生成订阅链接)</label>
            <input type="text" id="subUrl" value="${subUrl}" placeholder="请输入你部署的节点端 Worker 域名, 例如: https://aa.zqsl.eu.org">
        </div>
        <div class="grid">
          <div>
            <label>默认反代 IP 列表</label>
            <div class="config-add-box">
              <textarea id="inputProxyIP" placeholder="批量添加，一行一个&#10;例如: 1.2.3.4 (自动补全 :443)"></textarea>
              <button onclick="addConfig('ProxyIP')" class="btn-success">添加</button>
            </div>
            <div class="config-list-container" id="listProxyIP"></div>
          </div>
          <div>
            <label>优选域名列表 (支持别名 #Name)</label>
            <div class="config-add-box">
              <textarea id="inputBestDomain" placeholder="批量添加，一行一个&#10;格式: 域名/IP:端口#别名&#10;例如: www.visa.com:443#香港"></textarea>
              <button onclick="addConfig('BestDomain')" class="btn-success">添加</button>
            </div>
            <div class="config-list-container" id="listBestDomain"></div>
          </div>
        </div>
        <div style="margin-top:20px;text-align:right;">
          <button onclick="saveSettings()" id="saveBtn" class="btn-primary" style="width:120px;">保存全部配置</button>
        </div>
      </div>
      
      <div class="card">
        <h3>添加用户</h3>
        <div class="grid">
          <div><label>备注名称</label><input type="text" id="name" placeholder="默认 '未命名'"></div>
          <div><label>到期时间</label><input type="date" id="expiryDate"></div>
        </div>
        <div style="margin-top:10px"><label>自定义 UUID (可选)</label><textarea id="uuids" style="min-height:60px" placeholder="留空自动生成"></textarea></div>
        <div style="margin-top:15px;"><button onclick="addUser()" id="addBtn" class="btn-primary">生成 / 添加用户</button></div>
      </div>

      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
          <h3>用户列表 (${usersData.length})</h3>
        </div>
        <div class="batch-bar" id="batchBar">
          <span>已选 <b id="selCount">0</b> 个用户：</span>
          <button onclick="batchAction('enable')" class="btn-success">批量启用</button>
          <button onclick="batchAction('disable')" class="btn-secondary">批量禁用</button>
          <button onclick="batchAction('delete')" class="btn-danger">批量删除</button>
        </div>
        <div style="overflow-x:auto">
          <table style="min-width:900px">
            <thead><tr><th width="40"><input type="checkbox" id="selectAll" onclick="toggleSelectAll()"></th><th>UUID</th><th>备注</th><th>创建时间</th><th>到期时间</th><th>状态</th><th>操作</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>

      <!-- 编辑弹窗 -->
      <div class="modal-overlay" id="editModal">
        <div class="modal">
          <h3>编辑用户</h3>
          <input type="hidden" id="editUuid">
          <div style="margin-bottom:15px"><label>UUID</label><input type="text" id="editUuidDisplay" disabled style="background:#f5f5f5;color:#999"></div>
          <div style="margin-bottom:15px"><label>备注名称</label><input type="text" id="editName"></div>
          <div style="margin-bottom:20px"><label>到期时间</label><input type="date" id="editExpiryDate"></div>
          <div style="text-align:right;"><button onclick="closeEdit()" style="background:#999;margin-right:10px">取消</button><button onclick="saveUserEdit()" id="editSaveBtn" class="btn-primary">保存</button></div>
        </div>
      </div>
      
      <div id="toast"></div>

      <script>
        let proxyIPs = ${JSON.stringify(proxyIPsList)};
        let bestDomains = ${JSON.stringify(bestDomainsList)};
        
        const toast = (msg) => { const t = document.getElementById('toast'); t.innerText = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3000); };
        
        // 配置列表渲染
        function renderList(type) {
          const list = type === 'ProxyIP' ? proxyIPs : bestDomains;
          const container = document.getElementById('list' + type);
          container.innerHTML = '';
          if(list.length === 0) { container.innerHTML = '<div style="padding:10px;color:#999;text-align:center;">暂无数据</div>'; return; }
          list.forEach((item, index) => {
            const div = document.createElement('div'); div.className = 'config-item';
            div.innerHTML = \`<span>\${item}</span> <span class="del-btn" onclick="delConfig('\${type}', \${index})">×</span>\`;
            container.appendChild(div);
          });
        }
        function addConfig(type) {
          const input = document.getElementById('input' + type);
          const raw = input.value; if(!raw.trim()) return;
          const lines = raw.split(/[\\n\\s,]+/);
          let count = 0;
          lines.forEach(line => {
            let val = line.trim(); if(!val) return;
            const parts = val.split('#');
            let addr = parts[0];
            if(!addr.includes(':')) addr += ':443';
            val = parts.length > 1 ? \`\${addr}#\${parts[1]}\` : addr;
            const targetList = type === 'ProxyIP' ? proxyIPs : bestDomains;
            if(!targetList.includes(val)) { targetList.push(val); count++; }
          });
          input.value = ''; renderList(type); if(count > 0) toast(\`已添加 \${count} 条\`);
        }
        function delConfig(type, index) { if(type === 'ProxyIP') proxyIPs.splice(index, 1); else bestDomains.splice(index, 1); renderList(type); }
        
        // API 交互
        async function api(url, data) { const fd = new FormData(); for(let k in data) fd.append(k, data[k]); const res = await fetch(url, { method: 'POST', body: fd }); if(res.ok) { toast('操作成功'); setTimeout(()=>location.reload(), 500); } else toast('操作失败'); }
        
        async function saveSettings() {
          const btn = document.getElementById('saveBtn'); btn.innerText = '保存中...'; btn.disabled = true;
          const fd = new FormData();
          fd.append('proxyIP', proxyIPs.join('\\n'));
          fd.append('bestDomains', bestDomains.join('\\n'));
          fd.append('subUrl', document.getElementById('subUrl').value);
          try { const res = await fetch('/api/admin/saveSettings', { method: 'POST', body: fd }); if(res.ok) toast('✅ 配置已保存'); else toast('❌ 保存失败'); } catch(e) { toast('❌ 网络错误'); }
          btn.innerText = '保存全部配置'; btn.disabled = false;
        }

        function addUser() { document.getElementById('addBtn').disabled=true; api('/api/admin/add', { name: document.getElementById('name').value, expiryDate: document.getElementById('expiryDate').value, uuids: document.getElementById('uuids').value }); }
        function saveUserEdit() { document.getElementById('editSaveBtn').disabled=true; api('/api/admin/update', { uuid: document.getElementById('editUuid').value, name: document.getElementById('editName').value, expiryDate: document.getElementById('editExpiryDate').value }); }
        
        // 单个操作
        function toggleStatus(uuid, isEnable) { api('/api/admin/status', { uuids: uuid, enabled: isEnable ? 'true' : 'false' }); }
        function delUser(uuid) { if(confirm('确定删除此用户？')) api('/api/admin/delete', { uuids: uuid }); }
        
        // 批量操作
        function toggleSelectAll() { const master = document.getElementById('selectAll'); document.querySelectorAll('.u-check').forEach(c => c.checked = master.checked); updateBatchBar(); }
        document.addEventListener('change', (e) => { if(e.target.classList.contains('u-check')) updateBatchBar(); });
        function updateBatchBar() { const count = document.querySelectorAll('.u-check:checked').length; document.getElementById('selCount').innerText = count; const bar = document.getElementById('batchBar'); if(count>0) bar.classList.add('show'); else bar.classList.remove('show'); }
        function getSelectedUUIDs() { return Array.from(document.querySelectorAll('.u-check:checked')).map(c => c.value); }
        async function batchAction(action) {
            const uuids = getSelectedUUIDs(); if(uuids.length === 0) return;
            if(action === 'delete' && !confirm(\`确定删除 \${uuids.length} 个用户？\`)) return;
            await api(action === 'delete' ? '/api/admin/delete' : '/api/admin/status', { uuids: uuids.join(','), enabled: action === 'enable' ? 'true' : 'false' });
        }

        // 辅助功能
        function copySub(uuid) {
            let domain = document.getElementById('subUrl').value.trim();
            if (!domain) return toast('❌ 请先配置订阅地址');
            if (domain.endsWith('/')) domain = domain.slice(0, -1);
            if (!domain.startsWith('http')) domain = 'https://' + domain;
            const url = \`\${domain}/\${uuid}\`;
            navigator.clipboard.writeText(url).then(() => toast('✅ 订阅链接已复制')).catch(() => toast('❌ 复制失败'));
        }
        function openEdit(uuid, name, exp) { document.getElementById('editUuid').value=uuid; document.getElementById('editUuidDisplay').value=uuid; document.getElementById('editName').value=name; document.getElementById('editExpiryDate').value=exp; document.getElementById('editModal').style.display='flex'; }
        function closeEdit() { document.getElementById('editModal').style.display='none'; }
        function copy(t) { navigator.clipboard.writeText(t); toast('复制成功'); }

        // 初始化渲染
        renderList('ProxyIP'); renderList('BestDomain');
      </script>
    </body></html>
  `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
