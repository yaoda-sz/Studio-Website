(function () {
    // 监听 layout.js 发出的加载完成事件
    // window.addEventListener('layoutLoaded', init);
    // 如果 layout.js 还没准备好，或者页面没有用 layout.js，保留 DOMContentLoaded 作为后备
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initNavigation(); // 设置导航栏事件监听
        initMobileMenu(); // 设置移动端菜单
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
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navLinks.classList.toggle('open');

            // 添加菜单动画
            navMenuItems.forEach((item, index) => {
                item.style.animation = navLinks.classList.contains('open')
                    ? `0.5s ease-in-out slideIn forwards ${index * 0.1 + 0.1}s`
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
        }
        // navLinks.style.transition = 'transform 0.3s ease'; // 加关闭动画
        // navLinks.style.transform = 'translateX(100%)'; // 滑出效果
    }
    // 返回顶部
    const backTop = document.getElementById('backTop');
    window.addEventListener('scroll', () => {
        //当页面滚动超过一定距离时显示按钮
        if (window.scrollY > 200) {
            backTop.classList.add('show');
        } else { backTop.classList.remove('show'); }
    })
    //点击返回顶部
    backTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})();

// 背景音乐播放控制
(function () {
    const audio = document.getElementById('backgroundMusic');
    const playButton = document.getElementById('playButton');
    const playIcon = playButton.querySelector('.icon-play');
    const stopIcon = playButton.querySelector('.icon-stop');


    stopIcon.style.display = 'none';
    playIcon.style.display = 'block';

    playButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playIcon.style.display = 'none';
            stopIcon.style.display = 'block';

        } else {
            audio.pause();
            playIcon.style.display = 'block';
            stopIcon.style.display = 'none';
        }
    });
})();


// 监听所有 class 为 video-lazy-load 元素的点击事件
document.addEventListener('click', function (e) {
    // 检查点击的是不是我们的视频占位符（或者它的子元素）
    const container = e.target.closest('.video-lazy-load');

    if (container) {
        // 获取 HTML 标签里存的 I  
        const bvid = container.dataset.bvid;
        const cid = container.dataset.cid;

        const iframe = document.createElement('iframe');
        // 注意：autoplay=1 让视频加载出来后自动播放
        iframe.src = `https://player.bilibili.com/player.html?isOutside=true&bvid=${bvid}&cid=${cid}&autoplay=1`;

        // 设置 iframe 的样式属性
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
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
