(function () {
    // 监听 layout.js 发出的加载完成事件
    document.addEventListener('DOMContentLoaded', init);

    // 添加页面加载动画
    function addPageLoadAnimation() {
        // 添加淡入动画
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease-in-out';
            document.body.style.opacity = '1';
        }, 100);

        // 为所有带有 data-animate 属性的元素添加动画
        const animateElements = document.querySelectorAll('[data-animate]');
        animateElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `all 0.5s ease-out ${index * 0.1}s`;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(el);
        });
    }

    function init() {
        initNavigation(); // 设置导航栏事件监听
        initMobileMenu(); // 设置移动端菜单
        addPageLoadAnimation(); // 添加页面加载动画
        initSmoothScroll(); // 初始化平滑滚动
        initHoverEffects(); // 初始化悬停效果
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
        }
        // navLinks.style.transition = 'transform 0.3s ease'; // 加关闭动画
        // navLinks.style.transform = 'translateX(100%)'; // 滑出效果
    }

    // 初始化平滑滚动
    function initSmoothScroll() {
        // 为所有锚点链接添加平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // 减去导航栏高度
                        behavior: 'smooth'
                    });
                }
            });
        });

        // 返回顶部按钮
        const backTop = document.getElementById('backTop');
        if (backTop) {
            window.addEventListener('scroll', () => {
                // 当页面滚动超过一定距离时显示按钮
                if (window.scrollY > 200) {
                    backTop.classList.add('show');
                } else {
                    backTop.classList.remove('show');
                }
            });

            // 点击返回顶部
            backTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // 初始化悬停效果
    function initHoverEffects() {
        // 为卡片添加悬停效果
        document.querySelectorAll('.card, .card-v').forEach(card => {
            card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';

            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 10px 10px rgba(0,0,0,0.2)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            });
        });

        // 为按钮添加波纹效果
        document.querySelectorAll('button, .btn, a.btn').forEach(button => {
            button.addEventListener('click', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;

                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 1000);
            });
        });
    }
})();

// 背景音乐播放控制
(function () {
    const audio = document.getElementById('backgroundMusic');
    const playButton = document.getElementById('playButton');

    if (!audio || !playButton) return;

    const playIcon = playButton.querySelector('.icon-play');
    const stopIcon = playButton.querySelector('.icon-stop');

    if (stopIcon) stopIcon.style.display = 'none';
    if (playIcon) playIcon.style.display = 'block';

    playButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(e => console.log('音频播放失败:', e));
            if (playIcon) playIcon.style.display = 'none';
            if (stopIcon) stopIcon.style.display = 'block';
        } else {
            audio.pause();
            if (playIcon) playIcon.style.display = 'block';
            if (stopIcon) stopIcon.style.display = 'none';
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