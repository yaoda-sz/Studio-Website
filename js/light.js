document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    // 新增：初始化按钮图标
    if (currentTheme === 'light') {
        toggleButton.innerHTML = '<span class="iconfont icon-sunny"></span>'; // 当前暗色，显示太阳（切换到浅色）
    } else {
        toggleButton.innerHTML = '<span class="iconfont icon-moon"></span>'; // 当前浅色，显示月亮（切换到暗色）
    }
    toggleButton.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        if (currentTheme === 'light') {
            html.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            toggleButton.innerHTML = '<span class="iconfont icon-moon"></span>'; // 显示月亮图标
        } else {
            html.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            toggleButton.innerHTML = '<span class="iconfont icon-sunny"></span>'; // 显示太阳图标
        }
        console.log('Switching theme, saving:', localStorage.getItem('theme')); // 检查保存后值
    });
});