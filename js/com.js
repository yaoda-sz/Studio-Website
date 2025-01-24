document.addEventListener('DOMContentLoaded', init)
// 初始化导航页签的激活样式
function init() {
    addEventListener()
}
function addEventListener() {
    document.querySelectorAll('nav a').forEach(item => {
        item.addEventListener('click', onNavigation)
    })
}
function onNavigation(ev) {
    ev.preventDefault(); // 阻止默认行为，确保平滑滚动生效
    document.querySelectorAll('nav a').forEach(item => {
        item.classList.remove('active')
    })
    ev.target.classList.add('active')

    // 获取目标元素的ID
    const targetId = ev.target.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);

    // 平滑滚动到目标元素
    targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

    // 关闭移动设备上的导航菜单
    mobileMenu.classList.remove('active');
    navLinks.classList.remove('open');

    navMenuItems.forEach((item) => {
        item.style.animation = '';
    });
}

// 回到顶部按钮
const backTop = document.querySelector('#backTop');
backTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
})
// 切换小尺寸导航菜单显示状态
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const navMenuItems = document.querySelectorAll('.nav-links li');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navLinks.classList.toggle('open');

    navMenuItems.forEach((item, index) => {
        if (item.style.animation) {
            item.style.animation = '';
        } else {
            item.style.animation = `0.5s ease-in-out slideIn forwards ${index * 0.1 + 0.1}s`;
        }
    });
});