import { _decorator, AudioClip, AudioSource, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BirdAudio")
export class BirdAudio extends Component {
  @property({
    type: [AudioClip],
  })
  public clips: AudioClip[] = [];

  @property({
    type: AudioSource,
  })
  public audioSource: AudioSource = null!;

  onAudioQueue(index: number) {
    let clip: AudioClip = this.clips[index];

    this.audioSource.playOneShot(clip)
  }
}
