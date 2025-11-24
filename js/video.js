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

    // 不清空 innerHTML，而是更新现有 source（假设总是两个 source）
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

    // 更新 src
    src1.src = data.webm;
    src2.src = data.mp4;

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

function initializeVideoPlayer(videoData, listContainerId) {
    const videoList = document.getElementById(listContainerId);
    if (!videoList) return;

    // ... (DocumentFragment 的代码保持不变，用于渲染列表) ...
    // 注意：把视频列表 li 元素的生成代码放进来
    const fragment = document.createDocumentFragment();

    videoData.forEach((data, index) => {
        const li = document.createElement("li");
        li.className = "mov-v";
        li.dataset.webm = data.srcWebm;
        li.dataset.mp4 = data.srcMp4;
        li.dataset.index = index;

        let contentHTML = '';
        // 判断是否有外部预览链接
        if (data.previewSrc) {
            // 如果有 previewSrc，我们使用一张图片作为列表预览（推荐WebP/JPG）
            contentHTML = `
            <img src="${data.previewSrc}" alt="${data.label} 预览图" class="video-preview-img">
        `;
        } else {
            // 否则，我们使用本地的循环视频作为列表预览（你现在的 service.html 修复后的状态）
            contentHTML = `
                <video class="video-preview-vid" loop muted playsinline autoplay preload="metadata">
                    <source src="${data.srcWebm}" type="video/webm">
                    <source src="${data.srcMp4}" type="video/mp4">
                </video>
            `;
        }
        // 无论上面是图片还是视频，我们都需要浮层来点击
        li.innerHTML = `
           ${contentHTML}
            <div class="video-overlay">
                <span class="iconfont icon-play"></span>
                <span class="video-label">${data.label}</span>
            </div>
        `;
        fragment.appendChild(li);
    });
    videoList.appendChild(fragment);

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

    modal.addEventListener('mousedown', (e) => {
        // 新变化：排除关闭按钮，但允许在整个模态框（包括周边空白）拖拽
        if (e.target.closest('.video-close')) return; // 如果点击关闭按钮，不触发拖拽

        // 允许在 modal、modalVideo、drag-overlay 等任何子元素上触发（扩展到周边）
        isDraggingMouse = true;
        startXMouse = e.clientX;
        startYMouse = e.clientY;

        // 拖动开始时，取消过渡动画，让视频紧跟鼠标
        modalVideo.style.transition = 'none';

        // 新增：加个“抓手”指针反馈（可选，通过 CSS 已实现）
    }, { passive: true });

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

    // finishSwipe 函数（保持不变，或微调动画时间）
    function finishSwipe(direction, axis) {
        const endX = axis === 'x' ? (direction === 1 ? -window.innerWidth : window.innerWidth) : 0;
        const endY = axis === 'y' ? (direction === 1 ? -window.innerHeight : window.innerHeight) : 0;

        modalVideo.style.transform = `translate(${endX}px, ${endY}px)`;

        setTimeout(() => {
            switchVideo(direction);
        }, 200); // 缩短到200ms，让滑动更快连上新视频
    }

    // // 辅助函数：完成滑动动画并切换
    // function finishSwipe(direction, axis) {
    //     // 1. 先让视频彻底滑出屏幕 (视觉反馈)
    //     const endX = axis === 'x' ? (direction === 1 ? -window.innerWidth : window.innerWidth) : 0;
    //     const endY = axis === 'y' ? (direction === 1 ? -window.innerHeight : window.innerHeight) : 0;

    //     modalVideo.style.transform = `translate(${endX}px, ${endY}px)`;

    //     // 2. 等待 0.3秒 动画结束后，真正的切换视频
    //     setTimeout(() => {
    //         switchVideo(direction);
    //         // switchVideo 内部调用 openVideo，openVideo 里会重置位置为 (0,0)
    //     }, 400);
    // }

    // // 左右切换按钮
    // const nextBtn = document.querySelector('#modal-next-btn');
    // const prevBtn = document.querySelector('#modal-prev-btn');
    // if (nextBtn) nextBtn.addEventListener('click', () => switchVideo(1));
    // if (prevBtn) prevBtn.addEventListener('click', () => switchVideo(-1));

})();
