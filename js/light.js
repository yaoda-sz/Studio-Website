document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
    const body = document.body;


    // 检查保存的主题或系统偏好
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.setAttribute('data-theme', 'dark');
    }

    // 切换主题
    duckIcon.style.display = 'none';
    sunnyIcon.style.display = 'block';
    toggleButton.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            sunnyIcon.style.display = 'none';
            duckIcon.style.display = 'block';
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            sunnyIcon.style.display = 'block';
            duckIcon.style.display = 'none';
        }
    });
});