// 视频配置数据
const videoConfig = {
    cases: {
        '《波粒狂潮Infinity Boli》': {
            bvid: 'BV1Mfbzz7E8P',
            cid: '31696421478',
            posterSrc: './img/video_cover_blkc.webp',
            altText: '波粒狂潮视频封面'
        },
        '《神魔诀之江湖行》': {
            bvid: 'BV1foXxY5END',
            cid: '29013509219',
            posterSrc: './img/video_cover_smj.jpg',
            altText: '神魔诀视频封面'
        },
        '《何以为仙》': {
            bvid: 'BV1QDSNB4EsN',
            cid: '35081752258',
            posterSrc: './img/video_cover_hywx.jpg',
            altText: '何以为仙视频封面'
        },
        '《魔法玩具树屋》': {
            bvid: 'BV11L9BYREaB',
            cid: '28675476944',
            posterSrc: './img/video_cover_bigbird.jpg',
            altText: '魔法玩具树屋视频封面'
        },
        '《银与绯》': {
            bvid: 'BV1bEatzdEUh',
            cid: '32180865918',
            posterSrc: './img/video_cover_yingyufei.jpg',
            altText: '银与绯视频封面'
        }
    }
};

// 导出配置供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = videoConfig;
} else {
    window.videoConfig = videoConfig;
}
