import { registerMenuItem } from "@/components/player-menu";
import { queryMainVideoElement } from "@/components/player-video";
import { RecorderController } from "@/components/recorder";
import { MessagePlugin, MessageInstance } from 'tdesign-vue-next';

let recorderController: RecorderController;
let recordMsg: MessageInstance;

async function stopRecord(): Promise<void> {
  await recorderController.stopSync();
  try {
    recorderController.save('录制片段');
  } catch (e) {
    window.console.error(e);
  } finally {
    recordMsg?.close();
  }
}

async function startRecord(): Promise<void> {
  try {
    const videoEl = await queryMainVideoElement();
    recorderController = RecorderController.captureVideoElement(videoEl);
    recorderController.onrecordstop = () => window.console.log('record stop');
    recorderController.onrecorderror = (event) => window.console.error(event);
    recordMsg = await MessagePlugin.loading({
      content: '录制视频中',
      closeBtn: '停止',
      onCloseBtnClick: () => {
        if (recorderController?.isRecording === true) {
          stopRecord();
        }
      },
    });
  } catch (e) {
    window.console.error(e);
  }
}

async function toggleRecord() {
  if (recorderController?.isRecording === true) {
    await stopRecord();
  } else {
    await startRecord();
  }
}

function register(): void {
  registerMenuItem({
    dataAction: 'exbiliplayer-toggle-record',
    label: '开始/停止录制',
    onClick: toggleRecord,
  });
}

const VideoRecordFeature = { register };
export default VideoRecordFeature;
