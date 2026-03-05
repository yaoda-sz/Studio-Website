// 全局音乐播放器 - 独立于页面切换
(function () {
    // 检查是否已经存在全局音乐播放器
    if (window.GlobalMusicPlayer) {
        console.log('全局音乐播放器已存在，跳过初始化');
        return;
    }

    console.log('初始化全局音乐播放器...');

    // 音乐播放器配置
    const config = {
        sources: [
            './music/Believer.mp3',
            './music/Five Hundred Miles.mp3',
            './music/Sugar.mp3',
            './music/Rhythm of the Rain.mp3',
            './music/See You Again.mp3',
            './music/Someone You Loved.mp3',
            './music/Brother Louie.mp3',
            './music/Dragostea din tei.mp3',
            './music/Free Loop.mp3',
            './music/Hotel California.mp3',
            './music/It\'s My Life.mp3',
            './music/Rasputin.mp3',
            './music/I Don\'t Want To Say Goodbye.mp3',
            './music/I Hate Myself for Loving You.mp3',
            './music/I\'m Gonna Getcha Good.mp3',
            './music/B What U Wanna B.mp3',
            './music/Lemon Tree.mp3',
            './music/More Than I Can Say.mp3',
            './music/Moonlight Shadow.mp3',
            './music/Staring at You.mp3',
            './music/The Diva Dance.mp3',
            './music/Uptown Girl.mp3',
            './music/Yesterday Once More.mp3',
        ],
        currentIndex: 0,
        volume: 0.6
    };

    // 创建全局音频对象
    const audio = new Audio();
    audio.loop = false; // 改为false，实现歌曲列表循环
    audio.preload = 'auto';

    // 从localStorage恢复状态
    function restoreState() {

        const saved = localStorage.getItem('globalMusicState');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                config.currentIndex = state.currentIndex || 0;
                config.volume = state.volume || 0.6;
                // 不在这里设置音频源，等待页面完全加载后再设置
                return state;
            } catch (e) {
                console.warn('恢复状态失败:', e);
            }
        }

        // 不在这里设置默认音频源，等待页面完全加载后再设置
        return null;
    }

    // 保存状态
    function saveState() {
        const state = {
            isPlaying: !audio.paused,
            currentTime: audio.currentTime,
            currentIndex: config.currentIndex,
            volume: config.volume,
            src: audio.src
        };
        localStorage.setItem('globalMusicState', JSON.stringify(state));
    }

    // 切换播放/暂停
    function toggle() {
        if (audio.paused) {
            // 如果音频还没加载完成，等待加载
            if (audio.readyState < 2) { // HAVE_CURRENT_DATA
                // 监听 canplay 事件
                audio.addEventListener('canplay', function playWhenReady() {
                    audio.play().then(() => {
                        updateButton(true);
                        saveState();
                    }).catch(e => console.error('播放失败:', e));
                    audio.removeEventListener('canplay', playWhenReady);
                }, { once: true });

                // 监听错误事件
                audio.addEventListener('error', function handleError() {
                    console.error('音频加载错误:', audio.error);
                    // 尝试下一首
                    next();
                }, { once: true });

                // 强制重新加载
                audio.load();
            } else {
                audio.play().then(() => {
                    updateButton(true);
                    saveState();
                }).catch(e => console.error('播放失败:', e));
            }
        } else {
            audio.pause();
            updateButton(false);
            saveState();
        }
    }

    // 下一首
    function next() {
        config.currentIndex = (config.currentIndex + 1) % config.sources.length;
        audio.src = config.sources[config.currentIndex];
        audio.volume = config.volume;

        const wasPlaying = true; // 强制播放下一首

        // 等待音频加载完成后再播放
        audio.addEventListener('canplay', function playNext() {
            if (wasPlaying) {
                audio.play().then(() => {
                    updateButton(true);
                    saveState();
                }).catch(e => console.error('播放下一首失败:', e));
            }
            audio.removeEventListener('canplay', playNext);
        }, { once: true });

        audio.load();
        saveState();
    }

    // 上一首
    function prev() {
        config.currentIndex = (config.currentIndex - 1 + config.sources.length) % config.sources.length;
        audio.src = config.sources[config.currentIndex];
        audio.volume = config.volume;

        const wasPlaying = !audio.paused;

        // 等待音频加载完成后再播放
        audio.addEventListener('canplay', function playPrev() {
            if (wasPlaying) {
                audio.play().then(() => {
                    updateButton(true);
                    saveState();
                    console.log('成功播放上一首:', config.sources[config.currentIndex]);
                }).catch(e => console.error('播放上一首失败:', e));
            }
            audio.removeEventListener('canplay', playPrev);
        }, { once: true });

        audio.load();
        console.log('切换到上一首:', config.sources[config.currentIndex]);
        saveState();
    }

    // 更新按钮状态
    function updateButton(isPlaying) {
        const button = document.getElementById('playButton');
        if (button) {
            const playIcon = button.querySelector('.icon-play');
            const stopIcon = button.querySelector('.icon-stop');

            if (playIcon && stopIcon) {
                if (isPlaying) {
                    playIcon.style.display = 'none';
                    stopIcon.style.display = 'block';
                } else {
                    playIcon.style.display = 'block';
                    stopIcon.style.display = 'none';
                }
            }
        }
    }

    // 初始化播放器
    function init() {
        const savedState = restoreState();
        updateButton(savedState && savedState.isPlaying);

        // 定期保存状态
        setInterval(saveState, 1000);

        // 页面卸载时保存
        window.addEventListener('beforeunload', saveState);

        // 音频事件
        audio.addEventListener('play', () => updateButton(true));
        audio.addEventListener('pause', () => updateButton(false));
        audio.addEventListener('ended', () => {
            setTimeout(() => {
                try {
                    next();
                } catch (error) {
                    console.error('切换下一首时出错:', error);
                    audio.currentTime = 0;
                    audio.play().catch(e => console.error('重新播放失败:', e));
                }
            }, 100);
        });
        audio.addEventListener('error', (e) => {
            console.error('音频错误:', e);
            console.error('错误详情:', audio.error);
            // 尝试下一个源
            next();
        });

        // 等待所有页面元素加载完成后再开始加载音乐资源
        window.addEventListener('load', () => {
            console.log('页面所有元素加载完成，准备加载音乐资源');

            // 现在才设置音频源，开始加载音乐资源
            const saved = localStorage.getItem('globalMusicState');
            if (saved) {
                try {
                    const state = JSON.parse(saved);
                    config.currentIndex = state.currentIndex || 0;
                    config.volume = state.volume || 0.6;
                    audio.src = state.src || config.sources[config.currentIndex];
                    audio.volume = config.volume;
                    console.log('已恢复保存的音乐状态，开始加载音频源');
                } catch (e) {
                    console.warn('恢复音乐状态失败，使用默认设置:', e);
                    audio.src = config.sources[config.currentIndex];
                    audio.volume = config.volume;
                    console.log('使用默认音频源，开始加载');
                }
            } else {
                // 设置默认音频源
                audio.src = config.sources[config.currentIndex];
                audio.volume = config.volume;
                console.log('使用默认音频源，开始加载');
            }

            // 如果有保存的播放状态且正在播放，则恢复播放
            if (saved) {
                try {
                    const state = JSON.parse(saved);
                    if (state.isPlaying && state.currentTime) {
                        // 等待音频加载完成后再恢复播放位置和播放
                        audio.addEventListener('canplay', function restorePlay() {
                            audio.currentTime = state.currentTime;
                            audio.play().catch(e => console.log('恢复播放失败:', e));
                            audio.removeEventListener('canplay', restorePlay);
                        }, { once: true });
                        return;
                    }
                } catch (e) {
                    console.warn('恢复播放状态失败:', e);
                }
            }

            // 自动播放第一首歌（在页面完全加载且音频资源开始加载后）
            setTimeout(() => {
                // 等待音频加载完成后再播放
                audio.addEventListener('canplay', function autoPlay() {
                    audio.play().then(() => {
                        updateButton(true);
                        saveState();
                        console.log('页面加载完成后自动播放开始');
                    }).catch(e => console.log('自动播放失败:', e));
                    audio.removeEventListener('canplay', autoPlay);
                }, { once: true });
            }, 500); // 增加延迟确保页面完全稳定
        });
    }

    // 创建全局API
    window.GlobalMusicPlayer = {
        toggle: toggle,
        next: next,
        prev: prev,
        audio: audio,
        config: config,
        // 添加调试功能
        getStatus: () => ({
            currentIndex: config.currentIndex,
            currentSrc: audio.src,
            isPlaying: !audio.paused,
            currentTime: audio.currentTime,
            duration: audio.duration,
            volume: audio.volume,
            readyState: audio.readyState
        })
    };

    // 初始化
    init();

    // 添加键盘快捷键支持
    document.addEventListener('keydown', (e) => {
        // 防止在输入框中触发
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.code) {
            case 'Space':
                e.preventDefault();
                toggle();
                console.log('空格键：播放/暂停');
                break;
            case 'ArrowRight':
                e.preventDefault();
                next();
                console.log('右箭头：下一首');
                break;
            case 'ArrowLeft':
                e.preventDefault();
                prev();
                console.log('左箭头：上一首');
                break;
        }
    });

    // 监听DOM变化，为新页面绑定按钮事件
    const observer = new MutationObserver(() => {
        const button = document.getElementById('playButton');
        if (button && !button.hasAttribute('data-global-music')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle();
            });
            button.setAttribute('data-global-music', 'true');
        }
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始检查按钮
    const initialButton = document.getElementById('playButton');
    if (initialButton && !initialButton.hasAttribute('data-global-music')) {
        initialButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle();
        });
        initialButton.setAttribute('data-global-music', 'true');
        // 更新按钮状态
        updateButton(!audio.paused);
    }
})();