document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark'; // é»˜è®¤æ·±è‰²

    // åº”ç”¨ä¿å­˜çš„ä¸»é¢?
    if (savedTheme === 'light') {
        html.setAttribute('data-theme', 'light');
        toggleButton.innerHTML = '<span class="iconfont icon-moon"></span>'; // æµ…è‰²æ¨¡å¼ï¼Œæ˜¾ç¤ºæœˆäº®ï¼ˆåˆ‡æ¢åˆ°æ·±è‰²ï¼‰
    } else {
        html.removeAttribute('data-theme');
        toggleButton.innerHTML = '<span class="iconfont icon-sunny"></span>'; // æ·±è‰²æ¨¡å¼ï¼Œæ˜¾ç¤ºå¤ªé˜³ï¼ˆåˆ‡æ¢åˆ°æµ…è‰²ï¼‰
    }

    toggleButton.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        if (currentTheme === 'light') {
            html.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            toggleButton.innerHTML = '<span class="iconfont icon-sunny"></span>'; // åˆ‡æ¢åˆ°æ·±è‰²ï¼Œæ˜¾ç¤ºå¤ªé˜³
        } else {
            html.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            toggleButton.innerHTML = '<span class="iconfont icon-moon"></span>'; // åˆ‡æ¢åˆ°æµ…è‰²ï¼Œæ˜¾ç¤ºæœˆäº®
        }

    });
}); 