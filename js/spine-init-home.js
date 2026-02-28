window.addEventListener('load', () => {
    if (window.location && window.location.protocol === 'file:') {
        console.warn('[spine-init] Detected file:// protocol. Spine assets may fail to load due to browser security restrictions. Use a local http server to test.');
    }

    if (!window.spinePlayer || !window.spinePlayer.SpinePlayer) {
        console.error('[spine-init] spine-player not loaded. window.spinePlayer.SpinePlayer is missing.');
        return;
    }

    const players = [
        {
            id: 'zero-player',
            options: {
                skeleton: "./assets/spine/Zero.skel",
                atlas: "./assets/spine/Zero.atlas",
                animation: "idle",
                skin: "default",
                showControls: true,
                backgroundColor: "#333333",
                premultipliedAlpha: true,
                loop: true,
                viewport: { debug: { bones: false } },
                pauseOnHover: true,
                resumeOnHover: true
            }
        },
        {
            id: 'role_body-player',
            options: {
                skeleton: "./assets/spine/role_boy.json",
                atlas: "./assets/spine/role_boy.atlas",
                animation: "run_c",
                skin: "default",
                backgroundColor: "#333333",
                premultipliedAlpha: true,
                showControls: true,
                loop: true,
            }
        },
        {
            id: 'king-player',
            options: {
                skeleton: "./assets/spine/king.json",
                atlas: "./assets/spine/king4.2.atlas",
                animation: "ar",
                showControls: true,
                backgroundColor: "#333333",
                scale: 0.8,
                loop: true,
                premultipliedAlpha: false,
                viewport: { debug: { bones: false } },
                pauseOnHover: false,
                resumeOnHover: true
            }
        }
    ];

    players.forEach(({ id, options }) => {
        const el = document.getElementById(id);
        if (!el) {
            console.warn(`[spine-init] Container #${id} not found, skipped.`);
            return;
        }

        try {
            new window.spinePlayer.SpinePlayer(id, options);
            console.log(`[spine-init] Initialized #${id}`);
        } catch (err) {
            console.error(`[spine-init] Failed to init #${id}`, err);
        }
    });
});
