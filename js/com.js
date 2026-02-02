(function () {
    // 监听 layout.js 发出的加载完成事件
    document.addEventListener('DOMContentLoaded', init);

    // 简洁的错误处理 - 过滤掉已知的跨域错误
    window.addEventListener('error', function (e) {
        const errorMessage = e.message || '';
        const errorUrl = e.filename || '';
        const errorStack = e.error?.stack || '';

        // 过滤掉B站相关的跨域错误和用户脚本错误
        if (errorMessage.includes('Blocked a frame with origin') ||
            errorMessage.includes('cross-origin frame') ||
            errorMessage.includes('Failed to set a named property') ||
            errorMessage.includes('target-densitydpi') ||
            errorUrl.includes('userscript.html') ||
            errorUrl.includes('mbplayer.html') ||
            errorStack.includes('mbplayer.html') ||
            errorStack.includes('wplayer.js')) {
            e.preventDefault();
            e.stopPropagation();
            return true;
        }
    }, true);

    // 全局未处理的Promise错误处理
    window.addEventListener('unhandledrejection', function (e) {
        const errorMessage = e.reason?.message || e.reason || '';
        const errorStack = e.reason?.stack || '';

        // 过滤掉B站相关的跨域错误
        if (errorMessage.includes('Blocked a frame with origin') ||
            errorMessage.includes('cross-origin frame') ||
            errorMessage.includes('Failed to set a named property') ||
            errorStack.includes('mbplayer.html') ||
            errorStack.includes('wplayer.js')) {
            e.preventDefault();
            return;
        }
    });

    // 添加页面加载动画
    function addPageLoadAnimation() {
        // 添加淡入动画
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease-in-out';
            document.body.style.opacity = '1';
        }, 100);

        // 为所有带有 data-animate 属性的元素添加动画
        const animateElements = document.querySelectorAll('[data-animate]');
        animateElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `all 0.5s ease-out ${index * 0.1}s`;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(el);
        });
    }

    function init() {
        initNavigation(); // 设置导航栏事件监听
        initMobileMenu(); // 设置移动端菜单
        addPageLoadAnimation(); // 添加页面加载动画
        initSmoothScroll(); // 初始化平滑滚动
        initHoverEffects(); // 初始化悬停效果
    }
    // 设置导航栏事件监听
    function initNavigation() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        nav.addEventListener('click', (ev) => {
            if (ev.target.tagName === 'A') {
                document.querySelectorAll('nav a').forEach(item => item.classList.remove('active'));
                ev.target.classList.add('active'); // 给当前点击的链接添加 active 类
                closeMobileMenu(); // 关闭移动端菜单（如果打开）
            }
        });
    }

    // 设置移动端菜单
    function initMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const navLinks = document.querySelector('.nav-links');
        const navMenuItems = document.querySelectorAll('.nav-links li');
        if (!mobileMenu || !navLinks) return;

        // 绑定点击事件，切换菜单状态
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navLinks.classList.toggle('open');

            // 添加菜单动画
            navMenuItems.forEach((item, index) => {
                item.style.animation = navLinks.classList.contains('open')
                    ? `0.3s ease-in-out slideIn forwards ${index * 0.1 + 0.1}s`
                    : '';
            });
        });
    }

    // 关闭移动端菜单
    function closeMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const navLinks = document.querySelector('.nav-links');
        if (mobileMenu && navLinks) {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('open');
        }
    }

    // 初始化平滑滚动
    function initSmoothScroll() {
        // 为所有锚点链接添加平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // 减去导航栏高度
                        behavior: 'smooth'
                    });
                }
            });
        });

        // 返回顶部按钮
        const backTop = document.getElementById('backTop');
        if (backTop) {
            window.addEventListener('scroll', () => {
                // 当页面滚动超过一定距离时显示按钮
                if (window.scrollY > 200) {
                    backTop.classList.add('show');
                } else {
                    backTop.classList.remove('show');
                }
            });

            // 点击返回顶部
            backTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // 初始化悬停效果
    function initHoverEffects() {
        // 为卡片添加悬停效果
        document.querySelectorAll('.card, .card-v').forEach(card => {
            card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';

            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 10px 10px rgba(0,0,0,0.2)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            });
        });

        // 为按钮添加波纹效果
        document.querySelectorAll('button, .btn, a.btn').forEach(button => {
            button.addEventListener('click', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;

                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 1000);
            });
        });
    }
})();

// 背景音乐播放控制
(function () {
    let audio, playButton, playIcon, stopIcon;

    function initMusicPlayer() {
        playButton = document.getElementById('playButton');

        if (!playButton) {
            return;
        }

        playIcon = playButton.querySelector('.icon-play');
        stopIcon = playButton.querySelector('.icon-stop');

        // 恢复播放状态
        const savedState = localStorage.getItem('musicState');
        const savedTime = localStorage.getItem('musicTime');

        // 设置初始状态 - 智能恢复
        if (savedState === 'playing') {
            if (playIcon) playIcon.style.display = 'block';
            if (stopIcon) stopIcon.style.display = 'none';

            // 延迟检查用户是否主动交互
            setTimeout(() => {
                const currentState = localStorage.getItem('musicState');
                if (currentState === 'playing' && !audio) {
                    // 模拟用户点击来触发播放
                    playButton.click();
                }
            }, 2000);
        } else {
            if (stopIcon) stopIcon.style.display = 'none';
            if (playIcon) playIcon.style.display = 'block';
        }

        // 简单的点击事件
        playButton.addEventListener('click', async () => {
            // 首次点击时创建音频元素
            if (!audio) {
                audio = document.createElement('audio');
                audio.id = 'backgroundMusic';
                audio.loop = true;

                try {
                    // 使用fetch获取音频文件并创建Blob URL
                    const response = await fetch('./music/eyes on fire.mp3');

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const blob = await response.blob();
                    const audioUrl = URL.createObjectURL(blob);

                    audio.src = audioUrl;

                    // 添加到DOM（但不显示）
                    document.body.appendChild(audio);

                    // 等待音频加载完成
                    audio.addEventListener('loadeddata', () => {
                        // 设置保存的播放时间
                        const savedTime = localStorage.getItem('musicTime');
                        if (savedTime) {
                            audio.currentTime = parseFloat(savedTime);
                        }

                        // 添加其他事件监听器
                        audio.addEventListener('timeupdate', () => {
                            if (!audio.paused) {
                                localStorage.setItem('musicTime', audio.currentTime.toString());
                            }
                        });

                        audio.addEventListener('ended', () => {
                            localStorage.setItem('musicState', 'paused');
                            localStorage.setItem('musicTime', '0');
                            if (playIcon) playIcon.style.display = 'block';
                            if (stopIcon) stopIcon.style.display = 'none';
                        });

                        // 尝试播放
                        audio.play().then(() => {
                            localStorage.setItem('musicState', 'playing');
                            if (playIcon) playIcon.style.display = 'none';
                            if (stopIcon) stopIcon.style.display = 'block';
                        }).catch(e => {
                            localStorage.setItem('musicState', 'paused');
                        });
                    });

                    audio.addEventListener('error', (e) => {
                        localStorage.setItem('musicState', 'paused');
                    });

                } catch (error) {
                    // 降级到直接设置src
                    audio.src = './music/eyes on fire.mp3';
                    document.body.appendChild(audio);

                    audio.addEventListener('loadeddata', () => {
                        audio.play().then(() => {
                            localStorage.setItem('musicState', 'playing');
                            if (playIcon) playIcon.style.display = 'none';
                            if (stopIcon) stopIcon.style.display = 'block';
                        }).catch(e => {
                            localStorage.setItem('musicState', 'paused');
                        });
                    });
                }
            } else {
                if (audio.paused) {
                    audio.play().then(() => {
                        localStorage.setItem('musicState', 'playing');
                        if (playIcon) playIcon.style.display = 'none';
                        if (stopIcon) stopIcon.style.display = 'block';
                    }).catch(e => {
                        localStorage.setItem('musicState', 'paused');
                    });
                } else {
                    audio.pause();
                    localStorage.setItem('musicState', 'paused');
                    if (playIcon) playIcon.style.display = 'block';
                    if (stopIcon) stopIcon.style.display = 'none';
                }
            }
        });
    }

    // 监听layout.js发出的加载完成事件
    document.addEventListener('layoutLoaded', initMusicPlayer);

    // 也监听DOMContentLoaded，以防万一
    document.addEventListener('DOMContentLoaded', initMusicPlayer);
})();

// 监听所有 class 为 video-lazy-load 元素的点击事件
// 全局变量跟踪当前播放的B站视频
let currentBilibiliIframes = new Set(); // 使用Set存储所有播放中的B站视频

// 停止所有B站视频并恢复封面的函数
function stopAllBilibiliVideos() {
    const allBilibiliIframes = document.querySelectorAll('iframe[src*="player.bilibili.com"]');

    allBilibiliIframes.forEach((iframe, index) => {
        const videoLazyLoad = iframe.parentElement;
        if (videoLazyLoad) {
            const bvid = videoLazyLoad.dataset.bvid;
            const cid = videoLazyLoad.dataset.cid;

            if (bvid && cid) {
                // 根据不同的bvid恢复对应的封面
                let coverSrc = './img/bolikuanhu_cover.webp'; // 默认封面
                let altText = '视频封面';

                if (bvid === 'BV1Mfbzz7E8P') {
                    coverSrc = './img/bolikuanhu_cover.webp';
                    altText = '波粒狂潮视频封面';
                } else if (bvid === 'BV1foXxY5END') {
                    coverSrc = './img/shenmojue.jpg';
                    altText = '神魔诀视频封面';
                } else if (bvid === 'BV11L9BYREaB') {
                    coverSrc = './img/bigbird.jpg';
                    altText = '魔法玩具树屋视频封面';
                } else if (bvid === 'BV1bEatzdEUh') {
                    coverSrc = './img/yingyufei.jpg';
                    altText = '银与绯视频封面';
                }

                videoLazyLoad.innerHTML = `
                    <img src="${coverSrc}" alt="${altText}" class="video-poster">
                    <div class="play-icon">
                        <span class="iconfont icon-play"></span>
                    </div>
                `;
                videoLazyLoad.classList.add('video-lazy-load');
            }
        }
    });
    currentBilibiliIframes.clear();
}

document.addEventListener('click', function (e) {
    // 检查点击的是不是我们的视频占位符（或者它的子元素）
    const container = e.target.closest('.video-lazy-load');

    if (container) {
        // 1. 停止所有其他播放中的视频
        stopAllBilibiliVideos();

        // 2. 暂停模态框视频（如果正在播放）
        const modalVideo = document.getElementById('modal-video');
        if (modalVideo && !modalVideo.paused) {
            modalVideo.pause();
        }

        // 获取 HTML 标签里存的 I  
        const bvid = container.dataset.bvid;
        const cid = container.dataset.cid;

        // 获取封面信息用于错误恢复
        let coverSrc = './img/bolikuanhu_cover.webp';
        let altText = '视频封面';
        if (bvid === 'BV1Mfbzz7E8P') {
            coverSrc = './img/bolikuanhu_cover.webp';
            altText = '波粒狂潮视频封面';
        } else if (bvid === 'BV1foXxY5END') {
            coverSrc = './img/shenmojue.jpg';
            altText = '神魔诀视频封面';
        } else if (bvid === 'BV11L9BYREaB') {
            coverSrc = './img/bigbird.jpg';
            altText = '魔法玩具树屋视频封面';
        } else if (bvid === 'BV1bEatzdEUh') {
            coverSrc = './img/yingyufei.jpg';
            altText = '银与绯视频封面';
        }

        const iframe = document.createElement('iframe');
        // 注意：autoplay=1 让视频加载出来后自动播放
        iframe.src = `https://player.bilibili.com/player.html?isOutside=true&bvid=${bvid}&cid=${cid}&autoplay=1`;

        // 设置 iframe 的样式属性
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('border', '0');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('framespacing', '0');
        iframe.setAttribute('allowfullscreen', 'true');

        // 添加更严格的安全相关属性以防止跨域问题
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock');
        iframe.setAttribute('loading', 'lazy');

        // 添加referrerpolicy来增强安全性
        iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');

        // 添加CSP兼容性
        iframe.setAttribute('data-crossorigin', 'anonymous');

        // 添加错误处理
        iframe.onerror = function () {
            // 恢复封面
            container.innerHTML = `
                <img src="${coverSrc}" alt="${altText}" class="video-poster">
                <div class="play-icon">
                    <span class="iconfont icon-play"></span>
                </div>
            `;
            container.classList.add('video-lazy-load');
        };

        // 清空容器里的图片和按钮，放入 iframe
        container.innerHTML = '';
        container.appendChild(iframe);

        // 将新播放的视频添加到跟踪列表
        currentBilibiliIframes.add(iframe);

        // 移除点击事件类名，变成普通容器（可选）
        container.classList.remove('video-lazy-load');
    }
});

// 监听滚动事件，检查视频是否滑出视口
function checkVideoVisibility() {
    currentBilibiliIframes.forEach(iframe => {
        const rect = iframe.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // 计算视频在视口中的可见比例
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const videoHeight = rect.height;
        const visibleRatio = videoHeight > 0 ? visibleHeight / videoHeight : 0;

        // 优化停止条件：只有当视频可见比例小于20%时才停止
        // 这样可以避免在移动端过早停止视频
        if (visibleRatio < 0.2 || rect.bottom < 0 || rect.top > viewportHeight) {
            const videoLazyLoad = iframe.parentElement;
            if (videoLazyLoad) {
                const bvid = videoLazyLoad.dataset.bvid;
                const cid = videoLazyLoad.dataset.cid;

                if (bvid && cid) {
                    // 根据不同的bvid恢复对应的封面
                    let coverSrc = './img/bolikuanhu_cover.webp'; // 默认封面
                    let altText = '视频封面';

                    if (bvid === 'BV1Mfbzz7E8P') {
                        coverSrc = './img/bolikuanhu_cover.webp';
                        altText = '波粒狂潮视频封面';
                    } else if (bvid === 'BV1foXxY5END') {
                        coverSrc = './img/shenmojue.jpg';
                        altText = '神魔诀视频封面';
                    } else if (bvid === 'BV11L9BYREaB') {
                        coverSrc = './img/bigbird.jpg';
                        altText = '魔法玩具树屋视频封面';
                    } else if (bvid === 'BV1bEatzdEUh') {
                        coverSrc = './img/yingyufei.jpg';
                        altText = '银与绯视频封面';
                    }

                    videoLazyLoad.innerHTML = `
                        <img src="${coverSrc}" alt="${altText}" class="video-poster">
                        <div class="play-icon">
                            <span class="iconfont icon-play"></span>
                        </div>
                    `;
                    videoLazyLoad.classList.add('video-lazy-load');
                }
            }
            currentBilibiliIframes.delete(iframe);
        }
    });
}

// 添加滚动事件监听器，使用节流优化性能
let scrollTimeout;
let isScrolling = false;

// 检测是否为移动设备
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

window.addEventListener('scroll', function () {
    clearTimeout(scrollTimeout);

    // 移动端使用更长的延迟，避免过于频繁的检查
    const delay = isMobileDevice() ? 300 : 150;

    scrollTimeout = setTimeout(() => {
        if (!isScrolling) {
            isScrolling = true;
            checkVideoVisibility();
            // 滚动结束后再等待一段时间才重置状态
            setTimeout(() => {
                isScrolling = false;
            }, delay);
        }
    }, delay);
}, { passive: true });

// 添加触摸结束事件，确保在触摸滑动结束后正确检查视频状态
if (isMobileDevice()) {
    window.addEventListener('touchend', function () {
        setTimeout(checkVideoVisibility, 100);
    }, { passive: true });
}
