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
document.addEventListener('click', function (e) {
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

        const iframe = document.createElement('iframe');
        // 注意：autoplay=1 让视频加载出来后自动播放
        iframe.src = `https://player.bilibili.com/player.html?isOutside=true&bvid=${bvid}&cid=${cid}&autoplay=1`;

        // 设置 iframe 的样式属性
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.style.position = "absolute";
        iframe.style.top = "0";
        iframe.style.left = "0";
        iframe.style.zIndex = "10";
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('border', '0');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('framespacing', '0');
        iframe.setAttribute('allowfullscreen', 'true');

        // 清空容器里的图片和按钮，放入 iframe
        container.innerHTML = '';
        container.appendChild(iframe);

        // 移除点击事件类名，变成普通容器（可选）
        container.classList.remove('video-lazy-load');

    }
});

// 停止除当前容器外的所有其他视频
function stopAllOtherVideos(currentContainer) {
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
}

// 重新创建视频占位符
function recreateVideoPlaceholder(container) {
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
            <span class="iconfont icon-play"></span>
        </div>
    `;

    container.appendChild(videoLazyLoad);
}