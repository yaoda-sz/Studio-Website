document.addEventListener("DOMContentLoaded", function () {
    const items = document.querySelectorAll(".mov-v");
    const modal = document.getElementById("myModal");
    const modalVideo = document.getElementById("modal-video");
    const closeBtn = document.querySelector(".video-close");
    const videoContainer = document.getElementById("draggable-video-container");
    let currentItemIndex = -1;
    let isDragging = false;
    let startX, startY, deltaX, deltaY;

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function loadAndPlayVideo(video) {
        const source = video.querySelector("source");
        const src = source.getAttribute("data-src");
        if (!source.getAttribute("src")) {
            source.setAttribute("src", src);
            video.load();
        }
        if (video.paused) {
            video.loop = true;
            video.play().catch((error) => console.log("播放失败:", error));
        }
    }

    function pauseVideo(video) {
        if (!video.paused) video.pause();
    }

    function checkVideos() {
        items.forEach((item) => {
            const video = item.querySelector("video");
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

    items.forEach((item, index) => {
        item.addEventListener("click", () => {
            currentItemIndex = index;
            const src = item.getAttribute("data-src");
            if (!src) return;

            const modalSource = modalVideo.querySelector("source") || document.createElement("source");
            modalSource.setAttribute("src", src);
            modalSource.setAttribute("type", "video/webm");
            if (!modalVideo.querySelector("source")) modalVideo.appendChild(modalSource);

            modalVideo.load();
            modalVideo.loop = true;
            modal.style.display = "block";
            document.body.classList.add("no-scroll");
            modalVideo.play().catch(err => console.log("播放失败:", err));
        });
    });

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    function closeModal() {
        modal.style.display = "none";
        document.body.classList.remove("no-scroll");
        modalVideo.pause();
        modalVideo.querySelector("source")?.setAttribute("src", "");
        resetVideoPosition(true);
        checkVideos();
    }

    function startDragging(e) {
        isDragging = true;
        const touch = e.type === "touchstart" ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;
        videoContainer.style.transition = "none";
        e.preventDefault();
    }

    function onDragging(e) {
        if (!isDragging) return;
        const touch = e.type === "touchmove" ? e.touches[0] : e;
        deltaX = touch.clientX - startX;
        deltaY = touch.clientY - startY;

        videoContainer.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
        e.preventDefault();
    }

    function stopDragging() {
        if (!isDragging) return;
        isDragging = false;

        const threshold = 50;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        videoContainer.style.transition = "none";
        videoContainer.style.transform = "translate(-50%, -50%)";

        if (absDeltaX > threshold || absDeltaY > threshold) {
            if (absDeltaX > absDeltaY) {
                if (deltaX > threshold) {
                    currentItemIndex = (currentItemIndex + 1) % items.length;
                } else if (deltaX < -threshold) {
                    currentItemIndex = (currentItemIndex - 1 + items.length) % items.length;
                }
            } else {
                if (deltaY > threshold) {
                    currentItemIndex = (currentItemIndex + 1) % items.length;
                } else if (deltaY < -threshold) {
                    currentItemIndex = (currentItemIndex - 1 + items.length) % items.length;
                }
            }
            setTimeout(updateModalVideo, 50);
        }

        setTimeout(() => resetVideoPosition(true), 0);
    }

    function updateModalVideo() {
        const newItem = items[currentItemIndex];
        const src = newItem.getAttribute("data-src");
        const modalSource = modalVideo.querySelector("source") || document.createElement("source");
        modalSource.setAttribute("src", src);
        modalSource.setAttribute("type", "video/webm");
        if (!modalVideo.querySelector("source")) modalVideo.appendChild(modalSource);

        modalVideo.load();
        modalVideo.loop = true;
        modalVideo.play().catch(err => console.log("播放失败:", err));
    }

    function resetVideoPosition(useTransition = false) {
        if (useTransition) {
            videoContainer.style.transition = "transform 0.3s ease";
        } else {
            videoContainer.style.transition = "none";
        }
        videoContainer.style.transform = "translate(-50%, -50%)";
    }

    videoContainer.addEventListener("mousedown", startDragging);
    document.addEventListener("mousemove", onDragging);
    document.addEventListener("mouseup", stopDragging);

    videoContainer.addEventListener("touchstart", startDragging);
    document.addEventListener("touchmove", onDragging, { passive: false });
    document.addEventListener("touchend", stopDragging);
});