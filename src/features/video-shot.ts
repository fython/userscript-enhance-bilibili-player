import { registerMenuItem } from "@/components/player-menu";
import { queryMainVideoElement } from "@/components/player-video";
import { copyCanvasImage } from "@/utils/clipboard";
import { MessagePlugin } from 'tdesign-vue-next';

async function captureVideoShot(): Promise<void> {
  const videoEl = await queryMainVideoElement();
  // Requires video ready state is ready or buffered
  if (videoEl.readyState >= 2) {
    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    const fmt = 'image/png';
    const quality = (fmt === 'image/png') ? 1 : 0.9;
    try {
      await copyCanvasImage(canvas, fmt, quality);
      MessagePlugin.success('截图成功');
    } catch (e) {
      window.console.error(e);
      MessagePlugin.error('截图失败，你可以在控制台查看错误信息');
    }
  } else {
    MessagePlugin.warning('播放器还没就绪，请等待缓冲完毕再重试');
  }
}

function register() {
  registerMenuItem({
    dataAction: 'exbiliplayer-shot',
    label: '立即截取视频画面',
    onClick: captureVideoShot,
  });
}

const VideoShotFeature = { register };
export default VideoShotFeature;
