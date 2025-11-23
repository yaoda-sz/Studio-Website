// 定义该页面的视频数据
const videoData = [
    {
        // 预览图链接（用于列表页，可以是 GIF/WebP/JPG）
        srcMp4: "./video/mmd/mmd_mache.mp4",
        srcWebm: "./video/mmd/mmd_mache.webm",
        label: "交互动效展示"
    },
    {
        srcMp4: "./video/mmd/mmd_clickhouse.mp4",
        srcWebm: "./video/mmd/mmd_clickhouse.webm",
        label: "交互动效展示"
    },
    {
        srcMp4: "./video/mmd/mmd_fx_lvup02.mp4",
        srcWebm: "./video/mmd/mmd_fx_lvup02.webm",
        label: "交互动效展示"
    },
    {
        srcMp4: "./video/mmd/mmd_clicktree.mp4",
        srcWebm: "./video/mmd/mmd_clicktree.webm",
        label: "交互动效展示"
    },
    {
        srcMp4: "./video/mmd/mmd_fish_girl.mp4",
        srcWebm: "./video/mmd/mmd_fish_girl.webm",
        label: "钓鱼女孩动画展示"
    },
    {
        srcMp4: "./video/king.mp4",
        srcWebm: "./video/king.webm",
        label: "战斗角色动作展示"
    },
    {
        srcMp4: "./video/mmd/mmd_fx_card01.mp4",
        srcWebm: "./video/mmd/mmd_fx_card01.webm",
        label: "抽卡金鱼动画展示"
    },
    {
        srcMp4: "./video/mmd/mmd_fx01.mp4",
        srcWebm: "./video/mmd/mmd_fx01.webm",
        label: "飘花动画展示"
    },
    {
        srcMp4: "./video/mmd/mmd_fx02.mp4",
        srcWebm: "./video/mmd/mmd_fx02.webm",
        label: "飘花动画展示"
    },
    {
        srcMp4: "./video/mmd/mmd_fx03.mp4",
        srcWebm: "./video/mmd/mmd_fx03.webm",
        label: "飘花动画展示"
    },
    {
        srcMp4: "./video/mmd/mmd_fx04.mp4",
        srcWebm: "./video/mmd/mmd_fx04.webm",
        label: "飘花动画展示"
    },
    {
        srcMp4: "./video/mmd/mmd_fx05.mp4",
        srcWebm: "./video/mmd/mmd_fx05.webm",
        label: "飘花动画展示"
    },
    {
        srcMp4: "./video/mmd/mmd_login.mp4",
        srcWebm: "./video/mmd/mmd_login.webm",
        label: "游戏登陆动画展示"
    },
    {
        srcMp4: "./video/mmd/mmd_role02.mp4",
        srcWebm: "./video/mmd/mmd_role02.webm",
        label: "立绘角色待机呼吸动画展示"
    },
    {
        srcMp4: "./video/mmd/mmd_role03.mp4",
        srcWebm: "./video/mmd/mmd_role03.webm",
        label: "立绘角色待机呼吸动画展示"
    },
    {
        srcMp4: "./video/mmd/mmd_role04.mp4",
        srcWebm: "./video/mmd/mmd_role04.webm",
        label: "立绘角色待机呼吸动画展示"
    },
    {
        srcMp4: "./video/mmd/mmd_role05.mp4",
        srcWebm: "./video/mmd/mmd_role05.webm",
        label: "立绘角色待机呼吸动画展示"
    },
    {
        srcMp4: "./video/mmd/mmd_role06.mp4",
        srcWebm: "./video/mmd/mmd_role06.webm",
        label: "立绘角色待机呼吸动画展示"
    },
    {
        srcMp4: "./video/mmd/mmd_role07.mp4",
        srcWebm: "./video/mmd/mmd_role07.webm",
        label: "立绘角色待机呼吸动画展示"
    },
    {
        srcMp4: "./video/mmd/mmd_role08.mp4",
        srcWebm: "./video/mmd/mmd_role08.webm",
        label: "立绘角色待机呼吸动画展示"
    },
    // 萌萌哒Q角色
    {
        srcMp4: "./video/mmd/mmd_q_01.mp4",
        srcWebm: "./video/mmd/mmd_q_01.webm",
        label: "Q角色休闲动作展示"
    },
    {
        previewSrc: "https://image-assets.mihuashi.com/permanent/2839538%7C-2024/04/12/17/lmkYTWXtu8ugawrDHSB7I1YqVv-r.gif!artwork.square",
        srcMp4: "./video/mmd/mmd_q_02.mp4",
        srcWebm: "./video/mmd/mmd_q_02.webm",
        label: "Q角色休闲动作展示"
    },
    {
        srcMp4: "./video/mmd/mmd_q_03.mp4",
        srcWebm: "./video/mmd/mmd_q_03.webm",
        label: "Q角色休闲动作展示"
    },
    {
        srcMp4: "./video/mmd/mmd_q_04.mp4",
        srcWebm: "./video/mmd/mmd_q_04.webm",
        label: "Q角色休闲动作展示"
    },
    {
        srcMp4: "./video/mmd/mmd_q_05.mp4",
        srcWebm: "./video/mmd/mmd_q_05.webm",
        label: "Q角色休闲动作展示"
    },
    {
        srcMp4: "./video/mmd/mmd_q_06.mp4",
        srcWebm: "./video/mmd/mmd_q_06.webm",
        label: "Q角色休闲动作展示"
    },
    {
        srcMp4: "./video/mmd/mmd_q_07.mp4",
        srcWebm: "./video/mmd/mmd_q_07.webm",
        label: "Q角色休闲动作展示"
    },
    {
        srcMp4: "./video/mmd/mmd_q_08.mp4",
        srcWebm: "./video/mmd/mmd_q_08.webm",
        label: "Q角色休闲动作展示"
    },
    {
        srcMp4: "./video/mmd/mmd_q_09.mp4",
        srcWebm: "./video/mmd/mmd_q_09.webm",
        label: "Q角色休闲动作展示"
    },
    {
        srcMp4: "./video/mmd/mmd_q_10.mp4",
        srcWebm: "./video/mmd/mmd_q_10.webm",
        label: "Q角色休闲动作展示"
    },
    {
        srcMp4: "./video/mmd/mmd_q_11.mp4",
        srcWebm: "./video/mmd/mmd_q_11.webm",
        label: "Q角色休闲动作展示"
    },
    {
        srcMp4: "./video/mmd/mmd_q_12.mp4",
        srcWebm: "./video/mmd/mmd_q_12.webm",
        label: "Q角色休闲动作展示"
    },
    {
        srcMp4: "./video/mmd/mmd_q_13.mp4",
        srcWebm: "./video/mmd/mmd_q_13.webm",
        label: "Q角色休闲动作展示"
    },
    {
        srcMp4: "./video/mmd/mmd_q_14.mp4",
        srcWebm: "./video/mmd/mmd_q_14.webm",
        label: "Q角色休闲动作展示"
    },
    {
        srcMp4: "./video/mmd/mmd_q_15.mp4",
        srcWebm: "./video/mmd/mmd_q_15.webm",
        label: "Q角色休闲动作展示"
    },
    {
        srcMp4: "./video/mmd/mmd_q_16.mp4",
        srcWebm: "./video/mmd/mmd_q_16.webm",
        label: "Q角色休闲动作展示"
    },
    // 水狗
    {
        srcMp4: "./video/dog/dog_hero_00.mp4",
        srcWebm: "./video/dog/dog_hero_00.webm",
        label: "神魔诀角色动作展示"
    },
    {
        srcMp4: "./video/dog/dog_hero_01.mp4",
        srcWebm: "./video/dog/dog_hero_01.webm",
        label: "神魔诀角色动作展示"
    },
    {
        srcMp4: "./video/dog/dog_hero_02.mp4",
        srcWebm: "./video/dog/dog_hero_02.webm",
        label: "神魔诀角色动作展示"
    },
    {
        srcMp4: "./video/dog/dog_hero_03.mp4",
        srcWebm: "./video/dog/dog_hero_03.webm",
        label: "神魔诀角色动作展示"
    },
    {
        srcMp4: "./video/dog/dog_hero_04.mp4",
        srcWebm: "./video/dog/dog_hero_04.webm",
        label: "神魔诀角色动作展示"
    },
    {
        srcMp4: "./video/dog/dog_hero_05.mp4",
        srcWebm: "./video/dog/dog_hero_05.webm",
        label: "神魔诀角色动作展示"
    },
    {
        srcMp4: "./video/dog/dog_hero_06.mp4",
        srcWebm: "./video/dog/dog_hero_06.webm",
        label: "神魔诀角色动作展示"
    },
    {
        srcMp4: "./video/dog/dog_hero_107.mp4",
        srcWebm: "./video/dog/dog_hero_07.webm",
        label: "神魔诀角色动作展示"
    },
    {
        srcMp4: "./video/dog/dog_hero_08.mp4",
        srcWebm: "./video/dog/dog_hero_08.webm",
        label: "神魔诀角色动作展示"
    },
    {
        srcMp4: "./video/dog/dog_hero_09.mp4",
        srcWebm: "./video/dog/dog_hero_09.webm",
        label: "神魔诀角色动作展示"
    },
    {
        srcMp4: "./video/dog/dog_hero_10.mp4",
        srcWebm: "./video/dog/dog_hero_10.webm",
        label: "神魔诀角色动作展示"
    },
    {
        srcMp4: "./video/dog/dog_hero_11.mp4",
        srcWebm: "./video/dog/dog_hero_11.webm",
        label: "神魔诀角色动作展示"
    },

    {
        srcMp4: "./video/dog/dog_hero_13.mp4",
        srcWebm: "./video/dog/dog_hero_13.webm",
        label: "神魔诀角色动作展示"
    },
    {
        srcMp4: "./video/dog/dog_hero_14.mp4",
        srcWebm: "./video/dog/dog_hero_14.webm",
        label: "神魔诀角色动作展示"
    },
    {
        srcMp4: "./video/dog/dog_hero_15.mp4",
        srcWebm: "./video/dog/dog_hero_15.webm",
        label: "神魔诀角色动作展示"
    },
    {
        srcMp4: "./video/dog/dog_hero_16.mp4",
        srcWebm: "./video/dog/dog_hero_16.webm",
        label: "神魔诀角色动作展示"
    },
    // 帧速率
    {
        srcMp4: "./video/zsl/baby.mp4",
        srcWebm: "./video/zsl/baby.webm",
        label: "幼儿生气动画"
    },
    {
        srcMp4: "./video/zsl/boy.mp4",
        srcWebm: "./video/zsl/boy.webm",
        label: "走和跳动动画"
    },
    {
        srcMp4: "./video/zsl/zsl_anima01.mp4",
        srcWebm: "./video/zsl/zsl_anima01.webm",
        label: "玉米小人儿激动动画"
    },
    {
        srcMp4: "./video/zsl/jxb_jump.mp4",
        srcWebm: "./video/zsl/jxb_jump.webm",
        label: "小僵尸跳动动画"
    },
    {
        srcMp4: "./video/zsl/zsl_guai00.mp4",
        srcWebm: "./video/zsl/zsl_guai00.webm",
        label: "多脸怪动画"
    },
    {
        srcMp4: "./video/zsl/zsl_guai01.mp4",
        srcWebm: "./video/zsl/zsl_guai01.webm",
        label: "多牙齿怪动画"
    },
    {
        srcMp4: "./video/zsl/zsl_guai04.mp4",
        srcWebm: "./video/zsl/zsl_guai04.webm",
        label: "蝎子怪攻击动画"
    },
    {
        srcMp4: "./video/zsl/zsl_guai05.mp4",
        srcWebm: "./video/zsl/zsl_guai05.webm",
        label: "绿叶怪弓箭手"
    },
    {
        srcMp4: "./video/zsl/zsl_guai06.mp4",
        srcWebm: "./video/zsl/zsl_guai06.webm",
        label: "变异蘑菇怪砍你"
    },
    {
        srcMp4: "./video/zsl/zsl_zs.mp4",
        srcWebm: "./video/zsl/zsl_zs.webm",
        label: "小泡泡龙武士"
    },
    {
        srcMp4: "./video/zsl/zsl_guai07.mp4",
        srcWebm: "./video/zsl/zsl_guai07.webm",
        label: "大胡子法师"
    },
    {
        srcMp4: "./video/zsl/zsl_guai08.mp4",
        srcWebm: "./video/zsl/zsl_guai08.webm",
        label: "AI弓箭手射箭"
    },
    {
        srcMp4: "./video/zsl/zsl_hh01.mp4",
        srcWebm: "./video/zsl/zsl_hh01.webm",
        label: "小狮子跑动动画"
    },
    {
        srcMp4: "./video/zsl/zsl_hh04.mp4",
        srcWebm: "./video/zsl/zsl_hh04.webm",
        label: "小狮子转身展示成果"
    },
    {
        srcMp4: "./video/zsl/zsl_hh05.mp4",
        srcWebm: "./video/zsl/zsl_hh05.webm",
        label: "小狮子落下动画"
    },
    {
        srcMp4: "./video/zsl/zsl_hh07.mp4",
        srcWebm: "./video/zsl/zsl_hh07.webm",
        label: "小狮子和好友玩搭积木"
    }
];
// DOM加载完成后初始化
document.addEventListener("DOMContentLoaded", () => {
    initializeVideoPlayer(videoData, "video-list");
});
