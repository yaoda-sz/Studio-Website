// js/layout.js

// 1. 定义导航栏 HTML
const headerHTML = `
<div class="container">
    <div class="logo">
        <a href="./index.html">
            <img src="./img/logo.webp" alt="公司Logo">
            <h1>雨文白告工作室</h1>
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
</div>
`;

// 2. 定义页脚 HTML
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
            <img src="./img/weixin.webp" alt="微信二维码" class="wx-qrcode">
        </div>
    </div>
    <hr>
    <div class="bottom">
        <p>版权所有：苏州工业园区雨文白告游戏动漫工作室</p>
        <br>
        <p>© 2025 yaoda.art | 作品展示测试网站，保留所有权利。</p>
    </div>
</div>
`;

// 3. 自动插入到页面并高亮当前导航
document.addEventListener("DOMContentLoaded", () => {
    // 插入 Header
    const headerElem = document.querySelector('header');
    if (headerElem) headerElem.innerHTML = headerHTML;

    // 插入 Footer
    const footerElem = document.querySelector('footer');
    if (footerElem) footerElem.innerHTML = footerHTML;

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
});