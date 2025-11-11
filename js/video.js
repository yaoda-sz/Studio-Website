// 定义一个初始化视频功能的函数，接受视频数据和列表容器ID作为参数
function initializeVideoPlayer(videoData, listContainerId) {
    // 获取视频列表容器
    const videoList = document.getElementById(listContainerId);

    // 动态生成视频列表项
    videoData.forEach((data, index) => {
        const li = document.createElement("li");
        li.className = "mov-v";
        li.setAttribute("data-src-webm", data.srcWebm);
        li.setAttribute("data-src-mp4", data.srcMp4);
        li.setAttribute("data-index", index);
        li.innerHTML = `
            <video class="lazy-video" muted preload="metadata" aria-label="${data.label}">
                <source data-src="${data.srcMp4}" type="video/mp4">
                <source data-src="${data.srcWebm}" type="video/webm">
                您的浏览器不支持 video 标签。
            </video>
        `;
        videoList.appendChild(li);
    });

    // 获取所有视频项和相关元素
    const items = videoList.querySelectorAll(".mov-v");
    const modal = document.getElementById("myModal");
    const modalVideo = document.getElementById("modal-video");
    const closeBtn = document.querySelector(".video-close");
    const videoContainer = document.getElementById("draggable-video-container");
    let currentItemIndex = -1;
    let isDragging = false;
    let dragStartX, dragStartY;
    let deltaX, deltaY;

    // 使用IntersectionObserver实现视频懒加载
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                loadAndPlayVideo(video);
            } else {
                pauseVideo(video);
            }
        });
    }, { threshold: 0.1 });

    items.forEach(item => observer.observe(item.querySelector("video")));

    // 加载并播放视频
    function loadAndPlayVideo(video) {
        const sources = video.querySelectorAll("source");
        sources.forEach(source => {
            const src = source.getAttribute("data-src");
            if (!source.getAttribute("src")) {
                source.setAttribute("src", src);
            }
        });
        video.load();
        if (video.paused) {
            video.loop = true;
            video.play().catch(err => console.log("播放失败:", err));
        }
    }

    // 暂停视频
    function pauseVideo(video) {
        if (!video.paused) video.pause();
    }

    // 点击打开模态框
    items.forEach(item => {
        item.addEventListener("click", () => {
            currentItemIndex = parseInt(item.getAttribute("data-index"));
            updateModalVideo(item);
            modal.style.display = "block";
            document.body.classList.add("no-scroll");
        });
    });

    // 关闭模态框
    function closeModal() {
        modal.style.display = "none";
        document.body.classList.remove("no-scroll");
        modalVideo.pause();
        modalVideo.innerHTML = "";
        resetVideoPosition(false);
    }

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // 更新模态框视频
    function updateModalVideo(item) {
        const srcWebm = item.getAttribute("data-src-webm");
        const srcMp4 = item.getAttribute("data-src-mp4");
        const modalSourceMp4 = document.createElement("source");
        const modalSourceWebm = document.createElement("source");

        modalSourceMp4.setAttribute("src", srcMp4);
        modalSourceMp4.setAttribute("type", "video/mp4");
        modalSourceWebm.setAttribute("src", srcWebm);
        modalSourceWebm.setAttribute("type", "video/webm");

        modalVideo.innerHTML = "";
        modalVideo.appendChild(modalSourceMp4);
        modalVideo.appendChild(modalSourceWebm);
        modalVideo.load();
        modalVideo.addEventListener("loadeddata", () => {
            modalVideo.play().catch(err => {
                console.log("播放失败:", err);
                modalVideo.insertAdjacentHTML("afterend", '<p class="error">视频加载失败，请稍后重试</p>');
            });
        }, { once: true });
    }

    // 开始拖拽
    function startDragging(e) {
        isDragging = true;
        const event = e.type === "touchstart" ? e.touches[0] : e;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        videoContainer.style.transition = "none";
        e.preventDefault();
    }

    // 拖拽进行中
    function onDragging(e) {
        if (!isDragging) return;
        const event = e.type === "touchmove" ? e.touches[0] : e;
        deltaX = event.clientX - dragStartX;
        deltaY = event.clientY - dragStartY;
        videoContainer.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
        e.preventDefault();
    }

    // 停止拖拽
    function stopDragging() {
        if (!isDragging) return;
        isDragging = false;
        const swipeThreshold = 50;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        resetVideoPosition(false);

        if (absDeltaX > swipeThreshold || absDeltaY > swipeThreshold) {
            if (absDeltaX > absDeltaY) {
                if (deltaX > swipeThreshold) {
                    currentItemIndex = (currentItemIndex + 1) % items.length;
                } else if (deltaX < -swipeThreshold) {
                    currentItemIndex = (currentItemIndex - 1 + items.length) % items.length;
                }
            } else {
                if (deltaY > swipeThreshold) {
                    currentItemIndex = (currentItemIndex + 1) % items.length;
                } else if (deltaY < -swipeThreshold) {
                    currentItemIndex = (currentItemIndex - 1 + items.length) % items.length;
                }
            }
            updateModalVideo(items[currentItemIndex]);
            setTimeout(() => resetVideoPosition(true), 0);
        }
    }

    // 重置视频位置
    function resetVideoPosition(useTransition = false) {
        videoContainer.style.transition = useTransition ? "transform 0.3s ease" : "none";
        videoContainer.style.transform = "translate(-50%, -50%)";
    }

    // 绑定拖拽事件
    videoContainer.addEventListener("mousedown", startDragging);
    document.addEventListener("mousemove", onDragging);
    document.addEventListener("mouseup", stopDragging);
    videoContainer.addEventListener("touchstart", startDragging);
    document.addEventListener("touchmove", onDragging, { passive: false });
    document.addEventListener("touchend", stopDragging);
}

// 在页面加载时导出函数（可选，用于模块化）
if (typeof module !== "undefined" && module.exports) {
    module.exports = initializeVideoPlayer;
} else {
    window.initializeVideoPlayer = initializeVideoPlayer;
}// 使用 AbortController 来统一控制事件解绑
const controller = new AbortController();

document.addEventListener("mousemove", onDragging, {
    signal: controller.signal,
    passive: false
});

// 在适当时机调用 controller.abort() 解除所有监听器