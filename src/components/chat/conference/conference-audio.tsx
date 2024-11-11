import {
  AudioConferenceProps,
  TrackLoop,
  useTracks,
  ParticipantAudioTile,
  LayoutContextProvider,
  ControlBar,
  Chat,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { ConferenceChat } from '@/components/chat/conference/conference-chat';

export const CustomAudioConference = ({ ...props }: AudioConferenceProps) => {
  const audioTracks = useTracks([Track.Source.Microphone]);
  console.log('TRACK', Track);

  return (
    <LayoutContextProvider>
      <div className={'relative w-full flex flex-col h-full'} {...props}>
        <div>
          <div className={'w-full grid grid-cols-4 gap-[10px]'}>
            <TrackLoop tracks={audioTracks}>
              <ParticipantAudioTile />
            </TrackLoop>
          </div>
          <ControlBar
            variation={'verbose'}
            controls={{
              microphone: true,
              screenShare: true,
              camera: false,
            }}
          />
        </div>
        <ConferenceChat />
      </div>
    </LayoutContextProvider>
  );
};
