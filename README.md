# 🔗 Suxia Short Link (Serverless Edition)

一个基于 **Cloudflare Workers** + **KV Storage** 构建的轻量级、高性能、企业级短链接系统。

无需购买服务器，利用 Cloudflare 强大的全球边缘网络，免费搭建属于你自己的短链服务。支持后台管理、访问统计、城市级定位以及密码安全保护。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Cloudflare%20Workers-orange.svg)

## ✨ 主要特性

* **⚡️ 极速访问**: 利用 Cloudflare 边缘节点缓存 (`cacheTtl`)，毫秒级跳转响应。
* **🛡️ 安全管理**: 后台管理系统使用 Cloudflare 环境变量存储账号密码，代码中不含敏感信息。
* **📊 详细统计**: 记录访问者的 IP、时间、国家以及**城市**信息。
* **📱 响应式 UI**: 内置美观的 HTML 前端，完美适配手机和电脑，包含一键复制功能。
* **🔧 完整后台**:
    * 查看所有短链列表及实时热度。
    * 修改原始跳转链接。
    * 删除失效或错误的短链。
    * 查看单个链接的详细访问报表。
* **🆔 随机 ID**: 自动生成 9 位高强度随机字母数字组合，防止碰撞。

## 🛠️ 部署指南

本项目无需本地环境，完全可以在 Cloudflare 网页控制台完成部署。

### 1. 准备工作
* 一个 Cloudflare 账号。
* 一个托管在 Cloudflare 上的域名（例如 `example.com`）。

### 2. 创建数据库 (KV Namespace)
进入 **Workers & Pages** -> **KV**，创建两个命名空间：
1.  **名称**: `URL_DB` (用于存储链接映射)
2.  **名称**: `VISIT_STATS` (用于存储访问日志)

### 3. 创建 Worker
进入 **Workers & Pages** -> **Overview** -> **Create Application** -> **Create Worker**。
* 命名为 `short-link` (或任意名称)。
* 点击 Deploy 部署初始服务。

### 4. 配置环境变量 (Settings -> Variables)
为了后台安全，请添加以下 **Environment Variables**：

| 变量名 (Key) | 说明 | 示例值 |
| :--- | :--- | :--- |
| `ADMIN_USER` | 后台登录用户名 | `admin` |
| `ADMIN_PASSWORD` | 后台登录密码 (建议点击 Encrypt 加密) | `MySecretPass123` |

### 5. 绑定数据库 (Settings -> Variables)
在 **KV Namespace Bindings** 区域，添加以下绑定（**变量名必须大写**）：

| Variable name | KV Namespace |
| :--- | :--- |
| `LINKS` | 选择 `URL_DB` |
| `STATS` | 选择 `VISIT_STATS` |

> **注意**: 修改配置后，务必点击 "Save and deploy"。

### 6. 部署代码
1.  进入 Worker 的 **Edit Code** 界面。
2.  将项目中的 `worker.js` (即 V16.0 完整版代码) 复制并覆盖编辑器中的内容。
3.  点击右上角 **Deploy**。

### 7. 绑定域名 (Settings -> Triggers)
1.  点击 **Add Custom Domain**。
2.  输入你的二级域名 (例如 `link.example.com`)。
3.  等待证书生效（通常 1-2 分钟）。

---

## 📖 使用说明

### 🏠 前端生成
访问你的域名 (例如 `https://link.example.com`)：
1.  在输入框粘贴长链接。
2.  点击 **生成短链**。
3.  点击 **一键复制** 即可使用。

### ⚙️ 后台管理
访问 `https://link.example.com/admin`：
1.  输入你在环境变量中设置的 `ADMIN_USER` 和 `ADMIN_PASSWORD`。
2.  **功能列表**:
    * **列表页**: 查看所有短链、原始链接、总访问量。
    * **📉 统计**: 点击进入详情页，查看该链接的 IP、时间、地理位置列表。
    * **修改**: 更改短链指向的目标 URL。
    * **删除**: 永久删除该短链记录。

---

## ⚙️ 配置项

在代码最上方的 `CONFIG` 对象中，你可以修改网页标题：

```javascript
const CONFIG = {
  // 网页浏览器标签显示的标题
  TITLE: "Suxia 短链服务"
};
