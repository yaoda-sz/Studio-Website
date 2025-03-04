(function () {
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        // 定义变量
        const navLinks = document.querySelector('.nav-links');
        const mobileMenu = document.querySelector('.mobile-menu');
        const navMenuItems = document.querySelectorAll('.nav-links li');
        const backTop = document.querySelector('#backTop');
        const newDiv = document.querySelector('.new');
        const sections = document.querySelectorAll('.box-big');

        // 添加导航点击事件（仅用于高亮和移动端菜单关闭）
        document.querySelectorAll('nav a').forEach(item => {
            item.addEventListener('click', onNavigation);
        });

        // 导航点击处理
        function onNavigation(ev) {
            const allLinks = document.querySelectorAll('nav a');
            // 清除所有链接的active类
            allLinks.forEach(item => item.classList.remove('active'));
            ev.target.classList.add('active');

            // 不阻止默认跳转行为，让页面自然跳转到href指定的URL
            // 删除scrollIntoView逻辑，因为我们需要页面跳转而非滚动

            // 关闭移动端菜单
            if (mobileMenu && navLinks) {
                mobileMenu.classList.remove('active');
                navLinks.classList.remove('open');
                navMenuItems.forEach(item => item.style.animation = '');
            }
        }

        // 移动端菜单切换
        if (mobileMenu && navLinks) {
            mobileMenu.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                navLinks.classList.toggle('open');
                navMenuItems.forEach((item, index) => {
                    item.style.animation = item.style.animation
                        ? ''
                        : `0.5s ease-in-out slideIn forwards ${index * 0.1 + 0.1}s`;
                });
            });
        }

        // 回到顶部按钮
        if (backTop) {
            backTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            window.addEventListener('scroll', () => {
                const scrollTop = document.documentElement.scrollTop;
                if (newDiv) {
                    backTop.style.bottom = scrollTop >= newDiv.offsetTop ? '10px' : '-60px';
                    backTop.style.opacity = scrollTop >= newDiv.offsetTop ? 1 : 0;
                }
            });
        }

        // Intersection Observer（假设用于动画或其他效果）
        sections.forEach(section => io.observe(section));
    }

    // 假设这是你的Intersection Observer定义（如果未定义会导致报错）
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // 示例效果
            }
        });
    });
})();
// 播放背景音乐
document.addEventListener('DOMContentLoaded', function () {
    const music = document.getElementById('backgroundMusic');
    const playButton = document.getElementById('playButton');

    playButton.addEventListener('click', function () {
        if (music.paused) {
            music.play();
            playButton.classList.remove('paused');
            playButton.classList.add('playing');
        } else {
            music.pause();
            playButton.classList.remove('playing');
            playButton.classList.add('paused');
        }
    });

    // 初始状态设置为暂停
    playButton.classList.add('paused');
});