/**
 * 管理员面板视图 - Shadcn UI 风格
 */

const db = require('../database');

// 时间格式化
function formatBeijingDateTime(date) {
    if (!date) return '-';
    const d = new Date(date);
    const beijingTime = new Date(d.getTime() + (8 * 60 * 60 * 1000));
    const year = beijingTime.getUTCFullYear();
    const month = String(beijingTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(beijingTime.getUTCDate()).padStart(2, '0');
    const hour = String(beijingTime.getUTCHours()).padStart(2, '0');
    const minute = String(beijingTime.getUTCMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
}

function formatBeijingDate(date) {
    if (!date) return '-';
    const d = new Date(date);
    const beijingTime = new Date(d.getTime() + (8 * 60 * 60 * 1000));
    const year = beijingTime.getUTCFullYear();
    const month = String(beijingTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(beijingTime.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function renderAdminLoginPage(adminPath) {
    return `<!DOCTYPE html><html><head><title>管理员登录</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;display:flex;justify-content:center;align-items:center}.login-box{background:white;padding:40px;border-radius:10px;box-shadow:0 10px 40px rgba(0,0,0,0.2);width:100%;max-width:400px}.login-box h2{text-align:center;margin-bottom:30px;color:#333}.form-group{margin-bottom:20px}label{display:block;margin-bottom:8px;color:#666;font-size:14px}input[type=text],input[type=password]{width:100%;padding:12px;border:1px solid #ddd;border-radius:6px;font-size:16px}input:focus{outline:none;border-color:#667eea}button{width:100%;padding:14px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;border-radius:6px;font-size:16px;cursor:pointer}button:hover{transform:translateY(-2px);box-shadow:0 5px 20px rgba(102,126,234,0.4)}.error{color:#ff4d4f;font-size:14px;margin-top:10px;text-align:center;display:none}</style></head><body><div class="login-box"><h2>🔐 管理员登录</h2><form id="loginForm"><div class="form-group"><label>用户名</label><input type="text" id="username" name="username" required></div><div class="form-group"><label>密码</label><input type="password" id="password" name="password" required></div><button type="submit">登 录</button><div class="error" id="errorMsg"></div></form></div><script>
document.getElementById('loginForm').addEventListener('submit',async function(e){e.preventDefault();const errorMsg=document.getElementById('errorMsg');errorMsg.style.display='none';try{const formData=new FormData(this);const response=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:formData.get('username'),password:formData.get('password')})});const result=await response.json();if(result.success){window.location.href='${adminPath}';}else{errorMsg.textContent=result.error||'登录失败';errorMsg.style.display='block';}}catch(e){errorMsg.textContent='网络错误，请重试';errorMsg.style.display='block';}});</script></body></html>`;
}

function renderAdminPanel() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CFly Panel - VLES 管理端</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
  <script>
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            primary: "#000000",
            "background-light": "#ffffff",
            "background-dark": "#09090b",
            border: {
              light: "#e4e4e7",
              dark: "#27272a"
            },
            muted: {
              light: "#71717a",
              dark: "#a1a1aa"
            }
          },
          fontFamily: {
            display: ["Inter", "sans-serif"],
          },
          borderRadius: {
            DEFAULT: "0.5rem",
            'lg': "0.75rem",
          },
        },
      },
    };
  </script>
  <script>
    // 全局函数预定义（在DOM加载前）
    function switchSection(sectionName, skipSave) {
      // 实际实现会在页面加载后覆盖
      console.log('switchSection will be initialized after DOM load');
    }
    function closeModal() {
      console.log('closeModal will be initialized after DOM load');
    }
    function closeCustomConfirm(result) {
      console.log('closeCustomConfirm will be initialized after DOM load');
    }
    function showSubLinkModal(uuid) {
      console.log('showSubLinkModal will be initialized after DOM load');
    }
    function closeSubLinkModal() {
      console.log('closeSubLinkModal will be initialized after DOM load');
    }
    function copySubLinkAndClose(client) {
      console.log('copySubLinkAndClose will be initialized after DOM load');
    }
  </script>
  <style>
    body { font-family: 'Inter', sans-serif; }
    .material-symbols-outlined { font-size: 20px; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-thumb { background: #d1d1d1; border-radius: 10px; }
    .dark ::-webkit-scrollbar-thumb { background: #3f3f46; }
    .section-content { display: none; }
    .section-content.active { display: block; }
    /* Modal 动画 */
    .modal-show { opacity: 1 !important; pointer-events: auto !important; }
    .modal-show > div { transform: scale(1) !important; }
    /* 标签激活状态 */
    .tab-trigger {
      transition: all 0.2s;
    }
    .tab-trigger.active {
      background: white;
      color: #0f172a;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    .dark .tab-trigger.active {
      background: #09090b;
      color: #fafafa;
    }
  </style>
</head>
<body class="bg-background-light dark:bg-background-dark text-slate-950 dark:text-slate-50 transition-colors duration-200">
  
  <!-- 自定义Alert弹窗 -->
  <div id="custom-alert-overlay" class="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-200">
    <div class="bg-white dark:bg-zinc-950 w-full max-w-md rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xl transform scale-95 transition-all duration-200">
      <div class="p-6">
        <div class="flex items-start gap-4 mb-4">
          <div id="alert-icon" class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl"></span>
          </div>
          <div class="flex-1">
            <h3 id="alert-title" class="text-lg font-semibold mb-2"></h3>
            <p id="alert-message" class="text-sm text-slate-600 dark:text-zinc-400 whitespace-pre-line"></p>
          </div>
        </div>
        <div class="flex justify-end">
          <button onclick="closeCustomAlert()" class="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black text-sm font-medium rounded-md hover:opacity-90 transition-opacity">
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 自定义Confirm弹窗 -->
  <div id="custom-confirm-overlay" class="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-200">
    <div class="bg-white dark:bg-zinc-950 w-full max-w-md rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xl transform scale-95 transition-all duration-200">
      <div class="p-6">
        <div class="flex items-start gap-4 mb-6">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl text-amber-600 dark:text-amber-400">warning</span>
          </div>
          <div class="flex-1">
            <h3 id="confirm-title" class="text-lg font-semibold mb-2"></h3>
            <p id="confirm-message" class="text-sm text-slate-600 dark:text-zinc-400 whitespace-pre-line"></p>
          </div>
        </div>
        <div class="flex justify-end gap-3">
          <button onclick="closeCustomConfirm(false)" class="px-4 py-2 border border-slate-200 dark:border-zinc-800 text-sm font-medium rounded-md hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
            取消
          </button>
          <button onclick="closeCustomConfirm(true)" class="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black text-sm font-medium rounded-md hover:opacity-90 transition-opacity">
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 订阅链接弹窗 -->
  <div id="sub-link-modal" class="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-200">
    <div class="bg-white dark:bg-zinc-950 w-full max-w-2xl rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xl transform scale-95 transition-all duration-200">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-zinc-100">选择客户端类型</h3>
          <button onclick="closeSubLinkModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <p class="text-sm text-slate-600 dark:text-zinc-400 mb-4">请选择您的客户端类型，系统将自动复制对应的订阅链接</p>
        <div class="grid grid-cols-3 gap-3" id="sub-link-buttons">
          <!-- 动态生成按钮 -->
        </div>
      </div>
    </div>
  </div>
  
  <!-- 全局模态框 -->
  <div id="modal-overlay" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 pointer-events-none transition-all duration-300">
    <div id="modal-content" class="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl mx-4 rounded-xl shadow-none overflow-hidden transform scale-95 transition-all duration-300">
      <div class="px-6 py-6 pb-2">
        <div class="flex items-center justify-between">
          <div>
            <h3 id="modal-title" class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">标题</h3>
            <p id="modal-subtitle" class="text-sm text-zinc-500 dark:text-zinc-400 mt-1"></p>
          </div>
          <button onclick="closeModal()" class="rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            <span class="material-symbols-outlined text-zinc-500">close</span>
          </button>
        </div>
      </div>
      <div id="modal-body">
        <!-- 动态内容 -->
      </div>
    </div>
  </div>
  
  <div class="flex min-h-screen">
    <!-- 侧边栏 -->
    <aside class="w-64 border-r border-border-light dark:border-border-dark flex flex-col fixed inset-y-0 left-0 z-50 bg-background-light dark:bg-background-dark">
      <div class="p-6 border-b border-border-light dark:border-border-dark flex items-center gap-2">
        <div class="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white">
          <span class="material-symbols-outlined">terminal</span>
        </div>
        <span class="font-bold text-lg tracking-tight">CFly Panel</span>
      </div>
      
      <nav class="flex-1 overflow-y-auto p-4 space-y-1">
        <div class="text-[10px] font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-2 px-2">Main</div>
        
        <a onclick="switchSection('dashboard')" class="nav-link flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
          <span class="material-symbols-outlined">dashboard</span>
          <span>仪表盘</span>
        </a>
        
        <a onclick="switchSection('users')" class="nav-link flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
          <span class="material-symbols-outlined">group</span>
          <span>用户管理</span>
        </a>
        
        <a onclick="switchSection('proxy-ips')" class="nav-link flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
          <span class="material-symbols-outlined">language</span>
          <span>反代 IP</span>
        </a>
        
        <a onclick="switchSection('best-domains')" class="nav-link flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
          <span class="material-symbols-outlined">star</span>
          <span>优选域名</span>
        </a>
        
        <div class="pt-6 pb-2">
          <div class="text-[10px] font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-2 px-2">Sales</div>
        </div>
        
        <a onclick="switchSection('plans')" class="nav-link flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
          <span class="material-symbols-outlined">inventory_2</span>
          <span>套餐管理</span>
        </a>
        
        <a onclick="switchSection('orders')" class="nav-link flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
          <span class="material-symbols-outlined">receipt_long</span>
          <span>订单管理</span>
        </a>
        
        <a onclick="switchSection('announcements')" class="nav-link flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
          <span class="material-symbols-outlined">campaign</span>
          <span>公告管理</span>
        </a>
        
        <div class="pt-6 pb-2">
          <div class="text-[10px] font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-2 px-2">System</div>
        </div>
        
        <a onclick="switchSection('payment')" class="nav-link flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
          <span class="material-symbols-outlined">payments</span>
          <span>支付渠道</span>
        </a>
        
        <a onclick="switchSection('invites')" class="nav-link flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
          <span class="material-symbols-outlined">confirmation_number</span>
          <span>邀请码</span>
        </a>
        
        <a onclick="switchSection('password')" class="nav-link flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
          <span class="material-symbols-outlined">lock</span>
          <span>修改密码</span>
        </a>
      </nav>
      
      <div class="p-4 border-t border-border-light dark:border-border-dark space-y-2">
        <button onclick="adminLogout()" class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-border-light dark:border-border-dark hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-sm font-medium">
          <span class="material-symbols-outlined text-sm">logout</span>
          退出登录
        </button>
      </div>
    </aside>
    
    <!-- 主内容区 -->
    <main class="flex-1 ml-64 min-h-screen">
      <header class="h-16 border-b border-border-light dark:border-border-dark flex items-center justify-between px-8 bg-background-light dark:bg-background-dark">
        <h1 id="section-title" class="text-xl font-bold tracking-tight">仪表盘概览</h1>
        <div class="flex items-center gap-4">
          <button class="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-light dark:text-muted-dark" id="themeToggle">
            <span class="material-symbols-outlined dark:hidden">dark_mode</span>
            <span class="material-symbols-outlined hidden dark:block">light_mode</span>
          </button>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
              <span class="material-symbols-outlined">person</span>
            </div>
            <span class="text-sm font-medium">Admin</span>
          </div>
        </div>
      </header>
      
      <div class="p-8 space-y-8 max-w-7xl mx-auto">
        <!-- 仪表盘部分 -->
        <div id="section-dashboard" class="section-content active">
          <section>
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold tracking-tight">系统概览</h2>
              <span class="text-xs text-muted-light dark:text-muted-dark">最后更新: <span id="last-update-time"></span></span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="p-6 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-muted-light dark:text-muted-dark">总用户数</span>
                  <span class="material-symbols-outlined text-muted-light dark:text-muted-dark">group</span>
                </div>
                <div id="stat-total-users" class="text-3xl font-bold tracking-tight">0</div>
                <div class="mt-2 text-[10px] text-green-600 dark:text-green-400 flex items-center gap-1 font-medium">
                  <span class="material-symbols-outlined text-xs">trending_up</span>
                  系统总用户
                </div>
              </div>
              
              <div class="p-6 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-muted-light dark:text-muted-dark">活跃用户</span>
                  <span class="material-symbols-outlined text-muted-light dark:text-muted-dark">bolt</span>
                </div>
                <div id="stat-active-users" class="text-3xl font-bold tracking-tight">0</div>
                <div class="mt-2 text-[10px] text-green-600 dark:text-green-400 flex items-center gap-1 font-medium">
                  <span class="material-symbols-outlined text-xs">trending_up</span>
                  未过期用户
                </div>
              </div>
              
              <div class="p-6 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-muted-light dark:text-muted-dark">配置节点数</span>
                  <span class="material-symbols-outlined text-muted-light dark:text-muted-dark">dns</span>
                </div>
                <div id="stat-config-nodes" class="text-3xl font-bold tracking-tight">0</div>
                <div class="mt-2 text-[10px] text-muted-light dark:text-muted-dark font-medium">
                  正常运行中
                </div>
              </div>
              
              <div class="p-6 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-muted-light dark:text-muted-dark">已过期用户</span>
                  <span class="material-symbols-outlined text-muted-light dark:text-muted-dark">event_busy</span>
                </div>
                <div id="stat-expired-users" class="text-3xl font-bold tracking-tight">0</div>
                <div class="mt-2 text-[10px] text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                  <span class="material-symbols-outlined text-xs">warning</span>
                  需要关注
                </div>
              </div>
            </div>
          </section>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">
              <section class="rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark overflow-hidden">
                <div class="p-6 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                  <div>
                    <h3 class="font-semibold">核心配置</h3>
                    <p class="text-xs text-muted-light dark:text-muted-dark">调整全局系统参数</p>
                  </div>
                  <span class="material-symbols-outlined text-muted-light">settings</span>
                </div>
                
                <div class="p-6 space-y-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm font-medium block">新用户注册试用</label>
                      <p class="text-xs text-muted-light dark:text-muted-dark">开启后，新注册用户自动获得免费试用时长</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input id="input-enableTrial" class="sr-only peer" type="checkbox"/>
                      <div class="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label class="text-xs font-semibold text-muted-light uppercase">试用时长 (天)</label>
                      <select id="input-trialDays" class="w-full h-9 px-3 rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm focus:ring-1 focus:ring-primary outline-none">
                        <option value="1">1 天</option>
                        <option value="3">3 天</option>
                        <option value="7">7 天</option>
                      </select>
                    </div>
                    
                    <div class="space-y-2">
                      <label class="text-xs font-semibold text-muted-light uppercase">注册邀请码</label>
                      <div class="flex items-center gap-4 mt-3">
                        <span class="text-xs text-muted-light">强制开启邀请码注册</span>
                        <input id="input-requireInviteCode" class="rounded border-zinc-300 dark:border-zinc-700 text-primary focus:ring-primary" type="checkbox"/>
                      </div>
                    </div>
                  </div>
                  
                  <div class="pt-4 border-t border-border-light dark:border-border-dark">
                    <h4 class="text-xs font-semibold text-muted-light uppercase mb-4 tracking-wider">订单自动过期设置</h4>
                    
                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label class="text-xs font-medium">待审核订单时长</label>
                        <select id="input-pendingOrderExpiry" class="w-full h-9 px-3 rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm outline-none">
                          <option value="15">15 分钟</option>
                          <option value="30">30 分钟</option>
                          <option value="60">60 分钟</option>
                        </select>
                      </div>
                      
                      <div class="space-y-2">
                        <label class="text-xs font-medium">支付订单时长</label>
                        <select id="input-paymentOrderExpiry" class="w-full h-9 px-3 rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm outline-none">
                          <option value="10">10 分钟</option>
                          <option value="15">15 分钟</option>
                          <option value="30">30 分钟</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 flex justify-end">
                  <button onclick="saveSystemSettings()" class="bg-primary text-white text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
                    保存配置
                  </button>
                </div>
              </section>
            </div>
            
            <div class="space-y-6">
              <section class="p-6 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
                <h3 class="font-semibold mb-4 text-sm flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">bolt</span>
                  快速操作
                </h3>
                <div class="flex flex-wrap gap-2">
                  <button onclick="switchSection('proxy-ips')" class="flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-md hover:bg-zinc-800 transition-colors">
                    <span class="material-symbols-outlined text-xs">public</span>
                    反代 IP
                  </button>
                  <button onclick="switchSection('best-domains')" class="flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-md hover:bg-zinc-800 transition-colors">
                    <span class="material-symbols-outlined text-xs">star</span>
                    优选域名
                  </button>
                  <button onclick="switchSection('users')" class="flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-md hover:bg-zinc-800 transition-colors">
                    <span class="material-symbols-outlined text-xs">person_add</span>
                    用户管理
                  </button>
                </div>
              </section>
              
              <section class="p-6 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
                <h3 class="font-semibold mb-1 text-sm flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">database</span>
                  数据备份
                </h3>
                <p class="text-[10px] text-muted-light mb-4">导出或导入所有系统配置与用户数据</p>
                
                <div class="space-y-3">
                  <button onclick="exportData()" class="w-full flex items-center justify-center gap-2 px-3 py-2 border border-border-light dark:border-border-dark rounded-md text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                    <span class="material-symbols-outlined text-xs">download</span>
                    导出全部数据 (.JSON)
                  </button>
                  <button onclick="importData()" class="w-full flex items-center justify-center gap-2 px-3 py-2 border border-border-light dark:border-border-dark rounded-md text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                    <span class="material-symbols-outlined text-xs">upload_file</span>
                    导入备份数据
                  </button>
                </div>
                
                <div class="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-md">
                  <p class="text-[10px] text-amber-700 dark:text-amber-500 leading-relaxed font-medium">
                    <span class="font-bold">⚠️ 注意:</span> 导入操作会覆盖现有数据，建议操作前先导出备份。
                  </p>
                </div>
              </section>
            </div>
          </div>
          
          <section class="rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark overflow-hidden">
            <div class="p-6 border-b border-border-light dark:border-border-dark flex items-center justify-between">
              <h3 class="font-semibold">最近注册用户</h3>
              <button onclick="switchSection('users')" class="text-xs font-medium text-muted-light hover:text-primary transition-colors">查看全部</button>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead>
                  <tr class="bg-zinc-50 dark:bg-zinc-900/50 text-muted-light dark:text-muted-dark font-medium border-b border-border-light dark:border-border-dark">
                    <th class="px-6 py-3">UID / 账号</th>
                    <th class="px-6 py-3">注册时间</th>
                    <th class="px-6 py-3">套餐状态</th>
                    <th class="px-6 py-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody id="users-table-body" class="divide-y divide-border-light dark:divide-border-dark">
                  <tr>
                    <td colspan="4" class="px-6 py-8 text-center text-muted-light">
                      加载中...
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
        
        <!-- 用户管理部分 -->
        <div id="section-users" class="section-content">
          <!-- 添加新用户 -->
          <section class="mb-12">
            <div class="mb-6">
              <h2 class="text-2xl font-semibold tracking-tight">添加新用户</h2>
              <p class="text-sm text-muted-light mt-1">填写以下信息以创建新的访问凭据</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-transparent">
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium">备注名称</label>
                  <input id="add-name" type="text" placeholder="默认 '未命名'" class="flex h-10 w-full rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"/>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium">前端用户名 <span class="text-xs font-normal text-muted-light">(留空随机生成)</span></label>
                  <input id="add-front-username" type="text" placeholder="留空随机生成6位用户名" class="flex h-10 w-full rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"/>
                </div>
              </div>
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium">到期时间</label>
                  <input id="add-expiry" type="date" class="flex h-10 w-full rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"/>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium">前端密码 <span class="text-xs font-normal text-muted-light">(留空与用户名相同)</span></label>
                  <input id="add-front-password" type="password" placeholder="留空默认与用户名相同" class="flex h-10 w-full rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"/>
                </div>
              </div>
              <div class="md:col-span-2 space-y-2">
                <label class="text-sm font-medium">自定义 UUID <span class="text-xs font-normal text-muted-light">(可选，支持批量)</span></label>
                <textarea id="add-uuids" placeholder="留空自动生成单个UUID&#10;批量添加：一行一个UUID，或用逗号分隔" class="flex min-h-[80px] w-full rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"></textarea>
              </div>
            </div>
            <div class="mt-6">
              <button onclick="submitAddUser()" class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-white hover:bg-primary/90 h-10 px-8 py-2 transition-colors">
                生成 / 添加用户
              </button>
            </div>
          </section>

          <!-- 用户列表 -->
          <section class="space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-semibold tracking-tight">用户列表 (<span id="user-count">0</span>)</h2>
                <p class="text-sm text-muted-light mt-1">管理现有的用户及其订阅状态</p>
              </div>
              <div class="flex items-center gap-2">
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3 top-2 text-muted-light text-sm">search</span>
                  <input id="search-input" type="text" placeholder="搜索UUID或备注..." onkeyup="filterUsers()" class="h-9 w-[250px] pl-9 pr-3 rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-xs focus:ring-1 focus:ring-primary outline-none"/>
                </div>
              </div>
            </div>

            <!-- 批量操作栏 -->
            <div id="batch-bar" class="p-4 bg-blue-50 dark:bg-blue-950/20 border border-border-light dark:border-border-dark rounded-md hidden">
              <div class="flex items-center gap-4">
                <span class="text-sm">已选 <b id="sel-count">0</b> 个用户</span>
                <button onclick="batchEnable()" class="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors">批量启用</button>
                <button onclick="batchDisable()" class="px-3 py-1.5 bg-yellow-600 text-white text-xs font-medium rounded hover:bg-yellow-700 transition-colors">批量禁用</button>
                <button onclick="batchDelete()" class="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors">批量删除</button>
              </div>
            </div>

            <!-- 用户表格 -->
            <div class="rounded-md border border-border-light dark:border-border-dark overflow-hidden">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-border-light dark:border-border-dark">
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-light w-[50px]">
                      <input type="checkbox" id="check-all" onchange="toggleCheckAll()" class="rounded border-slate-300 dark:border-zinc-700 text-primary focus:ring-primary cursor-pointer"/>
                    </th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-light">UUID</th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-light">备注</th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-light">创建时间</th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-light">到期时间</th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-light">状态</th>
                    <th class="h-12 px-4 text-right align-middle font-medium text-muted-light">操作</th>
                  </tr>
                </thead>
                <tbody id="users-list-body" class="divide-y divide-border-light dark:divide-border-dark">
                  <tr>
                    <td colspan="7" class="p-8 text-center text-muted-light">加载中...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
        
        <!-- 反代IP部分 -->
        <div id="section-proxy-ips" class="section-content">
          <div class="max-w-4xl space-y-10">
            
            <!-- 订阅设置部分 -->
            <section class="space-y-6">
              <div class="flex items-center gap-2 mb-4">
                <h2 class="text-lg font-semibold tracking-tight">订阅设置</h2>
              </div>
              <div class="grid gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-medium leading-none text-slate-700 dark:text-zinc-300">节点订阅地址</label>
                  <input id="sub-url" type="text" class="flex h-10 w-full rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 transition-all" placeholder="ccffllyy.1412.me,cfly.de5.net"/>
                  <p class="text-[0.8rem] text-slate-500 dark:text-zinc-400">支持多个地址，用英文逗号 (,) 分隔。用户复制订阅时将随机分配节点。</p>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium leading-none text-slate-700 dark:text-zinc-300">官网地址</label>
                  <input id="website-url" type="text" class="flex h-10 w-full rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 transition-all" placeholder="cfly.1412.me"/>
                  <p class="text-[0.8rem] text-slate-500 dark:text-zinc-400">此地址显示在节点列表别名中，帮助用户识别官网。</p>
                </div>
              </div>
            </section>
            
            <hr class="border-slate-200 dark:border-zinc-800"/>
            
            <!-- 反代IP列表部分 -->
            <section class="space-y-6">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold tracking-tight">默认反代 IP 列表</h2>
                <span id="proxy-ips-count" class="text-sm text-slate-500 dark:text-zinc-400">已配置 0 个</span>
              </div>
              
              <div class="rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 p-4 mb-6">
                <div class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-primary dark:text-zinc-400 mt-0.5">info</span>
                  <p class="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                    <span class="font-semibold text-primary dark:text-zinc-100">温馨提示:</span> 在代理地址中包含地区标识符 (如 HK/JP/US/SG)，系统会自动选择地区代理以提高速度。
                  </p>
                </div>
              </div>
              
              <div class="flex flex-col gap-4">
                <div class="flex gap-2">
                  <textarea id="proxy-ips-batch-input" class="flex min-h-[120px] w-full rounded-md border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm font-mono ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 transition-all" placeholder="批量添加，每行一个。支持地理标签。例如：\nProxyIP.HK.CMLiusss.net:443\nsjc.o00o.ooo:443\nkr.william.us.ci:443"></textarea>
                  <button onclick="batchAddProxyIPs()" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 bg-primary dark:bg-white text-white dark:text-black hover:bg-primary/90 dark:hover:bg-zinc-100 h-10 px-4 py-2 self-start">
                    添加
                  </button>
                </div>
                
                <div id="proxy-ips-list" class="rounded-md border border-slate-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950">
                  <div class="divide-y divide-slate-200 dark:divide-zinc-800">
                    <div class="p-8 text-center text-slate-400 dark:text-zinc-600">
                      <span class="material-symbols-outlined text-4xl mb-2">cloud_off</span>
                      <p class="text-sm">暂无反代 IP</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            <div class="pt-6 border-t border-slate-200 dark:border-zinc-800 flex justify-end gap-3">
              <button onclick="loadProxyIPSettings()" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-slate-50 dark:hover:bg-zinc-900 h-11 px-6">
                重置
              </button>
              <button onclick="saveAllProxyIPSettings()" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors bg-primary dark:bg-white text-white dark:text-black hover:bg-primary/90 dark:hover:bg-zinc-100 h-11 px-8">
                保存配置
              </button>
            </div>
          </div>
        </div>
        
        <div id="section-best-domains" class="section-content">
          <div class="max-w-5xl space-y-6">
            
            <!-- Cron状态提示 -->
            <div class="flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-sm">
              <div class="flex items-center gap-6">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span class="text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Cron 状态:</span>
                  <span class="text-xs font-semibold">每15分钟执行</span>
                </div>
                <div class="h-4 w-[1px] bg-slate-200 dark:bg-zinc-800"></div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider">下次更新:</span>
                  <span id="next-sync-countdown" class="text-xs font-mono font-medium text-primary dark:text-zinc-200">14:59</span>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-xs text-slate-400 dark:text-zinc-500">Docker 部署环境下自动同步</span>
                <span class="material-symbols-outlined text-slate-400 dark:text-zinc-500 text-[18px]">info</span>
              </div>
            </div>
            
            <!-- 批量输入区 -->
            <div class="space-y-4">
              <div class="relative">
                <textarea id="best-domains-batch-input" class="w-full min-h-[140px] p-4 text-sm font-mono bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600" placeholder="批量添加，一行一个\\n格式：域名/IP:端口#别名\\n例如：www.example.com:443#香港\\n例如：104.16.88.20:443#美国"></textarea>
              </div>
              
              <div class="flex flex-wrap gap-3">
                <button onclick="batchAddBestDomains()" class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                  <span class="material-symbols-outlined text-[18px]">add</span> 批量添加
                </button>
                <button onclick="fetchIPv4BestDomains()" class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                  <span class="material-symbols-outlined text-[18px]">bolt</span> 获取 IPv4 优选
                </button>
                <button onclick="fetchIPv6BestDomains()" class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                  <span class="material-symbols-outlined text-[18px]">bolt</span> 获取 IPv6 优选
                </button>
                <div class="flex-1"></div>
                <button onclick="clearAllBestDomains()" class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors">
                  <span class="material-symbols-outlined text-[18px]">delete_sweep</span> 清空列表
                </button>
              </div>
            </div>
            
            <!-- 标签切换 -->
            <div class="w-full">
              <div class="inline-flex h-10 items-center justify-center rounded-md bg-slate-100 dark:bg-zinc-900 p-1 text-slate-500 dark:text-zinc-400 mb-4">
                <button id="tab-domain-list" class="tab-trigger active inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50" onclick="switchBestDomainsTab('domain-list')">域名列表</button>
                <button id="tab-node-status" class="tab-trigger inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50" onclick="switchBestDomainsTab('node-status')">节点状态</button>
              </div>
              
              <!-- 域名列表视图 -->
              <div id="tab-content-domain-list" class="tab-content active bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-sm overflow-hidden">
                <div class="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 flex justify-between items-center">
                  <span class="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">当前优选域名</span>
                  <span id="best-domains-count" class="text-xs text-slate-400 dark:text-zinc-500">共 0 个条目</span>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-sm">
                    <thead class="bg-slate-50/30 dark:bg-zinc-900">
                      <tr>
                        <th class="px-4 py-2 font-medium text-slate-500 dark:text-zinc-400 w-10"></th>
                        <th class="px-4 py-2 font-medium text-slate-500 dark:text-zinc-400">资源地址</th>
                        <th class="px-4 py-2 font-medium text-slate-500 dark:text-zinc-400">状态</th>
                        <th class="px-4 py-2 font-medium text-slate-500 dark:text-zinc-400 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody id="best-domains-list" class="divide-y divide-slate-100 dark:divide-zinc-800">
                      <tr>
                        <td colspan="4" class="px-4 py-8 text-center text-slate-400 dark:text-zinc-600">
                          <span class="material-symbols-outlined text-4xl mb-2 block">cloud_off</span>
                          <p class="text-sm">暂无优选域名</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <!-- 节点状态视图 -->
              <div id="tab-content-node-status" class="tab-content bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-sm overflow-hidden" style="display: none;">
                <div class="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 flex justify-between items-center">
                  <span class="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">节点运行状态</span>
                  <span id="node-status-time" class="text-xs text-slate-400 dark:text-zinc-500">最后检测: --:--:--</span>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-sm">
                    <thead class="bg-slate-50/30 dark:bg-zinc-900">
                      <tr>
                        <th class="px-4 py-2 font-medium text-slate-500 dark:text-zinc-400 w-12 text-center">序号</th>
                        <th class="px-4 py-2 font-medium text-slate-500 dark:text-zinc-400">名称</th>
                        <th class="px-4 py-2 font-medium text-slate-500 dark:text-zinc-400">节点</th>
                        <th class="px-4 py-2 font-medium text-slate-500 dark:text-zinc-400">延迟</th>
                        <th class="px-4 py-2 font-medium text-slate-500 dark:text-zinc-400 text-right">状态</th>
                      </tr>
                    </thead>
                    <tbody id="node-status-list" class="divide-y divide-slate-100 dark:divide-zinc-800">
                      <tr>
                        <td colspan="5" class="px-4 py-8 text-center text-slate-400 dark:text-zinc-600">
                          <span class="material-symbols-outlined text-4xl mb-2 block">cloud_off</span>
                          <p class="text-sm">暂无节点状态数据</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <!-- 底部操作 -->
            <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-zinc-800">
              <p class="text-xs text-slate-500 dark:text-zinc-500">
                提示: 点击列表条目前方的拖拽手柄可手动排序。所有数据自动从 Cloudflare 边缘节点同步。
              </p>
              <div class="flex gap-3">
                <button onclick="loadBestDomains()" class="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-zinc-800 rounded-md hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
                  重置更改
                </button>
                <button onclick="saveAllBestDomains()" class="px-6 py-2 bg-primary dark:bg-white text-white dark:text-black text-sm font-semibold rounded-md hover:opacity-90 shadow-sm transition-opacity">
                  保存并应用
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div id="section-plans" class="section-content">
          <!-- 添加新套餐 -->
          <section class="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-all duration-200">
            <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <h2 class="text-base font-semibold">添加新套餐</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">创建可供用户订阅的服务计划</p>
            </div>
            <div class="p-6">
              <form id="add-plan-form" class="grid grid-cols-1 md:grid-cols-6 gap-6">
                <div class="md:col-span-2 space-y-2">
                  <label class="text-sm font-medium text-slate-700 dark:text-slate-300">套餐名称</label>
                  <input id="plan-name" class="w-full h-10 px-3 py-2 text-sm bg-transparent border border-slate-200 dark:border-slate-800 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400" placeholder="例如: 月度专业套餐" type="text" required/>
                </div>
                <div class="md:col-span-2 space-y-2">
                  <label class="text-sm font-medium text-slate-700 dark:text-slate-300">时长 (天)</label>
                  <input id="plan-duration" class="w-full h-10 px-3 py-2 text-sm bg-transparent border border-slate-200 dark:border-slate-800 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" type="number" min="1" value="30" required/>
                </div>
                <div class="md:col-span-2 space-y-2">
                  <label class="text-sm font-medium text-slate-700 dark:text-slate-300">价格 (¥)</label>
                  <input id="plan-price" class="w-full h-10 px-3 py-2 text-sm bg-transparent border border-slate-200 dark:border-slate-800 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400" placeholder="0.00" type="number" step="0.01" min="0" value="0" required/>
                </div>
                <div class="md:col-span-5 space-y-2">
                  <label class="text-sm font-medium text-slate-700 dark:text-slate-300">套餐描述</label>
                  <input id="plan-description" class="w-full h-10 px-3 py-2 text-sm bg-transparent border border-slate-200 dark:border-slate-800 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400" placeholder="简要说明套餐包含的功能和限制..." type="text"/>
                </div>
                <div class="md:col-span-1 flex items-end">
                  <button type="button" onclick="addNewPlan()" class="w-full h-10 bg-primary text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-[18px]">add</span>
                    添加
                  </button>
                </div>
              </form>
            </div>
          </section>
          
          <!-- 套餐列表 -->
          <section class="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-all duration-200 mt-8">
            <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
              <div>
                <h2 class="text-base font-semibold">套餐列表</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">管理当前已上架的订阅方案</p>
              </div>
              <div class="flex items-center gap-2">
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[18px]">search</span>
                  <input id="plan-search" onkeyup="filterPlans()" class="pl-9 pr-4 h-9 w-48 text-xs bg-transparent border border-slate-200 dark:border-slate-800 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none" placeholder="搜索套餐..." type="text"/>
                </div>
              </div>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm border-collapse">
                <thead>
                  <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
                    <th class="px-6 py-4 font-semibold uppercase text-xs tracking-wider">名称</th>
                    <th class="px-6 py-4 font-semibold uppercase text-xs tracking-wider">周期</th>
                    <th class="px-6 py-4 font-semibold uppercase text-xs tracking-wider">价格</th>
                    <th class="px-6 py-4 font-semibold uppercase text-xs tracking-wider">描述</th>
                    <th class="px-6 py-4 font-semibold uppercase text-xs tracking-wider">状态</th>
                    <th class="px-6 py-4 font-semibold uppercase text-xs tracking-wider text-right">操作</th>
                  </tr>
                </thead>
                <tbody id="plans-list" class="divide-y divide-slate-100 dark:divide-slate-900">
                  <tr>
                    <td colspan="6" class="px-6 py-8 text-center text-slate-400">加载中...</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <div id="plans-count">共 0 个套餐项目</div>
            </div>
          </section>
        </div>
        
        <div id="section-orders" class="section-content">
          <!-- 筛选和操作栏 -->
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div class="flex items-center gap-4 flex-1">
              <div class="relative w-full max-w-xs">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                <input id="order-search" onkeyup="filterOrders()" class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="搜索订单号或用户..." type="text"/>
              </div>
              <select id="order-status-filter" onchange="loadAllOrders()" class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-sm py-2 pl-3 pr-10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none">
                <option value="all">全部订单</option>
                <option value="pending">待审核</option>
                <option value="approved">已通过</option>
                <option value="rejected">已拒绝</option>
                <option value="expired">已过期</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="exportOrders()" class="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity">
                <span class="material-symbols-outlined text-sm">download</span>
                导出数据
              </button>
            </div>
          </div>
          
          <!-- 订单列表 -->
          <div class="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                  <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-12">
                    <input id="order-check-all" onchange="toggleAllOrderChecks()" class="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary" type="checkbox"/>
                  </th>
                  <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">用户</th>
                  <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">套餐</th>
                  <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">金额</th>
                  <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">创建时间</th>
                  <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">状态</th>
                  <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">操作</th>
                </tr>
              </thead>
              <tbody id="orders-list" class="divide-y divide-slate-200 dark:divide-slate-800">
                <tr>
                  <td colspan="8" class="px-6 py-8 text-center text-slate-400">加载中...</td>
                </tr>
              </tbody>
            </table>
            <div class="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span id="orders-count" class="text-sm text-slate-500">共 0 条订单</span>
              <div class="flex items-center gap-2">
                <button onclick="batchApproveOrders()" class="px-3 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded transition-colors">批量通过</button>
                <button onclick="batchRejectOrders()" class="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors">批量拒绝</button>
              </div>
            </div>
          </div>
        </div>
        
        <div id="section-announcements" class="section-content">
          <!-- 添加新公告按钮 -->
          <div class="mb-6 flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold">公告列表</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">管理系统公告和通知信息</p>
            </div>
            <button onclick="openAddAnnouncementModal()" class="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity">
              <span class="material-symbols-outlined text-sm">add</span>
              添加公告
            </button>
          </div>
          
          <!-- 公告列表 -->
          <div class="space-y-4" id="announcements-list">
            <div class="text-center py-8 text-slate-400">加载中...</div>
          </div>
        </div>
        
        <div id="section-payment" class="section-content">
          <!-- 添加支付渠道按钮 -->
          <div class="mb-6 flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold">支付渠道</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">管理在线支付通道配置</p>
            </div>
            <button onclick="openAddPaymentChannelModal()" class="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity">
              <span class="material-symbols-outlined text-sm">add</span>
              添加渠道
            </button>
          </div>
          
          <!-- 支付渠道列表 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="payment-channels-list">
            <div class="col-span-2 text-center py-8 text-slate-400">加载中...</div>
          </div>
        </div>
        
        <div id="section-invites" class="section-content">
          <!-- 生成邀请码区域 -->
          <div class="bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg mb-6">
            <h2 class="text-sm font-medium text-zinc-500 mb-4">生成邀请码</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="space-y-2">
                <label class="text-xs font-medium text-zinc-700 dark:text-zinc-300">邀请码 <span class="text-zinc-400">(留空自动生成)</span></label>
                <input id="gen-invite-code" type="text" placeholder="自动生成" class="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"/>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-medium text-zinc-700 dark:text-zinc-300">可使用次数</label>
                <input id="gen-max-uses" type="number" value="1" min="1" class="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"/>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-medium text-zinc-700 dark:text-zinc-300">赠送试用天数</label>
                <input id="gen-trial-days" type="number" value="0" min="0" class="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"/>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-medium text-zinc-700 dark:text-zinc-300">备注</label>
                <input id="gen-remark" type="text" placeholder="可选" class="flex h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"/>
              </div>
            </div>
            <button onclick="generateInviteCode()" class="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium bg-black text-zinc-50 hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 h-9 px-4 py-2 transition-colors">
              <span class="material-symbols-outlined text-sm mr-2">add</span>
              生成邀请码
            </button>
          </div>
          
          <!-- 邀请码列表 -->
          <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead>
                  <tr class="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <th class="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">邀请码</th>
                    <th class="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">使用情况</th>
                    <th class="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">试用天数</th>
                    <th class="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">备注</th>
                    <th class="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">状态</th>
                    <th class="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">操作</th>
                  </tr>
                </thead>
                <tbody id="invites-list" class="divide-y divide-zinc-200 dark:divide-zinc-800">
                  <tr>
                    <td colspan="6" class="px-6 py-8 text-center text-zinc-400">加载中...</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800">
              <span id="invites-count" class="text-sm text-zinc-500">共 0 个邀请码</span>
            </div>
          </div>
        </div>
        
        <div id="section-password" class="section-content">
          <div class="rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark overflow-hidden">
            <div class="p-6 border-b border-border-light dark:border-border-dark">
              <h2 class="text-lg font-semibold">修改密码</h2>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">旧密码</label>
                <input id="oldPassword" type="password" class="w-full h-9 px-3 rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm outline-none focus:ring-1 focus:ring-primary"/>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">新密码</label>
                <input id="newPassword" type="password" class="w-full h-9 px-3 rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm outline-none focus:ring-1 focus:ring-primary"/>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">确认新密码</label>
                <input id="confirmPassword" type="password" class="w-full h-9 px-3 rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm outline-none focus:ring-1 focus:ring-primary"/>
              </div>
              <button onclick="changePassword()" class="bg-primary text-white text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
                修改密码
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  
  <script>
    // 主题切换
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      htmlElement.classList.add('dark');
    }
    
    themeToggle.addEventListener('click', () => {
      if (htmlElement.classList.contains('dark')) {
        htmlElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        htmlElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    });
    
    // 页面切换
    function switchSection(sectionName, skipSave) {
      // 隐藏所有部分
      document.querySelectorAll('.section-content').forEach(el => {
        el.classList.remove('active');
      });
      
      // 显示目标部分
      const targetSection = document.getElementById('section-' + sectionName);
      if (targetSection) {
        targetSection.classList.add('active');
      }
      
      // 保存当前section
      if (!skipSave) {
        localStorage.setItem('currentSection', sectionName);
      }
      
      // 更新导航高亮
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('bg-zinc-100', 'dark:bg-zinc-800', 'text-primary', 'dark:text-white', 'font-medium');
      });
      
      const targetLink = document.querySelector('[onclick*="' + sectionName + '"]');
      if (targetLink) {
        targetLink.closest('.nav-link').classList.add('bg-zinc-100', 'dark:bg-zinc-800', 'text-primary', 'dark:text-white', 'font-medium');
      }
      
      // 更新标题
      const titles = {
        'dashboard': '仪表盘概览',
        'users': '用户管理',
        'proxy-ips': '反代 IP 管理',
        'best-domains': '优选域名管理',
        'plans': '套餐管理',
        'orders': '订单管理',
        'announcements': '公告管理',
        'payment': '支付渠道',
        'invites': '邀请码管理',
        'password': '修改密码'
      };
      document.getElementById('section-title').textContent = titles[sectionName] || '管理面板';
      
      // 切换到对应页面时加载数据
      if (sectionName === 'users') loadAllUsers();
      if (sectionName === 'proxy-ips') loadProxyIPSettings();
      if (sectionName === 'best-domains') loadBestDomains();
      if (sectionName === 'plans') loadAllPlans();
      if (sectionName === 'orders') loadAllOrders();
      if (sectionName === 'announcements') loadAllAnnouncements();
      if (sectionName === 'payment') loadAllPaymentChannels();
      if (sectionName === 'invites') loadAllInviteCodes();
    }
    
    // 页面加载时恢复上次浏览的section
    const lastSection = localStorage.getItem('currentSection');
    if (lastSection && lastSection !== 'dashboard') {
      switchSection(lastSection, true);
    } else {
      // 默认加载用户列表
      loadAllUsers();
    }
    
    // ========== 模态框控制 ==========
    function openModal(title, bodyHtml, maxWidth, subtitle) {
      const modalContent = document.getElementById('modal-content');
      if (maxWidth) {
        modalContent.className = 'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-full mx-4 rounded-xl shadow-none overflow-hidden transform scale-100 transition-all duration-300 ' + maxWidth;
      } else {
        modalContent.className = 'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl mx-4 rounded-xl shadow-none overflow-hidden transform scale-100 transition-all duration-300';
      }
      document.getElementById('modal-title').textContent = title;
      document.getElementById('modal-subtitle').textContent = subtitle || '';
      document.getElementById('modal-body').innerHTML = bodyHtml;
      document.getElementById('modal-overlay').classList.add('modal-show');
    }
    
    function closeModal() {
      document.getElementById('modal-overlay').classList.remove('modal-show');
    }
    
    // ========== 自定义Alert弹窗 ==========
    function showAlert(message, type = 'info') {
      const overlay = document.getElementById('custom-alert-overlay');
      const icon = document.getElementById('alert-icon');
      const iconSpan = icon.querySelector('.material-symbols-outlined');
      const title = document.getElementById('alert-title');
      const messageEl = document.getElementById('alert-message');
      
      // 根据类型设置图标和样式
      const types = {
        success: {
          icon: 'check_circle',
          title: '成功',
          bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
          iconClass: 'text-emerald-600 dark:text-emerald-400'
        },
        error: {
          icon: 'error',
          title: '错误',
          bgClass: 'bg-red-100 dark:bg-red-900/30',
          iconClass: 'text-red-600 dark:text-red-400'
        },
        warning: {
          icon: 'warning',
          title: '警告',
          bgClass: 'bg-amber-100 dark:bg-amber-900/30',
          iconClass: 'text-amber-600 dark:text-amber-400'
        },
        info: {
          icon: 'info',
          title: '提示',
          bgClass: 'bg-blue-100 dark:bg-blue-900/30',
          iconClass: 'text-blue-600 dark:text-blue-400'
        }
      };
      
      const config = types[type] || types.info;
      
      icon.className = 'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ' + config.bgClass;
      iconSpan.className = 'material-symbols-outlined text-2xl ' + config.iconClass;
      iconSpan.textContent = config.icon;
      title.textContent = config.title;
      messageEl.textContent = message;
      
      overlay.classList.add('opacity-100', 'pointer-events-auto');
      overlay.querySelector('div').classList.add('scale-100');
      overlay.querySelector('div').classList.remove('scale-95');
    }
    
    function closeCustomAlert() {
      const overlay = document.getElementById('custom-alert-overlay');
      overlay.classList.remove('opacity-100', 'pointer-events-auto');
      overlay.querySelector('div').classList.remove('scale-100');
      overlay.querySelector('div').classList.add('scale-95');
    }
    
    // ========== 自定义Confirm弹窗 ==========
    let confirmCallback = null;
    
    function showConfirm(message, title = '确认操作') {
      return new Promise((resolve) => {
        const overlay = document.getElementById('custom-confirm-overlay');
        const titleEl = document.getElementById('confirm-title');
        const messageEl = document.getElementById('confirm-message');
        
        titleEl.textContent = title;
        messageEl.textContent = message;
        
        confirmCallback = resolve;
        
        overlay.classList.add('opacity-100', 'pointer-events-auto');
        overlay.querySelector('div').classList.add('scale-100');
        overlay.querySelector('div').classList.remove('scale-95');
      });
    }
    
    function closeCustomConfirm(result) {
      const overlay = document.getElementById('custom-confirm-overlay');
      overlay.classList.remove('opacity-100', 'pointer-events-auto');
      overlay.querySelector('div').classList.remove('scale-100');
      overlay.querySelector('div').classList.add('scale-95');
      
      if (confirmCallback) {
        confirmCallback(result);
        confirmCallback = null;
      }
    }
    
    // 重写原生alert和confirm
    window.alert = function(message) {
      // 解析消息类型
      let type = 'info';
      let cleanMessage = message;
      
      if (message.startsWith('✅')) {
        type = 'success';
        cleanMessage = message.replace(/^✅\s*/, '');
      } else if (message.startsWith('❌')) {
        type = 'error';
        cleanMessage = message.replace(/^❌\s*/, '');
      } else if (message.startsWith('⚠️')) {
        type = 'warning';
        cleanMessage = message.replace(/^⚠️\s*/, '');
      } else if (message.startsWith('⏳')) {
        type = 'info';
        cleanMessage = message.replace(/^⏳\s*/, '');
      }
      
      showAlert(cleanMessage, type);
    };
    
    window.confirm = function(message) {
      const cleanMessage = message.replace(/^⚠️\s*/, '');
      return showConfirm(cleanMessage);
    };
    
    // ========== 用户管理功能 ==========
    let allUsersData = [];
    
    async function loadAllUsers() {
      try {
        const response = await fetch('/api/admin/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        
        const result = await response.json();
        const users = result.users || [];
        allUsersData = users;
        
        // 更新用户数量
        document.getElementById('user-count').textContent = users.length;
        
        const tbody = document.getElementById('users-list-body');
        tbody.innerHTML = '';
        
        if (users.length === 0) {
          tbody.innerHTML = '<tr><td colspan="7" class="p-8 text-center text-muted-light">暂无用户数据</td></tr>';
          return;
        }
        
        // 一次性渲染所有用户
        users.forEach(u => {
          const isExpired = u.expiry && u.expiry < Date.now();
          const isEnabled = u.enabled;
          
          let statusBadge = '';
          
          if (!u.expiry) {
            statusBadge = '<span class="inline-flex items-center rounded-full border border-border-light dark:border-border-dark bg-slate-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-slate-400">未激活</span>';
          } else if (isExpired) {
            statusBadge = '<span class="inline-flex items-center rounded-full border border-border-light dark:border-border-dark bg-slate-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-slate-400">已过期</span>';
          } else if (!isEnabled) {
            statusBadge = '<span class="inline-flex items-center rounded-full border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 px-2.5 py-0.5 text-xs font-semibold text-red-600 dark:text-red-400">已禁用</span>';
          } else {
            statusBadge = '<span class="inline-flex items-center rounded-full border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950 px-2.5 py-0.5 text-xs font-semibold text-green-600 dark:text-green-400">正常</span>';
          }
          
          const expiryTime = u.expiry 
            ? new Date(u.expiry).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              }).replace(/\\//g, '-')
            : '未激活';
          
          const createTime = u.createAt 
            ? new Date(u.createAt).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              }).replace(/\\//g, '-')
            : '-';
          
          const row = '<tr class="hover:bg-slate-50/50 dark:hover:bg-zinc-900/50 transition-colors">' +
            '<td class="p-4 align-middle">' +
              '<input type="checkbox" class="u-check rounded border-slate-300 dark:border-zinc-700 text-primary focus:ring-primary cursor-pointer" value="'+ u.uuid +'" onchange="updateBatchBar()" data-name="'+ (u.name || '') +'"/>' +
            '</td>' +
            '<td class="p-4 align-middle font-mono text-[13px] text-blue-600 dark:text-blue-400 cursor-pointer hover:underline" onclick="copy(\\'+ u.uuid +'\\')" title="点击复制">'+ u.uuid +'</td>' +
            '<td class="p-4 align-middle">'+ (u.name || '-') +'</td>' +
            '<td class="p-4 align-middle text-muted-light">'+ createTime +'</td>' +
            '<td class="p-4 align-middle text-muted-light">'+ expiryTime +'</td>' +
            '<td class="p-4 align-middle">'+ statusBadge +'</td>' +
            '<td class="p-4 align-middle text-right">' +
              '<div class="relative inline-block">' +
                '<button id="menu-btn-' + u.uuid + '" onclick="toggleUserMenu(\\'+ u.uuid +'\\')" class="user-menu-btn h-8 w-8 inline-flex items-center justify-center rounded-md border border-border-light dark:border-border-dark hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">' +
                  '<span class="material-symbols-outlined text-sm">more_horiz</span>' +
                '</button>' +
                '<div id="menu-'+ u.uuid +'" class="user-menu hidden absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-border-light dark:border-border-dark rounded-md shadow-lg z-50">' +
                  '<div class="py-1">' +
                    '<button onclick="showSubLinkModal(\\'+ u.uuid +'\\')" class="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-2">' +
                      '<span class="material-symbols-outlined text-sm">link</span>订阅链接' +
                    '</button>' +
                    '<button onclick="openEditUser(\\'+ u.uuid +'\\')" class="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-2">' +
                      '<span class="material-symbols-outlined text-sm">edit</span>编辑' +
                    '</button>' +
                    (isEnabled && !isExpired ? 
                      '<button onclick="toggleUserStatus(\\'+ u.uuid +'\\',false)" class="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-2">' +
                        '<span class="material-symbols-outlined text-sm">block</span>禁用' +
                      '</button>' :
                      (!isEnabled && !isExpired ? 
                        '<button onclick="toggleUserStatus(\\'+ u.uuid +'\\',true)" class="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-2">' +
                          '<span class="material-symbols-outlined text-sm">check_circle</span>启用' +
                        '</button>' : '')
                    ) +
                    (!isExpired ? 
                      '<button onclick="openRenewUser(\\'+ u.uuid +'\\')" class="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-2">' +
                        '<span class="material-symbols-outlined text-sm">schedule</span>续期' +
                      '</button>' : ''
                    ) +
                    '<button onclick="confirmResetUUID(\\'+ u.uuid +'\\')" class="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-2">' +
                      '<span class="material-symbols-outlined text-sm">refresh</span>重置UUID' +
                    '</button>' +
                    '<div class="border-t border-border-light dark:border-border-dark"></div>' +
                    '<button onclick="deleteUser(\\'+ u.uuid +'\\')" class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2">' +
                      '<span class="material-symbols-outlined text-sm">delete</span>删除' +
                    '</button>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</td>' +
          '</tr>';
          
          tbody.innerHTML += row;
        });
      } catch (error) {
        console.error('加载用户列表失败:', error);
        document.getElementById('users-list-body').innerHTML = '<tr><td colspan="7" class="p-8 text-center text-red-600">加载失败: '+ error.message +'</td></tr>';
      }
    }
    
    function openAddUserModal() {
      const bodyHtml = '<div class=\"space-y-4\">' +
        '<div class=\"space-y-2\">' +
          '<label class=\"text-sm font-medium\">用户名</label>' +
          '<input id=\"new-username\" type=\"text\" placeholder=\"请输入用户名\" class=\"w-full h-9 px-3 rounded-md border border-border-light dark:border-border-dark bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary\">' +
        '</div>' +
        '<div class=\"space-y-2\">' +
          '<label class=\"text-sm font-medium\">到期时间</label>' +
          '<input id=\"new-expiry\" type=\"datetime-local\" class=\"w-full h-9 px-3 rounded-md border border-border-light dark:border-border-dark bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary\">' +
          '<p class=\"text-xs text-muted-light\">留空则为永久有效</p>' +
        '</div>' +
        '<div class=\"space-y-2\">' +
          '<label class=\"text-sm font-medium\">关联 UUID (可选)</label>' +
          '<input id=\"new-linked-uuid\" type=\"text\" placeholder=\"留空则自动生成\" class=\"w-full h-9 px-3 rounded-md border border-border-light dark:border-border-dark bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary\">' +
        '</div>' +
      '</div>' +
      '<div class=\"flex justify-end gap-2 mt-6\">' +
        '<button onclick=\"closeModal()\" class=\"px-4 py-2 text-sm font-medium border border-border-light dark:border-border-dark rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900\">取消</button>' +
        '<button onclick=\"submitAddUser()\" class=\"px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:opacity-90\">添加用户</button>' +
      '</div>';
      openModal('添加用户', bodyHtml);
    }
    
    async function submitAddUser() {
      const name = document.getElementById('add-name').value.trim() || '未命名';
      const expiryDate = document.getElementById('add-expiry').value;
      const frontUsername = document.getElementById('add-front-username').value.trim();
      const frontPassword = document.getElementById('add-front-password').value.trim();
      const uuids = document.getElementById('add-uuids').value.trim();
      
      try {
        const response = await fetch('/api/admin/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name, 
            expiryDate,
            frontUsername,
            frontPassword,
            uuids
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('用户添加成功', 'success');
          // 清空表单
          document.getElementById('add-name').value = '';
          document.getElementById('add-expiry').value = '';
          document.getElementById('add-front-username').value = '';
          document.getElementById('add-front-password').value = '';
          document.getElementById('add-uuids').value = '';
          loadAllUsers();
        } else {
          showAlert('添加失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('添加失败: ' + error.message, 'error');
      }
    }
    
    // 切换用户菜单
    function toggleUserMenu(uuid) {
      // 关闭所有其他菜单
      document.querySelectorAll('.user-menu').forEach(menu => {
        if (menu.id !== 'menu-' + uuid) {
          menu.classList.add('hidden');
        }
      });
      
      const menu = document.getElementById('menu-' + uuid);
      const button = document.getElementById('menu-btn-' + uuid);
      
      if (menu && button) {
        const isHidden = menu.classList.contains('hidden');
        
        if (isHidden) {
          // 获取按钮位置
          const buttonRect = button.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // 估算菜单高度（根据菜单项数量）
          const menuItems = menu.querySelectorAll('button').length;
          const estimatedMenuHeight = menuItems * 40 + 16; // 每项约40px + padding
          
          // 判断是否需要向上弹出
          const spaceBelow = windowHeight - buttonRect.bottom;
          const shouldPopUp = spaceBelow < estimatedMenuHeight + 20; // 留20px余量
          
          // 移除之前的定位类
          menu.classList.remove('bottom-full', 'mb-2');
          menu.style.removeProperty('top');
          menu.style.removeProperty('bottom');
          
          if (shouldPopUp) {
            // 向上弹出
            menu.classList.add('bottom-full', 'mb-2');
          } else {
            // 向下弹出（默认）
            menu.classList.remove('bottom-full', 'mb-2');
          }
          
          menu.classList.remove('hidden');
        } else {
          menu.classList.add('hidden');
        }
      }
    }
    
    // 点击页面其他地方关闭菜单
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.user-menu-btn') && !e.target.closest('.user-menu')) {
        document.querySelectorAll('.user-menu').forEach(menu => menu.classList.add('hidden'));
      }
    });
    
    // 搜索用户
    function filterUsers() {
      const searchText = document.getElementById('search-input').value.toLowerCase();
      const rows = document.querySelectorAll('#users-list-body tr');
      
      rows.forEach(row => {
        const uuid = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
        const name = row.querySelector('td:nth-child(3)')?.textContent.toLowerCase() || '';
        
        if (uuid.includes(searchText) || name.includes(searchText)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }
    
    // 确认重置UUID
    async function confirmResetUUID(uuid) {
      const confirmed = await showConfirm('确定要重置该用户的 UUID 吗？\n\n⚠️ 此操作将导致用户需要重新配置客户端！', '重置UUID');
      if (!confirmed) return;
      await resetUserUUID(uuid);
    }
    
    async function openEditUserModal(uuid) {
      try {
        const response = await fetch('/api/admin/user/' + uuid);
        if (!response.ok) throw new Error('Failed to fetch user');
        
        const user = await response.json();
        const account = allUsersData.find(u => u.uuid === uuid);
        
        const expiryValue = user.expiry ? new Date(user.expiry).toISOString().slice(0, 16) : '';
        
        const bodyHtml = '<div class=\"space-y-4\">' +
          '<div class=\"space-y-2\">' +
            '<label class=\"text-sm font-medium\">UUID</label>' +
            '<input type=\"text\" value=\"' + uuid + '\" disabled class=\"w-full h-9 px-3 rounded-md border border-border-light dark:border-border-dark bg-zinc-50 dark:bg-zinc-900 text-sm text-muted-light font-mono\">' +
          '</div>' +
          '<div class=\"space-y-2\">' +
            '<label class=\"text-sm font-medium\">用户名</label>' +
            '<input id=\"edit-username\" type=\"text\" value=\"' + (account?.account || '') + '\" class=\"w-full h-9 px-3 rounded-md border border-border-light dark:border-border-dark bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary\">' +
          '</div>' +
          '<div class=\"space-y-2\">' +
            '<label class=\"text-sm font-medium\">到期时间</label>' +
            '<input id=\"edit-expiry\" type=\"datetime-local\" value=\"' + expiryValue + '\" class=\"w-full h-9 px-3 rounded-md border border-border-light dark:border-border-dark bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary\">' +
          '</div>' +
          '<div class=\"space-y-2\">' +
            '<label class=\"text-sm font-medium\">状态</label>' +
            '<label class=\"flex items-center gap-2 cursor-pointer\">' +
              '<input id=\"edit-enabled\" type=\"checkbox\" ' + (user.enabled ? 'checked' : '') + ' class=\"rounded border-zinc-300 dark:border-zinc-700 text-primary focus:ring-primary\">' +
              '<span class=\"text-sm\">启用用户</span>' +
            '</label>' +
          '</div>' +
        '</div>' +
        '<div class=\"flex justify-end gap-2 mt-6\">' +
          '<button onclick=\"closeModal()\" class=\"px-4 py-2 text-sm font-medium border border-border-light dark:border-border-dark rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900\">取消</button>' +
          "<button onclick=\"submitEditUser('" + uuid + "')\" class=\"px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:opacity-90\">保存修改</button>" +
        '</div>';
        openModal('编辑用户', bodyHtml);
      } catch (error) {
        showAlert('加载用户信息失败: ' + error.message, 'error');
      }
    }
    
    async function submitEditUser(uuid) {
      const username = document.getElementById('edit-username').value.trim();
      const expiryInput = document.getElementById('edit-expiry').value;
      const enabled = document.getElementById('edit-enabled').checked;
      
      const expiry = expiryInput ? new Date(expiryInput).getTime() : null;
      
      try {
        const response = await fetch('/api/admin/user/' + uuid, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ account: username, expiry, enabled })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('用户信息已更新', 'success');
          closeModal();
          loadAllUsers();
        } else {
          showAlert('更新失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('更新失败: ' + error.message, 'error');
      }
    }
    
    async function resetUserUUID(uuid) {
      const confirmed = await showConfirm('确定要重置该用户的 UUID 吗？\n\n⚠️ 此操作将导致用户需要重新配置客户端！', '重置UUID');
      if (!confirmed) return;
      
      try {
        const response = await fetch('/api/admin/reset-uuid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuid })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('UUID 已重置\n\n新 UUID: ' + result.newUuid, 'success');
          loadAllUsers();
        } else {
          showAlert('重置失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('重置失败: ' + error.message, 'error');
      }
    }
    
    // 批量操作相关函数
    function toggleCheckAll() {
      const checkAll = document.getElementById('check-all');
      const checkboxes = document.querySelectorAll('.u-check');
      checkboxes.forEach(cb => cb.checked = checkAll.checked);
      updateBatchBar();
    }
    
    function updateBatchBar() {
      const checked = document.querySelectorAll('.u-check:checked');
      const count = checked.length;
      const bar = document.getElementById('batch-bar');
      const countSpan = document.getElementById('sel-count');
      
      if (count > 0) {
        bar.classList.remove('hidden');
        countSpan.textContent = count;
      } else {
        bar.classList.add('hidden');
      }
    }
    
    async function batchEnable() {
      const checked = Array.from(document.querySelectorAll('.u-check:checked'));
      if (checked.length === 0) return;
      
      const confirmed = await showConfirm('确定要启用选中的 ' + checked.length + ' 个用户吗？', '批量启用');
      if (!confirmed) return;
      
      try {
        const uuids = checked.map(cb => cb.value).join(',');
        const response = await fetch('/api/admin/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuids, enabled: 'true' })
        });
        
        const result = await response.json();
        if (result.success) {
          showAlert('批量启用成功', 'success');
          loadAllUsers();
        } else {
          showAlert('操作失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('操作失败: ' + error.message, 'error');
      }
    }
    
    async function batchDisable() {
      const checked = Array.from(document.querySelectorAll('.u-check:checked'));
      if (checked.length === 0) return;
      
      const confirmed = await showConfirm('确定要禁用选中的 ' + checked.length + ' 个用户吗？', '批量禁用');
      if (!confirmed) return;
      
      try {
        const uuids = checked.map(cb => cb.value).join(',');
        const response = await fetch('/api/admin/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuids, enabled: 'false' })
        });
        
        const result = await response.json();
        if (result.success) {
          showAlert('批量禁用成功', 'success');
          loadAllUsers();
        } else {
          showAlert('操作失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('操作失败: ' + error.message, 'error');
      }
    }
    
    async function batchDelete() {
      const checked = Array.from(document.querySelectorAll('.u-check:checked'));
      if (checked.length === 0) return;
      
      const confirmed = await showConfirm('确定要删除选中的 ' + checked.length + ' 个用户吗？\n\n⚠️ 此操作不可恢复！', '批量删除');
      if (!confirmed) return;
      
      try {
        const uuids = checked.map(cb => cb.value).join(',');
        const response = await fetch('/api/admin/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuids })
        });
        
        const result = await response.json();
        if (result.success) {
          showAlert('批量删除成功', 'success');
          loadAllUsers();
        } else {
          showAlert('操作失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('操作失败: ' + error.message, 'error');
      }
    }
    
    async function toggleUserStatus(uuid, enable) {
      try {
        const response = await fetch('/api/admin/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuids: uuid, enabled: String(enable) })
        });
        
        const result = await response.json();
        if (result.success) {
          showAlert(enable ? '已启用' : '已禁用', 'success');
          loadAllUsers();
        } else {
          showAlert('操作失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('操作失败: ' + error.message, 'error');
      }
    }
    
    function openEditUser(uuid) {
      const user = allUsersData.find(u => u.uuid === uuid);
      if (!user) return;
      
      const expiryDate = user.expiry ? new Date(user.expiry).toISOString().slice(0,16) : '';
      
      const bodyHtml = '<div class="space-y-4">' +
        '<input type="hidden" id="edit-uuid" value="'+ uuid +'">' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium">备注名称</label>' +
          '<input id="edit-name" type="text" value="'+ (user.name || '') +'" class="w-full h-9 px-3 rounded-md border border-border-light dark:border-border-dark bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary">' +
        '</div>' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium">到期时间</label>' +
          '<input id="edit-expiry" type="datetime-local" value="'+ expiryDate +'" class="w-full h-9 px-3 rounded-md border border-border-light dark:border-border-dark bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary">' +
        '</div>' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium">前端用户名 <span class="text-xs text-muted-light">(留空不修改)</span></label>' +
          '<input id="edit-front-username" type="text" placeholder="留空不修改" class="w-full h-9 px-3 rounded-md border border-border-light dark:border-border-dark bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary">' +
        '</div>' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium">前端密码 <span class="text-xs text-muted-light">(留空不修改)</span></label>' +
          '<input id="edit-front-password" type="password" placeholder="留空不修改" class="w-full h-9 px-3 rounded-md border border-border-light dark:border-border-dark bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary">' +
        '</div>' +
      '</div>' +
      '<div class="flex justify-end gap-2 mt-6">' +
        '<button onclick="closeModal()" class="px-4 py-2 text-sm font-medium border border-border-light dark:border-border-dark rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900">取消</button>' +
        '<button onclick="saveEditUser()" class="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:opacity-90">保存</button>' +
      '</div>';
      
      openModal('编辑用户', bodyHtml);
    }
    
    async function saveEditUser() {
      const uuid = document.getElementById('edit-uuid').value;
      const name = document.getElementById('edit-name').value.trim();
      const expiryInput = document.getElementById('edit-expiry').value;
      const frontUsername = document.getElementById('edit-front-username').value.trim();
      const frontPassword = document.getElementById('edit-front-password').value.trim();
      const expiry = expiryInput ? new Date(expiryInput).getTime() : null;
      
      const data = { uuid, name, expiry };
      if (frontUsername) data.frontUsername = frontUsername;
      if (frontPassword) data.frontPassword = frontPassword;
      
      try {
        const response = await fetch('/api/admin/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.success) {
          showAlert('更新成功', 'success');
          closeModal();
          loadAllUsers();
        } else {
          showAlert('更新失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('更新失败: ' + error.message, 'error');
      }
    }
    
    function openRenewUser(uuid) {
      const bodyHtml = '<div class="space-y-4">' +
        '<input type="hidden" id="renew-uuid" value="'+ uuid +'">' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium">续期天数</label>' +
          '<input id="renew-days" type="number" min="1" value="30" class="w-full h-9 px-3 rounded-md border border-border-light dark:border-border-dark bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary">' +
          '<p class="text-xs text-muted-light">在现有到期时间基础上增加天数</p>' +
        '</div>' +
      '</div>' +
      '<div class="flex justify-end gap-2 mt-6">' +
        '<button onclick="closeModal()" class="px-4 py-2 text-sm font-medium border border-border-light dark:border-border-dark rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900">取消</button>' +
        '<button onclick="saveRenewUser()" class="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:opacity-90">续期</button>' +
      '</div>';
      
      openModal('用户续期', bodyHtml);
    }
    
    async function saveRenewUser() {
      const uuid = document.getElementById('renew-uuid').value;
      const days = parseInt(document.getElementById('renew-days').value);
      
      if (!days || days <= 0) {
        showAlert('请输入有效的天数', 'warning');
        return;
      }
      
      const user = allUsersData.find(u => u.uuid === uuid);
      if (!user) return;
      
      // 如果已过期或未激活，从当前时间开始计算；否则从到期时间延长
      const now = Date.now();
      const baseTime = (user.expiry && user.expiry > now) ? user.expiry : now;
      const newExpiry = baseTime + (days * 24 * 60 * 60 * 1000);
      
      try {
        const response = await fetch('/api/admin/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuid, expiry: newExpiry })
        });
        
        const result = await response.json();
        if (result.success) {
          showAlert('续期成功', 'success');
          closeModal();
          loadAllUsers();
        } else {
          showAlert('续期失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('续期失败: ' + error.message, 'error');
      }
    }
    
    // 复制到剪贴板函数
    function copyToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showAlert('已复制到剪贴板', 'success');
        }).catch(err => {
          // 降级方案
          fallbackCopyToClipboard(text);
        });
      } else {
        fallbackCopyToClipboard(text);
      }
    }
    
    // 降级复制方案
    function fallbackCopyToClipboard(text) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        showAlert('已复制到剪贴板', 'success');
      } catch (err) {
        showAlert('复制失败，请手动复制', 'error');
      }
      document.body.removeChild(textArea);
    }
    
    function copySubOriginal(uuid) {
      const subUrl = window.location.origin + '/api/sub/' + uuid;
      copyToClipboard(subUrl);
    }
    
    // 显示订阅链接选择弹窗
    let currentSubUuid = '';
    function showSubLinkModal(uuid) {
      currentSubUuid = uuid;
      const modal = document.getElementById('sub-link-modal');
      const buttonsContainer = document.getElementById('sub-link-buttons');
      
      // 定义客户端列表（与用户前端一致）
      const clients = [
        { name: '通用订阅', value: 'original', icon: 'link' },
        { name: 'Clash', value: 'clash', icon: 'cloud' },
        { name: 'Surge', value: 'surge', icon: 'waves' },
        { name: 'Shadowrocket', value: 'shadowrocket', icon: 'rocket_launch' },
        { name: 'Quantumult X', value: 'quantumult', icon: 'speed' },
        { name: 'Sing-box', value: 'sing-box', icon: 'music_note' }
      ];
      
      // 生成按钮
      buttonsContainer.innerHTML = clients.map(client => 
        '<button onclick="copySubLinkAndClose(\\\''+ client.value +'\\\')" class="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-800 transition-colors">' +
          '<span class="material-symbols-outlined text-2xl text-slate-700 dark:text-zinc-300">' + client.icon + '</span>' +
          '<span class="text-sm font-medium text-slate-900 dark:text-zinc-100">' + client.name + '</span>' +
        '</button>'
      ).join('');
      
      // 显示弹窗
      modal.classList.remove('opacity-0', 'pointer-events-none');
      modal.classList.add('modal-show');
      
      // 关闭用户菜单
      const menu = document.getElementById('menu-' + uuid);
      if (menu) {
        menu.classList.add('hidden');
      }
    }
    
    function closeSubLinkModal() {
      const modal = document.getElementById('sub-link-modal');
      modal.classList.add('opacity-0', 'pointer-events-none');
      modal.classList.remove('modal-show');
      currentSubUuid = '';
    }
    
    function copySubLinkAndClose(client) {
      copySubLink(currentSubUuid, client);
      closeSubLinkModal();
    }
    
    // 复制不同客户端的订阅链接
    async function copySubLink(uuid, client) {
      // 获取系统设置中的订阅地址
      let subUrlConfig = '';
      try {
        const response = await fetch('/api/admin/getSystemSettings');
        const data = await response.json();
        if (data.success && data.settings.subUrl) {
          subUrlConfig = data.settings.subUrl;
        }
      } catch (error) {
        console.error('获取订阅地址失败:', error);
      }
      
      // 如果没有配置订阅地址，使用默认值
      if (!subUrlConfig) {
        subUrlConfig = window.location.origin;
      }
      
      // 确保 URL 有 https:// 前缀
      let normalizedSubUrl = subUrlConfig.trim();
      if (!normalizedSubUrl.startsWith('http://') && !normalizedSubUrl.startsWith('https://')) {
        normalizedSubUrl = 'https://' + normalizedSubUrl;
      }
      
      // 构建原始订阅URL
      const originalUrl = normalizedSubUrl + '/' + uuid;
      
      // 订阅转换配置
      const apiBaseUrl = 'https://url.v1.mk/sub';
      let finalUrl, clientName;
      
      // 根据客户端类型生成订阅链接
      if (client === 'original') {
        // 通用订阅：直接使用原始URL
        finalUrl = originalUrl;
        clientName = '通用订阅';
      } else {
        // 其他客户端：使用订阅转换
        const clientNames = {
          'clash': 'Clash',
          'surge': 'Surge',
          'shadowrocket': 'Shadowrocket',
          'quantumult': 'Quantumult X',
          'sing-box': 'Sing-box',
          'v2ray': 'V2Ray'
        };
        
        const targetMap = {
          'clash': 'clash',
          'surge': 'surge',
          'shadowrocket': 'shadowrocket',
          'quantumult': 'quanx',
          'sing-box': 'singbox',
          'v2ray': 'v2ray'
        };
        
        finalUrl = apiBaseUrl + '?target=' + targetMap[client] + '&url=' + encodeURIComponent(originalUrl);
        clientName = clientNames[client] || client;
      }
      
      copyToClipboard(finalUrl);
    }
    
    async function deleteUser(uuid) {
      const confirmed = await showConfirm('确定要删除该用户吗？\n\n⚠️ 此操作不可恢复！', '删除用户');
      if (!confirmed) return;
      
      try {
        const response = await fetch('/api/admin/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuids: uuid })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('用户已删除', 'success');
          loadAllUsers();
        } else {
          showAlert('删除失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('删除失败: ' + error.message, 'error');
      }
    }
    
    // ========== 反代IP功能 ==========
    let currentProxyIPs = [];
    
    async function loadProxyIPSettings() {
      try {
        // 加载系统设置
        const settingsResponse = await fetch('/api/admin/getSystemSettings');
        const settingsData = await settingsResponse.json();
        
        if (settingsData.success) {
          const settings = settingsData.settings;
          document.getElementById('sub-url').value = settings.subUrl || '';
          document.getElementById('website-url').value = settings.websiteUrl || '';
        }
        
        // 加载反代IP列表
        const response = await fetch('/api/admin/proxy-ips');
        if (!response.ok) throw new Error('Failed to fetch proxy IPs');
        
        const data = await response.json();
        currentProxyIPs = data.proxyIPs || [];
        
        renderProxyIPList();
      } catch (error) {
        console.error('加载反代IP设置失败:', error);
        showAlert('加载失败: ' + error.message, 'error');
      }
    }
    
    function renderProxyIPList() {
      const listContainer = document.getElementById('proxy-ips-list');
      document.getElementById('proxy-ips-count').textContent = '已配置 ' + currentProxyIPs.length + ' 个';
      
      if (currentProxyIPs.length === 0) {
        listContainer.innerHTML = '<div class="divide-y divide-slate-200 dark:divide-zinc-800"><div class="p-8 text-center text-slate-400 dark:text-zinc-600"><span class="material-symbols-outlined text-4xl mb-2">cloud_off</span><p class="text-sm">暂无反代 IP</p></div></div>';
        return;
      }
      
      let html = '<div class="divide-y divide-slate-200 dark:divide-zinc-800">';
      currentProxyIPs.forEach((ip, index) => {
        html += '<div class="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">' +
          '<div class="flex items-center gap-4">' +
            '<span class="material-symbols-outlined text-slate-400 dark:text-zinc-600 cursor-move">drag_indicator</span>' +
            '<code class="text-sm font-mono text-slate-700 dark:text-zinc-300">' + ip + '</code>' +
          '</div>' +
          '<button onclick="deleteProxyIP(' + index + ')" class="text-slate-400 hover:text-red-500 dark:text-zinc-600 dark:hover:text-red-400 transition-colors">' +
            '<span class="material-symbols-outlined">delete</span>' +
          '</button>' +
        '</div>';
      });
      html += '</div>';
      listContainer.innerHTML = html;
    }
    
    function batchAddProxyIPs() {
      const input = document.getElementById('proxy-ips-batch-input').value;
      const newIPs = input.split('\\n').map(line => line.trim()).filter(line => line);
      
      if (newIPs.length === 0) {
        showAlert('请输入要添加的反代 IP', 'warning');
        return;
      }
      
      // 去重并添加
      newIPs.forEach(ip => {
        if (!currentProxyIPs.includes(ip)) {
          currentProxyIPs.push(ip);
        }
      });
      
      document.getElementById('proxy-ips-batch-input').value = '';
      renderProxyIPList();
      showAlert('已添加 ' + newIPs.length + ' 个反代 IP', 'success');
    }
    
    async function deleteProxyIP(index) {
      const confirmed = await showConfirm('确定要删除该反代 IP 吗？', '删除反代IP');
      if (!confirmed) return;
      currentProxyIPs.splice(index, 1);
      renderProxyIPList();
    }
    
    async function saveAllProxyIPSettings() {
      try {
        const subUrl = document.getElementById('sub-url').value.trim();
        const websiteUrl = document.getElementById('website-url').value.trim();
        
        // 保存系统设置
        const settingsResponse = await fetch('/api/admin/saveSettings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            subUrl, 
            websiteUrl,
            proxyIP: currentProxyIPs.join('\\n')
          })
        });
        
        const settingsResult = await settingsResponse.json();
        if (!settingsResult.success) {
          throw new Error(settingsResult.error || '保存系统设置失败');
        }
        
        // 保存反代IP列表
        const proxyResponse = await fetch('/api/admin/proxy-ips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ proxyIPs: currentProxyIPs })
        });
        
        const proxyResult = await proxyResponse.json();
        
        if (proxyResult.success) {
          showAlert('保存成功\n\n' + 
            '订阅地址: ' + (subUrl || '未设置') + '\\n' +
            '官网地址: ' + (websiteUrl || '未设置') + '\\n' +
            '反代 IP: ' + currentProxyIPs.length + ' 个', 'success');
        } else {
          showAlert('保存失败: ' + (proxyResult.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('保存失败: ' + error.message, 'error');
      }
    }
    
    // ========== 套餐管理功能 ==========
    let allPlans = [];
    
    async function loadAllPlans() {
      try {
        const response = await fetch('/api/admin/plans');
        if (!response.ok) throw new Error('Failed to fetch plans');
        
        const data = await response.json();
        if (data.success) {
          allPlans = data.plans || [];
          renderPlansList();
        } else {
          showAlert('加载套餐失败: ' + (data.error || '未知错误'), 'error');
        }
      } catch (error) {
        console.error('加载套餐失败:', error);
        showAlert('加载套餐失败: ' + error.message, 'error');
      }
    }
    
    function renderPlansList() {
      const tbody = document.getElementById('plans-list');
      const countDiv = document.getElementById('plans-count');
      
      if (!allPlans || allPlans.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-slate-400 dark:text-slate-600"><span class="material-symbols-outlined text-4xl mb-2 block">inventory_2</span><p class="text-sm">暂无套餐</p></td></tr>';
        countDiv.textContent = '共 0 个套餐项目';
        return;
      }
      
      let html = '';
      allPlans.forEach(plan => {
        const statusClass = plan.enabled 
          ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          : 'bg-slate-50 dark:bg-slate-950 text-slate-400 border border-slate-200 dark:border-slate-800';
        const statusText = plan.enabled ? '已上架' : '已下架';
        const toggleIcon = plan.enabled ? 'toggle_on' : 'toggle_off';
        const rowOpacity = plan.enabled ? '' : ' opacity-60';
        
        html += '<tr class="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors' + rowOpacity + '" data-plan-name="' + plan.name.toLowerCase() + '">' +
          '<td class="px-6 py-4 font-medium">' + plan.name + '</td>' +
          '<td class="px-6 py-4 text-slate-500">' + plan.duration_days + '天</td>' +
          '<td class="px-6 py-4">¥' + parseFloat(plan.price).toFixed(2) + '</td>' +
          '<td class="px-6 py-4 text-slate-500 max-w-xs truncate">' + (plan.description || '-') + '</td>' +
          '<td class="px-6 py-4">' +
            '<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ' + statusClass + '">' +
              statusText +
            '</span>' +
          '</td>' +
          '<td class="px-6 py-4 text-right">' +
            '<div class="flex items-center justify-end gap-1">' +
              '<button onclick="togglePlanStatus(' + plan.id + ')" class="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-colors" title="切换状态">' +
                '<span class="material-symbols-outlined text-[20px]">' + toggleIcon + '</span>' +
              '</button>' +
              '<button onclick="editPlan(' + plan.id + ')" class="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-colors" title="编辑">' +
                '<span class="material-symbols-outlined text-[20px]">edit_note</span>' +
              '</button>' +
              '<button onclick="deletePlanConfirm(' + plan.id + ')" class="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors" title="删除">' +
                '<span class="material-symbols-outlined text-[20px]">delete_outline</span>' +
              '</button>' +
            '</div>' +
          '</td>' +
        '</tr>';
      });
      
      tbody.innerHTML = html;
      countDiv.textContent = '共 ' + allPlans.length + ' 个套餐项目';
    }
    
    function filterPlans() {
      const searchTerm = document.getElementById('plan-search').value.toLowerCase();
      const rows = document.querySelectorAll('#plans-list tr[data-plan-name]');
      
      rows.forEach(row => {
        const planName = row.getAttribute('data-plan-name');
        if (planName.includes(searchTerm)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }
    
    async function addNewPlan() {
      const name = document.getElementById('plan-name').value.trim();
      const duration = parseInt(document.getElementById('plan-duration').value);
      const price = parseFloat(document.getElementById('plan-price').value);
      const description = document.getElementById('plan-description').value.trim();
      
      if (!name) {
        showAlert('请输入套餐名称', 'warning');
        return;
      }
      
      if (!duration || duration <= 0) {
        showAlert('请输入有效的时长', 'warning');
        return;
      }
      
      if (isNaN(price) || price < 0) {
        showAlert('请输入有效的价格', 'warning');
        return;
      }
      
      try {
        const response = await fetch('/api/admin/plans/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            description,
            duration_days: duration,
            price
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('套餐添加成功', 'success');
          document.getElementById('add-plan-form').reset();
          document.getElementById('plan-duration').value = 30;
          document.getElementById('plan-price').value = 0;
          loadAllPlans();
        } else {
          showAlert('添加失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('添加失败: ' + error.message, 'error');
      }
    }
    
    function editPlan(planId) {
      const plan = allPlans.find(p => p.id === planId);
      if (!plan) return;
      
      const bodyHtml = '<div class="space-y-4">' +
        '<input type="hidden" id="edit-plan-id" value="' + planId + '">' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium">套餐名称</label>' +
          '<input id="edit-plan-name" type="text" value="' + plan.name + '" class="w-full h-9 px-3 rounded-md border border-border-light dark:border-border-dark bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary">' +
        '</div>' +
        '<div class="grid grid-cols-2 gap-4">' +
          '<div class="space-y-2">' +
            '<label class="text-sm font-medium">时长 (天)</label>' +
            '<input id="edit-plan-duration" type="number" min="1" value="' + plan.duration_days + '" class="w-full h-9 px-3 rounded-md border border-border-light dark:border-border-dark bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary">' +
          '</div>' +
          '<div class="space-y-2">' +
            '<label class="text-sm font-medium">价格 (¥)</label>' +
            '<input id="edit-plan-price" type="number" step="0.01" min="0" value="' + plan.price + '" class="w-full h-9 px-3 rounded-md border border-border-light dark:border-border-dark bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary">' +
          '</div>' +
        '</div>' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium">套餐描述</label>' +
          '<textarea id="edit-plan-description" rows="3" class="w-full px-3 py-2 rounded-md border border-border-light dark:border-border-dark bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none">' + (plan.description || '') + '</textarea>' +
        '</div>' +
      '</div>' +
      '<div class="flex justify-end gap-2 mt-6">' +
        '<button onclick="closeModal()" class="px-4 py-2 text-sm font-medium border border-border-light dark:border-border-dark rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900">取消</button>' +
        '<button onclick="savePlanEdit()" class="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:opacity-90">保存</button>' +
      '</div>';
      
      openModal('编辑套餐', bodyHtml);
    }
    
    async function savePlanEdit() {
      const id = parseInt(document.getElementById('edit-plan-id').value);
      const name = document.getElementById('edit-plan-name').value.trim();
      const duration = parseInt(document.getElementById('edit-plan-duration').value);
      const price = parseFloat(document.getElementById('edit-plan-price').value);
      const description = document.getElementById('edit-plan-description').value.trim();
      
      if (!name) {
        showAlert('请输入套餐名称', 'warning');
        return;
      }
      
      if (!duration || duration <= 0) {
        showAlert('请输入有效的时长', 'warning');
        return;
      }
      
      if (isNaN(price) || price < 0) {
        showAlert('请输入有效的价格', 'warning');
        return;
      }
      
      try {
        const response = await fetch('/api/admin/plans/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            name,
            description,
            duration_days: duration,
            price
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('套餐更新成功', 'success');
          closeModal();
          loadAllPlans();
        } else {
          showAlert('更新失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('更新失败: ' + error.message, 'error');
      }
    }
    
    async function togglePlanStatus(planId) {
      try {
        const response = await fetch('/api/admin/plans/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: planId })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('状态已更新', 'success');
          loadAllPlans();
        } else {
          showAlert('操作失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('操作失败: ' + error.message, 'error');
      }
    }
    
    async function deletePlanConfirm(planId) {
      const plan = allPlans.find(p => p.id === planId);
      if (!plan) return;
      
      const confirmed = await showConfirm(
        '确定要删除套餐 "' + plan.name + '" 吗？\n\n⚠️ 此操作不可恢复！',
        '删除套餐'
      );
      
      if (!confirmed) return;
      
      try {
        const response = await fetch('/api/admin/plans/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: planId })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('套餐已删除', 'success');
          loadAllPlans();
        } else {
          showAlert('删除失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('删除失败: ' + error.message, 'error');
      }
    }
    
    // ========== 订单管理功能 ==========
    let allOrders = [];
    
    async function loadAllOrders() {
      try {
        const status = document.getElementById('order-status-filter').value;
        const response = await fetch('/api/admin/orders?status=' + status);
        if (!response.ok) throw new Error('Failed to fetch orders');
        
        const data = await response.json();
        if (data.success) {
          allOrders = data.orders || [];
          renderOrdersList();
        } else {
          showAlert('加载订单失败: ' + (data.error || '未知错误'), 'error');
        }
      } catch (error) {
        console.error('加载订单失败:', error);
        showAlert('加载订单失败: ' + error.message, 'error');
      }
    }
    
    function renderOrdersList() {
      const tbody = document.getElementById('orders-list');
      const countSpan = document.getElementById('orders-count');
      
      if (!allOrders || allOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="px-6 py-8 text-center text-slate-400 dark:text-slate-600"><span class="material-symbols-outlined text-4xl mb-2 block">receipt_long</span><p class="text-sm">暂无订单</p></td></tr>';
        countSpan.textContent = '共 0 条订单';
        return;
      }
      
      let html = '';
      allOrders.forEach(order => {
        const statusConfig = getOrderStatusConfig(order.status);
        const canApprove = order.status === 'pending';
        const createdTime = order.created_at ? new Date(order.created_at).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).replace(/\\//g, '/') : '-';
        
        html += '<tr class="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors" data-order-id="' + order.id + '">' +
          '<td class="px-6 py-4">' +
            '<input class="order-checkbox rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary" type="checkbox" value="' + order.id + '"/>' +
          '</td>' +
          '<td class="px-6 py-4 text-sm font-mono text-slate-500">#' + order.id + '</td>' +
          '<td class="px-6 py-4 text-sm font-medium">' + (order.username || order.uuid.substring(0, 8)) + '</td>' +
          '<td class="px-6 py-4 text-sm">' + (order.plan_name || '-') + ' (' + order.duration_days + '天)</td>' +
          '<td class="px-6 py-4 text-sm font-medium">¥' + parseFloat(order.price || 0).toFixed(2) + '</td>' +
          '<td class="px-6 py-4 text-sm text-slate-500">' + createdTime + '</td>' +
          '<td class="px-6 py-4 text-sm">' +
            '<div class="flex items-center gap-1.5 ' + statusConfig.textColor + '">' +
              '<span class="w-1.5 h-1.5 rounded-full ' + statusConfig.dotColor + '"></span>' +
              statusConfig.text +
            '</div>' +
          '</td>' +
          '<td class="px-6 py-4 text-right">';
        
        if (canApprove) {
          html += '<div class="flex justify-end gap-3">' +
            '<button onclick="approveOrderConfirm(' + order.id + ')" class="text-xs font-semibold text-slate-900 dark:text-white hover:underline">通过</button>' +
            '<button onclick="rejectOrderConfirm(' + order.id + ')" class="text-xs font-semibold text-red-500 hover:underline">拒绝</button>' +
          '</div>';
        } else {
          html += '<button onclick="viewOrderDetail(' + order.id + ')" class="text-slate-400 hover:text-primary transition-colors">' +
            '<span class="material-symbols-outlined">more_horiz</span>' +
          '</button>';
        }
        
        html += '</td></tr>';
      });
      
      tbody.innerHTML = html;
      countSpan.textContent = '共 ' + allOrders.length + ' 条订单';
    }
    
    function getOrderStatusConfig(status) {
      const configs = {
        'pending': {
          text: '待审核',
          textColor: 'text-blue-500 dark:text-blue-400',
          dotColor: 'bg-blue-500'
        },
        'approved': {
          text: '已通过',
          textColor: 'text-emerald-600 dark:text-emerald-400',
          dotColor: 'bg-emerald-500'
        },
        'rejected': {
          text: '已拒绝',
          textColor: 'text-slate-500 dark:text-slate-400',
          dotColor: 'bg-slate-400'
        },
        'expired': {
          text: '已过期',
          textColor: 'text-orange-500 dark:text-orange-400',
          dotColor: 'bg-orange-500'
        }
      };
      return configs[status] || configs['pending'];
    }
    
    function filterOrders() {
      const searchTerm = document.getElementById('order-search').value.toLowerCase();
      const rows = document.querySelectorAll('#orders-list tr[data-order-id]');
      
      let visibleCount = 0;
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          row.style.display = '';
          visibleCount++;
        } else {
          row.style.display = 'none';
        }
      });
      
      document.getElementById('orders-count').textContent = '共 ' + visibleCount + ' 条订单';
    }
    
    function toggleAllOrderChecks() {
      const checked = document.getElementById('order-check-all').checked;
      document.querySelectorAll('.order-checkbox').forEach(cb => {
        cb.checked = checked;
      });
    }
    
    async function approveOrderConfirm(orderId) {
      const order = allOrders.find(o => o.id === orderId);
      if (!order) return;
      
      const confirmed = await showConfirm(
        '确定要通过订单 #' + orderId + ' 吗？\n\n用户: ' + (order.username || order.uuid.substring(0, 13)) + '\n套餐: ' + order.plan_name + ' (' + order.duration_days + '天)\n金额: ¥' + order.price,
        '通过订单'
      );
      
      if (!confirmed) return;
      
      try {
        const response = await fetch('/api/admin/orders/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: orderId })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('订单已通过，用户套餐已更新', 'success');
          loadAllOrders();
        } else {
          showAlert('操作失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('操作失败: ' + error.message, 'error');
      }
    }
    
    async function rejectOrderConfirm(orderId) {
      const order = allOrders.find(o => o.id === orderId);
      if (!order) return;
      
      const confirmed = await showConfirm(
        '确定要拒绝订单 #' + orderId + ' 吗？\n\n⚠️ 此操作不可恢复！',
        '拒绝订单'
      );
      
      if (!confirmed) return;
      
      try {
        const response = await fetch('/api/admin/orders/reject', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: orderId })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('订单已拒绝', 'success');
          loadAllOrders();
        } else {
          showAlert('操作失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('操作失败: ' + error.message, 'error');
      }
    }
    
    async function batchApproveOrders() {
      const checked = Array.from(document.querySelectorAll('.order-checkbox:checked'));
      if (checked.length === 0) {
        showAlert('请选择要通过的订单', 'warning');
        return;
      }
      
      const confirmed = await showConfirm(
        '确定要批量通过选中的 ' + checked.length + ' 个订单吗？',
        '批量通过'
      );
      
      if (!confirmed) return;
      
      try {
        let successCount = 0;
        let failCount = 0;
        
        for (const cb of checked) {
          const orderId = parseInt(cb.value);
          const response = await fetch('/api/admin/orders/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: orderId })
          });
          
          const result = await response.json();
          if (result.success) {
            successCount++;
          } else {
            failCount++;
          }
        }
        
        showAlert('批量操作完成\\n成功: ' + successCount + ' 个\\n失败: ' + failCount + ' 个', successCount > 0 ? 'success' : 'error');
        loadAllOrders();
        document.getElementById('order-check-all').checked = false;
      } catch (error) {
        showAlert('批量操作失败: ' + error.message, 'error');
      }
    }
    
    async function batchRejectOrders() {
      const checked = Array.from(document.querySelectorAll('.order-checkbox:checked'));
      if (checked.length === 0) {
        showAlert('请选择要拒绝的订单', 'warning');
        return;
      }
      
      const confirmed = await showConfirm(
        '确定要批量拒绝选中的 ' + checked.length + ' 个订单吗？\n\n⚠️ 此操作不可恢复！',
        '批量拒绝'
      );
      
      if (!confirmed) return;
      
      try {
        let successCount = 0;
        let failCount = 0;
        
        for (const cb of checked) {
          const orderId = parseInt(cb.value);
          const response = await fetch('/api/admin/orders/reject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: orderId })
          });
          
          const result = await response.json();
          if (result.success) {
            successCount++;
          } else {
            failCount++;
          }
        }
        
        showAlert('批量操作完成\\n成功: ' + successCount + ' 个\\n失败: ' + failCount + ' 个', successCount > 0 ? 'success' : 'error');
        loadAllOrders();
        document.getElementById('order-check-all').checked = false;
      } catch (error) {
        showAlert('批量操作失败: ' + error.message, 'error');
      }
    }
    
    function viewOrderDetail(orderId) {
      const order = allOrders.find(o => o.id === orderId);
      if (!order) return;
      
      const statusConfig = getOrderStatusConfig(order.status);
      const createdTime = order.created_at ? new Date(order.created_at).toLocaleString('zh-CN') : '-';
      const processedTime = order.processed_at ? new Date(order.processed_at).toLocaleString('zh-CN') : '-';
      
      const bodyHtml = '<div class="space-y-4">' +
        '<div class="grid grid-cols-2 gap-4">' +
          '<div class="space-y-2">' +
            '<label class="text-xs font-medium text-slate-500">订单ID</label>' +
            '<div class="text-sm font-mono">#' + order.id + '</div>' +
          '</div>' +
          '<div class="space-y-2">' +
            '<label class="text-xs font-medium text-slate-500">状态</label>' +
            '<div class="flex items-center gap-1.5 ' + statusConfig.textColor + ' text-sm">' +
              '<span class="w-1.5 h-1.5 rounded-full ' + statusConfig.dotColor + '"></span>' +
              statusConfig.text +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="space-y-2">' +
          '<label class="text-xs font-medium text-slate-500">用户UUID</label>' +
          '<div class="text-sm font-mono">' + order.uuid + '</div>' +
        '</div>' +
        '<div class="space-y-2">' +
          '<label class="text-xs font-medium text-slate-500">套餐</label>' +
          '<div class="text-sm">' + (order.plan_name || '-') + ' (' + order.duration_days + '天)</div>' +
        '</div>' +
        '<div class="space-y-2">' +
          '<label class="text-xs font-medium text-slate-500">金额</label>' +
          '<div class="text-sm font-medium">¥' + parseFloat(order.price || 0).toFixed(2) + '</div>' +
        '</div>' +
        '<div class="grid grid-cols-2 gap-4">' +
          '<div class="space-y-2">' +
            '<label class="text-xs font-medium text-slate-500">创建时间</label>' +
            '<div class="text-sm text-slate-600 dark:text-slate-400">' + createdTime + '</div>' +
          '</div>' +
          '<div class="space-y-2">' +
            '<label class="text-xs font-medium text-slate-500">处理时间</label>' +
            '<div class="text-sm text-slate-600 dark:text-slate-400">' + processedTime + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="flex justify-end gap-2 mt-6">' +
        '<button onclick="closeModal()" class="px-4 py-2 text-sm font-medium border border-border-light dark:border-border-dark rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900">关闭</button>' +
      '</div>';
      
      openModal('订单详情', bodyHtml);
    }
    
    async function exportOrders() {
      try {
        showAlert('正在导出订单数据...', 'info');
        
        const status = document.getElementById('order-status-filter').value;
        const response = await fetch('/api/admin/orders?status=' + status);
        const data = await response.json();
        
        if (data.success) {
          const orders = data.orders || [];
          const csvContent = 'data:text/csv;charset=utf-8,' +
            'ID,用户UUID,用户名,套餐名称,时长(天),金额,状态,创建时间,处理时间\\n' +
            orders.map(o => 
              o.id + ',' +
              o.uuid + ',' +
              (o.username || '') + ',' +
              (o.plan_name || '') + ',' +
              o.duration_days + ',' +
              o.price + ',' +
              o.status + ',' +
              (o.created_at ? new Date(o.created_at).toLocaleString('zh-CN') : '') + ',' +
              (o.processed_at ? new Date(o.processed_at).toLocaleString('zh-CN') : '')
            ).join('\\n');
          
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement('a');
          link.setAttribute('href', encodedUri);
          link.setAttribute('download', 'orders_' + Date.now() + '.csv');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          showAlert('导出成功', 'success');
        } else {
          showAlert('导出失败: ' + (data.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('导出失败: ' + error.message, 'error');
      }
    }
    
    // ========== 公告管理功能 ==========
    let allAnnouncements = [];
    
    async function loadAllAnnouncements() {
      try {
        const response = await fetch('/api/admin/announcements');
        if (!response.ok) throw new Error('Failed to fetch announcements');
        
        const data = await response.json();
        if (data.success) {
          allAnnouncements = data.announcements || [];
          renderAnnouncementsList();
        } else {
          showAlert('加载公告失败: ' + (data.error || '未知错误'), 'error');
        }
      } catch (error) {
        console.error('加载公告失败:', error);
        showAlert('加载公告失败: ' + error.message, 'error');
      }
    }
    
    function renderAnnouncementsList() {
      const container = document.getElementById('announcements-list');
      
      if (!allAnnouncements || allAnnouncements.length === 0) {
        container.innerHTML = '<div class="text-center py-12 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50">' +
          '<span class="material-symbols-outlined text-4xl mb-2 block">campaign</span>' +
          '<p class="text-sm">暂无公告</p>' +
          '<button onclick="openAddAnnouncementModal()" class="mt-4 text-sm text-primary hover:underline">添加第一条公告</button>' +
        '</div>';
        return;
      }
      
      let html = '';
      allAnnouncements.forEach(announcement => {
        const createdTime = announcement.created_at ? new Date(announcement.created_at).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\\//g, '-') : '-';
        
        const statusClass = announcement.enabled 
          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
        const statusText = announcement.enabled ? '已启用' : '已禁用';
        
        html += '<div class="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900/50 overflow-hidden hover:shadow-md transition-shadow">' +
          '<div class="p-6">' +
            '<div class="flex items-start justify-between mb-4">' +
              '<div class="flex-1">' +
                '<div class="flex items-center gap-3 mb-2">' +
                  '<h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">' + announcement.title + '</h3>' +
                  '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ' + statusClass + '">' + statusText + '</span>' +
                '</div>' +
                '<p class="text-xs text-slate-500 dark:text-slate-400">创建时间: ' + createdTime + '</p>' +
              '</div>' +
              '<div class="flex items-center gap-2">' +
                '<button onclick="editAnnouncement(' + announcement.id + ')" class="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-colors" title="编辑">' +
                  '<span class="material-symbols-outlined text-[20px]">edit_note</span>' +
                '</button>' +
                '<button onclick="toggleAnnouncementStatus(' + announcement.id + ')" class="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-colors" title="切换状态">' +
                  '<span class="material-symbols-outlined text-[20px]">' + (announcement.enabled ? 'toggle_on' : 'toggle_off') + '</span>' +
                '</button>' +
                '<button onclick="deleteAnnouncementConfirm(' + announcement.id + ')" class="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors" title="删除">' +
                  '<span class="material-symbols-outlined text-[20px]">delete_outline</span>' +
                '</button>' +
              '</div>' +
            '</div>' +
            '<div class="bg-slate-50 dark:bg-slate-800/50 rounded-md p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">' +
              announcement.content +
            '</div>' +
          '</div>' +
        '</div>';
      });
      
      container.innerHTML = html;
    }
    
    function openAddAnnouncementModal() {
      const bodyHtml = '<div class="space-y-6">' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium text-slate-700 dark:text-slate-300">公告标题</label>' +
          '<input id="add-announcement-title" type="text" class="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:ring-offset-slate-950" placeholder="请输入公告标题"/>' +
        '</div>' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium text-slate-700 dark:text-slate-300">公告内容</label>' +
          '<textarea id="add-announcement-content" rows="8" class="flex min-h-[160px] w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:ring-offset-slate-950 resize-none leading-relaxed" placeholder="请输入公告内容..."></textarea>' +
        '</div>' +
        '<div class="flex items-center space-x-2">' +
          '<input checked id="add-announcement-enabled" type="checkbox" class="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary cursor-pointer"/>' +
          '<label for="add-announcement-enabled" class="text-sm font-medium cursor-pointer select-none text-slate-700 dark:text-slate-300">启用此公告</label>' +
        '</div>' +
      '</div>' +
      '<div class="flex items-center justify-end space-x-2 mt-6">' +
        '<button onclick="closeModal()" class="inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 h-10 px-4 py-2 transition-colors">取消</button>' +
        '<button onclick="saveNewAnnouncement()" class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-white hover:bg-slate-800 h-10 px-4 py-2 transition-colors">保存</button>' +
      '</div>';
      
      openModal('添加公告', bodyHtml);
    }
    
    async function saveNewAnnouncement() {
      const title = document.getElementById('add-announcement-title').value.trim();
      const content = document.getElementById('add-announcement-content').value.trim();
      const enabled = document.getElementById('add-announcement-enabled').checked;
      
      if (!title) {
        showAlert('请输入公告标题', 'warning');
        return;
      }
      
      if (!content) {
        showAlert('请输入公告内容', 'warning');
        return;
      }
      
      try {
        const response = await fetch('/api/admin/announcements/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('公告添加成功', 'success');
          closeModal();
          loadAllAnnouncements();
        } else {
          showAlert('添加失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('添加失败: ' + error.message, 'error');
      }
    }
    
    function editAnnouncement(announcementId) {
      const announcement = allAnnouncements.find(a => a.id === announcementId);
      if (!announcement) return;
      
      const bodyHtml = '<div class="space-y-6">' +
        '<input type="hidden" id="edit-announcement-id" value="' + announcementId + '">' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium text-slate-700 dark:text-slate-300">公告标题</label>' +
          '<input id="edit-announcement-title" type="text" value="' + announcement.title + '" class="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:ring-offset-slate-950"/>' +
        '</div>' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium text-slate-700 dark:text-slate-300">公告内容</label>' +
          '<textarea id="edit-announcement-content" rows="8" class="flex min-h-[160px] w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:ring-offset-slate-950 resize-none leading-relaxed">' + announcement.content + '</textarea>' +
        '</div>' +
        '<div class="flex items-center space-x-2">' +
          '<input ' + (announcement.enabled ? 'checked' : '') + ' id="edit-announcement-enabled" type="checkbox" class="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary cursor-pointer"/>' +
          '<label for="edit-announcement-enabled" class="text-sm font-medium cursor-pointer select-none text-slate-700 dark:text-slate-300">启用此公告</label>' +
        '</div>' +
      '</div>' +
      '<div class="flex items-center justify-end space-x-2 mt-6">' +
        '<button onclick="closeModal()" class="inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 h-10 px-4 py-2 transition-colors">取消</button>' +
        '<button onclick="saveAnnouncementEdit()" class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-white hover:bg-slate-800 h-10 px-4 py-2 transition-colors">保存</button>' +
      '</div>';
      
      openModal('编辑公告', bodyHtml);
    }
    
    async function saveAnnouncementEdit() {
      const id = parseInt(document.getElementById('edit-announcement-id').value);
      const title = document.getElementById('edit-announcement-title').value.trim();
      const content = document.getElementById('edit-announcement-content').value.trim();
      const enabled = document.getElementById('edit-announcement-enabled').checked;
      
      if (!title) {
        showAlert('请输入公告标题', 'warning');
        return;
      }
      
      if (!content) {
        showAlert('请输入公告内容', 'warning');
        return;
      }
      
      try {
        const response = await fetch('/api/admin/announcements/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, title, content, enabled })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('公告更新成功', 'success');
          closeModal();
          loadAllAnnouncements();
        } else {
          showAlert('更新失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('更新失败: ' + error.message, 'error');
      }
    }
    
    async function toggleAnnouncementStatus(announcementId) {
      const announcement = allAnnouncements.find(a => a.id === announcementId);
      if (!announcement) return;
      
      try {
        const response = await fetch('/api/admin/announcements/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            id: announcementId, 
            title: announcement.title,
            content: announcement.content,
            enabled: !announcement.enabled
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('状态已更新', 'success');
          loadAllAnnouncements();
        } else {
          showAlert('操作失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('操作失败: ' + error.message, 'error');
      }
    }
    
    async function deleteAnnouncementConfirm(announcementId) {
      const announcement = allAnnouncements.find(a => a.id === announcementId);
      if (!announcement) return;
      
      const confirmed = await showConfirm(
        '确定要删除公告 "' + announcement.title + '" 吗？\n\n⚠️ 此操作不可恢复！',
        '删除公告'
      );
      
      if (!confirmed) return;
      
      try {
        const response = await fetch('/api/admin/announcements/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: announcementId })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('公告已删除', 'success');
          loadAllAnnouncements();
        } else {
          showAlert('删除失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('删除失败: ' + error.message, 'error');
      }
    }
    
    // ========== 支付渠道管理功能 ==========
    let allPaymentChannels = [];
    
    async function loadAllPaymentChannels() {
      try {
        const response = await fetch('/api/admin/payment-channels');
        if (!response.ok) throw new Error('Failed to fetch payment channels');
        
        const data = await response.json();
        if (data.success) {
          allPaymentChannels = data.channels || [];
          renderPaymentChannelsList();
        } else {
          showAlert('加载支付渠道失败: ' + (data.error || '未知错误'), 'error');
        }
      } catch (error) {
        console.error('加载支付渠道失败:', error);
        showAlert('加载支付渠道失败: ' + error.message, 'error');
      }
    }
    
    function renderPaymentChannelsList() {
      const container = document.getElementById('payment-channels-list');
      
      if (!allPaymentChannels || allPaymentChannels.length === 0) {
        container.innerHTML = '<div class="col-span-2 text-center py-12 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50">' +
          '<span class="material-symbols-outlined text-4xl mb-2 block">payments</span>' +
          '<p class="text-sm">暂无支付渠道</p>' +
          '<button onclick="openAddPaymentChannelModal()" class="mt-4 text-sm text-primary hover:underline">添加第一个支付渠道</button>' +
        '</div>';
        return;
      }
      
      let html = '';
      allPaymentChannels.forEach(channel => {
        const createdTime = channel.created_at ? new Date(channel.created_at).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\\//g, '-') : '-';
        
        const statusClass = channel.enabled 
          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
        const statusText = channel.enabled ? '已启用' : '已禁用';
        
        html += '<div class="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-zinc-950 overflow-hidden hover:shadow-md transition-shadow">' +
          '<div class="p-6">' +
            '<div class="flex items-start justify-between mb-4">' +
              '<div class="flex-1">' +
                '<div class="flex items-center gap-3 mb-2">' +
                  '<span class="material-symbols-outlined text-2xl text-primary">account_balance</span>' +
                  '<div>' +
                    '<h3 class="text-base font-semibold text-slate-900 dark:text-slate-100">' + (channel.name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</h3>' +
                    '<p class="text-xs text-slate-500 dark:text-slate-400 font-mono">' + (channel.code || '').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ' + statusClass + '">' + statusText + '</span>' +
            '</div>' +
            '<div class="space-y-2 text-sm">' +
              '<div class="flex items-center gap-2 text-slate-600 dark:text-slate-400">' +
                '<span class="material-symbols-outlined text-sm">link</span>' +
                '<span class="font-mono text-xs truncate">' + (channel.api_url || '').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span>' +
              '</div>' +
              '<div class="flex items-center gap-2 text-slate-600 dark:text-slate-400">' +
                '<span class="material-symbols-outlined text-sm">vpn_key</span>' +
                '<span class="font-mono text-xs">••••••••••••••••</span>' +
              '</div>' +
              '<div class="flex items-center gap-2 text-slate-500 dark:text-slate-400">' +
                '<span class="material-symbols-outlined text-sm">schedule</span>' +
                '<span class="text-xs">' + createdTime + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">' +
              '<button onclick="editPaymentChannel(' + channel.id + ')" class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">' +
                '<span class="material-symbols-outlined text-sm">edit</span>' +
                '编辑' +
              '</button>' +
              '<button onclick="togglePaymentChannelStatus(' + channel.id + ')" class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">' +
                '<span class="material-symbols-outlined text-sm">' + (channel.enabled ? 'toggle_on' : 'toggle_off') + '</span>' +
                (channel.enabled ? '禁用' : '启用') +
              '</button>' +
              '<button onclick="deletePaymentChannelConfirm(' + channel.id + ')" class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors">' +
                '<span class="material-symbols-outlined text-sm">delete</span>' +
                '删除' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      });
      
      container.innerHTML = html;
    }
    
    function openAddPaymentChannelModal() {
      const bodyHtml = '<div class="space-y-5">' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium text-zinc-950 dark:text-zinc-50">通道名称</label>' +
          '<input id="add-channel-name" type="text" placeholder="例如: USDT-TRC20" class="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 dark:text-zinc-50"/>' +
        '</div>' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium text-zinc-950 dark:text-zinc-50">通道代码</label>' +
          '<input id="add-channel-code" type="text" placeholder="例如: usdt.trc20" class="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 dark:text-zinc-50"/>' +
        '</div>' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium text-zinc-950 dark:text-zinc-50">API 地址</label>' +
          '<input id="add-channel-api-url" type="url" placeholder="https://epusdt.example.com" class="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 dark:text-zinc-50"/>' +
        '</div>' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium text-zinc-950 dark:text-zinc-50">API Token</label>' +
          '<div class="relative">' +
            '<input id="add-channel-api-token" type="password" placeholder="BEpusdt API 认证令牌" class="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 pr-10 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 dark:text-zinc-50"/>' +
            '<button type="button" onclick="togglePasswordVisibility(&quot;add-channel-api-token&quot;)" class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">' +
              '<span class="material-symbols-outlined text-lg">visibility</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="flex items-center justify-end space-x-2 mt-6">' +
        '<button onclick="closeModal()" class="inline-flex items-center justify-center rounded-md text-sm font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 h-10 px-4 py-2 text-zinc-950 dark:text-zinc-50 transition-colors">取消</button>' +
        '<button onclick="saveNewPaymentChannel()" class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-white dark:bg-zinc-50 dark:text-zinc-950 hover:opacity-90 h-10 px-4 py-2 shadow transition-opacity">保存</button>' +
      '</div>';
      
      openModal('添加支付渠道', bodyHtml);
    }
    
    function togglePasswordVisibility(inputId) {
      const input = document.getElementById(inputId);
      if (input.type === 'password') {
        input.type = 'text';
      } else {
        input.type = 'password';
      }
    }
    
    async function saveNewPaymentChannel() {
      const name = document.getElementById('add-channel-name').value.trim();
      const code = document.getElementById('add-channel-code').value.trim();
      const apiUrl = document.getElementById('add-channel-api-url').value.trim();
      const apiToken = document.getElementById('add-channel-api-token').value.trim();
      
      if (!name) {
        showAlert('请输入通道名称', 'warning');
        return;
      }
      
      if (!code) {
        showAlert('请输入通道代码', 'warning');
        return;
      }
      
      if (!apiUrl) {
        showAlert('请输入 API 地址', 'warning');
        return;
      }
      
      if (!apiToken) {
        showAlert('请输入 API Token', 'warning');
        return;
      }
      
      try {
        const response = await fetch('/api/admin/payment-channels/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            code,
            api_url: apiUrl,
            api_token: apiToken
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('支付渠道添加成功', 'success');
          closeModal();
          loadAllPaymentChannels();
        } else {
          showAlert('添加失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('添加失败: ' + error.message, 'error');
      }
    }
    
    function editPaymentChannel(channelId) {
      const channel = allPaymentChannels.find(c => c.id === channelId);
      if (!channel) return;
      
      const bodyHtml = '<div class="space-y-5">' +
        '<input type="hidden" id="edit-channel-id" value="' + channelId + '">' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium text-zinc-950 dark:text-zinc-50">通道名称</label>' +
          '<input id="edit-channel-name" type="text" value="' + (channel.name || '').replace(/"/g, '&quot;') + '" class="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 dark:text-zinc-50"/>' +
        '</div>' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium text-zinc-950 dark:text-zinc-50">通道代码</label>' +
          '<input id="edit-channel-code" type="text" value="' + (channel.code || '').replace(/"/g, '&quot;') + '" class="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 dark:text-zinc-50"/>' +
        '</div>' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium text-zinc-950 dark:text-zinc-50">API 地址</label>' +
          '<input id="edit-channel-api-url" type="url" value="' + (channel.api_url || '').replace(/"/g, '&quot;') + '" class="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 dark:text-zinc-50"/>' +
        '</div>' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium text-zinc-950 dark:text-zinc-50">API Token <span class="text-xs text-zinc-500">(留空不修改)</span></label>' +
          '<div class="relative">' +
            '<input id="edit-channel-api-token" type="password" placeholder="留空则不修改" class="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 pr-10 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 dark:text-zinc-50"/>' +
            '<button type="button" onclick="togglePasswordVisibility(&quot;edit-channel-api-token&quot;)" class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">' +
              '<span class="material-symbols-outlined text-lg">visibility</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="flex items-center justify-end space-x-2 mt-6">' +
        '<button onclick="closeModal()" class="inline-flex items-center justify-center rounded-md text-sm font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 h-10 px-4 py-2 text-zinc-950 dark:text-zinc-50 transition-colors">取消</button>' +
        '<button onclick="savePaymentChannelEdit()" class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-white dark:bg-zinc-50 dark:text-zinc-950 hover:opacity-90 h-10 px-4 py-2 shadow transition-opacity">保存更改</button>' +
      '</div>';
      
      openModal('编辑支付渠道', bodyHtml);
    }
    
    async function savePaymentChannelEdit() {
      const id = parseInt(document.getElementById('edit-channel-id').value);
      const name = document.getElementById('edit-channel-name').value.trim();
      const code = document.getElementById('edit-channel-code').value.trim();
      const apiUrl = document.getElementById('edit-channel-api-url').value.trim();
      const apiToken = document.getElementById('edit-channel-api-token').value.trim();
      
      if (!name || !code || !apiUrl) {
        showAlert('通道名称、代码和API地址不能为空', 'warning');
        return;
      }
      
      try {
        const response = await fetch('/api/admin/payment-channels/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            name,
            code,
            api_url: apiUrl,
            api_token: apiToken || undefined
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('支付渠道更新成功', 'success');
          closeModal();
          loadAllPaymentChannels();
        } else {
          showAlert('更新失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('更新失败: ' + error.message, 'error');
      }
    }
    
    async function togglePaymentChannelStatus(channelId) {
      try {
        const response = await fetch('/api/admin/payment-channels/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: channelId })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('状态已更新', 'success');
          loadAllPaymentChannels();
        } else {
          showAlert('操作失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('操作失败: ' + error.message, 'error');
      }
    }
    
    async function deletePaymentChannelConfirm(channelId) {
      const channel = allPaymentChannels.find(c => c.id === channelId);
      if (!channel) return;
      
      const confirmed = await showConfirm(
        '确定要删除支付渠道 "' + channel.name + '" 吗？\n\n⚠️ 此操作不可恢复！',
        '删除支付渠道'
      );
      
      if (!confirmed) return;
      
      try {
        const response = await fetch('/api/admin/payment-channels/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: channelId })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('支付渠道已删除', 'success');
          loadAllPaymentChannels();
        } else {
          showAlert('删除失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('删除失败: ' + error.message, 'error');
      }
    }
    
    // ========== 邀请码管理功能 ==========
    let allInviteCodes = [];
    
    async function loadAllInviteCodes() {
      try {
        const response = await fetch('/api/admin/invites');
        if (!response.ok) throw new Error('Failed to fetch invite codes');
        
        const data = await response.json();
        if (data.success) {
          allInviteCodes = data.invites || [];
          renderInviteCodesList();
        } else {
          showAlert('加载邀请码失败: ' + (data.error || '未知错误'), 'error');
        }
      } catch (error) {
        console.error('加载邀请码失败:', error);
        showAlert('加载邀请码失败: ' + error.message, 'error');
      }
    }
    
    function renderInviteCodesList() {
      const tbody = document.getElementById('invites-list');
      const countSpan = document.getElementById('invites-count');
      
      if (!allInviteCodes || allInviteCodes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-zinc-400 dark:text-zinc-600">' +
          '<span class="material-symbols-outlined text-4xl mb-2 block">confirmation_number</span>' +
          '<p class="text-sm">暂无邀请码</p>' +
        '</td></tr>';
        countSpan.textContent = '共 0 个邀请码';
        return;
      }
      
      let html = '';
      allInviteCodes.forEach(invite => {
        const usageText = invite.used_count + ' / ' + invite.max_uses;
        const usagePercent = Math.round((invite.used_count / invite.max_uses) * 100);
        const isExhausted = invite.used_count >= invite.max_uses;
        
        const statusClass = invite.enabled && !isExhausted
          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400';
        const statusText = !invite.enabled ? '已禁用' : (isExhausted ? '已用完' : '可使用');
        
        html += '<tr class="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">' +
          '<td class="px-6 py-4">' +
            '<div class="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100">' + (invite.code || '').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>' +
          '</td>' +
          '<td class="px-6 py-4">' +
            '<div class="flex items-center gap-2">' +
              '<div class="flex-1">' +
                '<div class="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">' +
                  '<div class="bg-black dark:bg-white h-2 transition-all" style="width: ' + usagePercent + '%"></div>' +
                '</div>' +
              '</div>' +
              '<span class="text-xs text-zinc-500 font-mono">' + usageText + '</span>' +
            '</div>' +
          '</td>' +
          '<td class="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">' + 
            (invite.trial_days > 0 ? invite.trial_days + ' 天' : '-') +
          '</td>' +
          '<td class="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400 max-w-xs truncate" title="' + (invite.remark || '').replace(/"/g, '&quot;') + '">' + 
            ((invite.remark || '-').replace(/</g, '&lt;').replace(/>/g, '&gt;')) +
          '</td>' +
          '<td class="px-6 py-4">' +
            '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ' + statusClass + '">' +
              statusText +
            '</span>' +
          '</td>' +
          '<td class="px-6 py-4 text-right">' +
            '<div class="flex items-center justify-end gap-1">' +
              '<button onclick="copyInviteCode(this.dataset.code)" data-code="' + invite.code.replace(/"/g, '&quot;') + '" class="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-black dark:hover:text-white transition-colors" title="复制">' +
                '<span class="material-symbols-outlined text-[18px]">content_copy</span>' +
              '</button>' +
              '<button onclick="editInviteCode(' + invite.id + ')" class="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-black dark:hover:text-white transition-colors" title="编辑">' +
                '<span class="material-symbols-outlined text-[18px]">edit</span>' +
              '</button>' +
              '<button onclick="toggleInviteCodeStatus(' + invite.id + ')" class="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-black dark:hover:text-white transition-colors" title="切换状态">' +
                '<span class="material-symbols-outlined text-[18px]">' + (invite.enabled ? 'toggle_on' : 'toggle_off') + '</span>' +
              '</button>' +
              '<button onclick="deleteInviteCodeConfirm(' + invite.id + ')" class="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-red-500 transition-colors" title="删除">' +
                '<span class="material-symbols-outlined text-[18px]">delete</span>' +
              '</button>' +
            '</div>' +
          '</td>' +
        '</tr>';
      });
      
      tbody.innerHTML = html;
      countSpan.textContent = '共 ' + allInviteCodes.length + ' 个邀请码';
    }
    
    async function generateInviteCode() {
      const code = document.getElementById('gen-invite-code').value.trim();
      const maxUses = parseInt(document.getElementById('gen-max-uses').value) || 1;
      const trialDays = parseInt(document.getElementById('gen-trial-days').value) || 0;
      const remark = document.getElementById('gen-remark').value.trim();
      
      if (maxUses < 1) {
        showAlert('可使用次数至少为 1', 'warning');
        return;
      }
      
      try {
        const response = await fetch('/api/admin/invites/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: code || undefined,
            max_uses: maxUses,
            trial_days: trialDays,
            remark: remark || ''
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('邀请码生成成功: ' + result.code, 'success');
          document.getElementById('gen-invite-code').value = '';
          document.getElementById('gen-max-uses').value = '1';
          document.getElementById('gen-trial-days').value = '0';
          document.getElementById('gen-remark').value = '';
          loadAllInviteCodes();
        } else {
          showAlert('生成失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('生成失败: ' + error.message, 'error');
      }
    }
    
    function copyInviteCode(code) {
      copyToClipboard(code);
      showAlert('邀请码已复制: ' + code, 'success');
    }
    
    function editInviteCode(inviteId) {
      const invite = allInviteCodes.find(i => i.id === inviteId);
      if (!invite) return;
      
      const bodyHtml = '<div class="px-6 py-4 space-y-5">' +
        '<input type="hidden" id="edit-invite-id" value="' + inviteId + '">' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="edit-invite-code">邀请码</label>' +
          '<input id="edit-invite-code" type="text" value="' + (invite.code || '').replace(/"/g, '&quot;') + '" class="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-white"/>' +
        '</div>' +
        '<div class="grid grid-cols-2 gap-4">' +
          '<div class="space-y-2">' +
            '<label class="text-sm font-medium leading-none" for="edit-invite-max-uses">可使用次数</label>' +
            '<input id="edit-invite-max-uses" type="number" min="1" value="' + invite.max_uses + '" class="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-white"/>' +
          '</div>' +
          '<div class="space-y-2">' +
            '<label class="text-sm font-medium leading-none" for="edit-invite-trial-days">赠送试用天数 <span class="text-[10px] text-zinc-400">(0表示不赠送)</span></label>' +
            '<input id="edit-invite-trial-days" type="number" min="0" value="' + invite.trial_days + '" class="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-white"/>' +
          '</div>' +
        '</div>' +
        '<div class="space-y-2">' +
          '<label class="text-sm font-medium leading-none" for="edit-invite-remark">备注</label>' +
          '<input id="edit-invite-remark" type="text" placeholder="可选，例如：给某渠道" value="' + (invite.remark || '').replace(/"/g, '&quot;') + '" class="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-white"/>' +
        '</div>' +
      '</div>' +
      '<div class="px-6 py-6 mt-2 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50">' +
        '<button onclick="closeModal()" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 h-10 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-zinc-50">取消</button>' +
        '<button onclick="saveInviteCodeEdit()" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-zinc-50 hover:bg-black/90 h-10 px-6 py-2 dark:bg-white dark:text-black dark:hover:bg-white/90">保存修改</button>' +
      '</div>';
      
      openModal('编辑邀请码', bodyHtml, 'max-w-md', '修改现有的邀请码配置信息。');
    }
    
    async function saveInviteCodeEdit() {
      const id = parseInt(document.getElementById('edit-invite-id').value);
      const code = document.getElementById('edit-invite-code').value.trim();
      const maxUses = parseInt(document.getElementById('edit-invite-max-uses').value);
      const trialDays = parseInt(document.getElementById('edit-invite-trial-days').value);
      const remark = document.getElementById('edit-invite-remark').value.trim();
      
      if (!code) {
        showAlert('邀请码不能为空', 'warning');
        return;
      }
      
      if (maxUses < 1) {
        showAlert('可使用次数至少为 1', 'warning');
        return;
      }
      
      try {
        const response = await fetch('/api/admin/invites/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            code,
            max_uses: maxUses,
            trial_days: trialDays,
            remark
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('邀请码更新成功', 'success');
          closeModal();
          loadAllInviteCodes();
        } else {
          showAlert('更新失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('更新失败: ' + error.message, 'error');
      }
    }
    
    async function toggleInviteCodeStatus(inviteId) {
      try {
        const response = await fetch('/api/admin/invites/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: inviteId })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('状态已更新', 'success');
          loadAllInviteCodes();
        } else {
          showAlert('操作失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('操作失败: ' + error.message, 'error');
      }
    }
    
    async function deleteInviteCodeConfirm(inviteId) {
      const invite = allInviteCodes.find(i => i.id === inviteId);
      if (!invite) return;
      
      const confirmed = await showConfirm(
        '确定要删除邀请码 "' + invite.code + '" 吗？\n\n⚠️ 此操作不可恢复！',
        '删除邀请码'
      );
      
      if (!confirmed) return;
      
      try {
        const response = await fetch('/api/admin/invites/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: inviteId })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('邀请码已删除', 'success');
          loadAllInviteCodes();
        } else {
          showAlert('删除失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('删除失败: ' + error.message, 'error');
      }
    }
    
    // ========== 优选域名功能 ==========
    let currentBestDomains = [];
    
    async function loadBestDomains() {
      try {
        const response = await fetch('/api/admin/best-domains');
        if (!response.ok) throw new Error('Failed to fetch best domains');
        
        const data = await response.json();
        let domains = data.bestDomains || [];
        
        // 排序：IPv4在前，IPv6在后
        domains.sort((a, b) => {
          const isIPv6A = a.includes('[');
          const isIPv6B = b.includes('[');
          
          if (isIPv6A && !isIPv6B) return 1;  // IPv6排后
          if (!isIPv6A && isIPv6B) return -1; // IPv4排前
          return 0;
        });
        
        currentBestDomains = domains;
        renderBestDomainsList();
        updateNextSyncTime();
      } catch (error) {
        console.error('加载优选域名失败:', error);
        showAlert('加载失败: ' + error.message, 'error');
      }
    }
    
    function renderBestDomainsList() {
      const listContainer = document.getElementById('best-domains-list');
      document.getElementById('best-domains-count').textContent = '共 ' + currentBestDomains.length + ' 个条目';
      
      if (currentBestDomains.length === 0) {
        listContainer.innerHTML = '<tr><td colspan="4" class="px-4 py-8 text-center text-slate-400 dark:text-zinc-600"><span class="material-symbols-outlined text-4xl mb-2 block">cloud_off</span><p class="text-sm">暂无优选域名</p></td></tr>';
        return;
      }
      
      let html = '';
      currentBestDomains.forEach((domain, index) => {
        html += '<tr class="group hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors" draggable="true" data-index="' + index + '" ondragstart="handleDragStart(event)" ondragover="handleDragOver(event)" ondrop="handleDrop(event)" ondragend="handleDragEnd(event)">' +
          '<td class="px-4 py-3"><span class="material-symbols-outlined text-slate-300 dark:text-zinc-600 text-[18px] cursor-move">drag_indicator</span></td>' +
          '<td class="px-4 py-3 font-mono text-slate-700 dark:text-zinc-300">' + domain + '</td>' +
          '<td class="px-4 py-3"><span class="inline-block w-2 h-2 rounded-full bg-slate-300 dark:bg-zinc-600"></span></td>' +
          '<td class="px-4 py-3 text-right">' +
            '<button onclick="deleteBestDomain(' + index + ')" class="text-slate-400 hover:text-red-500 transition-colors">' +
              '<span class="material-symbols-outlined text-[18px]">close</span>' +
            '</button>' +
          '</td>' +
        '</tr>';
      });
      listContainer.innerHTML = html;
    }
    
    // 拖拽排序功能
    let draggedIndex = null;
    
    function handleDragStart(e) {
      draggedIndex = parseInt(e.currentTarget.getAttribute('data-index'));
      e.currentTarget.style.opacity = '0.4';
    }
    
    function handleDragOver(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      e.dataTransfer.dropEffect = 'move';
      return false;
    }
    
    function handleDrop(e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      
      const dropIndex = parseInt(e.currentTarget.getAttribute('data-index'));
      
      if (draggedIndex !== null && draggedIndex !== dropIndex) {
        const draggedItem = currentBestDomains[draggedIndex];
        currentBestDomains.splice(draggedIndex, 1);
        currentBestDomains.splice(dropIndex, 0, draggedItem);
        renderBestDomainsList();
      }
      
      return false;
    }
    
    function handleDragEnd(e) {
      e.currentTarget.style.opacity = '1';
      draggedIndex = null;
    }
    
    function batchAddBestDomains() {
      const input = document.getElementById('best-domains-batch-input').value;
      const newDomains = input.split('\\n').map(line => line.trim()).filter(line => line);
      
      if (newDomains.length === 0) {
        showAlert('请输入要添加的优选域名', 'warning');
        return;
      }
      
      // 去重并添加
      newDomains.forEach(domain => {
        if (!currentBestDomains.includes(domain)) {
          currentBestDomains.push(domain);
        }
      });
      
      document.getElementById('best-domains-batch-input').value = '';
      renderBestDomainsList();
      showAlert('已添加 ' + newDomains.length + ' 个优选域名', 'success');
    }
    
    async function deleteBestDomain(index) {
      const confirmed = await showConfirm('确定要删除该优选域名吗？', '删除优选域名');
      if (!confirmed) return;
      currentBestDomains.splice(index, 1);
      renderBestDomainsList();
    }
    
    async function clearAllBestDomains() {
      const confirmed = await showConfirm('确定要清空所有优选域名吗？\n\n⚠️ 此操作不可恢复！', '清空列表');
      if (!confirmed) return;
      currentBestDomains = [];
      renderBestDomainsList();
      showAlert('已清空优选域名列表', 'success');
    }
    
    async function fetchIPv4BestDomains() {
      const confirmed = await showConfirm('确定要从远程获取 IPv4 优选域名吗？\n\n⚠️ 这将替换当前列表！', '获取IPv4优选');
      if (!confirmed) return;
      
      try {
        showAlert('正在获取 IPv4 优选域名，请稍候...', 'info');
        
        // 这里可以对接后端的获取优选IP接口
        // 暂时模拟数据
        const mockDomains = [
          'cf.twitter.now.cc',
          'telecom.twitter.now.cc', 
          'unicom.twitter.now.cc',
          '104.19.238.63:443#移动 LHR',
          '104.18.34.121:443#移动 LHR'
        ];
        
        currentBestDomains = mockDomains;
        renderBestDomainsList();
        showAlert('已获取 ' + mockDomains.length + ' 个 IPv4 优选域名', 'success');
      } catch (error) {
        showAlert('获取失败: ' + error.message, 'error');
      }
    }
    
    async function fetchIPv6BestDomains() {
      const confirmed = await showConfirm('确定要从远程获取 IPv6 优选域名吗？\n\n⚠️ 这将替换当前列表！', '获取IPv6优选');
      if (!confirmed) return;
      
      try {
        showAlert('正在获取 IPv6 优选域名，请稍候...', 'info');
        
        // 这里可以对接后端的获取优选IP接口
        // 暂时模拟数据
        const mockDomains = [
          '[2606:4700:7::a29f:8601]:443#美国',
          '[2606:4700:7::a29f:8602]:443#欧洲'
        ];
        
        currentBestDomains = mockDomains;
        renderBestDomainsList();
        showAlert('已获取 ' + mockDomains.length + ' 个 IPv6 优选域名', 'success');
      } catch (error) {
        showAlert('获取失败: ' + error.message, 'error');
      }
    }
    
    async function saveAllBestDomains() {
      try {
        const response = await fetch('/api/admin/best-domains', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bestDomains: currentBestDomains })
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('保存成功\n\n共配置 ' + currentBestDomains.length + ' 个优选域名', 'success');
        } else {
          showAlert('保存失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        showAlert('保存失败: ' + error.message, 'error');
      }
    }
    
    let nextSyncSeconds = 15 * 60; // 15分钟 = 900秒
    
    function updateNextSyncTime() {
      // 倒计时
      nextSyncSeconds--;
      if (nextSyncSeconds <= 0) {
        nextSyncSeconds = 15 * 60; // 重置为15分钟
      }
      
      const minutes = Math.floor(nextSyncSeconds / 60);
      const seconds = nextSyncSeconds % 60;
      const countdownStr = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
      
      const countdownElem = document.getElementById('next-sync-countdown');
      if (countdownElem) {
        countdownElem.textContent = countdownStr;
      }
      
      // 更新节点状态时间
      const now = new Date();
      const statusTimeStr = now.toLocaleTimeString('zh-CN', { hour12: false });
      const statusTimeElem = document.getElementById('node-status-time');
      if (statusTimeElem) {
        statusTimeElem.textContent = '最后检测: ' + statusTimeStr;
      }
      
      // 每秒更新一次
      setTimeout(updateNextSyncTime, 1000);
    }
    
    // 标签切换函数
    function switchBestDomainsTab(tabName) {
      // 切换标签激活状态
      document.getElementById('tab-domain-list').classList.remove('active');
      document.getElementById('tab-node-status').classList.remove('active');
      document.getElementById('tab-' + tabName).classList.add('active');
      
      // 切换内容显示
      document.getElementById('tab-content-domain-list').style.display = 'none';
      document.getElementById('tab-content-node-status').style.display = 'none';
      document.getElementById('tab-content-' + tabName).style.display = 'block';
      
      // 如果切换到节点状态，加载数据
      if (tabName === 'node-status') {
        loadNodeStatus();
      }
    }
    
    // 加载节点状态
    async function loadNodeStatus() {
      try {
        if (!currentBestDomains || currentBestDomains.length === 0) {
          renderNodeStatus([]);
          return;
        }
        
        // 解析优选域名列表
        // 格式1: 域名 cf.twitter.now.cc
        // 格式2: IPv4 104.18.34.78:443#v4移动 LHR
        // 格式3: IPv6 [2606:4700:7::a29f:8601]:443#v6移动 MAA
        const nodes = [];
        for (let i = 0; i < currentBestDomains.length; i++) {
          const domain = currentBestDomains[i];
          const parsed = parseDomainEntry(domain);
          if (parsed) {
            // 测试延迟（模拟）
            const latency = await testNodeLatency(parsed.address, parsed.port);
            
            // 构建节点地址显示
            let nodeAddress;
            if (parsed.isDomain) {
              // 域名: cf.twitter.now.cc:443
              nodeAddress = parsed.address + ':' + parsed.port;
            } else if (parsed.address.includes(':')) {
              // IPv6: [2606:4700:7::a29f:8601]:443
              nodeAddress = '[' + parsed.address + ']:' + parsed.port;
            } else {
              // IPv4: 104.18.34.78:443
              nodeAddress = parsed.address + ':' + parsed.port;
            }
            
            nodes.push({
              id: i + 1,
              name: parsed.label,
              node: nodeAddress,
              latency: latency,
              region: parsed.region || '-',
              status: latency > 0 && latency < 3000 ? '在线' : '超时'
            });
          }
        }
        
        renderNodeStatus(nodes);
      } catch (error) {
        console.error('加载节点状态失败:', error);
      }
    }
    
    // 解析域名条目
    // 格式1: 104.18.34.78:443#v4移动 LHR (IPv4)
    // 格式2: [2606:4700:7::a29f:8601]:443#v6移动 MAA (IPv6)
    // 格式3: cf.twitter.now.cc (域名，无端口)
    // 格式4: cf.twitter.now.cc:443 (域名，带端口)
    function parseDomainEntry(entry) {
      try {
        // 检查是否有#分隔符
        let addressPart, infoPart;
        if (entry.includes('#')) {
          const parts = entry.split('#');
          addressPart = parts[0].trim();
          infoPart = parts[1].trim();
        } else {
          // 没有#，说明是纯域名
          addressPart = entry.trim();
          infoPart = '';
        }
        
        let address, port, isDomain = false;
        
        // 检查是否是IPv6格式（带方括号）
        if (addressPart.startsWith('[')) {
          // IPv6: [2606:4700:7::a29f:8601]:443
          const ipv6Match = addressPart.match(/^\\[([^\\]]+)\\]:([0-9]+)$/);
          if (!ipv6Match) return null;
          address = ipv6Match[1]; // 2606:4700:7::a29f:8601
          port = ipv6Match[2]; // 443
          isDomain = false;
        } else if (addressPart.match(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:/)) {
          // IPv4: 104.18.34.78:443
          const ipv4Match = addressPart.match(/^([0-9.]+):([0-9]+)$/);
          if (!ipv4Match) return null;
          address = ipv4Match[1]; // 104.18.34.78
          port = ipv4Match[2]; // 443
          isDomain = false;
        } else {
          // 域名: cf.twitter.now.cc 或 cf.twitter.now.cc:443
          isDomain = true;
          if (addressPart.includes(':')) {
            const domainMatch = addressPart.match(/^([^:]+):([0-9]+)$/);
            if (domainMatch) {
              address = domainMatch[1]; // cf.twitter.now.cc
              port = domainMatch[2]; // 443
            } else {
              address = addressPart;
              port = '443'; // 默认端口
            }
          } else {
            address = addressPart;
            port = '443'; // 默认端口
          }
        }
        
        // 解析标签和地区
        let label, region;
        if (isDomain) {
          // 域名节点：名称就是域名本身，地区为空
          label = address;
          region = '';
        } else if (infoPart) {
          // IP节点：解析标签和地区
          // 格式: "v4移动 LHR" -> label: v4移动, region: LHR
          const infoMatch = infoPart.match(/^(.+?)\s+([A-Z]{2,4})$/);
          if (infoMatch) {
            label = infoMatch[1]; // v4移动
            region = infoMatch[2]; // LHR
          } else {
            label = infoPart; // 整个作为标签
            region = '';
          }
        } else {
          label = address;
          region = '';
        }
        
        return { address, port, label, region, isDomain };
      } catch (e) {
        console.error('解析域名条目失败:', entry, e);
        return null;
      }
    }
    
    // 测试节点延迟（模拟）
    async function testNodeLatency(ip, port) {
      // 实际环境中可以ping或fetch测试
      // 这里返回模拟延迟
      return new Promise(resolve => {
        setTimeout(() => {
          const randomLatency = Math.floor(Math.random() * 1500) + 500;
          resolve(randomLatency);
        }, 100);
      });
    }
    
    // 渲染节点状态列表
    function renderNodeStatus(nodes) {
      const tbody = document.getElementById('node-status-list');
      
      if (nodes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-4 py-8 text-center text-slate-400 dark:text-zinc-600"><span class="material-symbols-outlined text-4xl mb-2 block">cloud_off</span><p class="text-sm">暂无节点状态数据</p></td></tr>';
        return;
      }
      
      tbody.innerHTML = nodes.map(node => {
        const statusClass = node.status === '在线' 
          ? 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
          : 'border-red-200 dark:border-red-900 text-red-600 dark:text-red-400';
        
        return '<tr class="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-colors">' +
          '<td class="px-4 py-3 text-slate-500 dark:text-zinc-500 text-center">' + node.id + '</td>' +
          '<td class="px-4 py-3 font-medium text-slate-900 dark:text-zinc-100">' + node.name + '</td>' +
          '<td class="px-4 py-3 font-mono text-slate-600 dark:text-zinc-400">' + node.node + '</td>' +
          '<td class="px-4 py-3 font-mono text-slate-600 dark:text-zinc-400">' + node.latency + 'ms</td>' +
          '<td class="px-4 py-3 text-right">' +
            '<span class="inline-flex items-center rounded-full border ' + statusClass + ' px-2 py-0.5 text-xs font-medium">' + node.status + '</span>' +
          '</td>' +
        '</tr>';
      }).join('');
    }
    
    // 获取仪表盘统计数据
    async function fetchDashboardStats() {
      try {
        const response = await fetch('/api/admin/statistics');
        if (!response.ok) throw new Error('Failed to fetch statistics');
        
        const stats = await response.json();
        
        document.getElementById('stat-total-users').textContent = stats.totalUsers || 0;
        document.getElementById('stat-active-users').textContent = stats.activeUsers || 0;
        document.getElementById('stat-config-nodes').textContent = stats.configNodes || 0;
        document.getElementById('stat-expired-users').textContent = stats.expiredUsers || 0;
      } catch (error) {
        console.error('获取统计数据失败:', error);
      }
    }
    
    // 加载系统配置
    async function loadSystemSettings() {
      try {
        const response = await fetch('/api/admin/getSystemSettings');
        if (!response.ok) throw new Error('Failed to fetch settings');
        
        const data = await response.json();
        
        if (data.success && data.settings) {
          const settings = data.settings;
          
          document.getElementById('input-enableTrial').checked = settings.enableTrial || false;
          document.getElementById('input-trialDays').value = settings.trialDays || 1;
          document.getElementById('input-requireInviteCode').checked = settings.requireInviteCode || false;
          document.getElementById('input-pendingOrderExpiry').value = settings.pendingOrderExpiry || 30;
          document.getElementById('input-paymentOrderExpiry').value = settings.paymentOrderExpiry || 15;
        }
      } catch (error) {
        console.error('加载系统配置失败:', error);
      }
    }
    
    // 保存系统配置
    async function saveSystemSettings() {
      try {
        const settings = {
          enableTrial: document.getElementById('input-enableTrial').checked,
          trialDays: parseInt(document.getElementById('input-trialDays').value),
          requireInviteCode: document.getElementById('input-requireInviteCode').checked,
          pendingOrderExpiry: parseInt(document.getElementById('input-pendingOrderExpiry').value),
          paymentOrderExpiry: parseInt(document.getElementById('input-paymentOrderExpiry').value)
        };
        
        const response = await fetch('/api/admin/updateSystemSettings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings)
        });
        
        const result = await response.json();
        
        if (result.success) {
          showAlert('保存成功', 'success');
        } else {
          showAlert('保存失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (error) {
        console.error('保存系统配置失败:', error);
        showAlert('保存失败: ' + error.message, 'error');
      }
    }
    
    // 加载最近注册用户
    async function loadRecentUsers() {
      try {
        const accountResponse = await fetch('/api/admin/users');
        if (!accountResponse.ok) throw new Error('Failed to fetch user accounts');
        
        const result = await accountResponse.json();
        const accounts = result.users || [];
        const recentAccounts = accounts.slice(0, 5);
        const tbody = document.getElementById('users-table-body');
        tbody.innerHTML = '';
        
        for (const account of recentAccounts) {
          const detailResponse = await fetch('/api/admin/user/' + account.uuid);
          if (!detailResponse.ok) continue;
          
          const userDetail = await detailResponse.json();
          
          let statusClass = '';
          let statusText = '';
          
          if (!userDetail.enabled) {
            statusClass = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            statusText = '已禁用';
          } else if (userDetail.expiry && userDetail.expiry < Date.now()) {
            statusClass = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            statusText = '已过期';
          } else {
            statusClass = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            statusText = '正常';
          }
          
          const registerTime = userDetail.registeredAt 
            ? new Date(userDetail.registeredAt).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              }).replace(/\\//g, '-')
            : '未知';
          
          const shortUuid = account.uuid.substring(0, 13) + '...';
          
          const row = '<tr>' +
            '<td class="px-6 py-4">' +
              '<div class="font-medium">' + shortUuid + '</div>' +
              '<div class="text-[10px] text-muted-light">' + (account.account || '无账号') + '</div>' +
            '</td>' +
            '<td class="px-6 py-4 text-muted-light">' + registerTime + '</td>' +
            '<td class="px-6 py-4">' +
              '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ' + statusClass + '">' +
                statusText +
              '</span>' +
            '</td>' +
            '<td class="px-6 py-4 text-right">' +
              '<button class="text-primary dark:text-white hover:underline text-xs font-medium" onclick="switchSection(\'users\')">编辑</button>' +
            '</td>' +
          '</tr>';
          
          tbody.innerHTML += row;
        }
        
        if (recentAccounts.length === 0) {
          tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-8 text-center text-muted-light">暂无注册用户</td></tr>';
        }
      } catch (error) {
        console.error('加载最近注册用户失败:', error);
        const tbody = document.getElementById('users-table-body');
        tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-8 text-center text-red-600">加载用户数据失败: ' + error.message + '</td></tr>';
      }
    }
    
    // 导出数据
    async function exportData() {
      try {
        const res = await fetch('/api/admin/export-all');
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vles-data-' + Date.now() + '.json';
        a.click();
        alert('✅ 数据导出成功');
      } catch (e) {
        alert('❌ 导出失败: ' + e.message);
      }
    }
    
    // 导入数据
    async function importData() {
      alert('数据导入功能开发中...');
    }
    
    // 修改密码
    async function changePassword() {
      const oldPassword = document.getElementById('oldPassword').value.trim();
      const newPassword = document.getElementById('newPassword').value.trim();
      const confirmPassword = document.getElementById('confirmPassword').value.trim();
      
      if (!oldPassword || !newPassword || !confirmPassword) return alert('请填写完整信息');
      if (newPassword.length < 6) return alert('新密码至少6位');
      if (newPassword !== confirmPassword) return alert('两次输入的新密码不一致');
      
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({oldPassword, newPassword})
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert('✅ 密码修改成功，请重新登录');
        document.getElementById('oldPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        setTimeout(() => adminLogout(), 2000);
      } else {
        alert('❌ ' + (data.error || '修改失败'));
      }
    }
    
    // 退出登录
    async function adminLogout() {
      await fetch('/api/admin/logout', {method: 'POST'});
      location.reload();
    }
    
    // 更新时间显示
    function updateTime() {
      const now = new Date();
      const timeStr = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      const elem = document.getElementById('last-update-time');
      if (elem) elem.textContent = timeStr;
    }
    
    // 页面加载时获取数据
    document.addEventListener('DOMContentLoaded', () => {
      updateTime();
      fetchDashboardStats();
      loadSystemSettings();
      loadRecentUsers();
      
      // 默认激活第一个导航项
      const firstNavLink = document.querySelector('.nav-link');
      if (firstNavLink) {
        firstNavLink.classList.add('bg-zinc-100', 'dark:bg-zinc-800', 'text-primary', 'dark:text-white', 'font-medium');
      }
    });
  </script>
</body>
</html>`;
}

module.exports = {
    renderAdminPanel,
    renderAdminLoginPage
};
