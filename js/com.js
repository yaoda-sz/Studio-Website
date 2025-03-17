(function () {
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        setupNavigation(); // 设置导航栏事件监听
        setupMobileMenu(); // 设置移动端菜单
    }

    // 设置导航栏事件监听
    function setupNavigation() {
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
    function setupMobileMenu() {
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
    }
    // 返回顶部
    const backTop = document.getElementById('backTop');
    window.addEventListener('scroll', () => {
        //当页面滚动超过一定距离时显示按钮
        if (window.scrollY > 400) {
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
