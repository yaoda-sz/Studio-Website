// js/main.js - 整合后的主脚本文件
(function () {
    'use strict';

    // ========== 1. HTML模板定义 ==========
    
    // 导航栏 HTML
    const headerHTML = `
    <div id="headerTop" class="container">
        <div class="logo">
            <a href="./index.html">
                <img src="logo.webp" alt="公司Logo">
                <div class="logo-text">
                    <h1>咬哒叔</h1>
                    <p>SPINE 2D STUDIO</p>
                </div>
            </a>
        </div>
        <nav>
            <ul class="nav-links">
                <li><a href="./index.html">首页</a></li>
                <li><a href="./cases.html">客户案例</a></li>
                <li><a href="./works.html">作品展示</a></li>
                <li><a href="./about.html">关于我们</a></li>
                <li><a href="./contact.html">联系我们</a></li>
            </ul>
            <div class="mobile-menu">
                <div class="top-line"></div>
                <div class="middle-line"></div>
                <div class="bottom-line"></div>
            </div>
        </nav>
        <div class="language-selector">
            <div class="language-toggle">
                <span class="iconfont icon-language"></span>
                <span class="current-lang">中</span>
            </div>
            <div class="language-menu">
                <div class="language-option" data-lang="zh">中文</div>
                <div class="language-option" data-lang="en">English</div>
            </div>
        </div>
    </div>
    `;

    // 页脚 HTML
    const footerHTML = `
    <div class="container">
        <div class="contact-info">
            <div class="contact-item-left">
                <ul>
                    <li><span class="iconfont icon-qq"></span><p>QQ:170469162</p></li>
                    <li><span class="iconfont icon-weixin"></span><p>微信:yaodasz</p></li>
                    <li><span class="iconfont icon-phone"></span><p>电话:13814865715</p></li>
                    <li><span class="iconfont icon-mail"></span><p>邮箱:170469162@qq.com</p></li>
                </ul>
            </div>
            <div class="contact-item-right">
                <img src="./img/weixin.webp" sizes="(max-width: 120px), 120px" width="120px" height="120px" alt="微信二维码" loading="lazy" decoding="async">
            </div>
        </div>
        <hr>
        <div class="endText">
            <p>版权解释归：苏州工业园区雨文白告游戏动漫工作室</p>
            <br>
            <p> 2026 yaoda.work | 作品展示测试，保留所有权利。</p>
        </div>
    </div>
    `;

    // 侧边功能 HTML
    const sideControlHTML = `
    <!-- 主题切换 -->
    <button id="toggleButton">
        <span class="iconfont icon-sunny"></span>
    </button>
    <!-- 音乐播放 -->
    <button id="playButton">
        <span class="iconfont icon-play"></span>
        <span class="iconfont icon-stop"></span>
    </button>
    <!-- 回到顶部按钮 -->
    <button id="backTop">
        <span class="iconfont icon-back"></span>
    </button>
    `;

    // ========== 2. DOM插入和初始化 ==========

    function initializeLayout() {
        try {
            console.log("Main script loaded successfully");

            // 插入HTML内容
            insertHTMLContent();

            // 延迟执行事件绑定，确保DOM完全准备好
            requestAnimationFrame(() => {
                highlightCurrentNavigation();
                initializeEventHandlers();
                console.log("All event handlers initialized");
            });

        } catch (error) {
            console.error("Error in main script:", error);
        }
    }

    function insertHTMLContent() {
        // 插入页头
        const headerElem = document.querySelector('header');
        if (headerElem && !headerElem.innerHTML.trim()) {
            headerElem.innerHTML = headerHTML;
            console.log("Header content inserted dynamically");
        } else if (headerElem) {
            console.log("Header already has content, skipping dynamic insertion");
        }

        // 插入页脚
        const footerElem = document.querySelector('footer');
        if (footerElem && !footerElem.innerHTML.trim()) {
            footerElem.innerHTML = footerHTML;
            console.log("Footer content inserted dynamically");
        } else if (footerElem) {
            console.log("Footer already has content, skipping dynamic insertion");
        }

        // 插入侧边控制
        const sideControlElem = document.querySelector('#side-control');
        if (sideControlElem && !sideControlElem.innerHTML.trim()) {
            sideControlElem.innerHTML = sideControlHTML;
            console.log("Side control content inserted dynamically");
        } else if (sideControlElem) {
            console.log("Side control already has content, skipping dynamic insertion");
        }
    }

    // ========== 3. 导航功能 ==========

    function highlightCurrentNavigation() {
        // 自动高亮当前页面的导航链接
        const currentPath = window.location.pathname.toLowerCase();
        const navLinks = document.querySelectorAll('.nav-links a');

        navLinks.forEach(link => {
            let href = link.getAttribute('href').toLowerCase();
            // 处理相对路径：移除 './' 并标准化首页
            href = href.replace('./', '');
            const isHome = (href === 'index.html' || href === '') && (currentPath === '/' || currentPath.endsWith('/index.html') || currentPath === '');

            if (currentPath.endsWith('/' + href) || isHome) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function initializeNavigation() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        nav.addEventListener('click', (ev) => {
            if (ev.target.tagName === 'A') {
                // 移除所有active类
                document.querySelectorAll('nav a').forEach(item => item.classList.remove('active'));
                // 给当前点击的链接添加active类
                ev.target.classList.add('active');
                // 关闭移动端菜单（如果打开）
                closeMobileMenu();
            }
        });
    }

    // ========== 4. 移动端菜单功能 ==========

    function initializeMobileMenu() {
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
    }

    // ========== 5. 主题切换功能 ==========

    function initializeThemeToggle() {
        const toggleButton = document.getElementById('toggleButton');
        const html = document.documentElement;
        const savedTheme = localStorage.getItem('theme') || 'dark'; // 默认深色

        if (!toggleButton) return;

        // 应用保存的主题
        if (savedTheme === 'light') {
            html.setAttribute('data-theme', 'light');
            toggleButton.innerHTML = '<span class="iconfont icon-moon"></span>'; // 浅色模式，显示月亮（切换到深色）
        } else {
            html.removeAttribute('data-theme');
            toggleButton.innerHTML = '<span class="iconfont icon-sunny"></span>'; // 深色模式，显示太阳（切换到浅色）
        }

        toggleButton.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            if (currentTheme === 'light') {
                html.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                toggleButton.innerHTML = '<span class="iconfont icon-sunny"></span>'; // 切换到深色，显示太阳
            } else {
                html.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                toggleButton.innerHTML = '<span class="iconfont icon-moon"></span>'; // 切换到浅色，显示月亮
            }
        });
    }

    // ========== 6. 回到顶部功能 ==========

    function initializeBackTop() {
        const backTop = document.getElementById('backTop');
        if (!backTop) return;

        // 监听滚动事件
        window.addEventListener('scroll', () => {
            // 当页面滚动超过一定距离时显示按钮
            if (window.scrollY > 200) {
                backTop.classList.add('show');
            } else {
                backTop.classList.remove('show');
            }
        });

        // 点击返回顶部
        backTop.addEventListener('click', (e) => {
            e.preventDefault(); // 防止默认行为

            // 检查浏览器是否支持 smooth behavior
            if ('scrollBehavior' in document.documentElement.style && window.scrollTo) {
                try {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    return; // 如果成功，直接返回
                } catch (error) {
                    console.log('Native smooth scroll failed, using fallback');
                }
            }

            // 兼容性回退：手动实现平滑滚动
            const startPosition = window.pageYOffset || document.documentElement.scrollTop;
            const startTime = Date.now(); // 使用 Date.now() 替代 performance.now()
            const duration = 800; // 滚动持续时间（毫秒）

            function easeInOutCubic(t) {
                return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            }

            function animateScroll() {
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = easeInOutCubic(progress);

                const currentPosition = startPosition * (1 - easeProgress);
                window.scrollTo(0, currentPosition);

                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            }

            // 开始动画
            requestAnimationFrame(animateScroll);
        });
    }

    // ========== 7. 统一初始化 ==========

    function initializeEventHandlers() {
        initializeNavigation();
        initializeMobileMenu();
        initializeThemeToggle();
        initializeBackTop();
    }

    // ========== 8. 启动 ==========

    // 使用 DOMContentLoaded 确保页面完全加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLayout);
    } else {
        // 如果已经加载完成，直接执行
        initializeLayout();
    }

})();
