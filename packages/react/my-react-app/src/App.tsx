import { Tldraw } from 'tldraw';
import type { CustomEmbedDefinition } from 'tldraw';
import 'tldraw/tldraw.css';
// 仅定义掘金文章的嵌入规则（核心配置）
const juejinEmbed: CustomEmbedDefinition = {
  type: 'juejin-post', // 唯一标识：掘金文章嵌入类型
  title: '掘金文章', // 嵌入弹窗中显示的名称（用户可识别）
  hostnames: ['juejin.cn'], // 锁定域名：仅处理掘金链接
  minWidth: 800, // 嵌入框最小宽度（防止过小导致内容错乱）
  minHeight: 600, // 嵌入框最小高度（适配文章基本阅读）
  width: 800, // 默认宽度（匹配掘金文章阅读体验）
  height: 600, // 默认高度（容纳大部分文章内容，减少滚动）
  doesResize: true, // 允许用户拖拽调整嵌入框大小
  // 普通掘金链接 → 嵌入链接（掘金支持原链接直接嵌入，无需修改）
  toEmbedUrl: (url) => {
    const urlObj = new URL(url);
    // 精准匹配掘金文章路径：/post/纯数字ID（如 /post/7257708221360111675）
    const isJuejinPost = urlObj.pathname.match(/^\/post\/(\d+)$/);
    if (isJuejinPost) {
      return url; // 直接返回原链接（掘金支持原链接嵌入）
    }
  },
  // 嵌入链接 → 普通链接（反向转换，直接返回原链接即可）
  fromEmbedUrl: (url) => {
    const urlObj = new URL(url);
    if (urlObj.pathname.match(/^\/post\/(\d+)$/)) {
      return url;
    }
  },
  // 嵌入弹窗中显示的掘金官方图标（清晰识别）
  icon: 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png',
};

// 仅传入掘金嵌入规则（无其他无关规则）
const embeds = [juejinEmbed];

export default function JuejinOnlyEmbed() {
  return (
    // 固定定位确保白板占满屏幕
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw embeds={embeds} />
    </div>
  );
}
