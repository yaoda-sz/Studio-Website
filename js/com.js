(function () {
    // 监听 layout.js 发出的加载完成事件
    document.addEventListener('DOMContentLoaded', init);

    // 简单的错误处理
    window.addEventListener('error', function(e) {
        console.error('页面错误:', e.error || e.message);
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
    console.log('🎬 开始停止所有B站视频，当前跟踪数量:', currentBilibiliIframes.size);

    const allBilibiliIframes = document.querySelectorAll('iframe[src*="player.bilibili.com"]');
    console.log('🔍 页面中找到', allBilibiliIframes.length, '个B站iframe');

    allBilibiliIframes.forEach((iframe, index) => {
        const videoLazyLoad = iframe.parentElement;
        if (videoLazyLoad) {
            const bvid = videoLazyLoad.dataset.bvid;
            const cid = videoLazyLoad.dataset.cid;
            console.log(`📹 恢复视频封面 ${index + 1}: ${bvid}`);

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
                console.log(`✅ 已恢复封面: ${altText}`);
            }
        }
    });
    currentBilibiliIframes.clear();
    console.log('🧹 已清空跟踪列表');
}

document.addEventListener('click', function (e) {
    // 检查点击的是不是我们的视频占位符（或者它的子元素）
    const container = e.target.closest('.video-lazy-load');

    if (container) {
        console.log('🎯 点击了视频容器:', container.dataset.bvid);

        // 1. 停止所有其他播放中的视频
        stopAllBilibiliVideos();

        // 2. 暂停模态框视频（如果正在播放）
        const modalVideo = document.getElementById('modal-video');
        if (modalVideo && !modalVideo.paused) {
            modalVideo.pause();
            console.log('⏸️ 已暂停模态框视频');
        }

        // 获取 HTML 标签里存的 I  
        const bvid = container.dataset.bvid;
        const cid = container.dataset.cid;
        console.log('🚀 开始播放:', bvid);

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

        // 清空容器里的图片和按钮，放入 iframe
        container.innerHTML = '';
        container.appendChild(iframe);

        // 将新播放的视频添加到跟踪列表
        currentBilibiliIframes.add(iframe);
        console.log('📝 已添加到跟踪列表，当前数量:', currentBilibiliIframes.size);

        // 移除点击事件类名，变成普通容器（可选）
        container.classList.remove('video-lazy-load');
    }
});

// 监听滚动事件，检查视频是否滑出视口
function checkVideoVisibility() {
    currentBilibiliIframes.forEach(iframe => {
        const rect = iframe.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        console.log(`🔍 检查视频可见性: top=${rect.top}, bottom=${rect.bottom}, 可见=${isVisible}`);

        // 如果视频滑出视口超过一半，停止它
        if (!isVisible || rect.top > window.innerHeight / 2 || rect.bottom < window.innerHeight / 2) {
            console.log('📺 视频滑出视口，准备停止');
            const videoLazyLoad = iframe.parentElement;
            if (videoLazyLoad) {
                const bvid = videoLazyLoad.dataset.bvid;
                const cid = videoLazyLoad.dataset.cid;
                console.log(`🛑 滚动停止视频: ${bvid}`);

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
                    console.log(`✅ 已恢复封面: ${altText}`);
                }
            }
            currentBilibiliIframes.delete(iframe);
            console.log('🗑️ 已从跟踪列表移除，剩余数量:', currentBilibiliIframes.size);
        }
    });
}

// 添加滚动事件监听器，使用节流优化性能
let scrollTimeout;
window.addEventListener('scroll', function () {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(checkVideoVisibility, 150);
}, { passive: true });
