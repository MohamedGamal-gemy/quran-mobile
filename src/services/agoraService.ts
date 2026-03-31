import createAgoraRtcEngine, {
  IRtcEngine,
  ChannelProfileType,
  ClientRoleType,
} from 'react-native-agora';

const APP_ID = "d05e48da05dc46b8a6d44e01c310461a"; // Placeholder

class AgoraService {
  private engine: IRtcEngine | null = null;

  async init() {
    this.engine = createAgoraRtcEngine();
    this.engine.initialize({
      appId: APP_ID,
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
    });

    this.engine.enableAudio();
  }

  async joinChannel(channelName: string, uid: number, token?: string) {
    if (!this.engine) await this.init();
    
    this.engine?.setClientRole(ClientRoleType.ClientRoleBroadcaster);
    this.engine?.joinChannel(token || '', channelName, uid, {
      publishMicrophoneTrack: true,
      autoSubscribeAudio: true,
    });
  }

  async leaveChannel() {
    this.engine?.leaveChannel();
  }

  async muteLocalAudio(muted: boolean) {
    this.engine?.muteLocalAudioStream(muted);
  }

  getEngine() {
    return this.engine;
  }
}

export const agoraService = new AgoraService();
