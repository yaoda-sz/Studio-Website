// 视频配置数据
const videoConfig = {
    cases: {
        '《波粒狂潮Infinity Boli》': {
            bvid: 'BV1Mfbzz7E8P',
            cid: '31696421478',
            posterSrc: './img/bolikuanhu_cover.webp',
            altText: '波粒狂潮视频封面'
        },
        '《神魔诀之江湖行》': {
            bvid: 'BV1foXxY5END',
            cid: '29013509219',
            posterSrc: './img/shenmojue.jpg',
            altText: '神魔诀视频封面'
        },
        '《魔法玩具树屋》': {
            bvid: 'BV11L9BYREaB',
            cid: '28675476944',
            posterSrc: './img/bigbird.jpg',
            altText: '魔法玩具树屋视频封面'
        },
        '《银与绯》': {
            bvid: 'BV1bEatzdEUh',
            cid: '32180865918',
            posterSrc: './img/yingyufei.jpg',
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
