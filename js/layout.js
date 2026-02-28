// js/layout.js
// 1. 定义导航栏 HTML
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
                <li><a href="./cases.html">案例作品</a></li>
                <li><a href="./service.html">作品展示</a></li>
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

// 2. 定义页脚 HTML
const footerHTML = `
<div  class="container">
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
            <img src="./img/weixin.webp" alt="微信二维码" class="wx-qrcode">
        </div>
    </div>
    <hr>
    <div class="endText">
        <p>版权所有：苏州工业园区雨文白告游戏动漫工作室</p>
        <br>
        <p> 2026 yaoda.work | 作品展示测试网站，保留所有权利。</p>
    </div>
</div>
`;

// 4. 定义侧边功能 HTML
const sideControlHTML = `
<!-- 主题切换 -->
<button id="toggleButton">
    <span class="iconfont icon-sunny"></span>
    <!-- <span class="iconfont icon-dark"></span> -->
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

// 3. 自动插入到页面并高亮当前导航
document.addEventListener("DOMContentLoaded", () => {
    try {
        console.log("Layout script loaded successfully");

        // 检查并插入 Header（仅在内容为空时）
        const headerElem = document.querySelector('header');
        if (headerElem && !headerElem.innerHTML.trim()) {
            headerElem.innerHTML = headerHTML;
            console.log("Header content inserted dynamically");
        } else if (headerElem) {
            console.log("Header already has content, skipping dynamic insertion");
        }

        // 检查并插入 Footer（仅在内容为空时）
        const footerElem = document.querySelector('footer');
        if (footerElem && !footerElem.innerHTML.trim()) {
            footerElem.innerHTML = footerHTML;
            console.log("Footer content inserted dynamically");
        } else if (footerElem) {
            console.log("Footer already has content, skipping dynamic insertion");
        }

        // 检查并插入侧边控制按钮（仅在内容为空时）
        const sideControlElem = document.querySelector('#side-control');
        if (sideControlElem && !sideControlElem.innerHTML.trim()) {
            sideControlElem.innerHTML = sideControlHTML;
            console.log("Side control content inserted dynamically");
        } else if (sideControlElem) {
            console.log("Side control already has content, skipping dynamic insertion");
        }

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

        // 重新初始化移动端菜单事件（因为DOM是新生成的）
        // 这里我们需要调用 com.js 里的 setupMobileMenu，但为了简单，
        // 建议直接把 com.js 里的 setupNavigation 和 setupMobileMenu 逻辑整合或者确保在 layout 插入后再执行。
        // 临时的简单办法：触发一个自定义事件告诉 com.js 内容加载完了
        window.dispatchEvent(new Event('layoutLoaded'));
        console.log("LayoutLoaded event dispatched");

    } catch (error) {
        console.error("Error in layout script:", error);
    }
});