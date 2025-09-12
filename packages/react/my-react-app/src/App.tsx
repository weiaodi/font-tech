import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';

export default function JuejinOnlyEmbed() {
  return (
    // 固定定位确保白板占满屏幕
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw />
    </div>
  );
}
