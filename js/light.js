document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark'; // 默认深色

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
        console.log('Theme switched to:', localStorage.getItem('theme'));
    });
}); 