document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
    const html = document.documentElement;

    toggleButton.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            html.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            toggleButton.innerHTML = '<span class="iconfont icon-dark"></span>'; // 显示月亮图标
        } else {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            toggleButton.innerHTML = '<span class="iconfont icon-sunny"></span>'; // 显示太阳图标
        }
    });
});