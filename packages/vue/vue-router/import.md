在 HTML 中，`<script src="./hash.js"></script>` 这种引入外部 JavaScript 文件的方式有多种，下面为你详细介绍：

### 1. 常规引入

这是最常见的引入方式，将 `<script>` 标签放置在 HTML 文件的 `<head>` 或 `<body>` 中。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- 在 head 中引入 -->
    <script src="./hash.js"></script>
    <title>Document</title>
  </head>
  <body>
    <!-- 也可以在 body 中引入 -->
    <!-- <script src="./hash.js"></script> -->
  </body>
</html>
```

- **在 `<head>` 中引入**：HTML 解析到 `<script>` 标签时，会暂停解析，先下载并执行 JavaScript 文件，然后再继续解析 HTML。这种方式可能会导致页面渲染延迟，尤其是 JavaScript 文件较大时。
- **在 `<body>` 底部引入**：HTML 会先完成页面结构的解析和渲染，再下载并执行 JavaScript 文件，这样可以避免页面渲染延迟，提升用户体验。

### 2. 使用 `defer` 属性

`defer` 属性只适用于外部脚本文件，它告诉浏览器在 HTML 解析完成后再下载并执行脚本。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="./hash.js" defer></script>
    <title>Document</title>
  </head>
  <body></body>
</html>
```

- 脚本会在 HTML 解析完成后、`DOMContentLoaded` 事件触发前按照它们在文档中出现的顺序执行。
- 适用于需要操作 DOM 元素的脚本，确保在脚本执行时 DOM 已经准备好。

### 3. 使用 `async` 属性

`async` 属性同样只适用于外部脚本文件，它使脚本的下载和执行异步进行。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="./hash.js" async></script>
    <title>Document</title>
  </head>
  <body></body>
</html>
```

- 脚本会在下载完成后立即执行，不会等待 HTML 解析完成，也不会保证脚本按照它们在文档中出现的顺序执行。
- 适用于那些不需要依赖 DOM 元素且不影响页面渲染的脚本，如统计脚本、广告脚本等。

### 4. 动态创建 `<script>` 标签

可以使用 JavaScript 动态创建 `<script>` 标签并添加到文档中。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script>
      const script = document.createElement('script');
      script.src = './hash.js';
      document.head.appendChild(script);
    </script>
  </body>
</html>
```

- 这种方式可以在运行时根据条件动态加载脚本，灵活性高。
- 脚本的加载和执行也是异步的，具体行为类似于使用 `async` 属性。

### 5. 使用模块引入（ES6 模块）

如果你使用的是 ES6 模块，可以使用 `type="module"` 属性引入 JavaScript 文件。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="module" src="./hash.js"></script>
    <title>Document</title>
  </head>
  <body></body>
</html>
```

- 模块脚本默认是延迟执行的，类似于使用 `defer` 属性。
- 可以使用 `import` 和 `export` 语句进行模块化开发，增强代码的可维护性和复用性。

综上所述，引入外部 JavaScript 文件的方式各有特点，你可以根据具体需求选择合适的引入方式。
