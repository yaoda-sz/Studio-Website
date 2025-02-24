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

        // 添加导航点击事件
        document.querySelectorAll('nav a').forEach(item => {
            item.addEventListener('click', onNavigation);
        });

        // 导航点击处理
        function onNavigation(ev) {
            ev.preventDefault();
            const allLinks = document.querySelectorAll('nav a');
            allLinks.forEach(item => item.classList.remove('active'));
            ev.target.classList.add('active');

            const targetId = ev.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

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

        // 滚动高亮导航
        const io = new IntersectionObserver((entries) => {
            const mostVisible = entries.reduce((max, curr) =>
                curr.intersectionRatio > max.intersectionRatio ? curr : max
            );
            if (mostVisible.intersectionRatio > 0) {
                const id = mostVisible.target.getAttribute('id');
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.6 // 当60%区域可见时触发
        });

        sections.forEach(section => io.observe(section));
    }
})();