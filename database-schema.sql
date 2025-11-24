CREATE TABLE IF NOT EXISTS users (
    uuid TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL DEFAULT '未命名',
    expiry INTEGER,
    create_at INTEGER NOT NULL,
    enabled INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS user_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT,
    uuid TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    last_login INTEGER NOT NULL,
    FOREIGN KEY (uuid) REFERENCES users(uuid) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_accounts_username ON user_accounts(username);

CREATE INDEX IF NOT EXISTS idx_user_accounts_uuid ON user_accounts(uuid);

CREATE TABLE IF NOT EXISTS user_sessions (
    session_id TEXT PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_accounts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS subscription_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    duration_days INTEGER NOT NULL,
    price REAL NOT NULL,
    enabled INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    plan_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at INTEGER NOT NULL,
    paid_at INTEGER,
    FOREIGN KEY (user_id) REFERENCES user_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    enabled INTEGER DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

ALTER TABLE user_accounts ADD COLUMN auto_approve_version INTEGER DEFAULT 0;