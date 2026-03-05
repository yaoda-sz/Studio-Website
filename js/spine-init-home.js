// js/spine-init-home.js  【完整替换版 - 性能优化版】
let players = []; // 保存实例引用，用于后续 pause/dispose

const initSpinePlayers = () => {
    if (players.length > 0) return; // 防止重复初始化

    const configs = [
        {
            id: 'zero-player',
            options: {
                skeleton: "./assets/spine/Zero.skel",
                atlas: "./assets/spine/Zero.atlas",
                animation: "idle",
                skin: "default",
                showControls: true,           // 关闭控制条（节省 DOM + 事件）
                backgroundColor: "#333333",
                premultipliedAlpha: true,
                loop: true,
                viewport: { debug: { bones: false } },
                pauseOnHover: true,
                resumeOnHover: true,
                alpha: true                    // 重要：支持透明
            }
        },
        {
            id: 'role_body-player',
            options: {
                skeleton: "./assets/spine/role_boy.json",
                atlas: "./assets/spine/role_boy.atlas",
                animation: "run_c",
                skin: "default",
                showControls: true,
                backgroundColor: "#333333",
                premultipliedAlpha: true,
                loop: true,
                alpha: true
            }
        },
        {
            id: 'king-player',
            options: {
                skeleton: "./assets/spine/king.json",
                atlas: "./assets/spine/king.atlas",
                animation: "ar",
                showControls: true,
                backgroundColor: "#333333",
                scale: 0.8,
                loop: true,
                premultipliedAlpha: false,
                alpha: true
            }
        }
    ];

    configs.forEach(({ id, options }) => {
        const container = document.getElementById(id);
        if (!container) return;

        try {
            const player = new window.spinePlayer.SpinePlayer(id, options);
            players.push(player);
            console.log(`[Spine-Opt] Initialized #${id}`);
        } catch (e) {
            console.error(e);
        }
    });
};

// === 核心优化：IntersectionObserver 懒加载 ===
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initSpinePlayers();
            observer.disconnect(); // 只触发一次
        }
    });
}, { threshold: 0.1, rootMargin: "100px" });

// 观察 3 个容器
['zero-player', 'role_body-player', 'king-player'].forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
});

// === 视口外自动暂停（大幅降低 CPU）===
const pauseObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const player = players.find(p => p.container && p.container.id === entry.target.id);
        if (!player) return;
        if (entry.isIntersecting) {
            player.play();   // 或 player.animationState.setAnimation(0, currentAnim, true);
        } else {
            player.pause();
        }
    });
}, { threshold: 0.01 });

window.addEventListener('load', () => {
    // 延迟 100ms 再观察，避免初始布局抖动
    setTimeout(() => {
        players.forEach(p => {
            const container = p.container;
            if (container) pauseObserver.observe(container);
        });
    }, 100);
});

// 页面卸载时清理（防止内存泄漏）
window.addEventListener('beforeunload', () => {
    players.forEach(player => {
        if (player.dispose) player.dispose();
    });
});
