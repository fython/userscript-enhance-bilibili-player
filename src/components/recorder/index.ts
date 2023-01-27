import { MimeTypes, findExtensionForMimeType } from "./model";

export interface RecorderControllerParams {
  mimeType?: MimeTypes;
  dataInterval?: number;
}

export class RecorderController {
  static isSupported(): boolean {
    return typeof HTMLVideoElement.prototype.captureStream !== 'undefined'
      || typeof HTMLVideoElement.prototype.mozCaptureStream !== 'undefined';
  }

  /**
   * 对 HTMLVideoElement 发起录制
   * @param {HTMLVideoElement} videoEl
   * @param {MimeTypes?} mimeType
   */
  static captureVideoElement(videoEl: HTMLVideoElement, mimeType?: MimeTypes) {
    const controller = new RecorderController({ mimeType, dataInterval: 5000 });
    const captureStream = videoEl.captureStream || videoEl.mozCaptureStream;
    if (!captureStream) {
      throw new Error('Unsupported API');
    }
    controller.start(captureStream.call(videoEl));
    return controller;
  }

  recorder: MediaRecorder | null;
  recordedData: BlobPart[];
  onrecordstop: (() => void) | null;
  onrecorderror: ((e: Event) => void) | null;
  isRecording: boolean;
  mimeType?: MimeTypes;
  dataInterval: number;

  constructor(params: RecorderControllerParams) {
    this.recorder = null;
    this.recordedData = [];
    this.onrecordstop = null;
    this.onrecorderror = null;
    this.isRecording = false;

    this.mimeType = params.mimeType;
    this.dataInterval = params.dataInterval ?? 5000;
  }

  /**
   * 对 MediaStream 开始录制
   * @param {MediaStream} stream
   */
  start(stream: MediaStream): void {
    const recorder = new MediaRecorder(stream, { mimeType: this.mimeType });
    const recordData: BlobPart[] = [];
    recorder.ondataavailable = (event) => {
      recordData.push(event.data);
    };
    recorder.onstop = () => {
      this.isRecording = false;
      if (this.onrecordstop) {
        this.onrecordstop();
      }
    };
    recorder.onerror = (event) => {
      this.isRecording = false;
      if (this.onrecorderror) {
        this.onrecorderror(event);
      }
    };
    recorder.start(this.dataInterval);
    this.isRecording = true;
    this.recorder = recorder;
    this.recordedData = recordData;
  }

  stop(): void {
    if (this.recorder && this.recorder.state === 'recording') {
      this.recorder.stop();
    }
  }

  stopSync(): Promise<void> {
    return new Promise<void>((resolve) => {
      let old_onrecordstop = this.onrecordstop;
      this.onrecordstop = () => {
        if (old_onrecordstop) old_onrecordstop();
        resolve();
      };
      this.stop();
    });
  }

  reset(): void {
    this.stop();
    this.recorder = null;
    this.recordedData = [];
    this.isRecording = false;
  }

  /**
   * 保存录制结果
   * @param {string} filename 不包括扩展名的文件名
   */
  save(filename: string): void {
    if (!this.recordedData || this.recordedData.length <= 0 || !this.recorder) {
      return;
    }
    if (!filename) {
      window.console.log('Please specify a filename for downloading.');
      filename = 'download';
    }
    filename = filename + '.' + findExtensionForMimeType(this.recorder.mimeType);
    const a = document.createElement('a');
    const objectURL = URL.createObjectURL(this.recordedBlob);
    a.download = filename;
    a.href = objectURL;
    a.click();
    window.URL.revokeObjectURL(objectURL);
  }

  get recordedBlob(): Blob {
    return new Blob(this.recordedData, { type: this.recorder?.mimeType });
  }
}
