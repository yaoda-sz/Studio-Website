// 模态框全局变量 (确保其他函数可以访问它们)
// ----------------------------------------------------
const modal = document.getElementById("myModal");
const modalVideo = document.getElementById("modal-video");
const closeBtn = document.querySelector(".video-close");
let currentItems = []; // 存储当前列表项
let currentIndex = -1; // 存储当前播放的索引

// 图片缓存机制 - 避免重复加载
const imageCache = new Map(); // 存储已加载的图片对象

// 懒加载观察器
let lazyLoadObserver;

function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        lazyLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;

                    if (src) {
                        // 检查缓存中是否已有该图片
                        if (imageCache.has(src)) {
                            // 使用缓存的图片
                            img.src = src;
                            img.style.opacity = '1';
                            observer.unobserve(img);
                            return;
                        }

                        // 添加加载状态
                        img.style.opacity = '0.5';
                        img.style.transition = 'opacity 0.3s';

                        // 创建新的图片对象进行预加载并缓存
                        const newImg = new Image();
                        newImg.onload = () => {
                            // 缓存已加载的图片
                            imageCache.set(src, newImg);
                            img.src = src;
                            img.style.opacity = '1';
                            observer.unobserve(img);
                        };
                        newImg.onerror = () => {
                            // 加载失败时显示占位图
                            img.src = './img/video-placeholder.webp';
                            img.style.opacity = '1';
                            console.warn('图片加载失败:', src);
                            observer.unobserve(img);
                        };
                        newImg.src = src;
                    }
                }
            });
        }, {
            rootMargin: '200px', // 提前200px开始加载，给用户更好的体验
            threshold: 0.01      // 只要1%可见就开始加载
        });
    }
}

// 初始化懒加载
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// 预加载首屏动图
function preloadAboveFoldImages() {
    setTimeout(() => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const viewportHeight = window.innerHeight;

        // 预加载首屏可见的图片
        lazyImages.forEach((img, index) => {
            if (index < 6) { // 预加载前6张图片
                const rect = img.getBoundingClientRect();
                if (rect.top < viewportHeight + 200) {
                    const src = img.dataset.src;
                    if (src) {
                        // 检查缓存中是否已有该图片
                        if (imageCache.has(src)) {
                            img.src = src;
                            img.style.opacity = '1';
                            if (lazyLoadObserver) {
                                lazyLoadObserver.unobserve(img);
                            }
                            return;
                        }

                        const newImg = new Image();
                        newImg.onload = () => {
                            // 缓存已加载的图片
                            imageCache.set(src, newImg);
                            img.src = src;
                            img.style.opacity = '1';
                            if (lazyLoadObserver) {
                                lazyLoadObserver.unobserve(img);
                            }
                        };
                        newImg.onerror = () => {
                            img.src = './img/video-placeholder.webp';
                            img.style.opacity = '1';
                        };
                        newImg.src = src;
                    }
                }
            }
        });
    }, 500); // 延迟500ms执行，避免阻塞页面渲染
}

// 页面加载完成后预加载首屏图片
window.addEventListener('load', preloadAboveFoldImages);

// ----------------------------------------------------
// 核心函数：打开和关闭
// ----------------------------------------------------

function openVideo(index) {
    if (index < 0 || index >= currentItems.length) return;
    currentIndex = index;
    const data = currentItems[index].dataset;

    // 确保数据完整性
    if (!data.label) {
        console.warn('缺少label数据，dataset:', data);
    }

    console.log('打开视频，数据:', data);

    // 停止所有B站视频并恢复封面
    const bilibiliIframes = document.querySelectorAll('iframe[src*="player.bilibili.com"]');
    bilibiliIframes.forEach(iframe => {
        const videoLazyLoad = iframe.parentElement;
        if (videoLazyLoad) {
            const bvid = videoLazyLoad.dataset.bvid;
            const cid = videoLazyLoad.dataset.cid;
            if (bvid && cid) {
                // 根据不同的bvid恢复对应的封面
                let coverSrc = './img/bolikuanhu_cover.webp'; // 默认封面
                let altText = '视频封面';

                if (bvid === 'BV1Mfbzz7E8P') {
                    coverSrc = './img/bolikuanhu_cover.webp';
                    altText = '波粒狂潮视频封面';
                } else if (bvid === 'BV1foXxY5END') {
                    coverSrc = './img/shenmojue.jpg';
                    altText = '神魔诀视频封面';
                } else if (bvid === 'BV11L9BYREaB') {
                    coverSrc = './img/bigbird.jpg';
                    altText = '魔法玩具树屋视频封面';
                } else if (bvid === 'BV1bEatzdEUh') {
                    coverSrc = './img/yingyufei.jpg';
                    altText = '银与绯视频封面';
                }

                videoLazyLoad.innerHTML = `
                    <img src="${coverSrc}" alt="${altText}" class="video-poster">
                    <div class="play-icon">
                        <span class="iconfont icon-play"></span>
                    </div>
                `;
                videoLazyLoad.classList.add('video-lazy-load');
            }
        }
    });

    // 新增：淡出当前视频，掩盖加载空白
    modalVideo.style.opacity = 0;

    // 检查是否使用在线视频链接
    if (data.videoUrl) {
        console.log('显示图片:', data.videoUrl);
        // 直接使用 img 标签显示 WebP 动图

        // 隐藏 video 元素
        modalVideo.style.display = 'none';

        // 清理之前可能存在的 img 元素
        const modalContent = modalVideo.parentNode;
        const existingImg = modalContent.querySelector('img');
        if (existingImg) {
            existingImg.remove();
        }

        // 创建新的 img 元素
        const img = document.createElement('img');
        img.style.maxWidth = '95vw';
        img.style.maxHeight = '95vh';
        img.style.width = 'auto';
        img.style.height = 'auto';
        img.style.objectFit = 'contain';
        img.style.display = 'block'; // 确保显示
        img.style.position = 'relative'; // 确保定位正确
        img.style.zIndex = '10'; // 确保在最上层
        img.alt = data.label;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s';

        // 检查缓存中是否已有该图片
        if (imageCache.has(data.videoUrl)) {
            // 使用缓存的图片，立即显示
            img.src = data.videoUrl;
            img.style.opacity = '1';
            console.log('使用缓存图片:', data.videoUrl);
        } else {
            // 添加加载处理
            img.onload = () => {
                // 缓存已加载的图片
                imageCache.set(data.videoUrl, img);
                img.style.opacity = '1';
                console.log('图片已缓存:', data.videoUrl);
            };

            img.onerror = () => {
                img.src = './img/video-placeholder.webp';
                img.style.opacity = '1';
                console.warn('弹框图片加载失败:', data.videoUrl);
            };

            img.src = data.videoUrl;
        }
        modalVideo.parentNode.appendChild(img);
        console.log('图片已添加到DOM，src:', img.src);

        // 预加载相邻的图片（提升切换体验）
        preloadAdjacentImages(currentIndex);

        // 显示模态框
        modal.style.display = "block";
        document.body.classList.add("no-scroll");
        console.log('模态框已显示');
    } else {
        // 使用传统的 MP4/WebM 格式（向后兼容）
        // 清除之前的src属性
        modalVideo.src = '';

        // 显示 video 元素
        modalVideo.style.display = 'block';

        let src1 = modalVideo.querySelector('source[type="video/webm"]');
        let src2 = modalVideo.querySelector('source[type="video/mp4"]');

        // 如果没有 source，先创建（只执行一次）
        if (!src1 || !src2) {
            src1 = document.createElement('source');
            src1.type = 'video/webm';
            src2 = document.createElement('source');
            src2.type = 'video/mp4';
            modalVideo.appendChild(src1);
            modalVideo.appendChild(src2);
        }

        src1.src = data.srcWebm;
        src2.src = data.srcMp4;

        // 加载新视频
        modalVideo.load();

        // 添加错误处理
        modalVideo.addEventListener('error', (e) => {
            console.error('视频加载失败:', data.label);
        }, { once: true });

        // 在视频数据加载完成后，淡入 + 播放
        modalVideo.addEventListener('loadeddata', () => {
            modalVideo.style.opacity = 1; // 淡入
            modalVideo.play().catch(e => console.error('视频播放失败:', e));
        }, { once: true });
    }
    // 显示模态框（如果已显示，就保持）
    modal.style.display = "block";
    document.body.classList.add("no-scroll");

    // 重置 modal-content 位置
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        // 重置为居中位置
        modalContent.style.transform = 'translate(-50%, -50%)';
        modalContent.style.transition = 'none';
    }
}

function closeVideo() {
    modal.style.display = "none";
    document.body.classList.remove("no-scroll");
    modalVideo.pause();

    // 清理动态创建的img元素
    const modalContent = modalVideo.parentNode;
    const existingImg = modalContent.querySelector('img');
    if (existingImg) {
        existingImg.remove();
    }

    // 重置video元素
    modalVideo.innerHTML = '';
    modalVideo.src = '';
    modalVideo.style.display = 'block';
}

function switchVideo(direction) {
    // direction: +1 (next) 或 -1 (prev)
    const nextIndex = (currentIndex + direction + currentItems.length) % currentItems.length;
    openVideo(nextIndex);
}

// ----------------------------------------------------
// 视频列表渲染函数 (此函数只负责渲染)
// ----------------------------------------------------

function initializeVideoPlayer(videoData, listContainerId) {
    const videoList = document.getElementById(listContainerId);
    if (!videoList) {
        console.error('找不到视频列表容器:', listContainerId);
        return;
    }

    const fragment = document.createDocumentFragment();
    const batchSize = 12;
    let renderedCount = 0;
    let isLoadingMore = false;

    function renderItems(items, startIndex, targetFragment, useStaticPreview) {
        items.forEach((data, index) => {
            const li = document.createElement("li");
            li.className = "mov-v";
            li.dataset.webm = data.srcWebm || '';
            li.dataset.mp4 = data.srcMp4 || '';
            li.dataset.videoUrl = data.previewSrc || '';
            li.dataset.label = data.label || '';
            li.dataset.index = startIndex + index;

            let contentHTML = '';
            if (data.previewSrc) {
                const staticFlag = useStaticPreview ? 'data-static="1"' : '';
                contentHTML = `
            <img ${staticFlag} data-src="${data.previewSrc}" src="./img/video-placeholder.webp" alt="${data.label} 预览图" class="video-preview-img" loading="lazy">
        `;
            } else {
                contentHTML = `
                <video class="video-preview-vid" loop muted playsinline preload="none">
                    <source src="${data.srcWebm}" type="video/webm">
                    <source src="${data.srcMp4}" type="video/mp4">
                </video>
            `;
            }

            li.innerHTML = `
           ${contentHTML}
            <div class="video-overlay">
                <span class="iconfont icon-play"></span>
                <span class="video-label">${data.label}</span>
            </div>
        `;
            targetFragment.appendChild(li);
        });
    }

    function attachLazyObserver() {
        if (!lazyLoadObserver) return;
        const lazyImages = videoList.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => lazyLoadObserver.observe(img));
    }

    function renderNextBatch() {
        if (isLoadingMore || renderedCount >= videoData.length) return;
        isLoadingMore = true;

        const nextItems = videoData.slice(renderedCount, renderedCount + batchSize);
        const batchFragment = document.createDocumentFragment();
        renderItems(nextItems, renderedCount, batchFragment, renderedCount === 0);
        videoList.appendChild(batchFragment);
        renderedCount += nextItems.length;
        attachLazyObserver();
        isLoadingMore = false;
    }

    renderNextBatch();

    // 滚动分页触发器
    const sentinel = document.createElement('div');
    sentinel.className = 'video-sentinel';
    videoList.parentNode.appendChild(sentinel);

    if ('IntersectionObserver' in window) {
        const pagerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    renderNextBatch();
                }
            });
        }, { rootMargin: '300px', threshold: 0.01 });
        pagerObserver.observe(sentinel);
    }

    // 绑定事件委托
    videoList.addEventListener('click', (e) => {
        const li = e.target.closest('.mov-v');
        if (li) {
            // 每次点击都更新 currentItems 列表，确保数据是最新的
            currentItems = Array.from(videoList.querySelectorAll('.mov-v'));
            openVideo(parseInt(li.dataset.index));
        }
    });
}

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
        // 【核心修改】允许点击：视频本身、模态框背景，或者透明覆盖层(.drag-overlay)
        // 只要不是点击了关闭按钮，都允许尝试拖拽
        if (e.target.closest('.video-close')) return;

        // 如果你想保留严格判断，也可以写成：
        // if (e.target !== modalVideo && e.target !== modal && !e.target.classList.contains('drag-overlay')) return;

        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

        // 拖动开始时，取消过渡动画，让视频紧跟手指
        // 使用 modal-content 而不是 modalVideo，因为 video 可能被隐藏
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transition = 'none';
        }
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
            // 水平移动 - 保持原有的居中偏移
            const modalContent = document.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = `translate(calc(-50% + ${moveX}px), -50%)`;
            }
        } else {
            // 垂直移动 - 保持原有的居中偏移
            const modalContent = document.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = `translate(-50%, calc(-50% + ${moveY}px))`;
            }
        }
    }, { passive: true });

    // 3. 触摸结束 (判断切换还是回弹)
    modal.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;

        // 恢复 0.3秒 的动画过渡效果
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transition = 'transform 0.3s ease';
        }

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
            const modalContent = document.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'translate(-50%, -50%)';
            }
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

    modal.addEventListener('mousedown', (e) => {
        // 新变化：排除关闭按钮，但允许在整个模态框（包括周边空白）拖拽
        if (e.target.closest('.video-close')) return; // 如果点击关闭按钮，不触发拖拽

        // 允许在 modal、modalVideo、drag-overlay 等任何子元素上触发（扩展到周边）
        isDraggingMouse = true;
        startXMouse = e.clientX;
        startYMouse = e.clientY;

        // 拖动开始时，取消过渡动画，让视频紧跟鼠标
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transition = 'none';
        }

        // 新增：加个"抓手"指针反馈（可选，通过 CSS 已实现）
    }, { passive: true });

    document.addEventListener('mousemove', (e) => {
        if (!isDraggingMouse) return;

        const currentX = e.clientX;
        const currentY = e.clientY;

        moveXMouse = currentX - startXMouse;
        moveYMouse = currentY - startYMouse;

        // 判断主要移动方向，只在一个轴上移动（左右优先于上下）
        if (Math.abs(moveXMouse) > Math.abs(moveYMouse)) {
            // 水平移动（左右拖拽切换）- 保持原有的居中偏移
            const modalContent = document.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = `translate(calc(-50% + ${moveXMouse}px), -50%)`;
            }
        } else {
            // 垂直移动（上下拖拽切换）- 保持原有的居中偏移
            const modalContent = document.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = `translate(-50%, calc(-50% + ${moveYMouse}px))`;
            }
        }
    }, { passive: true });

    document.addEventListener('mouseup', (e) => {
        if (!isDraggingMouse) return;
        isDraggingMouse = false;

        // 恢复动画过渡
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transition = 'transform 0.3s ease-out'; // 加 ease-out，更顺滑
        }

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
            const modalContent = document.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'translate(-50%, -50%)';
            }
        }

        // 重置移动距离
        moveXMouse = 0;
        moveYMouse = 0;
    });

    // finishSwipe 函数（保持不变，或微调动画时间）
    function finishSwipe(direction, axis) {
        const endX = axis === 'x' ? (direction === 1 ? -window.innerWidth : window.innerWidth) : 0;
        const endY = axis === 'y' ? (direction === 1 ? -window.innerHeight : window.innerHeight) : 0;

        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            // 保持居中偏移，避免位置偏移
            modalContent.style.transform = `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px))`;
        }

        setTimeout(() => {
            switchVideo(direction);
        }, 200); // 缩短到200ms，让滑动更快连上新视频
    }

})();

// 预加载相邻图片的函数
function preloadAdjacentImages(currentIndex) {
    if (!currentItems || currentItems.length === 0) return;

    // 预加载前一张和后一张图片
    const prevIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
    const nextIndex = (currentIndex + 1) % currentItems.length;

    [prevIndex, nextIndex].forEach(index => {
        const item = currentItems[index];
        const videoUrl = item.dataset.videoUrl;

        if (videoUrl && !imageCache.has(videoUrl)) {
            const img = new Image();
            img.onload = () => {
                imageCache.set(videoUrl, img);
                console.log('预加载完成:', videoUrl);
            };
            img.onerror = () => {
                console.warn('预加载失败:', videoUrl);
            };
            img.src = videoUrl;
        }
    });
}
