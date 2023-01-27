import { registerMenuItem } from "@/components/player-menu";
import { queryMainVideoElement } from "@/components/player-video";
import { copyCanvasImage, isSupportClipboardItemAPI } from "@/utils/clipboard";
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';
import CopyShotBody from '@/features/video-shot/CopyShotBody.vue';

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
    // TODO 允许用户设置截图后自动复制或弹出对话框
    if (isSupportClipboardItemAPI()) {
      try {
        await copyCanvasImage(canvas, fmt, quality);
        MessagePlugin.success('截图成功');
      } catch (e) {
        window.console.error(e);
        MessagePlugin.error('截图失败，你可以在控制台查看错误信息');
      }
    } else {
      const videoPaused = videoEl.paused;
      if (!videoPaused) {
        videoEl.pause();
      }
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('canvas.toBlob returns empty data');
        }
        const dialog = DialogPlugin.alert({
          header: '复制截图',
          body: (h) => h(CopyShotBody, {
            data: blob,
          }),
          onConfirm: () => {
            dialog.destroy();
          },
          onClosed: () => {
            if (!videoPaused) {
              videoEl.play();
            }
          },
        });
      }, fmt, quality);
    }
  } else {
    MessagePlugin.warning('播放器还没就绪，请等待缓冲完毕再重试');
  }
}

function register(): void {
  registerMenuItem({
    dataAction: 'exbiliplayer-shot',
    label: '立即截取视频画面',
    onClick: captureVideoShot,
  });
}

const VideoShotFeature = { register };
export default VideoShotFeature;
