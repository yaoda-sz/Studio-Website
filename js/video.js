// 获取所有可点击的视频元素
const videoItems = Array.from(document.querySelectorAll('.mov-v'));
const modal = document.getElementById('myModal');
const modalVideoContainer = document.getElementById('draggable-video-container');
const dragOverlay = modalVideoContainer.querySelector('.drag-overlay'); // 拖拽覆盖层
const modalVideo = document.getElementById('modal-video');
const span = document.getElementsByClassName("video-close")[0];

let isDragging = false;
let offsetX, offsetY;
let currentIndex = -1;

// 当用户点击视频时打开模态框
videoItems.forEach((item, index) => {
    item.addEventListener('click', function () {
        currentIndex = index;
        modal.style.display = "block";
        loadVideo(index);
        // 每次打开模态框时显示拖拽覆盖层
        dragOverlay.style.display = 'block';
        // 禁用页面滚动
        document.body.classList.add('no-scroll');
    });
});

// 加载指定索引的视频
function loadVideo(index) {
    if (index >= 0 && index < videoItems.length) {
        modalVideo.src = videoItems[index].getAttribute('data-src');
        modalVideo.load();

        // 立即调整视频大小以适应视窗
        adjustVideoSize(modalVideoContainer);

        modalVideo.play(); // 自动播放视频

        // 在视频加载后立即设置正确的拖拽状态
        modalVideo.onloadedmetadata = () => {
            // 显示覆盖层并允许拖拽
            dragOverlay.style.display = 'block';
            // 确保拖拽事件绑定正确
            dragOverlay.onmousedown = dragMouseDown;

            // 再次调整视频大小以适应视窗
            adjustVideoSize(modalVideoContainer);
        };
    }
}

// 重置位置到中间并且调整大小
function resetPosition(element) {
    element.style.position = 'absolute';
    element.style.top = '50%';
    element.style.left = '50%';
    element.style.transform = 'translate(-50%, -50%)';

    // 调整视频大小以适应视窗
    adjustVideoSize(element);
}

// 根据视窗大小调整视频容器大小
function adjustVideoSize(container) {
    const maxWidth = window.innerWidth * 0.9; // 视窗宽度的90%
    const maxHeight = window.innerHeight * 0.8; // 视窗高度的80%

    let width = container.offsetWidth;
    let height = container.offsetHeight;

    // 计算缩放比例
    let scale = Math.min(maxWidth / width, maxHeight / height);

    // 如果需要缩小视频则应用缩放
    if (scale < 1) {
        container.style.width = `${width * scale}px`;
        container.style.height = `${height * scale}px`;
    } else {
        // 移除内联样式以恢复默认最大尺寸
        container.style.width = '';
        container.style.height = '';
    }
}

// 当用户改变浏览器窗口大小时，自动调整视频大小
window.addEventListener('resize', () => {
    if (modal.style.display !== "none") {
        adjustVideoSize(modalVideoContainer);
    }
});

// 添加点击事件监听器以处理播放/暂停逻辑
modalVideo.addEventListener('click', function () {
    const containerRect = modalVideoContainer.getBoundingClientRect();
    if (containerRect.top === (window.innerHeight - containerRect.height) / 2 &&
        containerRect.left === (window.innerWidth - containerRect.width) / 2) {
        // 只有当视频处于中心位置时才允许点击控制播放/暂停
        if (modalVideo.paused) {
            modalVideo.play();
        } else {
            modalVideo.pause();
        }
    }
});

// 当用户点击视频时打开模态框
videoItems.forEach((item, index) => {
    item.addEventListener('click', function () {
        currentIndex = index;
        modal.style.display = "block";
        loadVideo(index);
        // 每次打开模态框时显示拖拽覆盖层
        dragOverlay.style.display = 'block';
    });
});

// 当用户点击关闭按钮时关闭模态框
span.onclick = function () {
    modal.style.display = "none";
    modalVideo.pause(); // 暂停视频
    modalVideo.src = ""; // 清空视频源以释放资源
    resetPosition(modalVideoContainer); // 重置位置到中心
    // 启用页面滚动
    document.body.classList.remove('no-scroll');
}

// 当用户点击模态框外区域时关闭模态框
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        modalVideo.pause();
        modalVideo.src = "";
        resetPosition(modalVideoContainer); // 重置位置到中心
        // 启用页面滚动
        document.body.classList.remove('no-scroll');
    }
}
// 拖拽功能
dragOverlay.onmousedown = dragMouseDown; // 绑定拖拽事件到覆盖层

function dragMouseDown(e) {
    e.preventDefault();
    isDragging = true;
    offsetX = e.clientX - modalVideoContainer.offsetLeft;
    offsetY = e.clientY - modalVideoContainer.offsetTop;
    // 显示覆盖层并禁用过渡效果
    modalVideoContainer.style.transition = 'none';
    document.onmousemove = elementDrag;
    document.onmouseup = stopDragElement;
}

function elementDrag(e) {
    e.preventDefault();
    if (isDragging) {
        modalVideoContainer.style.position = 'absolute';
        modalVideoContainer.style.top = `${e.clientY - offsetY}px`;
        modalVideoContainer.style.left = `${e.clientX - offsetX}px`;
    }
}

function stopDragElement(e) {
    isDragging = false;
    document.onmousemove = null;
    document.onmouseup = null;

    // 松开鼠标后立即恢复过渡效果，并触发回位
    modalVideoContainer.style.transition = 'top 0.5s ease-out, left 0.5s ease-out';
    resetPosition(modalVideoContainer);

    // 回位完成后保持覆盖层可见，以便立即拖拽
    setTimeout(() => {
        dragOverlay.style.display = 'block'; // 保持覆盖层可见
    }, 500); // 等待回位动画完成

    // 如果没有拖到边缘，则继续播放视频
    if (!isOnEdge()) {
        modalVideo.play();
    }
}

function resetPosition(element) {
    element.style.position = 'absolute';
    element.style.top = '50%';
    element.style.left = '50%';
    element.style.transform = 'translate(-50%, -50%)';
}

function isOnEdge() {
    const threshold = 100; // 边缘阈值
    const containerRect = modalVideoContainer.getBoundingClientRect();
    const screenWidth = window.innerWidth;

    if (containerRect.left < threshold || screenWidth - containerRect.right < threshold) {
        // 向左或向右切换视频
        currentIndex += containerRect.left < threshold ? -1 : 1;
        currentIndex = Math.max(0, Math.min(currentIndex, videoItems.length - 1));
        loadVideo(currentIndex);
        return true;
    }
    return false;
}