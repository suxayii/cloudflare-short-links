# 🔗 Short Link (Serverless Edition)

> 一个基于 **Cloudflare Workers** + **KV Storage** 构建的企业级短链接系统。
> 
> **无需服务器 · 永久免费 · 毫秒级响应 · 银行级安全**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Cloudflare%20Workers-orange.svg)
![Status](https://img.shields.io/badge/status-stable-green.svg)

---

## ✨ 核心亮点

* **⚡️ 全球加速**: 依托 Cloudflare 边缘网络，利用 `cacheTtl` 实现毫秒级跳转。
* **🛡️ 安全架构**: 账号密码托管于 Cloudflare 环境变量 (Env Vars)，代码零敏感信息。
* **📊 深度统计**: 精准记录访问者 IP、时间、国家及**城市**，并在后台可视化展示。
* **📱 极致体验**: 响应式 UI 设计，完美适配移动端与桌面端，支持一键复制。
* **🔧 强大后台**:
    * **数据总览**: 查看所有链接的热度排行。
    * **内容管理**: 支持修改原始链接指向、删除违规链接。
    * **报表分析**: 单个链接的详细访问日志（精确到秒）。
* **🆔 智能防撞**: 9 位高强度随机 ID 算法，支撑海量数据无碰撞。

---

## 🚀 部署教程 (从零开始)

本项目无需任何本地开发环境，只需一个浏览器即可完成部署。

### 第一步：准备工作
1.  注册/登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2.  确保你有一个域名已托管在 Cloudflare（例如 `example.com`）。

### 第二步：创建 KV 数据库
> KV (Key-Value) 是 Cloudflare 的全球分布式数据库，用于存储链接关系和统计数据。

1.  在左侧菜单点击 **Workers & Pages** -> **KV**。
2.  点击 **Create a Namespace**，分别创建两个数据库：
    * **数据库 1**: 名称填写 `URL_DB` (用于存链接)
    * **数据库 2**: 名称填写 `VISIT_STATS` (用于存日志)

### 第三步：创建 Worker 服务
1.  进入 **Workers & Pages** -> **Overview**。
2.  点击 **Create Application** -> **Create Worker**。
3.  命名为 `short-link` (或你喜欢的名字)，点击 **Deploy**。

### 第四步：配置安全与数据库 (关键) 🔒

进入你刚创建的 Worker 的 **Settings (设置)** -> **Variables (变量)** 页面。

#### 1. 设置环境变量 (Environment Variables)
点击 **Add variable**，设置后台登录账号。**建议点击 Encrypt 按钮加密存储**。

| Variable name (变量名) | Value (值) | 说明 |
| :--- | :--- | :--- |
| `ADMIN_USER` | `admin` | 后台登录用户名 |
| `ADMIN_PASSWORD` | `your_password` | 后台登录密码 |

#### 2. 绑定数据库 (KV Namespace Bindings)
向下滚动到 **KV Namespace Bindings**，点击 **Add binding**。
**⚠️ 注意：变量名必须严格大写，否则程序无法运行！**

| Variable name (变量名) | KV Namespace (对应数据库) |
| :--- | :--- |
| `LINKS` | 选择你刚才创建的 `URL_DB` |
| `STATS` | 选择你刚才创建的 `VISIT_STATS` |

> **完成后，务必点击页面底部的 "Save and deploy"！**

### 第五步：写入代码
1.  回到 Worker 的顶部，点击 **Code** 标签（或右上角 **Edit code**）。
2.  将项目提供的 `worker.js` (V16.0 完整版) 代码全部复制。
3.  清空编辑器原有内容，粘贴新代码。
4.  点击右上角 **Deploy**。

### 第六步：绑定域名
1.  点击 **Settings** -> **Triggers**。
2.  点击 **Add Custom Domain**。
3.  输入你的二级域名（例如 `link.example.com`）。
4.  等待证书生效（通常 1-2 分钟），状态变为 **Active** 即可访问。

---

## 📖 使用指南

### 🟢 普通用户
访问主页 (例如 `https://link.example.com`)：
1.  输入长链接 (必须包含 `http://` 或 `https://`)。
2.  点击 **生成短链**。
3.  点击 **一键复制** 分享给他人。

### 🔴 管理员后台
访问后台 (例如 `https://link.example.com/admin`)：
1.  输入在环境变量中设置的 `ADMIN_USER` 和 `ADMIN_PASSWORD`。
2.  **管理功能**：
    * **列表**: 查看所有短链及总访问量。
    * **统计**: 点击 <kbd>📉 统计</kbd> 按钮，查看该链接的详细访问报表 (IP/城市/时间)。
    * **修改**: 链接填错了？点击 <kbd>修改</kbd> 随时更正跳转目标。
    * **删除**: 点击 <kbd>删除</kbd> 彻底移除该记录。

---

## ❓ 常见问题 (Troubleshooting)

**Q: 打开后台显示 "500 Internal Server Error"？**
> **A:** 通常是因为没有配置环境变量。请检查 **Settings -> Variables** 中是否正确添加了 `ADMIN_USER` 和 `ADMIN_PASSWORD`。

**Q: 生成链接时提示 "Network Error" 或后台列表为空？**
> **A:** 通常是因为数据库未绑定或绑定名称错误。请检查 **KV Namespace Bindings** 中变量名是否严格为 `LINKS` 和 `STATS` (全大写)。

**Q: 修改了后台密码，为什么还能直接登录？**
> **A:** 浏览器可能缓存了旧凭证。点击后台右上角的 **"退出"** 按钮，或者清除浏览器缓存后重试。

**Q: 统计里的城市显示 "Unknown"？**
> **A:** Cloudflare 免费版 Worker 对某些 IP 的地理位置解析可能不完整，这是正常现象。国家级定位通常是准确的。

---

## 💻 开发者 API 文档

如果你想将短链功能集成到自己的程序中，可以直接调用以下接口：

### 1. 生成短链
* **URL**: `/api/create`
* **Method**: `GET`
* **Params**: `url` (需要 URL Encode)
* **Response**:
    ```json
    {
      "short_id": "a1b2c3d4e",
      "short_url": "[https://link.example.com/a1b2c3d4e](https://link.example.com/a1b2c3d4e)",
      "original_url": "[https://google.com](https://google.com)"
    }
    ```

### 2. 获取统计 (需鉴权)
* **URL**: `/api/admin/list`
* **Method**: `GET`
* **Params**: `u` (用户名), `p` (密码), `cursor` (分页游标)

---

## 📄 License

MIT License. Feel free to use and modify.
