<template>
  <div class="video-player">
    <video-player
      class="video-player vjs-custom-skin"
      ref="videoPlayer"
      :options="playerOptions"
      :playsinline="true"
      @ready="onPlayerReady"
      @play="onPlayerPlay"
      @timeupdate="onPlayerTimeupdate"
      @pause="onPlayerPause"
      @ended="onPlayerEnded"
    />
  </div>
</template>

<script setup>
import Vue, { reactive } from 'vue';
import VideoPlayer from 'vue-video-player';
//引入样式
import 'vue-video-player/src/custom-theme.css';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-hls';
//使用组件
Vue.use(VideoPlayer);

const playerOptions = reactive({
  //视频url设置,两种类型，MP4和m3u8
  sources: [
    {
      src: 'https://ewe.weewe.mp4',
      type: 'video/mp4', // mp4视频类型
      // src: 'https://ewe.weewe.m3u8',
      // type: 'application/x-mpegURL' //m3u8 视频类型，这里可以不写，如果写一定要写对，否则会无法播放
    },
  ],
  playbackRates: [0.5, 1.0, 1.5, 2.0], // 开启倍速，不开启倍速可以写个空数组
  fluid: true, // 当 fluid 设置为 true 时，Video.js 播放器将拥有流体大小，即它会根据容器的尺寸动态地调整自身的大小
  autoplay: false, // 是否自动播放
  muted: false, // 是否静音播放
  controls: true, // 是否展示控制栏
});

const onPlayerReady = (player) => {
  console.log('Player is ready!', player);
};
const onPlayerPlay = (player) => {
  console.log('开始播放');
  // 设置初始播放位置
  player.currentTime(this.currentTime);
};
const onPlayerTimeupdate = (player) => {
  // console.log('播放中', this.nowCurrentTime)
};
const onPlayerPause = (player) => {
  console.log('暂停播放');
};
const onPlayerEnded = (player) => {
  // 播放完毕
};
</script>

<style lang="less" scoped></style>
