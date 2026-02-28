(function () {
    // 监听 layout.js 发出的加载完成事件
    window.addEventListener('layoutLoaded', init);
    // 移除 DOMContentLoaded 作为后备，因为现在所有内容都通过 layout.js 动态插入

    function init() {
        initNavigation(); // 设置导航栏事件监听
        initMobileMenu(); // 设置移动端菜单
        initBackTop(); // 设置回到顶部按钮
    }
    // 设置导航栏事件监听
    function initNavigation() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        nav.addEventListener('click', (ev) => {
            if (ev.target.tagName === 'A') {
                document.querySelectorAll('nav a').forEach(item => item.classList.remove('active'));
                ev.target.classList.add('active'); // 给当前点击的链接添加 active 类
                closeMobileMenu(); // 关闭移动端菜单（如果打开）
            }
        });
    }

    // 设置移动端菜单
    function initMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const navLinks = document.querySelector('.nav-links');
        const navMenuItems = document.querySelectorAll('.nav-links li');

        if (!mobileMenu || !navLinks) return;

        // 绑定点击事件，切换菜单状态
        mobileMenu.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpening = !navLinks.classList.contains('open');

            mobileMenu.classList.toggle('active');
            navLinks.classList.toggle('open');

            // 禁止/允许页面滚动
            if (isOpening) {
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
            } else {
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
            }

            // 添加菜单动画
            navMenuItems.forEach((item, index) => {
                item.style.animation = navLinks.classList.contains('open')
                    ? `0.3s ease-in-out slideIn forwards ${index * 0.1 + 0.1}s`
                    : '';
            });
        });
    }

    // 关闭移动端菜单
    function closeMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const navLinks = document.querySelector('.nav-links');
        if (mobileMenu && navLinks) {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('open');

            // 恢复页面滚动
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
        // navLinks.style.transition = 'transform 0.3s ease'; // 加关闭动画
        // navLinks.style.transform = 'translateX(100%)'; // 滑出效果
    }

    // 设置回到顶部按钮
    function initBackTop() {
        const backTop = document.getElementById('backTop');
        if (!backTop) return;

        window.addEventListener('scroll', () => {
            //当页面滚动超过一定距离时显示按钮
            if (window.scrollY > 200) {
                backTop.classList.add('show');
            } else {
                backTop.classList.remove('show');
            }
        });

        //点击返回顶部
        backTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
})();

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