/**
 * 支付网关 Worker - 对接 BEpusdt
 * 
 * 部署说明：
 * 1. 创建新的 Cloudflare Worker
 * 2. 绑定 D1 数据库 (变量名: DB)
 * 3. 配置环境变量:
 *    - BEPUSDT_API_URL: BEpusdt API 地址 (例如: https://epusdt.zqsl.xxx)
 *    - BEPUSDT_API_TOKEN: BEpusdt API 认证令牌
 *    - MANAGER_NOTIFY_URL: 管理端回调地址 (例如: https://your-manager.workers.dev/api/payment/notify)
 *    - REDIRECT_BASE_URL: 支付成功后跳转的用户前端地址
 */

// =============================================================================
// 支付通道配置
// =============================================================================
const PAYMENT_CHANNELS = {
    'usdt.trc20': { name: 'USDT-TRC20', icon: '💎' },
    'usdt.polygon': { name: 'USDT-Polygon', icon: '🔷' },
    'usdt.arbitrum': { name: 'USDT-Arbitrum', icon: '🔶' },
    'tron.trx': { name: 'TRX', icon: '⚡' },
};

// =============================================================================
// 主入口
// =============================================================================
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;

        // CORS 预检请求
        if (request.method === 'OPTIONS') {
            return handleCORS();
        }

        // API 路由
        if (request.method === 'POST') {
            // 创建支付订单
            if (path === '/api/pay/create') {
                return await handleCreatePayment(request, env);
            }
            // BEpusdt 回调通知
            if (path === '/api/pay/notify') {
                return await handlePaymentNotify(request, env);
            }
        }

        if (request.method === 'GET') {
            // 查询订单状态
            if (path.startsWith('/api/pay/status/')) {
                const tradeId = path.split('/').pop();
                return await handleQueryStatus(tradeId, env);
            }
            // 支付成功跳转
            if (path === '/api/pay/return') {
                return await handlePaymentReturn(request, env);
            }
        }

        return new Response('Payment Gateway Running', { 
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
    }
};

// =============================================================================
// CORS 处理
// =============================================================================
function handleCORS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400'
        }
    });
}

function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8'
    };
}

// =============================================================================
// 签名算法 - BEpusdt 签名
// =============================================================================
async function generateSignature(params, token) {
    // 1. 按 key 字典序排序
    const sortedKeys = Object.keys(params).sort();
    
    // 2. 拼接 key=value
    const signStr = sortedKeys
        .filter(key => key !== 'signature' && params[key] !== undefined && params[key] !== '')
        .map(key => `${key}=${params[key]}`)
        .join('&');
    
    // 3. 拼接 token 并 MD5
    const toSign = signStr + token;
    
    // 使用 Web Crypto API 计算 MD5
    const encoder = new TextEncoder();
    const data = encoder.encode(toSign);
    const hashBuffer = await crypto.subtle.digest('MD5', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex.toLowerCase();
}

// 验证签名
async function verifySignature(params, token, signature) {
    const expectedSig = await generateSignature(params, token);
    return expectedSig === signature.toLowerCase();
}

// =============================================================================
// 创建支付订单
// =============================================================================
async function handleCreatePayment(request, env) {
    try {
        const body = await request.json();
        
        // 验证必要参数
        const { order_id, amount, trade_type, user_id } = body;
        
        if (!order_id || !amount) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: '缺少必要参数' 
            }), { status: 400, headers: corsHeaders() });
        }

        // BEpusdt API 地址和密钥
        const apiUrl = env.BEPUSDT_API_URL;
        const apiToken = env.BEPUSDT_API_TOKEN;
        
        if (!apiUrl || !apiToken) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: '支付通道未配置' 
            }), { status: 500, headers: corsHeaders() });
        }

        // 构建支付参数
        const notifyUrl = `${new URL(request.url).origin}/api/pay/notify`;
        const redirectUrl = env.REDIRECT_BASE_URL || new URL(request.url).origin;
        
        const payParams = {
            order_id: order_id,
            amount: parseFloat(amount),
            notify_url: notifyUrl,
            redirect_url: `${redirectUrl}?order_id=${order_id}`,
            trade_type: trade_type || 'usdt.trc20'
        };

        // 生成签名
        payParams.signature = await generateSignature(payParams, apiToken);

        // 调用 BEpusdt 创建订单
        const response = await fetch(`${apiUrl}/api/v1/order/create-transaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payParams)
        });

        const result = await response.json();

        if (result.status_code === 200) {
            // 保存本地支付记录
            await savePaymentRecord(env, {
                order_id: order_id,
                trade_id: result.data.trade_id,
                amount: amount,
                actual_amount: result.data.actual_amount,
                trade_type: trade_type || 'usdt.trc20',
                user_id: user_id || '',
                status: 1, // 等待支付
                payment_url: result.data.payment_url,
                token: result.data.token,
                created_at: Date.now()
            });

            return new Response(JSON.stringify({
                success: true,
                data: {
                    trade_id: result.data.trade_id,
                    order_id: result.data.order_id,
                    amount: result.data.amount,
                    actual_amount: result.data.actual_amount,
                    token: result.data.token,
                    payment_url: result.data.payment_url,
                    expiration_time: result.data.expiration_time
                }
            }), { status: 200, headers: corsHeaders() });
        } else {
            return new Response(JSON.stringify({
                success: false,
                error: result.message || '创建支付订单失败'
            }), { status: 400, headers: corsHeaders() });
        }

    } catch (error) {
        console.error('创建支付订单错误:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), { status: 500, headers: corsHeaders() });
    }
}

// =============================================================================
// 支付回调通知
// =============================================================================
async function handlePaymentNotify(request, env) {
    try {
        const body = await request.json();
        
        console.log('收到支付回调:', JSON.stringify(body));

        const { 
            trade_id, 
            order_id, 
            amount, 
            actual_amount, 
            token, 
            block_transaction_id,
            signature,
            status 
        } = body;

        // 验证签名
        const apiToken = env.BEPUSDT_API_TOKEN;
        const verifyParams = { trade_id, order_id, amount, actual_amount, token, block_transaction_id, status };
        
        const isValid = await verifySignature(verifyParams, apiToken, signature);
        if (!isValid) {
            console.error('签名验证失败');
            return new Response('签名错误', { status: 400 });
        }

        // 更新本地支付记录
        await updatePaymentRecord(env, order_id, {
            status: status,
            block_transaction_id: block_transaction_id || '',
            actual_amount: actual_amount,
            updated_at: Date.now()
        });

        // 如果支付成功，通知管理端
        if (status === 2) {
            const managerNotifyUrl = env.MANAGER_NOTIFY_URL;
            if (managerNotifyUrl) {
                try {
                    await fetch(managerNotifyUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            order_id: order_id,
                            trade_id: trade_id,
                            amount: amount,
                            actual_amount: actual_amount,
                            status: status,
                            block_transaction_id: block_transaction_id
                        })
                    });
                } catch (e) {
                    console.error('通知管理端失败:', e);
                }
            }
        }

        // 返回 ok 表示回调成功
        return new Response('ok', { status: 200 });

    } catch (error) {
        console.error('处理支付回调错误:', error);
        return new Response('error', { status: 500 });
    }
}

// =============================================================================
// 查询订单状态
// =============================================================================
async function handleQueryStatus(tradeId, env) {
    try {
        const record = await getPaymentRecordByTradeId(env, tradeId);
        
        if (!record) {
            return new Response(JSON.stringify({
                success: false,
                error: '订单不存在'
            }), { status: 404, headers: corsHeaders() });
        }

        return new Response(JSON.stringify({
            success: true,
            data: {
                order_id: record.order_id,
                trade_id: record.trade_id,
                status: record.status,
                amount: record.amount,
                actual_amount: record.actual_amount,
                payment_url: record.payment_url
            }
        }), { status: 200, headers: corsHeaders() });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), { status: 500, headers: corsHeaders() });
    }
}

// =============================================================================
// 支付成功跳转
// =============================================================================
async function handlePaymentReturn(request, env) {
    const url = new URL(request.url);
    const orderId = url.searchParams.get('order_id');
    
    const redirectUrl = env.REDIRECT_BASE_URL || '/';
    
    // 重定向到用户前端
    return Response.redirect(`${redirectUrl}?payment_success=1&order_id=${orderId}`, 302);
}

// =============================================================================
// 数据库操作
// =============================================================================
async function savePaymentRecord(env, record) {
    try {
        await env.DB.prepare(`
            INSERT INTO payment_records 
            (order_id, trade_id, amount, actual_amount, trade_type, user_id, status, payment_url, token, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            record.order_id,
            record.trade_id,
            record.amount,
            record.actual_amount,
            record.trade_type,
            record.user_id,
            record.status,
            record.payment_url,
            record.token,
            record.created_at
        ).run();
    } catch (e) {
        console.error('保存支付记录失败:', e);
    }
}

async function updatePaymentRecord(env, orderId, updates) {
    try {
        await env.DB.prepare(`
            UPDATE payment_records 
            SET status = ?, block_transaction_id = ?, actual_amount = ?, updated_at = ?
            WHERE order_id = ?
        `).bind(
            updates.status,
            updates.block_transaction_id,
            updates.actual_amount,
            updates.updated_at,
            orderId
        ).run();
    } catch (e) {
        console.error('更新支付记录失败:', e);
    }
}

async function getPaymentRecordByTradeId(env, tradeId) {
    try {
        const result = await env.DB.prepare(
            "SELECT * FROM payment_records WHERE trade_id = ?"
        ).bind(tradeId).first();
        return result;
    } catch (e) {
        return null;
    }
}
