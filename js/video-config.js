// 视频配置数据
const videoConfig = {
    cases: {
        '《波粒狂潮Infinity Boli》': {
            bvid: 'BV1Mfbzz7E8P',
            cid: '31696421478',
            posterSrc: './img/video_cover_blkc.webp',
            altText: '波粒狂潮视频封面'
        },
        '《神魔诀之江湖行》': {
            bvid: 'BV1foXxY5END',
            cid: '29013509219',
            posterSrc: './img/video_cover_smj.jpg',
            altText: '神魔诀视频封面'
        },
        '《何以为仙》': {
            bvid: 'BV1QDSNB4EsN',
            cid: '35081752258',
            posterSrc: './img/video_cover_hywx.jpg',
            altText: '何以为仙视频封面'
        },
        '《魔法玩具树屋》': {
            bvid: 'BV11L9BYREaB',
            cid: '28675476944',
            posterSrc: './img/video_cover_bigbird.jpg',
            altText: '魔法玩具树屋视频封面'
        },
        '《银与绯》': {
            bvid: 'BV1bEatzdEUh',
            cid: '32180865918',
            posterSrc: './img/video_cover_yingyufei.jpg',
            altText: '银与绯视频封面'
        }
    }
};

// 导出配置供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = videoConfig;
} else {
    window.videoConfig = videoConfig;
}

// 监听所有 class 为 video-lazy-load 元素的点击事件
document.addEventListener('click', (e) => {
    // 检查点击的是不是我们的视频占位符（或者它的子元素）
    const container = e.target.closest('.video-lazy-load');

    if (container) {
        // 阻止默认行为和冒泡
        e.preventDefault();
        e.stopPropagation();

        // 停止所有其他正在播放的视频
        stopAllOtherVideos(container);

        // 获取 HTML 标签里存的 bvid 和 cid
        const bvid = container.dataset.bvid;
        const cid = container.dataset.cid;

        // 创建加载指示器
        const loadingIndicator = document.createElement('div');
        loadingIndicator.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            z-index: 20;
        `;

        // 添加旋转动画样式
        if (!document.querySelector('#video-loading-style')) {
            const style = document.createElement('style');
            style.id = 'video-loading-style';
            style.textContent = `
                @keyframes spin {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        const iframe = document.createElement('iframe');
        // 注意：autoplay=1 让视频加载出来后自动播放
        iframe.src = `https://player.bilibili.com/player.html?isOutside=true&bvid=${bvid}&cid=${cid}&autoplay=1`;
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
        `;
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('border', '0');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('framespacing', '0');
        iframe.setAttribute('allowfullscreen', 'true');

        // 先添加加载指示器到容器
        container.appendChild(loadingIndicator);

        // 设置加载超时
        let isLoading = true;
        const loadingTimeout = setTimeout(() => {
            if (isLoading) {
                // 3秒后强制显示iframe，即使没完全加载
                container.innerHTML = '';
                container.appendChild(iframe);
                container.classList.remove('video-lazy-load');
                isLoading = false;
            }
        }, 3000);

        // 监听iframe加载
        iframe.onload = () => {
            clearTimeout(loadingTimeout);
            if (isLoading) {
                // iframe加载完成，替换内容
                container.innerHTML = '';
                container.appendChild(iframe);
                container.classList.remove('video-lazy-load');
                isLoading = false;
            }
        };

        // 处理加载错误
        iframe.onerror = () => {
            clearTimeout(loadingTimeout);
            container.removeChild(loadingIndicator);
            console.error('视频加载失败');
            isLoading = false;
        };

        // 开始加载iframe
        container.appendChild(iframe);

    }
});

// 停止除当前容器外的所有其他视频
const stopAllOtherVideos = (currentContainer) => {
    // 查找所有包含iframe的video-container
    const allVideoContainers = document.querySelectorAll('.video-container');

    // 获取当前点击的video-container
    const currentVideoContainer = currentContainer.parentElement;

    allVideoContainers.forEach(container => {
        // 跳过当前容器
        if (container === currentVideoContainer) {
            return;
        }

        // 查找容器内的iframe
        const iframe = container.querySelector('iframe');
        if (iframe) {
            // 重新创建视频占位符（恢复封面）
            recreateVideoPlaceholder(container);
        }
    });
};

// 重新创建视频占位符
const recreateVideoPlaceholder = (container) => {
    // 清空容器
    container.innerHTML = '';

    // 查找视频标题，适配不同的页面结构
    let caseTitle = null;

    // 首先尝试从cases.html的结构中查找：box-video > case-tag > title-card
    const boxVideo = container.closest('.box-video');
    if (boxVideo) {
        caseTitle = boxVideo.querySelector('.case-tag .title-card')?.textContent;
    }

    // 如果没找到，尝试从其他页面结构中查找：title-com > title-card
    if (!caseTitle) {
        const titleCom = container.parentElement?.closest('.title-com') || container.closest('.title-com');
        if (titleCom) {
            caseTitle = titleCom.querySelector('h3')?.textContent;
        }
    }

    if (!caseTitle) {
        return;
    }

    // 从全局配置中查找匹配的视频信息
    const videoInfo = window.videoConfig?.cases?.[caseTitle];

    if (!videoInfo) {
        return;
    }

    const { bvid, cid, posterSrc, altText } = videoInfo;

    // 创建新的video-lazy-load元素
    const videoLazyLoad = document.createElement('div');
    videoLazyLoad.className = 'video-lazy-load';
    videoLazyLoad.dataset.bvid = bvid;
    videoLazyLoad.dataset.cid = cid;

    videoLazyLoad.innerHTML = `
        <img src="${posterSrc}" alt="${altText}" class="video-poster">
        <div class="play-icon">
            <span class="iconfont icon-player"></span>
        </div>
    `;

    container.appendChild(videoLazyLoad);
};