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
            './music/因为是女子.mp3',
            './music/我想要Z爱.mp3',
            './music/左小祖咒-当我离开你的时候.mp3'
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
                audio.src = state.src || config.sources[config.currentIndex];
                audio.volume = config.volume;

                if (state.isPlaying && state.currentTime) {
                    audio.currentTime = state.currentTime;
                    // 延迟播放，确保音频加载完成
                    setTimeout(() => {
                        audio.play().catch(e => console.log('自动播放失败:', e));
                    }, 500);
                }
                return state;
            } catch (e) {
                console.warn('恢复状态失败:', e);
            }
        }

        // 默认设置
        audio.src = config.sources[config.currentIndex];
        audio.volume = config.volume;
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
            audio.play().then(() => {
                updateButton(true);
                saveState();
            }).catch(e => console.error('播放失败:', e));
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

        const wasPlaying = !audio.paused;

        // 等待音频加载完成后再播放
        audio.addEventListener('canplay', function playNext() {
            if (wasPlaying) {
                audio.play().then(() => {
                    updateButton(true);
                    saveState();
                    console.log('成功播放下一首:', config.sources[config.currentIndex]);
                }).catch(e => console.error('播放下一首失败:', e));
            }
            audio.removeEventListener('canplay', playNext);
        }, { once: true });

        audio.load();
        console.log('切换到下一首:', config.sources[config.currentIndex]);
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
            console.log('歌曲播放结束，当前索引:', config.currentIndex);
            console.log('准备播放下一首...');

            // 添加延迟确保音频完全结束
            setTimeout(() => {
                try {
                    next();
                } catch (error) {
                    console.error('切换下一首时出错:', error);
                    // 尝试重新播放当前歌曲
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

            // 更新按钮状态
            updateButton(!audio.paused);
        }
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
