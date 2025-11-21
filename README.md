# VLESS 智能管理系统

> 基于 Cloudflare Workers + D1 数据库的 VLESS 用户管理和智能代理系统  
> 支持地理位置智能匹配、拖动排序、实时同步等高级特性

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)
[![D1 Database](https://img.shields.io/badge/D1-Database-green)](https://developers.cloudflare.com/d1/)

---

## ✨ 核心特性

### 🎯 智能地理位置匹配
- 自动识别目标地址的地理位置
- 优先使用同地区的反代 IP
- 支持 15+ 国家/地区智能识别
- 降低延迟，提升连接速度

### 🎨 可视化管理界面
- 现代化响应式 UI 设计
- 拖拽排序配置项
- 批量操作用户
- 实时配置同步

### 🔒 安全可靠
- UUID 实时验证
- D1 数据库持久化存储
- 密码保护管理后台
- 过期时间自动管理

### ⚡ 高性能
- 智能多重代理重试
- DNS over HTTPS
- WebSocket 流量转发
- 60秒配置缓存

---

## 📁 文件说明

| 文件 | 说明 | 用途 |
|------|------|------|
| `User-Manager-Worker.js` | 管理端 | 用户管理、配置管理、Web界面 |
| `Node-Worker.js` | 节点端 | 流量转发、智能代理、订阅生成 |

---

## 🚀 完整部署教程

### 准备工作

在开始之前，你需要：
- ✅ 一个 Cloudflare 账号（免费版即可）
- ✅ 已绑定域名到 Cloudflare（可选，但推荐）

---

### 第一步：创建 D1 数据库

#### 1.1 登录 Cloudflare Dashboard

访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)

#### 1.2 创建 D1 数据库

1. 在左侧菜单选择 **Workers & Pages**
2. 点击 **D1 SQL Database**
3. 点击 **Create database**
4. 数据库名称输入：`vless_users`（或其他名称）
5. 点击 **Create**

#### 1.3 初始化数据库表

在数据库详情页面，点击 **Console** 标签，执行以下 SQL：

```sql
-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    uuid TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    expiry INTEGER,
    create_at INTEGER NOT NULL,
    enabled INTEGER NOT NULL DEFAULT 1
);

-- 创建设置表
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_enabled ON users(enabled);
CREATE INDEX IF NOT EXISTS idx_users_expiry ON users(expiry);
```

✅ 数据库创建完成！

---

### 第二步：部署管理端 Worker

#### 2.1 创建管理端 Worker

1. 在 **Workers & Pages** 页面，点击 **Create application**
2. 选择 **Create Worker**
3. Worker 名称输入：`vless-manager`（或其他名称）
4. 点击 **Deploy**

#### 2.2 编辑 Worker 代码

1. 点击 **Edit code**
2. 删除默认代码
3. 复制本仓库的 `User-Manager-Worker.js` 全部内容
4. 粘贴到编辑器
5. 点击 **Save and deploy**

#### 2.3 绑定 D1 数据库

1. 返回 Worker 详情页，点击 **Settings** 标签
2. 找到 **Bindings** 部分，点击 **Add**
3. 选择 **D1 database**
4. **Variable name** 填写：`DB`（必须是大写 DB）
5. **D1 database** 选择刚才创建的 `vless_users`
6. 点击 **Save**

#### 2.4 设置管理密码

1. 在 **Settings** 页面，找到 **Environment Variables**
2. 点击 **Add variable**
3. **Variable name** 填写：`ADMIN_PASSWORD`
4. **Value** 填写：你的管理密码（例如：`MySecurePass123`）
5. 点击 **Save**

#### 2.5 绑定自定义域名（可选）

1. 在 **Settings** 页面，找到 **Triggers** 部分
2. 点击 **Add Custom Domain**
3. 输入域名：`manager.yourdomain.com`
4. 等待 SSL 证书配置完成

✅ 管理端部署完成！访问你的域名或 `xxx.workers.dev` 测试登录。

---

### 第三步：部署节点端 Worker

#### 3.1 创建节点端 Worker

1. 在 **Workers & Pages** 页面，点击 **Create application**
2. 选择 **Create Worker**
3. Worker 名称输入：`vless-node`（或其他名称）
4. 点击 **Deploy**

#### 3.2 编辑 Worker 代码

1. 点击 **Edit code**
2. 删除默认代码
3. 复制本仓库的 `Node-Worker.js` 全部内容
4. 粘贴到编辑器
5. **重要：修改第 7 行的 API 地址**
   ```javascript
   const REMOTE_API_URL = 'https://你的管理端域名/api/users';
   ```
   例如：
   ```javascript
   const REMOTE_API_URL = 'https://vless-manager.xxx.workers.dev/api/users';
   // 或
   const REMOTE_API_URL = 'https://manager.yourdomain.com/api/users';
   ```
6. 点击 **Save and deploy**

#### 3.3 绑定自定义域名（可选但推荐）

1. 在 **Settings** 页面，找到 **Triggers** 部分
2. 点击 **Add Custom Domain**
3. 输入域名：`node.yourdomain.com`
4. 等待 SSL 证书配置完成

✅ 节点端部署完成！

---

### 第四步：配置管理端

#### 4.1 登录管理后台

1. 访问管理端域名
2. 输入你设置的 `ADMIN_PASSWORD`
3. 点击登录

#### 4.2 配置节点订阅地址

在页面顶部的 **节点订阅地址** 输入框中填入节点端域名：
```
https://vless-node.xxx.workers.dev
# 或
https://node.yourdomain.com
```

#### 4.3 配置反代 IP 列表（支持智能地理匹配）

在 **默认反代 IP 列表** 中添加：
```
ProxyIP.HK.CMLiussss.net:443
ProxyIP.JP.CMLiussss.net:443
ProxyIP.SG.CMLiussss.net:443
ProxyIP.US.CMLiussss.net:443
ProxyIP.KR.CMLiussss.net:443
```

💡 **智能提示：** 在代理地址中包含地区标识（如 HK/JP/US），系统会根据目标地址自动选择同地区代理。

#### 4.4 配置优选域名列表

在 **优选域名列表** 中添加：
```
cf.twitter.now.cc:443#白嫖2
telecom.twitter.now.cc#电信优化
v6telecom.twitter.now.cc:443#电信IPv6
unicom.twitter.now.cc:443#联通优化
v6mobile.twitter.now.cc:443#移动IPv6
```

**格式说明：**
- `域名:端口#节点名称` - 完整格式
- `域名#节点名称` - 端口默认 443
- `域名` - 使用域名作为节点名，端口默认 443

#### 4.5 保存配置

点击 **保存全部配置** 按钮

✅ 配置完成！

---

### 第五步：添加用户并测试

#### 5.1 添加用户

1. 在 **添加用户** 区域填写：
   - **备注名称**：用户昵称（可选，留空为"未命名"）
   - **到期时间**：留空为永久有效
   - **自定义 UUID**：留空自动生成
2. 点击 **生成 / 添加用户**

#### 5.2 获取订阅链接

1. 在用户列表中找到刚添加的用户
2. 点击 **订阅** 按钮，订阅链接自动复制到剪贴板
3. 订阅链接格式：`https://your-node-domain/用户UUID`

#### 5.3 测试连接

**方法一：使用 V2Ray 客户端**
1. 打开 V2Ray 客户端（如 v2rayN、v2rayNG）
2. 添加订阅：粘贴订阅链接
3. 更新订阅
4. 选择节点测试连接

**方法二：调试接口**

访问节点端的 `/debug` 接口查看配置：
```
https://your-node-domain/debug
```

返回内容应包括：
```json
{
  "users": {
    "uuid-here": "用户名"
  },
  "settings": {
    "proxyIPs": [...],
    "bestDomains": [...]
  },
  "lastUpdate": "2025-11-21T...",
  "apiUrl": "https://..."
}
```

✅ 部署完成，可以正常使用了！

---

## 🎨 管理端功能详解

### 用户管理

#### 添加单个用户
- 自定义备注名称
- 设置到期时间
- 自动生成或自定义 UUID

#### 批量添加用户
在 **自定义 UUID** 框中输入多个 UUID（每行一个），一次性创建多个用户。

#### 编辑用户
点击用户列表中的 **编辑** 按钮，可以修改：
- 备注名称
- 到期时间

#### 批量操作
1. 勾选多个用户
2. 点击顶部的批量操作按钮：
   - **批量启用** - 启用选中的用户
   - **批量禁用** - 禁用选中的用户
   - **批量删除** - 删除选中的用户

### 配置管理

#### 拖动排序
- 点击配置项左侧的 `☰` 图标
- 拖动到目标位置
- 释放鼠标完成排序
- 点击 **保存全部配置**

#### 添加配置
支持批量添加（每行一个）：
```
ProxyIP.HK.CMLiussss.net:443
ProxyIP.JP.CMLiussss.net
1.1.1.1#美国节点
```

#### 删除配置
点击配置项右侧的 `×` 按钮删除

---

## 🌍 智能地理位置匹配详解

这是本系统的核心特性之一，可以显著降低延迟和提升连接成功率。

### 工作原理

**场景：用户访问日本网站 `japan.com`**

```
用户请求 japan.com
  ↓
尝试直连 → 成功 ✅
  ↓ 失败
检测目标地理位置: JP
  ↓
智能排序代理列表
  ↓
优先使用 ProxyIP.JP → 成功 ✅
  ↓ 失败
尝试 ProxyIP.HK → 成功 ✅
  ↓ 失败
尝试 ProxyIP.SG → 成功 ✅
  ↓ 失败
所有代理失败 ❌
```

### 支持的地区识别

系统会自动识别以下地区标识（**大小写不敏感**）：

| 地区代码 | 识别关键词 | 地区名称 |
|---------|-----------|---------|
| 🇭🇰 HK | `hk`, `hongkong`, `hong kong`, `香港`, `hkg` | 中国香港 |
| 🇯🇵 JP | `jp`, `japan`, `日本`, `tokyo`, `东京` | 日本 |
| 🇸🇬 SG | `sg`, `singapore`, `新加坡` | 新加坡 |
| 🇺🇸 US | `us`, `usa`, `america`, `美国`, `united states` | 美国 |
| 🇰🇷 KR | `kr`, `korea`, `韩国`, `seoul`, `首尔` | 韩国 |
| 🇹🇼 TW | `tw`, `taiwan`, `台湾`, `taipei`, `台北` | 中国台湾 |
| 🇬🇧 UK | `uk`, `london`, `英国`, `britain` | 英国 |
| 🇩🇪 DE | `de`, `germany`, `德国`, `frankfurt`, `法兰克福` | 德国 |
| 🇫🇷 FR | `fr`, `france`, `法国`, `paris`, `巴黎` | 法国 |
| 🇨🇦 CA | `ca`, `canada`, `加拿大`, `toronto` | 加拿大 |
| 🇦🇺 AU | `au`, `australia`, `澳大利亚`, `sydney` | 澳大利亚 |
| 🇨🇳 CN | `cn`, `china`, `中国`, `beijing`, `shanghai` | 中国 |
| 🇮🇳 IN | `in`, `india`, `印度`, `mumbai` | 印度 |
| 🇷🇺 RU | `ru`, `russia`, `俄罗斯`, `moscow` | 俄罗斯 |
| 🇧🇷 BR | `br`, `brazil`, `巴西`, `sao paulo` | 巴西 |
| 🇳🇱 NL | `nl`, `netherlands`, `荷兰`, `amsterdam` | 荷兰 |

### 反代 IP 配置最佳实践

#### ✅ 推荐配置

```
ProxyIP.HK.CMLiussss.net:443
ProxyIP.JP.CMLiussss.net:443
ProxyIP.SG.CMLiussss.net:443
ProxyIP.US.CMLiussss.net:443
ProxyIP.KR.CMLiussss.net:443
ProxyIP.UK.CMLiussss.net:443
ProxyIP.Oracle.cmliussss.net:443
```

#### 配置技巧

1. **地区标识命名** - 在域名中包含地区关键词
   - ✅ `ProxyIP.HK.example.com` - 明确标识香港
   - ✅ `hongkong-proxy.example.com` - 包含 hongkong
   - ✅ `proxy-japan.example.com` - 包含 japan
   - ❌ `proxy01.example.com` - 无法识别地区

2. **优先级排序** - 拖动调整顺序
   - 将最快的代理放在前面（非地理匹配时使用）
   - 将备用代理放在后面

3. **端口配置** - 自动补全
   - `example.com` → 自动补全为 `example.com:443`
   - `1.1.1.1` → 自动补全为 `1.1.1.1:443`
   - `example.com:8443` → 保持原样

### 实际效果对比

| 目标地址 | 传统方式 | 智能匹配方式 |
|---------|---------|-------------|
| japan.com | 随机选择代理 | 优先使用 JP 代理 ⚡ |
| hongkong.com | 随机选择代理 | 优先使用 HK 代理 ⚡ |
| singapore.sg | 随机选择代理 | 优先使用 SG 代理 ⚡ |
| unknown.com | 按顺序尝试 | 按顺序尝试 |

**优势：**
- ⚡ 降低延迟 - 同地区代理距离更近
- 📈 提高成功率 - 同地区代理兼容性更好
- 🔄 智能降级 - 失败后自动尝试其他代理
- 🎯 灵活配置 - 支持手动调整优先级

---

## 📝 优选域名配置

优选域名是用于生成订阅链接的节点地址列表。

### 格式说明

```
域名/IP[:端口][#节点名称]
```

### 完整配置示例

```
cf.twitter.now.cc:443#白嫖2
telecom.twitter.now.cc#电信优化
v6telecom.twitter.now.cc:443#电信IPv6
unicom.twitter.now.cc#联通优化
v6mobile.twitter.now.cc:443#移动IPv6
japan.com:443#日本节点
www.visa.com.sg:443#新加坡
1.1.1.1#CloudflareIP
```

### 生成的节点名称

根据上面的配置，订阅中的节点名称为：

- ✅ `白嫖2`
- ✅ `电信优化`
- ✅ `电信IPv6`
- ✅ `联通优化`
- ✅ `移动IPv6`
- ✅ `日本节点`
- ✅ `新加坡`
- ✅ `CloudflareIP`

**注意：** 
- 如果用户备注名为"未命名"，则直接显示节点名
- 如果用户有自定义备注名（如"张三"），则显示 `张三-节点名`

### 拖动排序

1. 在管理端界面，鼠标悬停在配置项上
2. 点击并按住左侧的 `☰` 拖动图标
3. 拖动到目标位置
4. 释放鼠标完成排序
5. 点击 **保存全部配置** 按钮

---

## 🔧 完整功能列表

### 管理端功能

#### 用户管理
- ✅ 添加单个/批量用户
- ✅ 编辑用户信息（名称、到期时间）
- ✅ 删除单个/批量用户
- ✅ 启用/禁用单个/批量用户
- ✅ 自定义 UUID 或自动生成
- ✅ 到期时间自动判断
- ✅ 用户状态标签显示
- ✅ 复制用户 UUID
- ✅ 一键复制订阅链接

#### 配置管理
- ✅ 反代 IP 列表管理
- ✅ 优选域名列表管理
- ✅ 节点订阅地址配置
- ✅ 拖动排序功能
- ✅ 批量添加配置
- ✅ 智能地理位置提示
- ✅ 实时配置保存

#### 数据管理
- ✅ D1 数据库持久化
- ✅ 从 KV 迁移数据
- ✅ 数据库初始化脚本
- ✅ 配置缓存机制

#### 界面特性
- ✅ 响应式设计（支持手机/平板/电脑）
- ✅ 密码登录保护
- ✅ Cookie 会话管理
- ✅ Toast 提示消息
- ✅ 模态框编辑
- ✅ 批量操作栏

### 节点端功能

#### 核心功能
- ✅ VLESS 协议支持
- ✅ WebSocket 流量转发
- ✅ UUID 实时验证
- ✅ 订阅链接生成（Base64）
- ✅ 健康检查接口 (`/`)
- ✅ 调试信息接口 (`/debug`)

#### 智能代理
- ✅ 地理位置智能匹配
- ✅ 多重代理自动重试
- ✅ 直连优先策略
- ✅ 代理智能排序
- ✅ 失败自动降级

#### 网络特性
- ✅ DNS over HTTPS (DoH)
- ✅ UDP DNS 查询支持
- ✅ TCP 流量转发
- ✅ IPv4/IPv6 双栈支持
- ✅ 域名解析支持

#### 配置同步
- ✅ 60秒缓存机制
- ✅ 强制刷新防抖
- ✅ 失败兜底配置
- ✅ 实时用户验证
- ✅ 自动配置更新

---

## 🐛 故障排查

### 常见问题

#### 1. 订阅链接显示 404

**原因：**
- 节点端 `REMOTE_API_URL` 配置错误
- 管理端未正确返回用户数据
- UUID 不在有效用户列表中

**解决方法：**
1. 访问 `https://your-node-domain/debug` 查看配置
2. 检查 `apiUrl` 是否正确
3. 检查 `users` 对象是否包含该 UUID

#### 2. 管理端显示"操作失败"

**原因：**
- D1 数据库未绑定
- 数据库表未创建
- 变量名不是 `DB`

**解决方法：**
1. 检查 Worker Settings → Bindings
2. 确认 D1 database 绑定，变量名为 `DB`
3. 在 D1 Console 执行初始化 SQL

#### 3. 节点连接失败

**原因：**
- 用户已过期或被禁用
- 反代 IP 全部失败
- 目标地址无法访问

**解决方法：**
1. 在管理端检查用户状态
2. 测试反代 IP 是否可用
3. 查看节点端日志

#### 4. 配置拖动不生效

**原因：**
- 未点击"保存全部配置"按钮
- 浏览器不支持拖放 API

**解决方法：**
1. 拖动后必须点击保存按钮
2. 使用现代浏览器（Chrome/Firefox/Edge）

### 调试工具

#### 节点端调试接口

访问 `/debug` 查看实时状态：

```bash
curl https://your-node-domain/debug
```

返回示例：
```json
{
  "users": {
    "e5aade72-ff90-463d-8d98-0d9903885f7f": "张三"
  },
  "settings": {
    "proxyIPs": [
      "ProxyIP.HK.CMLiussss.net:443",
      "ProxyIP.JP.CMLiussss.net:443"
    ],
    "bestDomains": [
      "cf.twitter.now.cc:443#白嫖2",
      "telecom.twitter.now.cc:443#电信优化"
    ]
  },
  "lastUpdate": "2025-11-21T12:34:56.789Z",
  "apiUrl": "https://your-manager-domain/api/users"
}
```

#### 管理端 API 测试

测试用户 API 是否正常：

```bash
curl https://your-manager-domain/api/users
```

返回示例：
```json
{
  "users": {
    "uuid1": "用户1",
    "uuid2": "用户2"
  },
  "settings": {
    "proxyIPs": [...],
    "bestDomains": [...],
    "subUrl": "https://..."
  }
}
```

---

## 📊 连接流程图

### 完整请求流程

```
┌─────────────┐
│  V2Ray客户端  │
└──────┬──────┘
       │ ① 订阅更新
       ↓
┌─────────────────┐
│  节点端 Worker   │ ← ② 从管理端同步配置
│  /uuid-path     │
└──────┬──────────┘
       │ ③ 返回订阅（Base64）
       ↓
┌─────────────┐
│  V2Ray客户端  │
│  选择节点连接  │
└──────┬──────┘
       │ ④ WebSocket 握手
       ↓
┌─────────────────┐
│  节点端 Worker   │
│  验证 UUID      │ ← ⑤ 强制刷新用户列表
└──────┬──────────┘
       │ ⑥ UUID 有效
       ↓
┌─────────────────┐
│  解析目标地址    │
│  目标: japan.com │
└──────┬──────────┘
       │
       ├─⑦ 尝试直连
       │   └─→ ✅ 成功 → 转发数据
       │   └─→ ❌ 失败 ↓
       │
       ├─⑧ 智能匹配
       │   └─→ 识别地区: JP
       │   └─→ 排序代理: [ProxyIP.JP, ProxyIP.HK, ...]
       │
       ├─⑨ 代理重试
       │   ├─→ ProxyIP.JP → ✅ 成功 → 转发数据
       │   ├─→ ProxyIP.JP → ❌ 失败 ↓
       │   ├─→ ProxyIP.HK → ✅ 成功 → 转发数据
       │   └─→ ProxyIP.HK → ❌ 失败 ↓
       │
       └─⑩ 所有失败
           └─→ ❌ 连接中断
```

---

## 📄 许可证

MIT License

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 如何贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 使用清晰的变量命名
- 添加必要的注释
- 保持代码简洁易读
- 测试后再提交

---

## 📮 联系方式

- GitHub Issues: [提交问题](https://github.com/kiftyxx/vles/issues)
- 讨论区: [GitHub Discussions](https://github.com/kiftyxx/vles/discussions)

---

## ⭐ Star History

如果这个项目对你有帮助，请给个 Star ⭐

---

**最后更新时间：** 2025-11-21  
**当前版本：** v2.0.0  
**作者：** kiftyxx
