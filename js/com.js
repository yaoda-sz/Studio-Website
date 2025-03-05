(function () {
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        setupNavigation(); // 设置导航栏事件监听
        setupMobileMenu(); // 设置移动端菜单
        setupBackToTop(); // 设置回到顶部按钮
        setupIntersectionObserver(); // 设置Intersection Observer 监听页面滚动
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

    // 设置回到顶部按钮
    function setupBackToTop() {
        const backTop = document.querySelector('#backTop');
        const newDiv = document.querySelector('.new');
        if (!backTop || !newDiv) return;

        // 点击回到顶部
        backTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // 监听滚动，显示或隐藏回到顶部按钮
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const isVisible = scrollTop >= newDiv.offsetTop;
            backTop.style.bottom = isVisible ? '10px' : '-60px';
            backTop.style.opacity = isVisible ? 1 : 0;
        });
    }

    // 设置 Intersection Observer，监听页面滚动
    function setupIntersectionObserver() {
        const sections = document.querySelectorAll('.box-big');
        if (!sections.length) return;

        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        });

        sections.forEach(section => io.observe(section));
    }
})();

// 背景音乐播放控制
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const music = document.getElementById('backgroundMusic');
        const playButton = document.getElementById('playButton');
        if (!music || !playButton) return;

        // 绑定播放/暂停点击事件
        playButton.addEventListener('click', function () {
            const isPlaying = !music.paused;
            if (isPlaying) {
                music.pause(); // 如果正在播放，则暂停
            } else {
                music.play().catch(console.error); // 尝试播放，并捕获可能的错误
            }
            playButton.classList.toggle('playing', !isPlaying);
            playButton.classList.toggle('paused', isPlaying);
        });

        // 初始状态设置为暂停
        playButton.classList.add('paused');
    });
})();
