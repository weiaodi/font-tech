`fetch` 和 `axios` 是前端开发中用于处理 HTTP 请求的两种常用方式，它们的主要区别如下：

### 1. **API 风格**

- **fetch**：是浏览器原生的 API（从 ES6 开始支持），使用 Promise 链式调用。
  ```javascript
  fetch('https://api.example.com/data')
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));
  ```
- **axios**：是基于 Promise 的第三方库，API 设计更简洁，支持更多便捷方法。
  ```javascript
  axios
    .get('https://api.example.com/data')
    .then((response) => console.log(response.data))
    .catch((error) => console.error('Error:', error));
  ```

### 2. **错误处理**

- **fetch**：只有在网络请求失败时才会 reject（如 DNS 错误、网络中断），HTTP 状态码（如 404、500）会被视为成功响应。
  ```javascript
  fetch('https://api.example.com/data').then((response) => {
    if (!response.ok) {
      throw new Error('HTTP error ' + response.status);
    }
    return response.json();
  });
  ```
- **axios**：任何非 2xx 状态码都会触发 reject，并包含详细的错误信息。
  ```javascript
  axios.get('https://api.example.com/data').catch((error) => {
    if (error.response) {
      console.log(error.response.data); // 响应数据
      console.log(error.response.status); // HTTP 状态码
    }
  });
  ```

### 3. **请求/响应拦截**

- **fetch**：没有内置的拦截器，需要手动封装处理。
- **axios**：支持全局请求和响应拦截器，适合统一处理认证、日志等。
  ```javascript
  // 添加请求拦截器
  axios.interceptors.request.use((config) => {
    config.headers.Authorization = 'Bearer token';
    return config;
  });
  ```

### 4. **取消请求**

- **fetch**：通过 `AbortController`（ES2019 引入）取消。

  ```javascript
  const controller = new AbortController();
  fetch('https://api.example.com/data', { signal: controller.signal }).then((response) => response.json());

  // 取消请求
  controller.abort();
  ```

- **axios**：内置 `CancelToken` 机制。

  ```javascript
  const source = axios.CancelToken.source();
  axios.get('https://api.example.com/data', { cancelToken: source.token });

  // 取消请求
  source.cancel('Operation canceled by the user.');
  ```

### 5. **请求数据格式**

- **fetch**：发送 JSON 数据需要手动序列化。
  ```javascript
  fetch('https://api.example.com/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'value' }),
  });
  ```
- **axios**：自动处理 JSON 序列化和反序列化。
  ```javascript
  axios.post('https://api.example.com/data', { key: 'value' });
  ```

### 6. **上传进度**

- **fetch**：需要手动监听 `ReadableStream`（较复杂）。
- **axios**：内置进度监听。
  ```javascript
  axios.post('https://api.example.com/upload', formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(percentCompleted);
    },
  });
  ```

### 7. **浏览器兼容性**

- **fetch**：现代浏览器支持（IE 不支持，需 polyfill）。
- **axios**：兼容性更好，支持 IE 11+（依赖 Promise polyfill）。

### 8. **默认配置**

- **fetch**：没有默认配置，每次请求需手动设置。
- **axios**：支持全局默认配置。
  ```javascript
  axios.defaults.baseURL = 'https://api.example.com';
  axios.defaults.headers.common['Authorization'] = 'Bearer token';
  ```

### 总结

| 特性         | fetch                  | axios                 |
| ------------ | ---------------------- | --------------------- |
| **类型**     | 原生 API               | 第三方库              |
| **错误处理** | 需手动检查 HTTP 状态码 | 自动处理非 2xx 状态码 |
| **拦截器**   | 无                     | 支持                  |
| **取消请求** | 需使用 AbortController | 内置 CancelToken      |
| **兼容性**   | 现代浏览器             | 更好（支持 IE 11+）   |
| **进度监听** | 复杂                   | 简单                  |
| **默认配置** | 无                     | 支持                  |

**选择建议**：

- 若追求轻量且仅需基本功能，或在 Node.js 环境中使用，可选择 `fetch`。
- 若需要更完善的功能（如拦截器、进度监听、兼容性），建议使用 `axios`。
