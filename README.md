# 🔗 Suxia Short Link (D1 Serverless Edition)

> 一个基于 **Cloudflare Workers** + **D1 SQL Database** 构建的企业级高性能短链接系统。
>
> **无需服务器 · 每日 10 万+ 写入额度 · 毫秒级响应 · 银行级安全**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Cloudflare%20Workers-orange.svg)
![Database](https://img.shields.io/badge/database-Cloudflare%20D1-red.svg)

---

## 📖 项目介绍

Suxia Short Link 是一个完全运行在 Cloudflare 边缘网络上的短链接生成与管理系统。

与传统的 KV 版本相比，**D1 版** 利用了 Cloudflare 的原生 SQL 数据库，极大地突破了每日写入限制（从 1,000 次提升至 100,000 次），并提供了更强大的数据聚合分析能力。

### ✨ 核心特性

* **⚡️ 生产级性能**: 依托 Cloudflare 全球边缘网络，配合 `cacheTtl` 实现毫秒级跳转。
* **💾 海量存储**: 使用 D1 SQL 数据库，支持每日 **10 万行写入** 和 **500 万行读取**（免费版额度）。
* **📱 自适应 UI**: 
    * **桌面端**: 清晰的表格视图，详细展示各项数据。
    * **移动端**: 自动切换为**卡片式布局**，操作按钮大而易用，彻底告别横向滚动。
* **🛡️ 安全架构**: 后台账号密码托管于环境变量，代码零敏感信息。
* **📊 深度统计**: 
    * 记录 IP、时间、国家/城市。
    * **智能聚合**: 同一 IP 的多次访问会自动合并，点击展开查看详细时间轨迹。
* **🔧 强大后台**:
    * **即时备注**: 支持给链接添加/修改备注。
    * **一键复制**: 手机/电脑端均支持一键复制短链。
    * **内容管理**: 修改跳转目标、删除违规链接、分页查看。

---

## 🛠️ 部署教程 (Web Dashboard 版)

本项目无需本地开发环境，只需一个浏览器即可在 5 分钟内完成部署。

### 第一步：准备工作
1.  注册/登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2.  确保你有一个域名已托管在 Cloudflare。

### 第二步：创建 D1 数据库 (关键)
1.  在左侧菜单点击 **Workers & Pages** -> **D1 SQL Database**。
2.  点击 **Create**，输入数据库名称（例如 `link-db`），点击 **Create**。
3.  点击进入你刚创建的数据库，选择 **Console (控制台)** 标签。
4.  **依次**执行以下 SQL 语句（请分三次粘贴并点击 Execute，以免出错）：

    **1. 创建链接表:**
    ```sql
    CREATE TABLE IF NOT EXISTS links (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        note TEXT,
        created_at INTEGER
    );
    ```

    **2. 创建日志表:**
    ```sql
    CREATE TABLE IF NOT EXISTS visits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        link_id TEXT,
        ip TEXT,
        region TEXT,
        created_at INTEGER
    );
    ```

    **3. 创建索引:**
    ```sql
    CREATE INDEX IF NOT EXISTS idx_visits_link_id ON visits(link_id);
    ```

### 第三步：创建 Worker 服务
1.  进入 **Workers & Pages** -> **Overview**。
2.  点击 **Create Application** -> **Create Worker**。
3.  命名为 `short-link` (或你喜欢的名字)，点击 **Deploy**。

### 第四步：配置环境变量 (安全设置)
进入 Worker 的 **Settings** -> **Variables** 页面。

1.  **Environment Variables**: 点击 **Add variable**，设置后台账号密码。
    * `ADMIN_USER`: 设置你的用户名 (例如 `admin`)
    * `ADMIN_PASSWORD`: 设置你的密码 (建议开启 Encrypt 加密)

2.  **D1 Database Bindings**: 向下滚动，点击 **Add binding**。
    * **Variable name**: `DB` (**必须严格大写，否则无法运行**)
    * **D1 Database**: 选择你在第二步创建的 `link-db`。

> **⚠️ 注意**: 配置完成后，务必点击底部的 **"Save and deploy"**！

### 第五步：部署代码
1.  回到 Worker 的顶部，点击 **Code** 标签 (或右上角 **Edit code**)。
2.  清空编辑器内原有的代码。
3.  将项目提供的 `worker.js` (V25.0 D1 完整版) 代码全量粘贴进去。
4.  点击右上角 **Deploy**。

### 第六步：绑定域名
1.  点击 **Settings** -> **Triggers**。
2.  点击 **Add Custom Domain**。
3.  输入你的二级域名（例如 `link.example.com`）。
4.  等待证书生效（通常 1-2 分钟），状态变为 **Active** 即可访问。

---

## 📖 使用指南

### 🏠 前端 (用户端)
访问主页 (例如 `https://link.example.com`)：
* 输入长链接，点击生成。
* 点击 **"📄 一键复制链接"** 分享。

### ⚙️ 后台 (管理端)
访问后台 (例如 `https://link.example.com/admin`)：
1.  输入环境变量中设置的账号密码登录。
2.  **核心功能**:
    * **列表**: 默认按创建时间倒序排列，新生成的在最前面。
    * **备注**: 点击 <kbd>📝 备注</kbd> 按钮，给链接添加说明。
    * **统计**: 点击 <kbd>📉 统计</kbd>，查看详细的访客记录（按 IP 聚合显示）。
    * **复制**: 在手机端也可直接点击 <kbd>📄 复制</kbd> 按钮。

---

## 💻 API 文档 (开发者用)

### 1. 创建短链
* **URL**: `/api/create`
* **Method**: `GET`
* **Query**: `url` (需 URL Encode)
* **Response**:
    ```json
    {
      "short_id": "xyz123",
      "short_url": "[https://link.example.com/xyz123](https://link.example.com/xyz123)",
      "original_url": "[https://google.com](https://google.com)"
    }
    ```

---

## ❓ 常见问题 (Q&A)

**Q: 点击数据库 Execute 报错 "The request is malformed"?**
A: 这是 Cloudflare 控制台的 bug。请尝试一次只粘贴一条 SQL 语句（不要带注释），分三次执行即可成功。

**Q: 打开后台提示 "500 Internal Server Error"?**
A: 通常是因为没有绑定 D1 数据库。请检查 **Settings -> Variables -> D1 Database Bindings**，变量名必须是 `DB`。

**Q: 为什么统计里有的城市显示 Unknown?**
A: Cloudflare 免费版 Worker 获取 IP 地理位置的精度有限，通常国家级是准确的，城市级取决于 IP 库更新情况。

---

## 📂 项目结构

本项目采用 **单文件架构 (Single File Architecture)**，极大简化部署流程。

* **Frontend**: HTML/CSS/JS 内嵌于 Worker 代码中，利用 CDN 加速渲染。
* **Backend**: 基于 Hono 风格的原生 Fetch API 处理路由。
* **Database**: SQL 语句直接操作 D1 数据库。

---

## 📄 License

MIT License.
