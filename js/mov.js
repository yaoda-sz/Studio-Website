// 模态框全局变量 (确保其他函数可以访问它们)
// ----------------------------------------------------
const modal = document.getElementById("myModal");
const modalVideo = document.getElementById("modal-video");
const closeBtn = document.querySelector(".video-close");
let currentItems = []; // 存储当前列表项
let currentIndex = -1; // 存储当前播放的索引

// ----------------------------------------------------
// 核心函数：打开和关闭
// ----------------------------------------------------

function openVideo(index) {
    if (index < 0 || index >= currentItems.length) return;
    currentIndex = index;
    const data = currentItems[index].dataset;

    // 新增：淡出当前视频，掩盖加载空白
    modalVideo.style.opacity = 0;

    // 清空现有的 source 元素
    modalVideo.innerHTML = '';

    // 根据浏览器支持创建对应的 source
    const source = document.createElement('source');
    if (supportsWebM && data.webm) {
        source.src = data.webm;
        source.type = 'video/webm';
    } else {
        source.src = data.mp4;
        source.type = 'video/mp4';
    }
    modalVideo.appendChild(source);

    // 加载新视频
    modalVideo.load();

    // 在视频数据加载完成后，淡入 + 播放
    modalVideo.addEventListener('loadeddata', () => {
        modalVideo.style.opacity = 1; // 淡入
        modalVideo.play();
    }, { once: true }); // 只监听一次

    // 重置位置（从你的原代码）
    modalVideo.style.transform = 'translate(0px, 0px)';
    modalVideo.style.transition = 'none';

    // 显示模态框（如果已显示，就保持）
    modal.style.display = "block";
    document.body.classList.add("no-scroll");
}

function closeVideo() {
    modal.style.display = "none";
    document.body.classList.remove("no-scroll");
    modalVideo.pause();
    modalVideo.innerHTML = ''; // 清空资源释放内存
}

function switchVideo(direction) {
    // direction: +1 (next) 或 -1 (prev)
    const nextIndex = (currentIndex + direction + currentItems.length) % currentItems.length;
    openVideo(nextIndex);
}

// ----------------------------------------------------
// 视频列表渲染函数 (此函数只负责渲染)
// ----------------------------------------------------

// 检测浏览器是否支持 WebM
const supportsWebM = document.createElement('video').canPlayType('video/webm') !== '';

function initializeVideoPlayer(videoData, listContainerId) {
    const videoList = document.getElementById(listContainerId);
    if (!videoList) return;

    // 异步渲染视频列表
    const renderVideoList = async () => {
        const loadingIndicator = document.getElementById('loading-indicator');
        const videoList = document.getElementById('video-list');

        try {
            const fragment = document.createDocumentFragment();

            videoData.forEach((data, index) => {
                const li = document.createElement("li");
                li.className = "mov-v";
                li.dataset.webm = data.srcWebm;
                li.dataset.mp4 = data.srcMp4;
                li.dataset.index = index;
                if (data.previewSrc) {
                    li.dataset.preview = data.previewSrc;
                }

                li.innerHTML = `
                    <div class="preview-container">
                        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" data-src="${data.previewSrc || ''}" alt="" class="video-preview-img" decoding="async">
                        <video class="video-preview-vid" loop muted playsinline preload="none" style="display:none;"></video>
                    </div>
                    <div class="video-overlay">
                        <span class="iconfont icon-play"></span>
                        <span class="video-label">${data.label}</span>
                    </div>
                `;

                fragment.appendChild(li);
            });

            videoList.appendChild(fragment);

            // 懒加载预览图：进入视口才真正设置 src
            const lazyImages = Array.from(videoList.querySelectorAll('img.video-preview-img[data-src]'));
            let activeImageLoads = 0;
            const maxConcurrentImageLoads = 8;
            const imageLoadQueue = [];

            const pumpImageQueue = () => {
                while (activeImageLoads < maxConcurrentImageLoads && imageLoadQueue.length > 0) {
                    const task = imageLoadQueue.shift();
                    if (task) task();
                }
            };

            const enqueueImageLoad = (img, imageObserver) => {
                const src = img.getAttribute('data-src');
                if (!src) {
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                    return;
                }

                imageLoadQueue.push(() => {
                    activeImageLoads++;

                    img.onload = async () => {
                        try {
                            if (img.decode) await img.decode();
                        } catch (_) { }
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                        activeImageLoads--;
                        pumpImageQueue();
                    };

                    // 预览图加载失败：降级为视频预览（不自动加载全部，只加载当前可见的）
                    img.onerror = () => {
                        const li = img.closest('.mov-v');
                        if (li) {
                            const vid = li.querySelector('video.video-preview-vid');
                            if (vid) {
                                const source = document.createElement('source');
                                if (supportsWebM && li.dataset.webm) {
                                    source.src = li.dataset.webm;
                                    source.type = 'video/webm';
                                } else {
                                    source.src = li.dataset.mp4;
                                    source.type = 'video/mp4';
                                }
                                vid.innerHTML = '';
                                vid.appendChild(source);
                                vid.style.display = '';
                                vid.play().catch(() => { });
                                img.style.display = 'none';
                            }
                        }
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                        activeImageLoads--;
                        pumpImageQueue();
                    };

                    img.src = src;
                });

                pumpImageQueue();
            };

            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const img = entry.target;
                    enqueueImageLoad(img, imageObserver);
                });
            }, { rootMargin: '1400px 0px', threshold: 0.01 });

            lazyImages.forEach(img => imageObserver.observe(img));

            // 首屏 + 下一屏：先预取一小批，减少快速滚动时的“空白迟滞感”
            lazyImages.slice(0, 24).forEach(img => enqueueImageLoad(img, imageObserver));

            // 绑定事件委托
            videoList.addEventListener('click', (e) => {
                const li = e.target.closest('.mov-v');

                if (li) {
                    // 每次点击都更新 currentItems 列表，确保数据是最新的
                    currentItems = Array.from(videoList.querySelectorAll('.mov-v'));
                    openVideo(parseInt(li.dataset.index));
                }
            });

            // 隐藏加载指示器，显示视频列表
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
            videoList.style.display = 'grid';

            // 页面加载完成后立即执行一次
            hideVideoDownloadPlugins();

        } catch (error) {
            if (loadingIndicator) {
                loadingIndicator.textContent = '加载失败，请刷新页面重试';
            }
        }
    };

    renderVideoList();
}

// 隐藏视频下载插件的函数
function hideVideoDownloadPlugins() {
    const videoContainers = document.querySelectorAll('.mov-v');

    videoContainers.forEach(container => {
        // 查找并移除可能的下载插件元素
        const potentialPlugins = container.querySelectorAll('*');

        potentialPlugins.forEach(element => {
            const className = element.className || '';
            const id = element.id || '';
            const ariaLabel = element.getAttribute('aria-label') || '';
            const title = element.getAttribute('title') || '';
            const style = element.getAttribute('style') || '';

            // 检查是否是下载插件
            const isDownloadPlugin =
                className.includes('download') ||
                className.includes('plugin') ||
                className.includes('extension') ||
                id.includes('download') ||
                ariaLabel.includes('下载') ||
                title.includes('下载') ||
                (style.includes('position: absolute') && style.includes('z-index: 9999')) ||
                (style.includes('position: fixed') && style.includes('z-index: 9999')) ||
                (style.includes('bottom:') && style.includes('right:'));

            if (isDownloadPlugin && element !== container.querySelector('.video-overlay')) {
                element.style.display = 'none';
                element.style.visibility = 'hidden';
                element.style.opacity = '0';
                element.style.pointerEvents = 'none';
            }
        });
    });
}

// 页面加载完成后立即执行一次
document.addEventListener('DOMContentLoaded', hideVideoDownloadPlugins);

// js/video.js 底部
// ----------------------------------------------------
// 3. 全局事件绑定 (包含拖拽、回弹、切换逻辑)
// ----------------------------------------------------
(function () {
    if (!modal) return;
    // 关闭按钮和背景点击
    closeBtn.onclick = closeVideo;
    modal.onclick = (e) => { if (e.target === modal) closeVideo(); };

    // 键盘事件
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') closeVideo();
            if (e.key === 'ArrowRight') switchVideo(1);
            if (e.key === 'ArrowLeft') switchVideo(-1);
        }
    });

    // --- 触摸拖拽逻辑 ---
    let startX = 0, startY = 0;
    let moveX = 0, moveY = 0;
    let isDragging = false;
    const threshold = 80; // 拖动超过80px就触发切换

    // 1. 触摸开始
    modal.addEventListener('touchstart', (e) => {
        // 【核心修改】允许点击：视频本身、模态框背景、或者透明覆盖层(.drag-overlay)
        // 只要不是点击了关闭按钮，都允许尝试拖动
        if (e.target.closest('.video-close')) return;

        // 如果你想保留严格判断，也可以写成：
        // if (e.target !== modalVideo && e.target !== modal && !e.target.classList.contains('drag-overlay')) return;

        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

        // 拖动开始时，取消过渡动画，让视频紧跟手指
        modalVideo.style.transition = 'none';
    }, { passive: true });

    // 2. 触摸移动 (视频跟随)
    modal.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;

        moveX = currentX - startX;
        moveY = currentY - startY;

        // 判断主要移动方向，只在一个轴上移动 (体验更好)
        if (Math.abs(moveX) > Math.abs(moveY)) {
            // 水平移动
            modalVideo.style.transform = `translate(${moveX}px, 0)`;
        } else {
            // 垂直移动
            modalVideo.style.transform = `translate(0, ${moveY}px)`;
        }
    }, { passive: true });

    // 3. 触摸结束 (判断切换还是回弹)
    modal.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;

        // 恢复 0.3秒 的动画过渡效果
        modalVideo.style.transition = 'transform 0.3s ease';

        // 判断水平滑动距离是否足够
        if (Math.abs(moveX) > threshold) {
            // --- 水平切换 ---
            const direction = moveX > 0 ? -1 : 1; // 左滑(MoveX<0)是Next(+1)，右滑(MoveX>0)是Prev(-1)
            finishSwipe(direction, 'x');
        }
        // 判断垂直滑动距离是否足够
        else if (Math.abs(moveY) > threshold) {
            // --- 垂直切换 ---
            const direction = moveY > 0 ? -1 : 1; // 上滑是Next，下滑是Prev
            finishSwipe(direction, 'y');
        }
        else {
            // --- 距离不够，回弹归位 ---
            modalVideo.style.transform = 'translate(0px, 0px)';
        }

        // 重置移动距离
        moveX = 0;
        moveY = 0;
    });
    // ----------------------------------------------------
    // 新增：鼠标事件（PC 端拖拽切换）
    let isDraggingMouse = false;
    let startXMouse = 0, startYMouse = 0;
    let moveXMouse = 0, moveYMouse = 0;

    const cancelMouseDrag = () => {
        if (!isDraggingMouse) return;
        isDraggingMouse = false;
        moveXMouse = 0;
        moveYMouse = 0;
        modalVideo.style.transition = 'transform 0.3s ease-out';
        modalVideo.style.transform = 'translate(0px, 0px)';
    };

    modal.addEventListener('mousedown', (e) => {
        // 新变化：排除关闭按钮，但允许在整个模态框（包括周边空白）拖拽
        if (e.target.closest('.video-close')) return; // 如果点击关闭按钮，不触发拖拽

        e.preventDefault();

        // 允许在 modal、modalVideo、drag-overlay 等任何子元素上触发（扩展到周边）
        isDraggingMouse = true;
        startXMouse = e.clientX;
        startYMouse = e.clientY;

        // 拖动开始时，取消过渡动画，让视频紧跟鼠标
        modalVideo.style.transition = 'none';

        // 新增：加个“抓手”指针反馈（可选，通过 CSS 已实现）
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDraggingMouse) return;

        const currentX = e.clientX;
        const currentY = e.clientY;

        moveXMouse = currentX - startXMouse;
        moveYMouse = currentY - startYMouse;

        // 判断主要移动方向，只在一个轴上移动（左右优先于上下）
        if (Math.abs(moveXMouse) > Math.abs(moveYMouse)) {
            // 水平移动（左右拖拽切换）
            modalVideo.style.transform = `translate(${moveXMouse}px, 0)`;
        } else {
            // 垂直移动（上下拖拽切换）
            modalVideo.style.transform = `translate(0, ${moveYMouse}px)`;
        }
    }, { passive: true });

    document.addEventListener('mouseup', (e) => {
        if (!isDraggingMouse) return;
        isDraggingMouse = false;

        // 恢复动画过渡
        modalVideo.style.transition = 'transform 0.3s ease-out'; // 加 ease-out，更顺滑

        // 判断水平滑动距离（左右拖拽）
        if (Math.abs(moveXMouse) > threshold) {
            const direction = moveXMouse > 0 ? -1 : 1; // 右拖（>0）: prev (-1), 左拖(<0): next (1)
            finishSwipe(direction, 'x');
        }
        // 判断垂直滑动距离（上下拖拽）
        else if (Math.abs(moveYMouse) > threshold) {
            const direction = moveYMouse > 0 ? -1 : 1; // 下拖（>0）: prev (-1), 上拖(<0): next (1)
            finishSwipe(direction, 'y');
        }
        else {
            // 距离不够，回弹到原位
            modalVideo.style.transform = 'translate(0px, 0px)';
        }

        // 重置移动距离
        moveXMouse = 0;
        moveYMouse = 0;
    });

    modal.addEventListener('dblclick', cancelMouseDrag);
    window.addEventListener('blur', cancelMouseDrag);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') cancelMouseDrag();
    });
    document.addEventListener('mouseleave', cancelMouseDrag);

    // finishSwipe 函数（保持不变，或微调动画时间）
    function finishSwipe(direction, axis) {
        const endX = axis === 'x' ? (direction === 1 ? -window.innerWidth : window.innerWidth) : 0;
        const endY = axis === 'y' ? (direction === 1 ? -window.innerHeight : window.innerHeight) : 0;

        modalVideo.style.transform = `translate(${endX}px, ${endY}px)`;

        setTimeout(() => {
            switchVideo(direction);
        }, 200); // 缩短到200ms，让滑动更快连上新视频
    }
})();