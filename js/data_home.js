// 定义该页面的视频数据
const videoData = [
    // 水狗
    { srcWebm: "./video/dog/dog_hero_00.webm", srcMp4: "./video/dog/dog_hero_00.mp4", label: "神魔诀角色动作展示" },
    { srcWebm: "./video/dog/dog_hero_01.webm", srcMp4: "./video/dog/dog_hero_01.mp4", label: "神魔诀角色动作展示" },
    { srcWebm: "./video/dog/dog_hero_02.webm", srcMp4: "./video/dog/dog_hero_02.mp4", label: "神魔诀角色动作展示" },
    { srcWebm: "./video/dog/dog_hero_03.webm", srcMp4: "./video/dog/dog_hero_03.mp4", label: "神魔诀角色动作展示" }
    // { srcWebm: "./video/dog/dog_hero_04.webm", srcMp4: "./video/dog/dog_hero_04.mp4", label: "神魔诀角色动作展示" },
    // { srcWebm: "./video/dog/dog_hero_05.webm", srcMp4: "./video/dog/dog_hero_05.mp4", label: "神魔诀角色动作展示" },
    // { srcWebm: "./video/dog/dog_hero_06.webm", srcMp4: "./video/dog/dog_hero_06.mp4", label: "神魔诀角色动作展示" },
    // { srcWebm: "./video/dog/dog_hero_07.webm", srcMp4: "./video/dog/dog_hero_107.mp4", label: "神魔诀角色动作展示" }


];
// DOM加载完成后初始化
document.addEventListener("DOMContentLoaded", () => {
    initializeVideoPlayer(videoData, "other-video-list");
});