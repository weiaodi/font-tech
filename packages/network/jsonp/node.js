const http = require('http');

const server = http.createServer((req, res) => {
  // 获取请求的 URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  // 获取回调函数名
  const callback = url.searchParams.get('callback');
  // 模拟返回的数据
  const data = {
    message: '这是一个跨域请求返回的数据',
    status: 'success',
  };
  // 将数据转换为 JSON 字符串
  const jsonData = JSON.stringify(data);
  // 构建 JSONP 响应
  const response = `${callback}(${jsonData})`;

  // 设置响应头
  res.writeHead(200, { 'Content-Type': 'application/javascript' });
  // 发送响应
  res.end(response);
});

const port = 3333;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
