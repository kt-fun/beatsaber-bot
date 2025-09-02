// src/mocks/napi-canvas.browser.js
// 这个文件只在 Storybook/Vite Dev 环境下被使用

/**
 * 模拟 @napi-rs/canvas 的 createCanvas 方法，但在浏览器中运行。
 * @param {number} width
 * @param {number} height
 * @returns {HTMLCanvasElement} - 返回一个真实的浏览器 <canvas> 元素
 */
export function createCanvas(width, height) {
  // 在浏览器中，我们直接创建一个内存中的 <canvas> 元素
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  // 为了在 Storybook 中更明确地看到这是 Mock，我们可以给它加点料
  // const originalGetContext = canvas.getContext.bind(canvas);
  // canvas.getContext = (type, attrs) => {
  //   if (type === '2d') {
  //     const ctx = originalGetContext(type, attrs);
  //     // 添加一个水印，表明这是模拟环境
  //     ctx.save();
  //     ctx.font = '12px monospace';
  //     ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  //     ctx.fillText('[Browser Mock]', 5, 15);
  //     ctx.restore();
  //     return ctx;
  //   }
  //   return originalGetContext(type, attrs);
  // };

  return canvas;
}

// 按需模拟其他需要的 API
// export class Image { ... }
