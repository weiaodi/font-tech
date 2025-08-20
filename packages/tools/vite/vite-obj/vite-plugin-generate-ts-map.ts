import type { Plugin } from 'vite';
import fs from 'fs/promises';
import path from 'path';

// 插件配置选项
interface GenerateTsMapOptions {
  targetDir: string; // 要遍历的目标文件夹（相对项目根目录）
  outputFile: string; // 生成的TS文件路径（相对项目根目录）
  exclude?: string[]; // 排除的文件/文件夹（如 ['.d.ts', 'test/']）
}

// 默认配置
const defaultOptions: GenerateTsMapOptions = {
  targetDir: 'src/modules', // 默认遍历 src/modules 文件夹
  outputFile: 'src/generated/files-map.ts', // 默认生成到 src/generated
  exclude: ['.d.ts', 'node_modules', 'dist'],
};

// 递归遍历文件夹，收集TS文件信息
async function traverseDir(dirPath: string, rootDir: string, exclude: string[]): Promise<Record<string, string>> {
  const fileMap: Record<string, string> = {};
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    // 处理排除规则
    const relativePath = path.relative(rootDir, fullPath);
    if (exclude.some((pattern) => relativePath.includes(pattern))) continue;

    if (entry.isDirectory()) {
      // 递归处理子文件夹
      const subDirMap = await traverseDir(fullPath, rootDir, exclude);
      Object.assign(fileMap, subDirMap);
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      // 读取TS文件内容（转义特殊字符，避免生成TS语法错误）
      const content = await fs.readFile(fullPath, 'utf-8');
      const escapedContent = content
        .replace(/'/g, "\\'") // 转义单引号
        .replace(/\n/g, '\\n') // 转义换行
        .replace(/\r/g, '\\r'); // 转义回车
      // 用相对路径作为key（如 "a/b" 对应 "src/modules/a/b.ts"）
      const key = relativePath.replace(/\.ts$/, '');
      fileMap[key] = escapedContent;
    }
  }

  return fileMap;
}

// 将扁平的路径映射转为嵌套对象结构（如 "a/b" → { a: { b: 内容 } }）
function mapToNestedObject(fileMap: Record<string, string>): object {
  const root: Record<string, any> = {};
  Object.entries(fileMap).forEach(([pathStr, content]) => {
    const pathParts = pathStr.split(path.sep); // 按系统路径分隔符拆分（如 / 或 \）
    let current = root;
    // 遍历路径片段，构建嵌套结构
    pathParts.forEach((part, index) => {
      if (index === pathParts.length - 1) {
        // 最后一个片段：赋值文件内容
        current[part] = content;
      } else {
        // 非最后一个片段：创建子对象（若不存在）
        if (!current[part]) current[part] = {};
        current = current[part];
      }
    });
  });
  return root;
}

// 生成TS文件内容（导出嵌套对象）
function generateTsContent(nestedObj: object): string {
  return `/** 自动生成：文件夹结构+TS文件内容映射（Vite打包时生成） */
export const filesMap = ${JSON.stringify(nestedObj, null, 2)} as const;
export type FilesMap = typeof filesMap;
`;
}

// 核心Vite插件
export function generateTsMap(options?: Partial<GenerateTsMapOptions>): Plugin {
  const finalOptions = { ...defaultOptions, ...options };
  // 转为绝对路径（避免相对路径混乱）
  const projectRoot = process.cwd();
  const targetDirAbs = path.resolve(projectRoot, finalOptions.targetDir);
  const outputFileAbs = path.resolve(projectRoot, finalOptions.outputFile);

  return {
    name: 'vite-plugin-generate-ts-map',
    // 打包开始时触发（开发环境启动/生产打包均会执行）
    async buildStart() {
      try {
        // 1. 检查目标文件夹是否存在
        await fs.access(targetDirAbs);
      } catch (err) {
        this.warn(`目标文件夹不存在：${finalOptions.targetDir}，跳过TS对象生成`);
        return;
      }

      try {
        // 2. 递归遍历文件夹，收集TS文件信息
        this.info(`正在遍历文件夹：${finalOptions.targetDir}`);
        const fileMap = await traverseDir(targetDirAbs, targetDirAbs, finalOptions.exclude!);

        // 3. 转换为嵌套对象结构
        const nestedObj = mapToNestedObject(fileMap);

        // 4. 创建输出目录（若不存在）
        const outputDir = path.dirname(outputFileAbs);
        await fs.mkdir(outputDir, { recursive: true });

        // 5. 生成TS文件
        const tsContent = generateTsContent(nestedObj);
        await fs.writeFile(outputFileAbs, tsContent, 'utf-8');
        this.info(`成功生成TS对象文件：${finalOptions.outputFile}`);
      } catch (err) {
        if (err instanceof Error) {
          this.error(`生成TS对象失败：${err.message}`); // 传递string类型的错误信息
        } else {
          // 处理非Error类型的异常（如字符串、数字等）
          this.error(`生成TS对象失败：未知错误 ${String(err)}`);
        }
      }
    },
    // 可选：打包完成后清理临时文件（若不需要保留）
    // async generateBundle() {
    //   await fs.unlink(outputFileAbs).catch(() => {});
    // }
  };
}
