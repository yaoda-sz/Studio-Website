document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
    const body = document.body;

    // 主题切换逻辑
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        toggleButton.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.setAttribute('data-theme', 'dark');
        toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
    }

    toggleButton.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            toggleButton.innerHTML = '<i class="fas fa-moon"></i>'; // 显示月亮图标
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            toggleButton.innerHTML = '<i class="fas fa-sun"></i>'; // 显示太阳图标
        }
    });
});