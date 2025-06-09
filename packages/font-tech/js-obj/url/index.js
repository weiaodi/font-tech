const url = 'https://www.example.com:8080/path/to/resource?param1=value1&param2=value2#section';

try {
  const parsedUrl = new URL(url);

  console.log('协议:', parsedUrl.protocol); // 输出: https:
  console.log('主机:', parsedUrl.host); // 输出: www.example.com:8080
  console.log('主机名:', parsedUrl.hostname); // 输出: www.example.com
  console.log('端口:', parsedUrl.port); // 输出: 8080
  console.log('路径名:', parsedUrl.pathname); // 输出: /path/to/resource
  console.log('查询参数:', parsedUrl.search); // 输出: ?param1=value1&param2=value2
  console.log('哈希值:', parsedUrl.hash); // 输出: #section

  // 解析查询参数
  const searchParams = new URLSearchParams(parsedUrl.search);
  for (const [key, value] of searchParams.entries()) {
    console.log(`${key}: ${value}`);
  }
} catch (error) {
  console.error('解析 URL 时出错:', error);
}
