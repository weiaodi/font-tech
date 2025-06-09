// 获取DOM元素
const instantFeedbackSlider = document.getElementById('instant-feedback');
const instantValue = document.getElementById('instant-value');
const asyncOperationSlider = document.getElementById('async-operation');
const asyncValue = document.getElementById('async-value');
const periodicUpdateSlider = document.getElementById('periodic-update');
const periodicValue = document.getElementById('periodic-value');
const notificationDelaySlider = document.getElementById('notification-delay');
const notificationValue = document.getElementById('notification-value');

const instantButton = document.getElementById('instant-button');
const instantFeedbackDisplay = document.getElementById('instant-feedback-display');

const asyncButton = document.getElementById('async-button');
const asyncLoading = document.getElementById('async-loading');
const asyncFeedbackDisplay = document.getElementById('async-feedback-display');

const scrollContainer = document.getElementById('scroll-container');
const notificationButton = document.getElementById('notification-button');
const notificationContainer = document.getElementById('notification-container');

// 更新延迟显示值
instantFeedbackSlider.addEventListener('input', () => {
  instantValue.textContent = `${instantFeedbackSlider.value}ms`;
});

asyncOperationSlider.addEventListener('input', () => {
  asyncValue.textContent = `${asyncOperationSlider.value}ms`;
});

periodicUpdateSlider.addEventListener('input', () => {
  periodicValue.textContent = `${periodicUpdateSlider.value}ms`;

  // 滚动延迟变化时，重新生成滚动内容以体验差异
  generateScrollContent();
});

notificationDelaySlider.addEventListener('input', () => {
  notificationValue.textContent = `${notificationDelaySlider.value}ms`;
});

// 瞬时反馈场景：按钮点击
instantButton.addEventListener('click', () => {
  const delay = parseInt(instantFeedbackSlider.value);
  instantButton.disabled = true;
  instantButton.textContent = '处理中...';

  setTimeout(() => {
    instantFeedbackDisplay.textContent = `点击响应 (延迟: ${delay}ms)`;
    instantFeedbackDisplay.classList.add('bg-green-100', 'text-green-800');

    setTimeout(() => {
      instantFeedbackDisplay.textContent = '等待点击...';
      instantFeedbackDisplay.classList.remove('bg-green-100', 'text-green-800');
      instantButton.disabled = false;
      instantButton.textContent = '点击我 (瞬时反馈)';
    }, 1000);
  }, delay);
});

// 异步操作场景：数据加载
asyncButton.addEventListener('click', () => {
  const delay = parseInt(asyncOperationSlider.value);
  asyncButton.disabled = true;
  asyncButton.textContent = '加载中...';

  asyncLoading.classList.remove('hidden');
  asyncLoading.classList.add('flex');
  asyncFeedbackDisplay.classList.add('hidden');

  setTimeout(() => {
    asyncLoading.classList.add('hidden');
    asyncLoading.classList.remove('flex');
    asyncFeedbackDisplay.classList.remove('hidden');
    asyncFeedbackDisplay.textContent = `数据加载完成 (延迟: ${delay}ms)`;

    setTimeout(() => {
      asyncButton.disabled = false;
      asyncButton.textContent = '加载数据 (异步操作)';
    }, 1000);
  }, delay);
});

// 周期性更新场景：模拟滚动内容（固定速度，不同帧率）
function generateScrollContent() {
  // 清除之前的动画
  if (window.scrollAnimationFrame) {
    cancelAnimationFrame(window.scrollAnimationFrame);
  }

  scrollContainer.innerHTML = '';
  const delay = parseInt(periodicUpdateSlider.value);
  const itemCount = 100;

  // 计算目标速度（像素/秒）
  const targetSpeed = 50; // 固定为50px/秒

  // 创建大量列表项
  for (let i = 0; i < itemCount; i++) {
    const item = document.createElement('div');
    item.className = 'p-3 mb-2 bg-gray-50 rounded-lg flex items-center';

    // 根据延迟模拟不同的渲染效果
    const smoothness = 1 - Math.min(delay / 100, 1); // 将延迟映射到0-1范围
    const opacity = 0.5 + smoothness * 0.5; // 延迟越高，透明度越低，模拟卡顿感
    const borderColor = delay < 50 ? 'border-green-200' : 'border-red-200';

    item.style.opacity = opacity;
    item.className += ` ${borderColor} border`;

    item.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3">
        ${i + 1}
      </div>
      <div>
        <div class="font-medium">列表项 ${i + 1}</div>
        <div class="text-sm text-gray-500">目标帧率: ${Math.round(1000 / delay)}fps (${delay < 50 ? '流畅' : '卡顿'})</div>
      </div>
    `;

    scrollContainer.appendChild(item);
  }

  // 记录时间戳和位置
  let lastTime = performance.now();
  let position = 0;

  // 计算每帧应该移动的距离，确保速度恒定
  function calculateDistance(deltaTime) {
    // 基于目标速度和时间差计算移动距离
    return (targetSpeed * deltaTime) / 1000; // px/ms * ms = px
  }

  // 帧率控制变量
  const targetFrameInterval = delay; // 目标帧间隔（毫秒）
  let lastFrameTime = performance.now();

  function animateScroll(timestamp) {
    // 计算时间差（毫秒）
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // 控制帧率
    if (timestamp - lastFrameTime >= targetFrameInterval) {
      // 计算这一帧应该移动的距离
      const distance = calculateDistance(timestamp - lastFrameTime);
      position += distance;
      lastFrameTime = timestamp;

      // 应用变换
      scrollContainer.style.transform = `translateY(-${position}px)`;

      // 重置滚动位置
      if (position > scrollContainer.offsetHeight - scrollContainer.parentElement.offsetHeight) {
        position = 0;
      }
    }

    // 继续动画循环
    window.scrollAnimationFrame = requestAnimationFrame(animateScroll);
  }

  // 启动滚动动画
  window.scrollAnimationFrame = requestAnimationFrame((timestamp) => {
    lastTime = timestamp;
    lastFrameTime = timestamp;
    animateScroll(timestamp);
  });
}

// 初始化滚动内容
generateScrollContent();

// 监听滑块变化，重新生成内容
periodicUpdateSlider.addEventListener('input', generateScrollContent);
// 非关键反馈场景：通知提示
notificationButton.addEventListener('click', () => {
  const delay = parseInt(notificationDelaySlider.value);
  notificationButton.disabled = true;

  setTimeout(() => {
    // 清除现有通知
    notificationContainer.innerHTML = '';

    // 创建新通知
    const notification = document.createElement('div');
    notification.className = 'notification bg-gray-800 text-white p-3 rounded-lg flex items-center justify-between';
    notification.style.width = 'fit-content';
    notification.style.margin = '0 auto';

    notification.innerHTML = `
          <div>
            <div class="font-medium">通知消息</div>
            <div class="text-sm opacity-80">此通知延迟 ${delay}ms 显示</div>
          </div>
          <button class="ml-4 text-white opacity-70 hover:opacity-100">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        `;

    // 添加关闭按钮事件
    notification.querySelector('button').addEventListener('click', () => {
      notification.style.opacity = '0';
      setTimeout(() => {
        notificationContainer.removeChild(notification);
      }, 300);
    });

    // 添加通知到容器
    notificationContainer.appendChild(notification);

    // 自动关闭通知
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notificationContainer.contains(notification)) {
          notificationContainer.removeChild(notification);
        }
        notificationButton.disabled = false;
      }, 300);
    }, 3000);
  }, delay);
});
