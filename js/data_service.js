// 定义该页面的视频数据
const videoData = [
    {
        // 预览图链接（用于列表页和弹框播放）
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/16/032628lctffocbzkckcmo8.webp",
        srcMp4: "./video/mmd/mmd_mache.mp4",
        srcWebm: "./video/mmd/mmd_mache.webm",
        label: "交互动效展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/16/032551gnvk7cuug3fjkknv.webp",
        srcMp4: "./video/mmd/mmd_clickhouse.mp4",
        srcWebm: "./video/mmd/mmd_clickhouse.webm",
        label: "交互动效展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/16/032556kpk7rcr55k5ef519.webp",
        srcMp4: "./video/mmd/mmd_fx_lvup02.mp4",
        srcWebm: "./video/mmd/mmd_fx_lvup02.webm",
        label: "交互动效展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/16/032553hcnw2ffz841c331n.webp",
        srcMp4: "./video/mmd/mmd_clicktree.mp4",
        srcWebm: "./video/mmd/mmd_clicktree.webm",
        label: "交互动效展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/16/032553p1mz0ly4tc0prrxt.webp",
        srcMp4: "./video/mmd/mmd_fish_girl.mp4",
        srcWebm: "./video/mmd/mmd_fish_girl.webm",
        label: "钓鱼女孩动画展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202304/01/223014zbr42h0f44gciz2h.gif.webp",
        srcMp4: "./video/king.mp4",
        srcWebm: "./video/king.webm",
        label: "战斗角色动作展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/16/032601antcotaxt7jo9wzo.webp",
        srcMp4: "./video/mmd/mmd_fx01.mp4",
        srcWebm: "./video/mmd/mmd_fx_card01.webm",
        label: "抽卡金鱼动画展示"
    },
    // 萌萌哒Q角色
    {
        previewSrc: "https://image-assets.mihuashi.com/permanent/2839538%7C-2024/04/12/17/lmkYTWXtu8ugawrDHSB7I1YqVv-r.gif!artwork.square",
        srcMp4: "./video/mmd/mmd_q_02.mp4",
        srcWebm: "./video/mmd/mmd_q_02.webm",
        label: "Q角色休闲动作展示"
    },
    {
        previewSrc: "https://image-assets.mihuashi.com/permanent/2839538%7C-2024/04/12/17/FsuJD-I1gbktTCkal-CE15YO8441.gif!artwork.square",
        srcMp4: "./video/mmd/mmd_q_08.mp4",
        srcWebm: "./video/mmd/mmd_q_08.webm",
        label: "Q角色休闲动作展示"
    },
    {
        previewSrc: "https://image-assets.mihuashi.com/permanent/2839538%7C-2023/12/31/15/lsY8rsjbjHnO6_kxHpzd__hpu1mH.gif!artwork.square",
        srcMp4: "./video/mmd/mmd_q_15.mp4",
        srcWebm: "./video/mmd/mmd_q_15.webm",
        label: "Q角色休闲动作展示"
    },
    {
        previewSrc: "https://image-assets.mihuashi.com/permanent/2839538%7C-2024/04/12/17/lvnrP75w4fTe_vaZdETh4JyxCW7l.gif!artwork.square",
        srcMp4: "./video/mmd/mmd_q_10.mp4",
        srcWebm: "./video/mmd/mmd_q_10.webm",
        label: "Q角色休闲动作展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/010417t6l8k282jzz8v0c6.webp",
        srcMp4: "./video/mmd/mmd_q_01.mp4",
        srcWebm: "./video/mmd/mmd_q_01.webm",
        label: "Q角色休闲动作展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/010417mf697unllo9yono7.webp",
        srcMp4: "./video/mmd/mmd_q_03.mp4",
        srcWebm: "./video/mmd/mmd_q_03.webm",
        label: "Q角色休闲动作展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/010401awf1mm6mwp112i67.webp",
        srcMp4: "./video/mmd/mmd_q_04.mp4",
        srcWebm: "./video/mmd/mmd_q_04.webm",
        label: "Q角色休闲动作展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/010404uv2d3llbd4mpb7hf.webp",
        srcMp4: "./video/mmd/mmd_q_05.mp4",
        srcWebm: "./video/mmd/mmd_q_05.webm",
        label: "Q角色休闲动作展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/010405vwpivfkvwiuwp1ww.webp",
        srcMp4: "./video/mmd/mmd_q_06.mp4",
        srcWebm: "./video/mmd/mmd_q_06.webm",
        label: "Q角色休闲动作展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/010407ny229121wrid8r1y.webp",
        srcMp4: "./video/mmd/mmd_q_07.mp4",
        srcWebm: "./video/mmd/mmd_q_07.webm",
        label: "Q角色休闲动作展示"
    },

    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/010408yvp4py4zbppppop8.webp",
        srcMp4: "./video/mmd/mmd_q_09.mp4",
        srcWebm: "./video/mmd/mmd_q_09.webm",
        label: "Q角色休闲动作展示"
    },

    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/010410wncvlquucupxqlc2.webp",
        srcMp4: "./video/mmd/mmd_q_11.mp4",
        srcWebm: "./video/mmd/mmd_q_11.webm",
        label: "Q角色休闲动作展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/010412x90p9krkwrowrkx1.webp",
        srcMp4: "./video/mmd/mmd_q_12.mp4",
        srcWebm: "./video/mmd/mmd_q_12.webm",
        label: "Q角色休闲动作展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/010413suiuz7o0sq1duoom.webp",
        srcMp4: "./video/mmd/mmd_q_13.mp4",
        srcWebm: "./video/mmd/mmd_q_13.webm",
        label: "Q角色休闲动作展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/010415e5z0oh87qksoqqok.webp",
        srcMp4: "./video/mmd/mmd_q_14.mp4",
        srcWebm: "./video/mmd/mmd_q_14.webm",
        label: "Q角色休闲动作展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/010416vuhlz51l0duzz0fh.webp",
        srcMp4: "./video/mmd/mmd_q_16.mp4",
        srcWebm: "./video/mmd/mmd_q_16.webm",
        label: "Q角色休闲动作展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/16/032602zy5yy25gm2y532yo.webp",
        srcMp4: "./video/mmd/mmd_fx_card01.mp4",
        srcWebm: "./video/mmd/mmd_fx_card01.webm",
        label: "飘花动画展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/16/032602v2anyhgkngm36rin.webp",
        srcMp4: "./video/mmd/mmd_fx02.mp4",
        srcWebm: "./video/mmd/mmd_fx02.webm",
        label: "飘花动画展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/16/032609nx5f2qg4142f41qs.webp",
        srcMp4: "./video/mmd/mmd_fx03.mp4",
        srcWebm: "./video/mmd/mmd_fx03.webm",
        label: "飘花动画展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/16/032611hgp9bgggr19rnmr4.webp",
        srcMp4: "./video/mmd/mmd_fx04.mp4",
        srcWebm: "./video/mmd/mmd_fx04.webm",
        label: "飘花动画展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/16/032615wxf9ajta2ph9hp9e.webp",
        srcMp4: "./video/mmd/mmd_fx05.mp4",
        srcWebm: "./video/mmd/mmd_fx05.webm",
        label: "飘花动画展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/16/032619x3effckfc1e3b5k2.webp",
        srcMp4: "./video/mmd/mmd_login.mp4",
        srcWebm: "./video/mmd/mmd_login.webm",
        label: "游戏登陆动画展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/16/032630yhimdiei8x8auifc.webp",
        srcMp4: "./video/mmd/mmd_role02.mp4",
        srcWebm: "./video/mmd/mmd_role02.webm",
        label: "立绘角色待机呼吸动画展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/16/032632osay9x9awfwnmdjw.webp",
        srcMp4: "./video/mmd/mmd_role03.mp4",
        srcWebm: "./video/mmd/mmd_role03.webm",
        label: "立绘角色待机呼吸动画展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/16/032635dr7rztisiij9rr9i.webp",
        srcMp4: "./video/mmd/mmd_role04.mp4",
        srcWebm: "./video/mmd/mmd_role04.webm",
        label: "立绘角色待机呼吸动画展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/16/032635k5jhhhfthhh2i8hi.webp",
        srcMp4: "./video/mmd/mmd_role05.mp4",
        srcWebm: "./video/mmd/mmd_role05.webm",
        label: "立绘角色待机呼吸动画展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/16/032637kz6mtikt74i3w36i.webp",
        srcMp4: "./video/mmd/mmd_role06.mp4",
        srcWebm: "./video/mmd/mmd_role06.webm",
        label: "立绘角色待机呼吸动画展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/16/032637oitk9xu6x9i9dtpz.webp",
        srcMp4: "./video/mmd/mmd_role07.mp4",
        srcWebm: "./video/mmd/mmd_role07.webm",
        label: "立绘角色待机呼吸动画展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/16/032638xz2vx66m6bpbr0zz.webp",
        srcMp4: "./video/mmd/mmd_role08.mp4",
        srcWebm: "./video/mmd/mmd_role08.webm",
        label: "立绘角色待机呼吸动画展示"
    },
    // 水狗
    {
        previewSrc: "https://image-assets.mihuashi.com/permanent/2839538%7C-2025/12/02/03/FtstOecfPnlQLD4oZDd7YBQmyeq1_2637.gif!artwork.square",
        srcWebm: "./video/dog/dog_hero_00.webm",
        label: "神魔诀角色动作展示"
    },
    {
        previewSrc: "https://image-assets.mihuashi.com/permanent/2839538%7C-2025/12/02/03/lj8HISR7OohPG6wJkuiqPKG2IgZW_1540.gif!artwork.square",
        srcMp4: "./video/dog/dog_hero_01.mp4",
        srcWebm: "./video/dog/dog_hero_01.webm",
        label: "神魔诀角色动作展示"
    },
    {
        previewSrc: "https://image-assets.mihuashi.com/permanent/2839538%7C-2025/12/02/03/lijfVRSAOxo6cEzoM74c7TF1RdIB_1553.gif!artwork.square",
        srcMp4: "./video/dog/dog_hero_02.mp4",
        srcWebm: "./video/dog/dog_hero_02.webm",
        label: "神魔诀角色动作展示"
    },
    {
        previewSrc: "https://image-assets.mihuashi.com/permanent/2839538%7C-2025/12/02/03/FrKebopzZ9fRf30k7n3fG1RAs1EQ_1547.gif!artwork.square",
        srcMp4: "./video/dog/dog_hero_03.mp4",
        srcWebm: "./video/dog/dog_hero_03.webm",
        label: "神魔诀角色动作展示"
    },
    {
        previewSrc: "https://image-assets.mihuashi.com/permanent/2839538%7C-2025/12/02/03/Fgsg5ahEMI3gxqKxkmu0t9qmksxj_1545.gif!artwork.square",
        srcMp4: "./video/dog/dog_hero_04.mp4",
        srcWebm: "./video/dog/dog_hero_04.webm",
        label: "神魔诀角色动作展示"
    },
    {
        previewSrc: "https://image-assets.mihuashi.com/permanent/2839538%7C-2025/12/02/03/Fj_5ESDfQsXSNHdd2AQQ0faIG7SI_1551.gif!artwork.square",
        srcMp4: "./video/dog/dog_hero_08.mp4",
        srcWebm: "./video/dog/dog_hero_08.webm",
        label: "神魔诀角色动作展示"
    },
    {
        previewSrc: "https://image-assets.mihuashi.com/permanent/2839538%7C-2025/12/02/03/Fsw9SS7-131I8oOFW5WlkeLMW_zu_1538.gif!artwork.square",
        srcMp4: "./video/dog/dog_hero_09.mp4",
        srcWebm: "./video/dog/dog_hero_09.webm",
        label: "神魔诀角色动作展示"
    },
    {
        previewSrc: "https://image-assets.mihuashi.com/permanent/2839538%7C-2025/12/02/03/ltW8tWJmJi3RxpNrjrzScIlGmbVh_1549.gif!artwork.square",
        srcMp4: "./video/dog/dog_hero_15.mp4",
        srcWebm: "./video/dog/dog_hero_15.webm",
        label: "神魔诀角色动作展示"
    },
    {
        previewSrc: "https://image-assets.mihuashi.com/permanent/2839538%7C-2025/12/02/03/FmYR1FFbXOWa59T59gD6Wwtj40Bm_1543.gif!artwork.square",
        srcMp4: "./video/dog/dog_hero_06.mp4",
        srcWebm: "./video/dog/dog_hero_06.webm",
        label: "神魔诀角色动作展示"
    },
    {
        previewSrc: "https://image-assets.mihuashi.com/permanent/2839538%7C-2025/12/02/03/Fhjesl80940ms2WCzBl7T5hiHiqZ_1534.gif!artwork.square",
        srcMp4: "./video/dog/dog_hero_13.mp4",
        srcWebm: "./video/dog/dog_hero_13.webm",
        label: "神魔诀角色动作展示"
    },
    {
        previewSrc: "https://image-assets.mihuashi.com/permanent/2839538%7C-2025/12/02/03/Fj4UBdzlhjn9ybuWW8Ti5wkCQCLO_1542.gif!artwork.square",
        srcMp4: "./video/dog/dog_hero_16.mp4",
        srcWebm: "./video/dog/dog_hero_16.webm",
        label: "神魔诀角色动作展示"
    },
    {
        previewSrc: "https://image-assets.mihuashi.com/permanent/2839538%7C-2025/12/02/03/FsQCKYZmcvYNmHEatgZkqcp1ugNq_1531.gif!artwork.square",
        srcMp4: "./video/dog/dog_hero_07.mp4",
        srcWebm: "./video/dog/dog_hero_07.webm",
        label: "神魔诀角色动作展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/21/021516v9kk2v9avtrkkk0i.webp",
        srcMp4: "./video/dog/dog_hero_10.mp4",
        srcWebm: "./video/dog/dog_hero_10.webm",
        label: "神魔诀角色动作展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/21/021516zpub6s9psdspspp9.webp",
        srcMp4: "./video/dog/dog_hero_05.mp4",
        srcWebm: "./video/dog/dog_hero_05.webm",
        label: "神魔诀角色动作展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/21/021516hw2jolo3rr99w359.webp",
        srcMp4: "./video/dog/dog_hero_11.mp4",
        srcWebm: "./video/dog/dog_hero_11.webm",
        label: "神魔诀角色动作展示"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/21/021519g0jjgk8ggz1gjp1b.webp",
        srcMp4: "./video/dog/dog_hero_14.mp4",
        srcWebm: "./video/dog/dog_hero_14.webm",
        label: "神魔诀角色动作展示"
    },
    // 帧速率
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/011040t91kdrhz4148hzxh.webp",
        srcMp4: "./video/zsl/baby.mp4",
        srcWebm: "./video/zsl/baby.webm",
        label: "幼儿生气动画"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/011039xeoy3j8zpoq99w7d.webp",
        srcMp4: "./video/zsl/boy.mp4",
        srcWebm: "./video/zsl/boy.webm",
        label: "走和跳动动画"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/011043pv047px57jx72x7o.webp",
        srcMp4: "./video/zsl/zsl_anima01.mp4",
        srcWebm: "./video/zsl/zsl_anima01.webm",
        label: "玉米小人儿激动"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/011039vcb98z89buzd8bu9.webp",
        srcMp4: "./video/zsl/jxb_jump.mp4",
        srcWebm: "./video/zsl/jxb_jump.webm",
        label: "小僵尸"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/011044y7cisut2si2b2uth.webp",
        srcMp4: "./video/zsl/zsl_guai00.mp4",
        srcWebm: "./video/zsl/zsl_guai00.webm",
        label: "多脸怪"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/011045xp99p66lvcu4spsu.webp",
        srcMp4: "./video/zsl/zsl_guai01.mp4",
        srcWebm: "./video/zsl/zsl_guai01.webm",
        label: "多牙齿怪物"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/011049esvkkkmfd5zmmutm.webp",
        srcMp4: "./video/zsl/zsl_guai04.mp4",
        srcWebm: "./video/zsl/zsl_guai04.webm",
        label: "蝎子怪攻击"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/011050rzihzhavqkzikypc.webp",
        srcMp4: "./video/zsl/zsl_guai05.mp4",
        srcWebm: "./video/zsl/zsl_guai05.webm",
        label: "绿叶怪弓箭手"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/011051cpan2aqttoqhp95a.webp",
        srcMp4: "./video/zsl/zsl_guai06.mp4",
        srcWebm: "./video/zsl/zsl_guai06.webm",
        label: "变异蘑菇怪砍"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/011102kgnsy3dbszod5gjd.webp",
        srcMp4: "./video/zsl/zsl_zs.mp4",
        srcWebm: "./video/zsl/zsl_zs.webm",
        label: "小泡泡龙武士"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/011052rxi9obgyi7zxsixz.webp",
        srcMp4: "./video/zsl/zsl_guai07.mp4",
        srcWebm: "./video/zsl/zsl_guai07.webm",
        label: "大胡子法"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/011055q9yrch4094c006as.webp",
        srcMp4: "./video/zsl/zsl_guai08.mp4",
        srcWebm: "./video/zsl/zsl_guai08.webm",
        label: "AI弓箭手射"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/011056nldbxd3buu3vxoa3.webp",
        srcMp4: "./video/zsl/zsl_hh01.mp4",
        srcWebm: "./video/zsl/zsl_hh01.webm",
        label: "小狮子跑动动"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/011059hef033fz3tth0fte.webp",
        srcMp4: "./video/zsl/zsl_hh04.mp4",
        srcWebm: "./video/zsl/zsl_hh04.webm",
        label: "小狮子转身"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/011100wrroocdewjcenzfq.webp",
        srcMp4: "./video/zsl/zsl_hh05.mp4",
        srcWebm: "./video/zsl/zsl_hh05.webm",
        label: "小狮子落下动"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/20/011101xuw1wt5w5t4y94z3.webp",
        srcMp4: "./video/zsl/zsl_hh07.mp4",
        srcWebm: "./video/zsl/zsl_hh07.webm",
        label: "小狮子和好友玩搭积木"
    },
    {
        previewSrc: "https://attach.cgjoy.com/attachment/forum/202601/29/234616yvjvnjzwwncqnnzs.webp",
        srcMp4: "./video/football.mp4",
        srcWebm: "./video/football.webm",
        label: "足球小子"
    },
];
// DOM加载完成后初始化
document.addEventListener("DOMContentLoaded", () => {
    initializeVideoPlayer(videoData, "video-list");
});