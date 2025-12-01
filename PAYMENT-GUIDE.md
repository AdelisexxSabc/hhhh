# 支付功能部署指南

本指南说明如何在 vless-snippets 中配置 BEpusdt 支付功能。

## 架构说明

```
用户前端 → 管理端 Worker → BEpusdt 支付网关
                ↓
         (支付回调)
                ↓
         订单自动完成
```

## 前置要求

1. 已部署 [BEpusdt](https://github.com/v03413/BEpusdt) 支付网关
2. 已获取 BEpusdt 的 API 地址和 Token

## 数据库更新

需要在 D1 数据库中执行以下 SQL 创建支付相关表：

```sql
-- 支付通道配置表
CREATE TABLE IF NOT EXISTS payment_channels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    api_url TEXT NOT NULL,
    api_token TEXT NOT NULL,
    enabled INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL
);

-- 支付记录表
CREATE TABLE IF NOT EXISTS payment_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT UNIQUE NOT NULL,
    trade_id TEXT,
    amount REAL NOT NULL,
    actual_amount TEXT,
    trade_type TEXT,
    user_id TEXT,
    status INTEGER DEFAULT 1,
    payment_url TEXT,
    token TEXT,
    block_transaction_id TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_payment_records_order_id ON payment_records(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_trade_id ON payment_records(trade_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_status ON payment_records(status);

-- 订单表添加支付相关字段
ALTER TABLE orders ADD COLUMN payment_order_id TEXT;
ALTER TABLE orders ADD COLUMN payment_trade_id TEXT;
ALTER TABLE orders ADD COLUMN payment_type TEXT DEFAULT 'manual';
```

## 配置步骤

### 1. 登录管理后台

访问管理后台，进入「支付通道」配置页面。

### 2. 添加支付通道

填写以下信息：

| 字段 | 说明 | 示例 |
|------|------|------|
| 通道名称 | 显示给用户的名称 | USDT-TRC20 |
| 通道代码 | BEpusdt 支持的交易类型 | usdt.trc20 |
| API 地址 | BEpusdt 服务地址 | https://epusdt.example.com |
| API Token | BEpusdt 配置的认证令牌 | your_api_token |

### 3. 支持的交易类型

BEpusdt 支持以下交易类型：

- `usdt.trc20` - USDT TRC20 (推荐)
- `usdt.polygon` - USDT Polygon
- `usdt.arbitrum` - USDT Arbitrum  
- `usdt.optimism` - USDT Optimism
- `usdt.bsc` - USDT BSC
- `tron.trx` - TRX

## 支付流程

1. 用户在套餐购买页面选择套餐
2. 弹出支付方式选择（如果有配置支付通道）
3. 用户选择支付通道并确认
4. 系统创建订单并调用 BEpusdt 生成支付链接
5. 用户跳转到 BEpusdt 收银台完成支付
6. BEpusdt 回调通知管理端
7. 管理端自动完成订单，延长用户有效期

## 回调地址

支付回调地址会自动设置为：

```
https://your-manager-worker.workers.dev/api/payment/notify
```

确保此地址可被 BEpusdt 服务器访问。

## 注意事项

1. **HTTPS 必须**：所有地址必须使用 HTTPS
2. **签名验证**：系统会自动验证 BEpusdt 回调签名
3. **幂等处理**：即使回调多次，订单只会处理一次
4. **免费套餐**：价格为 0 的套餐不会触发在线支付

## 故障排查

### 支付页面不跳转

- 检查支付通道是否启用
- 检查 API 地址是否正确
- 检查 API Token 是否正确
- 查看浏览器控制台错误信息

### 支付成功但订单未完成

- 检查回调地址是否可访问
- 检查 BEpusdt 日志中的回调记录
- 在 Cloudflare Workers 日志中查看回调处理情况

### 签名验证失败

- 确保管理端配置的 API Token 与 BEpusdt 的 `conf.toml` 中配置的一致
