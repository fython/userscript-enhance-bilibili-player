import {MimeTypes} from '../../common/constants';

/**
 * @enum {string}
 */
const MimeExtensions = {
    [MimeTypes.MP4]: 'mp4',
    [MimeTypes.MP3]: 'mp3',
    [MimeTypes.WEBM]: 'webm',
    [MimeTypes.MKV]: 'mkv',
    [MimeTypes.OGG]: 'ogg',
    [MimeTypes.WEBM_AUDIO]: 'webm',
};

/**
 * @param {string?} mimeType
 * @returns {MimeExtensions}
 */
function findExtensionForMimeType(mimeType) {
    if (!mimeType) {
        return MimeExtensions[MimeTypes.MP4];
    }
    for (const [key, value] of Object.entries(MimeExtensions)) {
        if (mimeType.indexOf(key) !== -1) {
            return value;
        }
    }
}

export class RecorderController {
    /**
     * 对 HTMLVideoElement 发起录制
     * @param {HTMLVideoElement} videoEl
     * @param {MimeTypes?} mimeType
     */
    static captureVideoElement(videoEl, mimeType) {
        const controller = new RecorderController({ mimeType });
        videoEl.captureStream = videoEl.captureStream || videoEl.mozCaptureStream;
        controller.start(videoEl.captureStream());
        return controller;
    }

    /**
     * @constructor
     * @param {MimeTypes?} mimeType
     * @param {number} dataInterval
     */
    constructor({ mimeType, dataInterval = 5000 } = {}) {
        this.recorder = null;
        this.recordedData = [];
        this.onrecordstop = null;
        this.onrecorderror = null;
        this.isRecording = false;

        this.mimeType = mimeType;
        this.dataInterval = dataInterval;
    }

    /**
     * 对 MediaStream 开始录制
     * @param {MediaStream} stream
     */
    start(stream) {
        const recorder = new MediaRecorder(stream, { mimeType: this.mimeType });
        const recordData = [];
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

    stop() {
        if (this.recorder && this.recorder.state === 'recording') {
            this.recorder.stop();
        }
    }

    stopSync() {
        return new Promise((resolve) => {
            let old_onrecordstop = this.onrecordstop;
            this.onrecordstop = () => {
                if (old_onrecordstop) old_onrecordstop();
                resolve();
            };
            this.stop();
        });
    }

    reset() {
        this.stop();
        this.recorder = null;
        this.recordedData = [];
        this.isRecording = false;
    }

    /**
     * 保存录制结果
     * @param {string} filename 不包括扩展名的文件名
     */
    save(filename) {
        if (!this.recordedData || this.recordedData.length <= 0) {
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

    get recordedBlob() {
        return new Blob(this.recordedData, { type: this.recorder.mimeType });
    }
}
