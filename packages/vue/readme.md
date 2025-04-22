网络抓包的vue产物文件

```js
import { createHotContext as __vite__createHotContext } from '/@vite/client';
import.meta.hot = __vite__createHotContext('/src/App.vue');
import { defineComponent as _defineComponent } from '/node_modules/.vite/deps/vue.js?v=c9a818d9';
import { ref } from '/node_modules/.vite/deps/vue.js?v=c9a818d9';
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: 'App',
  setup(__props, { expose: __expose }) {
    __expose();
    const msg = ref('hello word');
    const __returned__ = { msg };
    Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true });
    return __returned__;
  },
});
import {
  toDisplayString as _toDisplayString,
  openBlock as _openBlock,
  createElementBlock as _createElementBlock,
} from '/node_modules/.vite/deps/vue.js?v=c9a818d9';
const _hoisted_1 = { class: 'msg' };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    _openBlock(),
    _createElementBlock(
      'h1',
      _hoisted_1,
      _toDisplayString($setup.msg),
      1,
      /* TEXT */
    )
  );
}
// 对应 css模块
import '/src/App.vue?t=1745293685998&vue&type=style&index=0&scoped=7a7a37b1&lang.css';

_sfc_main.__hmrId = '7a7a37b1';
typeof __VUE_HMR_RUNTIME__ !== 'undefined' && __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main);
import.meta.hot.on('file-changed', ({ file }) => {
  __VUE_HMR_RUNTIME__.CHANGED_FILE = file;
});
import.meta.hot.accept((mod) => {
  if (!mod) return;
  const { default: updated, _rerender_only } = mod;
  if (_rerender_only) {
    __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render);
  } else {
    __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated);
  }
});
import _export_sfc from '/@id/__x00__plugin-vue:export-helper';
export default /* @__PURE__ */ _export_sfc(_sfc_main, [
  ['render', _sfc_render],
  ['__scopeId', 'data-v-7a7a37b1'],
  ['__file', '/Users/wei/Desktop/FontTech_monoRepo/packages/my-vue-project/src/App.vue'],
]);
```

---

<!-- 构建开始前的准备操作 -->

```js
在vite执行中 优先进入了vueplugin插件中

export default defineConfig({
  plugins: [vue()],
});


function vuePlugin(rawOptions = {}) {
  const options = shallowRef({
    compiler: null,
    // 省略...
  });

  return {
    name: 'vite:vue',
    handleHotUpdate(ctx) {
      // ...
    },
    config(config) {
      // ..
    },
    configResolved(config) {
      // ..
    },
    configureServer(server) {
      // ..
    },


    async resolveId(id) {
      // ..
    },
    load(id, opt) {
      // ..
    },
服务器启动阶段: options 和 buildStart 钩子会在服务启动时被调用。
请求响应阶段: 当浏览器发起请求时，Vite 内部依次调用 resolveId、load和transform 钩子。

 #vuePlugin函数返回的对象中的buildStart、transform方法就是对应的插件钩子函数。
 vite会在对应的时候调用这些插件的钩子函数，
 比如当vite服务器启动时就会调用插件里面的buildStart等函数，
 当vite解析每个模块时就会调用transform等函数。
    buildStart() {
      const compiler = options.value.compiler = options.value.compiler || resolveCompiler(options.value.root);
      if (compiler.invalidateTypeCache) {
        options.value.devServer?.watcher.on("unlink", (file) => {
          compiler.invalidateTypeCache(file);
        });
      }
    },
    transform(code, id, opt) {
      // ..
    },
  };
}

// 处理编译器
// 在tryResolveCompiler函数中判断当前项目是否是vue3.x版本，
// 然后将vue/compiler-sfc包返回。
// 所以经过初始化后options.value.compiler的值就是vue的底层库vue/compiler-sfc，
function resolveCompiler(root) {
  const compiler = tryResolveCompiler(root) || tryResolveCompiler();
  if (!compiler) {
    throw new Error(
      `Failed to resolve vue/compiler-sfc.
@vitejs/plugin-vue requires vue (>=3.2.25) to be present in the dependency tree.`
    );
  }
  return compiler;
}
function tryResolveCompiler(root) {
  const vueMeta = tryRequire("vue/package.json", root);
  if (vueMeta && vueMeta.version.split(".")[0] >= 3) {
    return tryRequire("vue/compiler-sfc", root);
  }
}
```

<!-- vite解析每个文件的时候的时候开始执行transform -->

```js
    transform(code, id, opt) {
      const ssr = opt?.ssr === true;
      const { filename, query } = parseVueRequest(id);
      if (query.raw || query.url) {
        return;
      }
      if (!filter.value(filename) && !query.vue) {
        return;
      }
      if (!query.vue) {
        return transformMain(
          code,
          filename,
          options.value,
          this,
          ssr,
          customElementFilter.value(filename)
        );
      } else {
        const descriptor = query.src ? getSrcDescriptor(filename, query) || getTempSrcDescriptor(filename, query) : getDescriptor(filename, options.value);
        if (query.src) {
          this.addWatchFile(filename);
        }
        if (query.type === "template") {
          return transformTemplateAsModule(
            code,
            descriptor,
            options.value,
            this,
            ssr,
            customElementFilter.value(filename)
          );
        } else if (query.type === "style") {
          return transformStyle(
            code,
            descriptor,
            Number(query.index || 0),
            options.value,
            this,
            filename
          );
        }
      }
    }    transform(code, id, opt) {
      const ssr = opt?.ssr === true;
      const { filename, query } = parseVueRequest(id);
      if (query.raw || query.url) {
        return;
      }
      if (!filter.value(filename) && !query.vue) {
        return;
      }
      if (!query.vue) {
        return transformMain(
          code,
          filename,
          options.value,
          this,
          ssr,
          customElementFilter.value(filename)
        );
      } else {
        const descriptor = query.src ? getSrcDescriptor(filename, query) || getTempSrcDescriptor(filename, query) : getDescriptor(filename, options.value);
        if (query.src) {
          this.addWatchFile(filename);
        }
        if (query.type === "template") {
          return transformTemplateAsModule(
            code,
            descriptor,
            options.value,
            this,
            ssr,
            customElementFilter.value(filename)
          );
        } else if (query.type === "style") {
          return transformStyle(
            code,
            descriptor,
            Number(query.index || 0),
            options.value,
            this,
            filename
          );
        }
      }
    }
transformMain 中执行了主要的转化操作 简化后代码

async function transformMain(code, filename, options, pluginContext, ssr, customElement) {
  const prevDescriptor = getPrevDescriptor(filename);
  const { descriptor, errors } = createDescriptor(filename, code, options);
  const { code: scriptCode, map: scriptMap } = await genScriptCode(
    descriptor,
    options,
    pluginContext,
    ssr,
    customElement
  );
  const hasTemplateImport = descriptor.template && !isUseInlineTemplate(descriptor, options);
  let templateCode = "";
  let templateMap = void 0;
  if (hasTemplateImport) {
    ({ code: templateCode, map: templateMap } = await genTemplateCode(
      descriptor,
      options,
      pluginContext,
      ssr,
      customElement
    ));
  }
  const stylesCode = await genStyleCode(
    descriptor,
    pluginContext,
    customElement,
    attachedProps
  );
  const customBlocksCode = await genCustomBlockCode(descriptor, pluginContext);
  const output = [
    scriptCode,
    templateCode,
    stylesCode,
    customBlocksCode
  ];
  return {
    code: resolvedCode,
    map: resolvedMap || {
      mappings: ""
    },
    meta: {
      vite: {
        lang: descriptor.script?.lang || descriptor.scriptSetup?.lang || "js"
      }
    }
  };
}




```

## transformMain执行的主要操作

1.

```js
createDescriptor
function createDescriptor(filename, source, {
  root,
  isProduction,
  sourceMap,
  compiler,
  template,
  features
}, hmr = false) {
vite启动时调用了buildStart钩子函数，
然后将vue底层包vue/compiler-sfc赋值给options的compiler属性。
那这里的compiler.parse其实就是调用的vue/compiler-sfc包暴露出来的parse函数，

  const { descriptor, errors } = compiler.parse(source, {
    filename,
    sourceMap,
    templateParseOptions: template?.compilerOptions
  });
  const normalizedPath = normalizePath$1(path.relative(root, filename));
  const componentIdGenerator = features?.componentIdGenerator;
  if (componentIdGenerator === "filepath") {
    descriptor.id = getHash(normalizedPath);
  } else if (componentIdGenerator === "filepath-source") {
    descriptor.id = getHash(normalizedPath + source);
  } else if (typeof componentIdGenerator === "function") {
    descriptor.id = componentIdGenerator(
      normalizedPath,
      source,
      isProduction,
      getHash
    );
  } else {
    descriptor.id = getHash(normalizedPath + (isProduction ? source : ""));
  }
  (hmr ? hmrCache : cache).set(filename, descriptor);
  return { descriptor, errors };
}

调用createDescriptor 函数返回的 descriptor属性有
export interface SFCParseResult {
  descriptor: SFCDescriptor
  errors: (CompilerError | SyntaxError)[]
}

export interface SFCDescriptor {
  filename: string
  source: string
  template: SFCTemplateBlock | null
  script: SFCScriptBlock | null
  scriptSetup: SFCScriptBlock | null
  styles: SFCStyleBlock[]
  customBlocks: SFCBlock[]
  cssVars: string[]
  slotted: boolean
  shouldForceReload: (prevImports: Record<string, ImportBinding>) => boolean
}

template属性包含了App.vue文件中的   template模块code字符串  和  AST抽象语法树，
scriptSetup属性包含了App.vue文件中的  <script setup>模块的   code字符串，
styles属性包含了App.vue文件中      <style>模块中的code字符串
```

2.

```js
async function genScriptCode(descriptor, options, pluginContext, ssr, customElement) {
  let scriptCode = `const ${scriptIdentifier} = {}`;
  const script = resolveScript(descriptor, options, ssr, customElement);
  if (script) {
    scriptCode = script.content;
    map = script.map;
  }
  return {
    code: scriptCode,
    map,
  };
}
在genScriptCode函数中主要就是这行代码：
const script = resolveScript(descriptor, options, ssr, customElement);。
将第一步生成的descriptor对象作为参数传给resolveScript函数，返回值就是编译后的js代码，

resolveScript函数的代码简化后如下：
function resolveScript(descriptor, options, ssr, customElement) {
  let resolved = null;
  resolved = options.compiler.compileScript(descriptor, {
    ...options.script,
    id: descriptor.id,
    isProd: options.isProduction,
    inlineTemplate: isUseInlineTemplate(descriptor, !options.devServer),
    templateOptions: resolveTemplateCompilerOptions(descriptor, options, ssr),
    sourceMap: options.sourceMap,
    genDefaultAs: canInlineMain(descriptor, options) ? scriptIdentifier : void 0,
    customElement
  });
  return resolved;
}


其中主要步骤compileScript
export function compileScript(
  sfc: SFCDescriptor,
  options: SFCScriptCompileOptions,
): SFCScriptBlock{}

主要步骤返回的对象类型

export interface SFCScriptBlock extends SFCBlock {
  type: 'script'
  setup?: string | boolean
  bindings?: BindingMetadata
  imports?: Record<string, ImportBinding>
  scriptAst?: import('@babel/types').Statement[]
  scriptSetupAst?: import('@babel/types').Statement[]
  warnings?: string[]
  /**
   * Fully resolved dependency file paths (unix slashes) with imported types
   * used in macros, used for HMR cache busting in @vitejs/plugin-vue and
   * vue-loader.
   */
  deps?: string[]
}

export interface SFCBlock {
  type: string
  content: string
  attrs: Record<string, string | true>
  loc: SourceLocation
  map?: RawSourceMap
  lang?: string
  src?: string
}

scriptAst为编译不带setup属性的script标签生成的AST抽象语法树。
scriptSetupAst为编译带setup属性的script标签生成的AST抽象语法树，
content为vue文件中的script模块编译后生成的浏览器可执行的js代码。


```

其中同理
最终

transformMain函数中的代码执行主流程，其实就是对应了一个vue文件编译成js文件的流程。

首先调用createDescriptor函数将一个vue文件解析为一个descriptor对象。

然后以descriptor对象为参数调用genScriptCode函数，将vue文件中的<script>模块代码编译成浏览器可执行的js代码code字符串，赋值给scriptCode变量。

接着以descriptor对象为参数调用genTemplateCode函数，将vue文件中的<template>模块代码编译成render函数code字符串，赋值给templateCode变量。

然后以descriptor对象为参数调用genStyleCode函数，将vue文件中的<style>模块代码编译成了import语句code字符串，比如：import "/src/App.vue?vue&type=style&index=0&scoped=7a7a37b1&lang.css";，赋值给stylesCode变量。

然后将scriptCode、templateCode、stylesCode使用换行符\n拼接起来得到resolvedCode，这个resolvedCode就是一个vue文件编译成js文件的代码code字符串
