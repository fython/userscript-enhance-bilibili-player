import DomUtils from "@/utils/dom";

export function queryMainVideoElement(): Promise<HTMLVideoElement> {
  return DomUtils.queryElementMust('.bpx-player-primary-area video');
}
