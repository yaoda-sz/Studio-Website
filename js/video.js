document.addEventListener("DOMContentLoaded", function () {
    const lazyVideos = document.querySelectorAll(".lazy-video");
    const modal = document.getElementById("myModal");
    const modalVideo = document.getElementById("modal-video");
    const closeBtn = document.querySelector(".video-close");
    const videoContainer = document.getElementById("draggable-video-container");
    let currentVideoIndex = -1;
    let isDragging = false;
    let startX, startY, deltaX, deltaY;

    // 检查元素是否在可视区域
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // 加载并循环播放视频
    function loadAndPlayVideo(video) {
        const source = video.querySelector("source");
        const src = source.getAttribute("data-src");
        if (!source.getAttribute("src")) {
            source.setAttribute("src", src);
            video.load();
            video.loop = true;
            video.play().catch((error) => console.log("播放失败:", error));
        } else if (video.paused) {
            video.play().catch((error) => console.log("播放失败:", error));
        }
    }

    // 暂停视频
    function pauseVideo(video) {
        if (!video.paused) video.pause();
    }

    // 检查视频可见性并播放
    function checkVideos() {
        lazyVideos.forEach((video) => {
            if (isInViewport(video)) {
                loadAndPlayVideo(video);
            } else {
                pauseVideo(video);
            }
        });
    }

    checkVideos();
    window.addEventListener("scroll", checkVideos);
    window.addEventListener("resize", checkVideos);

    // 点击视频弹出模态框
    lazyVideos.forEach((video, index) => {
        video.parentElement.addEventListener("click", () => {
            currentVideoIndex = index;
            const src = video.querySelector("source").getAttribute("data-src");
            modalVideo.src = src;
            modalVideo.loop = true;
            modal.style.display = "block";
            document.body.classList.add("no-scroll");
            modalVideo.play();
        });
    });

    // 点击关闭按钮或空白区域关闭模态框
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    function closeModal() {
        modal.style.display = "none";
        document.body.classList.remove("no-scroll");
        modalVideo.pause();
        modalVideo.src = "";
        resetVideoPosition();
        checkVideos();
    }

    // 拖动开始
    function startDragging(e) {
        isDragging = true;
        const touch = e.type === "touchstart" ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;
        videoContainer.style.transition = "none"; // 拖动时无动画
        e.preventDefault();
    }

    // 拖动中
    function onDragging(e) {
        if (!isDragging) return;
        const touch = e.type === "touchmove" ? e.touches[0] : e;
        deltaX = touch.clientX - startX;
        deltaY = touch.clientY - startY;

        videoContainer.style.left = `calc(50% + ${deltaX}px)`;
        videoContainer.style.top = `calc(50% + ${deltaY}px)`;
        e.preventDefault();
    }

    // 拖动结束
    function stopDragging() {
        if (!isDragging) return;
        isDragging = false;

        const threshold = 50;
        if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
            if (deltaX > threshold || deltaY > threshold) {
                currentVideoIndex = (currentVideoIndex + 1) % lazyVideos.length;
            } else if (deltaX < -threshold || deltaY < -threshold) {
                currentVideoIndex = (currentVideoIndex - 1 + lazyVideos.length) % lazyVideos.length;
            }
            updateModalVideo();
        }

        resetVideoPosition();
    }

    // 更新模态框视频
    function updateModalVideo() {
        const newVideo = lazyVideos[currentVideoIndex];
        const src = newVideo.querySelector("source").getAttribute("data-src");
        modalVideo.src = src;
        modalVideo.loop = true;
        modalVideo.play();
    }

    // 重置视频位置（可选：移除动画）
    function resetVideoPosition() {
        videoContainer.style.transition = "all 0.3s ease"; // 移除回弹动画
        videoContainer.style.left = "50%";
        videoContainer.style.top = "50%";
    }

    // 桌面端事件
    videoContainer.addEventListener("mousedown", startDragging);
    document.addEventListener("mousemove", onDragging);
    document.addEventListener("mouseup", stopDragging);

    // 手机端触摸事件
    videoContainer.addEventListener("touchstart", startDragging);
    document.addEventListener("touchmove", onDragging, { passive: false });
    document.addEventListener("touchend", stopDragging);
});