### Cookie 中常用的设置字段及功能解析

Cookie 作为客户端存储机制，其安全性和功能性很大程度上依赖于字段配置。以下是最常用的几个设置字段及其核心作用：

#### 一、`Expires` / `Max-Age`：控制 Cookie 有效期

- **`Expires`**

  - 格式：指定具体过期日期（如 `Expires=Thu, 31 Dec 2025 23:59:59 GMT`）。
  - 特点：基于绝对时间，受客户端系统时间影响，兼容性更好（支持旧版浏览器）。

- **`Max-Age`**

  - 格式：指定过期前的秒数（如 `Max-Age=86400` 表示 24 小时后过期）。
  - 特点：基于相对时间，优先级高于 `Expires`，更推荐使用（尤其在需要动态计算过期时间时）。

- **示例对比**
  ```http
  Set-Cookie: session_id=abc123; Expires=Thu, 31 Dec 2025 23:59:59 GMT
  Set-Cookie: theme=dark; Max-Age=2592000（30天）
  ```

#### 二、`HttpOnly`：防御 XSS 攻击

- **作用**：设置后，Cookie 无法被前端 JavaScript（如 `document.cookie`）读取，仅能通过 HTTP/HTTPS 请求传递给服务器。
- **示例**
  ```http
  Set-Cookie: JSESSIONID=123; HttpOnly
  ```
- **安全意义**：防止攻击者通过 XSS 漏洞窃取 Cookie 中的敏感信息（如 Session ID）。

#### 三、`Secure`：强制 HTTPS 传输

- **作用**：设置后，Cookie 仅在 HTTPS 协议下发送，HTTP 环境中被浏览器忽略。
- **示例**
  ```http
  Set-Cookie: auth_token=xyz; Secure
  ```
- **安全意义**：避免 Cookie 在明文传输中被中间人攻击截获或篡改。

#### 四、`SameSite`：防御 CSRF 攻击

- **作用**：控制 Cookie 是否在跨站点请求中发送，有三种取值：

  1. **`Strict`**：仅在同站点请求中发送（最严格，如从 `a.com` 跳转到 `a.com` 时携带）。
  2. **`Lax`**：允许部分跨站点请求发送（如 GET 方法的链接跳转，防御大部分 CSRF 场景）。
  3. **`None`**：允许所有跨站点请求发送（需同时搭配 `Secure` 使用，否则浏览器可能拒绝）。

- **示例**
  ```http
  Set-Cookie: csrf_token=123; SameSite=Lax
  Set-Cookie: payment_info=xxx; SameSite=None; Secure
  ```
- **应用场景**：电商网站支付 Cookie 常设置 `SameSite=Strict`，普通会话 Cookie 推荐 `SameSite=Lax`。

#### 五、`Domain` / `Path`：控制 Cookie 生效范围

- **`Domain`**

  - 作用：指定 Cookie 允许被哪些域名访问（如 `Domain=.example.com` 表示子域名均可访问）。
  - 示例
    ```http
    Set-Cookie: lang=zh-CN; Domain=example.com
    ```

- **`Path`**
  - 作用：指定 Cookie 允许被哪些路径访问（如 `Path=/api` 表示仅 `/api` 路径下的请求携带）。
  - 示例
    ```http
    Set-Cookie: token=abc; Path=/admin
    ```
- **安全意义**：缩小 Cookie 生效范围，避免被无关域名或路径的请求滥用。

#### 六、`Priority` / `SameParty`：进阶配置字段

- **`Priority`**（非标准，但部分浏览器支持）

  - 作用：指定 Cookie 优先级（`High`/`Medium`/`Low`），影响浏览器对过期 Cookie 的清理策略。
  - 示例
    ```http
    Set-Cookie: important_data=123; Priority=High
    ```

- **`SameParty`**（Chrome 80+ 引入）
  - 作用：类似 `SameSite`，但基于 "Same Party" 规则（同一注册域名+子域名视为同一方），更灵活。

#### 七、常用字段组合示例

```http
Set-Cookie: auth=eyJhbGciOiJIUzI1NiJ9;
  Expires=Thu, 31 Dec 2025 23:59:59 GMT;
  Max-Age=31536000;
  HttpOnly;
  Secure;
  SameSite=Lax;
  Domain=.example.com;
  Path=/
```

以上配置表示：

- 有效期 1 年的认证 Cookie
- 禁止 JavaScript 读取，仅 HTTPS 传输
- 跨站点请求时需满足 `SameSite=Lax` 规则
- 对 `example.com` 及其所有子域名、根路径下的请求生效

#### 八、安全配置最佳实践

1. **敏感 Cookie 必选配置**：
   - 认证相关 Cookie 必须设置 `HttpOnly` + `Secure` + `SameSite=Lax/Strict`。
2. **有效期控制**：
   - 短期会话（如登录状态）使用 `Max-Age=7200`（2小时），长期 Cookie 需搭配定期刷新机制。
3. **生效范围最小化**：
   - 避免设置 `Domain=example.com` 时覆盖所有子域名，按业务需求细分 `Path`（如 `/api`/`/admin`）。
