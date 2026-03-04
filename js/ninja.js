(async function () {
    // 等待DOM完全加载
    if (document.readyState === 'loading') {
        await new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', resolve);
        });
    }

    console.log('DOM loaded, starting ninja character initialization');

    // 获取容器 DOM 节点
    const container = document.getElementById('display-container');

    if (!container) {
        console.error('display-container element not found!');
        return;
    }

    console.log('Container found:', container);

    // 隐藏加载指示器
    const loadingIndicator = document.getElementById('spine-loading');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
        console.log('Loading indicator hidden');
    }

    // ===== 全局配置参数 =====
    const CONFIG = {
        RETURN_DURATION: 0.8,         // 角色回弹到中心所需的总时间（秒）
        RETURN_PHYSICS_SCALE: 0.6,    // 回弹时的物理摆动系数（控制衣服头发晃动幅度）
        RELEASE_ADJUST_DURATION: 0.2, // 松手后的平滑起步缓冲时间
        FINISH_DURATION: 0.12,        // 接近终点时的微调对齐时间
        EASE_ACCEL_PORTION: 0.5,      // 缓动曲线加速阶段占比（0.5为中间点）
        EASE_POWER: 2.0               // 缓动强度（数值越大回弹速度感越强）
    };

    // 1. 初始化 PIXI 应用
    const app = new PIXI.Application();
    try {
        await app.init({
            resizeTo: container,          // 画布尺寸跟随 1400x600 容器
            backgroundAlpha: 0,           // 画布透明，显示下层的背景和紫色色块
            resolution: window.devicePixelRatio || 1, // 适配高分辨率屏幕
            autoDensity: true,
        });
        console.log('PIXI application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize PIXI application:', error);
        return;
    }

    container.appendChild(app.canvas); // 将生成的 Canvas 添加到容器中
    console.log('Canvas added to container');

    // 2. 加载 Spine 骨骼资源
    PIXI.Assets.add({ alias: "girlData", src: "./assets/spine/ninja.skel" });
    PIXI.Assets.add({ alias: "girlAtlas", src: "./assets/spine/ninja.atlas" });
    try {
        await PIXI.Assets.load(["girlData", "girlAtlas"]);
        console.log('Spine assets loaded successfully');
    } catch (error) {
        console.error('Failed to load Spine assets:', error);
        return;
    }

    // 3. 创建 Spine 角色实例
    let girl;
    try {
        girl = spine.Spine.from({
            skeleton: "girlData",
            atlas: "girlAtlas",
            scale: 0.55, // 根据需要缩放角色大小
        });
        console.log('Spine character created successfully');
    } catch (error) {
        console.error('Failed to create Spine character:', error);
        return;
    }

    // ===== 状态控制与缓存变量 =====
    let originX, originY;             // 记录容器中心点（角色回弹的目标点）
    let minY = 0, maxY = 0;           // 垂直方向的可移动范围边界

    let isDragging = false;           // 标记是否正在被玩家拖拽
    let isReturning = false;          // 标记是否正处于回弹动画中
    let isFinishing = false;          // 标记是否处于回弹收尾对齐阶段

    let lastPosition = { x: 0, y: 0 }; // 记录上一帧的鼠标坐标，用于计算位移增量
    let startReturnPosition = { x: 0, y: 0 }; // 松手瞬间角色的位置坐标

    let returnTime = 0;               // 回弹过程累计时间
    let releaseAdjustTime = 0;        // 松手缓冲累计时间
    let finishTime = 0;               // 收尾阶段累计时间
    let finishStartPosition = { x: 0, y: 0 }; // 收尾阶段的起始坐标

    /**
     * 尺寸缓存函数：在初始化或容器改变大小时调用
     * 预先计算好中心点和上下边界，避免在 Ticker 循环中重复计算，提升性能
     */
    function updateSizeCache() {
        try {
            const bounds = girl.getBounds();
            const cw = container.clientWidth;
            const ch = container.clientHeight;

            // ===== 响应式缩放逻辑 =====
            let responsiveScale;

            // 桌面端：保持原始缩放
            if (cw >= 900) {
                responsiveScale = 1;
            }
            // 平板端：轻微缩小
            else if (cw >= 480) {
                responsiveScale = 0.6;
            }
            // 手机端：适度缩小，但保持足够大
            else {
                // 根据屏幕宽度动态调整，提高最小缩放值
                const minWidth = 320;
                const maxWidth = 480;
                const minScale = 0.48;
                const maxScale = 0.54;

                // 线性插值计算缩放
                const ratio = (cw - minWidth) / (maxWidth - minWidth);
                responsiveScale = minScale + ratio * (maxScale - minScale);
            }

            // 应用缩放
            girl.scale.set(responsiveScale);

            // 重新获取边界（因为缩放改变了）
            const newBounds = girl.getBounds();

            // 计算 Y 轴的可移动限制区间
            const offsetTop = girl.y - newBounds.y;
            const offsetBottom = (newBounds.y + newBounds.height) - girl.y;
            minY = offsetTop;
            maxY = ch - offsetBottom;

            // 计算右边sky-bg元素的中心点作为角色默认坐标
            const skyBgElement = document.getElementById('sky-bg');

            if (skyBgElement) {
                const skyBgRect = skyBgElement.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();

                // 使用PIXI的坐标系统进行转换
                const scaleX = app.screen.width / container.clientWidth;
                const scaleY = app.screen.height / container.clientHeight;

                // 计算sky-bg相对于容器的中心点坐标，并转换为PIXI坐标
                const relativeX = skyBgRect.left - containerRect.left + skyBgRect.width / 2;
                originX = relativeX * scaleX;

                // 确保originX在合理范围内
                originX = Math.max(0, Math.min(app.screen.width, originX));
            } else {
                // 如果找不到sky-bg元素，回退到右侧1/8位置（使用PIXI坐标）
                originX = app.screen.width / 2 + app.screen.width / 8;
            }

            // 计算Y轴中心点
            originY = ch / 2 + (newBounds.height / 4);
            originY = Math.max(minY, Math.min(maxY, originY));

            console.log('坐标更新:', { originX, originY, containerWidth: cw, containerHeight: ch });
        } catch (e) {
            console.error("计算边界出错", e);
            // 出错时使用默认值
            originX = app.screen.width / 2;
            originY = app.screen.height / 2;
        }
    }

    /**
     * 安全物理同步：将当前帧产生的位移 dx/dy 传递给 Spine 的物理引擎
     * 这样角色在移动时，头发、裙摆等会有自然的惯性晃动
     */
    function safePhysicsTranslate(dx, dy) {
        if (girl?.skeleton?.physicsTranslate) {
            try {
                girl.skeleton.physicsTranslate(dx, dy);
            } catch (e) {
                console.warn('物理同步时出错:', e);
            }
        }
    }

    /**
     * 自定义缓动函数：模拟先加速后减速的平滑过程
     * t: 当前进度比例 (0 ~ 1)
     */
    function customEase(t) {
        const p = CONFIG.EASE_ACCEL_PORTION;
        if (t < p) {
            // 加速阶段
            return Math.pow(t / p, CONFIG.EASE_POWER) * p;
        } else {
            // 减速阶段
            const local = (t - p) / (1 - p);
            return p + (1 - Math.pow(1 - local, CONFIG.EASE_POWER)) * (1 - p);
        }
    }

    try {
        girl.state.setAnimation(0, "swing", true); // 播放默认待机动画
        girl.state.setAnimation(1, "eyeblink-long", true); // 播放眨眼动画（叠加在track 1上）
        app.stage.addChild(girl);
        console.log('Character animations set and added to stage');

    } catch (error) {
        console.error('Failed to set animations or add character to stage:', error);
        return;
    }

    // 执行初始计算并将角色放入正确位置
    const setInitialPosition = () => {
        updateSizeCache();
        girl.x = originX;
        girl.y = originY;
    };

    // 设置初始位置 - 简化版本
    setTimeout(setInitialPosition, 100);

    // 统一的 resize 处理
    const handleResize = () => {
        setTimeout(() => {
            updateSizeCache();
            if (girl.x !== originX || girl.y !== originY) {
                girl.x = originX;
                girl.y = originY;
            }
        }, 100);
    };

    app.renderer.on('resize', handleResize);
    window.addEventListener('resize', handleResize);

    // 4. 设置交互响应
    app.stage.eventMode = 'dynamic'; // 开启交互模式
    app.stage.hitArea = app.screen; // 全屏响应鼠标事件

    // 鼠标按下：开始拖拽
    app.stage.on("pointerdown", (e) => {
        isDragging = true;
        isReturning = false;
        isFinishing = false;
        lastPosition.x = e.data.global.x; // 记录初始按下的位置
        lastPosition.y = e.data.global.y;

        // 播放“被抓起”的动画
        const entry = girl.state.setAnimation(0, "feet", true);
        if (entry) entry.mixDuration = 0.25;
        // 确保眨眼动画持续播放
        girl.state.setAnimation(1, "eyeblink-long", true);
    });

    // 鼠标移动：计算位移并应用约束
    app.stage.on("pointermove", (e) => {
        if (!isDragging) return;

        const currX = e.data.global.x;
        const currY = e.data.global.y;

        // 计算当前帧与上一帧的鼠标位移差值
        const dx = currX - lastPosition.x;
        const dy = currY - lastPosition.y;

        // --- 坐标限制核心逻辑 ---
        // X 轴：左右不限制，直接累加位移，允许角色移出容器
        const nextX = girl.x + dx;

        // Y 轴：上下严格限制在 [minY, maxY] 范围内，不允许出框
        const nextY = Math.max(minY, Math.min(maxY, girl.y + dy));

        // 计算实际应用后的位移量（用于物理系统同步）
        const appliedDx = nextX - girl.x;
        const appliedDy = nextY - girl.y;

        // 更新角色坐标
        girl.x = nextX;
        girl.y = nextY;

        // 产生衣服晃动的物理感
        safePhysicsTranslate(appliedDx, appliedDy);

        // 更新记录，供下一帧使用
        lastPosition.x = currX;
        lastPosition.y = currY;
    });

    // 鼠标松开（包括移出区域）：启动回弹
    const onRelease = () => {
        if (!isDragging) return;
        isDragging = false;
        isReturning = true;
        returnTime = 0;
        releaseAdjustTime = 0;
        startReturnPosition.x = girl.x; // 记录松手时的起点坐标
        startReturnPosition.y = girl.y;
    };

    app.stage.on("pointerup", onRelease);
    app.stage.on("pointerupoutside", onRelease);

    window.addEventListener('beforeunload', () => {
        try {
            app?.destroy?.(true);
        } catch (e) {
            console.warn('销毁应用时出错:', e);
        }
    });

    // 5. 每帧更新循环 (Ticker)
    app.ticker.add((ticker) => {
        if (!isReturning) return; // 非回弹状态直接跳过逻辑

        const dt = ticker.deltaMS / 1000; // 本帧耗时（秒）
        returnTime += dt;
        releaseAdjustTime += dt;

        // 计算当前回弹进度 (0 ~ 1)
        const t = Math.min(returnTime / CONFIG.RETURN_DURATION, 1);
        const ease = customEase(t);

        // 根据缓动曲线计算当前帧角色的目标位置（向中心点收拢）
        const targetX = startReturnPosition.x + (originX - startReturnPosition.x) * ease;
        const targetY = Math.max(minY, Math.min(maxY, startReturnPosition.y + (originY - startReturnPosition.y) * ease));

        const prevX = girl.x;
        const prevY = girl.y;

        // 更新坐标
        girl.x = targetX;
        girl.y = targetY;

        // 计算回弹过程中的物理效果
        // 使用 physicsMul 实现平滑起步，防止松手瞬间物理系统受力过猛
        const physicsMul = Math.min(1, releaseAdjustTime / CONFIG.RELEASE_ADJUST_DURATION);
        safePhysicsTranslate(
            (girl.x - prevX) * CONFIG.RETURN_PHYSICS_SCALE * physicsMul,
            (girl.y - prevY) * CONFIG.RETURN_PHYSICS_SCALE * physicsMul
        );

        // 6. 收尾对齐阶段处理
        if (t >= 1 && !isFinishing) {
            isFinishing = true;
            finishTime = 0;
            finishStartPosition.x = girl.x;
            finishStartPosition.y = girl.y;
        }

        if (isFinishing) {
            finishTime += dt;
            const ff = Math.min(1, finishTime / CONFIG.FINISH_DURATION);
            const sf = ff * ff * (3 - 2 * ff); // Smoothstep 曲线，用于最后 0.12s 的细腻对齐

            const nextX = finishStartPosition.x + (originX - finishStartPosition.x) * sf;
            const nextY = Math.max(minY, Math.min(maxY, finishStartPosition.y + (originY - finishStartPosition.y) * sf));

            // 最后一刻的物理微调
            safePhysicsTranslate((nextX - girl.x) * CONFIG.RETURN_PHYSICS_SCALE, (nextY - girl.y) * CONFIG.RETURN_PHYSICS_SCALE);

            girl.x = nextX;
            girl.y = nextY;

            // 动画完全结束
            if (ff >= 1) {
                isReturning = false;
                isFinishing = false;
                // 切换回普通的待机摇摆动画
                const entry = girl.state.setAnimation(0, "swing", true);
                if (entry) entry.mixDuration = 0.5;
                // 确保眨眼动画持续播放
                girl.state.setAnimation(1, "eyeblink-long", true);
            }
        }
    });
})();