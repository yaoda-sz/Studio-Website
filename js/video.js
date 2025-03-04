// 获取 DOM 元素
const videoItems = Array.from(document.querySelectorAll('.mov-v'));
const modal = document.getElementById('myModal');
const modalVideoContainer = document.getElementById('draggable-video-container');
const dragOverlay = modalVideoContainer.querySelector('.drag-overlay');
const modalVideo = document.getElementById('modal-video');
const closeButton = document.getElementsByClassName('video-close')[0];

let isDragging = false;
let offsetX, offsetY;
let startX, startY; // 记录拖拽起始位置
let currentIndex = -1;

// 为视频项绑定点击事件
videoItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentIndex = index;
        openModal(index);
    });
});

// 打开模态框并加载视频
function openModal(index) {
    modal.style.display = 'block';
    loadVideo(index);
    dragOverlay.style.display = 'block';
    document.body.classList.add('no-scroll');
}

// 加载指定索引的视频
function loadVideo(index) {
    if (index < 0 || index >= videoItems.length) return;

    const videoSrc = videoItems[index].getAttribute('data-src');
    if (!videoSrc) {
        console.error(`Video source not found for index ${index}`);
        return;
    }

    modalVideo.src = videoSrc;
    modalVideo.load();
    adjustVideoSize(modalVideoContainer);
    modalVideo.play().catch(err => console.error('Video play failed:', err));

    modalVideo.onloadedmetadata = () => {
        adjustVideoSize(modalVideoContainer);
        dragOverlay.style.display = 'block';
        dragOverlay.onmousedown = dragMouseDown;
    };
}

// 重置视频容器位置到屏幕中心
function resetPosition(element) {
    element.style.position = 'absolute';
    element.style.top = '50%';
    element.style.left = '50%';
    element.style.transform = 'translate(-50%, -50%)';
    adjustVideoSize(element);
}

// 调整视频容器大小以适应视窗
function adjustVideoSize(container) {
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.8;
    const video = container.querySelector('video');
    const width = video.videoWidth || container.offsetWidth;
    const height = video.videoHeight || container.offsetHeight;
    const scale = Math.min(maxWidth / width, maxHeight / height);

    container.style.width = scale < 1 ? `${width * scale}px` : '';
    container.style.height = scale < 1 ? `${height * scale}px` : '';
}

// 窗口大小调整事件（使用防抖）
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (modal.style.display !== 'none') adjustVideoSize(modalVideoContainer);
    }, 100);
});

// 播放/暂停控制（仅在中心位置有效）
modalVideo.addEventListener('click', () => {
    const rect = modalVideoContainer.getBoundingClientRect();
    const isCentered = Math.abs(rect.top - (window.innerHeight - rect.height) / 2) < 1 &&
        Math.abs(rect.left - (window.innerWidth - rect.width) / 2) < 1;
    if (isCentered) {
        modalVideo.paused ? modalVideo.play() : modalVideo.pause();
    }
});

// 关闭模态框
closeButton.onclick = closeModal;
window.onclick = (event) => {
    if (event.target === modal) closeModal();
};

function closeModal() {
    modal.style.display = 'none';
    modalVideo.pause();
    modalVideo.src = '';
    resetPosition(modalVideoContainer);
    document.body.classList.remove('no-scroll');
}

// 拖拽功能
function dragMouseDown(e) {
    e.preventDefault();
    isDragging = true;
    startX = e.clientX; // 记录起始 X 位置
    startY = e.clientY; // 记录起始 Y 位置
    offsetX = e.clientX - modalVideoContainer.offsetLeft;
    offsetY = e.clientY - modalVideoContainer.offsetTop;
    modalVideoContainer.style.transition = 'none';
    document.onmousemove = elementDrag;
    document.onmouseup = stopDragElement;
}

function elementDrag(e) {
    e.preventDefault();
    if (isDragging) {
        modalVideoContainer.style.top = `${e.clientY - offsetY}px`;
        modalVideoContainer.style.left = `${e.clientX - offsetX}px`;
    }
}

function stopDragElement(e) {
    isDragging = false;
    document.onmousemove = null;
    document.onmouseup = null;

    // 计算拖拽方向
    const endX = e.clientX;
    const endY = e.clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const threshold = 100; // 边缘检测和方向判断的阈值

    // 检查是否靠近边缘并切换视频
    if (checkEdgeAndSwitch(deltaX, deltaY, threshold)) {
        resetPosition(modalVideoContainer); // 切换视频后重置位置
    } else {
        // 如果没有切换视频，则恢复到中心位置
        modalVideoContainer.style.transition = 'top 0.5s ease-out, left 0.5s ease-out';
        resetPosition(modalVideoContainer);
        setTimeout(() => {
            dragOverlay.style.display = 'block';
            modalVideo.play();
        }, 500); // 等待回位动画完成
    }
}

// 检查边缘并根据方向切换视频
function checkEdgeAndSwitch(deltaX, deltaY, threshold) {
    const rect = modalVideoContainer.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    let switched = false;

    // 左右滑动切换
    if (rect.left < threshold && Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
        // 向左滑动，切换到上一个视频
        currentIndex = Math.max(0, currentIndex - 1);
        loadVideo(currentIndex);
        switched = true;
    } else if (screenWidth - rect.right < threshold && Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
        // 向右滑动，切换到下一个视频
        currentIndex = Math.min(videoItems.length - 1, currentIndex + 1);
        loadVideo(currentIndex);
        switched = true;
    }
    // 上下滑动切换
    else if (rect.top < threshold && Math.abs(deltaY) > Math.abs(deltaX) && deltaY < 0) {
        // 向上滑动，切换到上一个视频
        currentIndex = Math.max(0, currentIndex - 1);
        loadVideo(currentIndex);
        switched = true;
    } else if (screenHeight - rect.bottom < threshold && Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
        // 向下滑动，切换到下一个视频
        currentIndex = Math.min(videoItems.length - 1, currentIndex + 1);
        loadVideo(currentIndex);
        switched = true;
    }

    return switched;
}