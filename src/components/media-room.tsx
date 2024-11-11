'use client';
import { useEffect, useState } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  ConnectionQualityIndicator,
  ParticipantAudioTile,
  ParticipantTile,
  ParticipantName,
  useParticipants,
  LayoutContextProvider,
  AudioConference,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import { CustomAudioConference } from '@/components/chat/conference/conference-audio';

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}
// TODO: consider to use useIsSpeaking
export const MediaRoom = ({ chatId, audio, video }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState('');

  useEffect(() => {
    if (!user?.firstName) return;
    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  if (token === '') {
    return (
      <div className={'flex flex-col flex-1 justify-center items-center'}>
        <Loader2 className={'h-7 w-7 text-zinc-500 animate-spin my-4'} />
        <p className={'text-xs text-zinc-500 dark:text-zinc-400'}>Loading...</p>
      </div>
    );
  }

  return (
    <LayoutContextProvider>
      <LiveKitRoom
        className={'!bg-white dark:!bg-[#313338] flex-1'}
        data-lk-theme={'default'}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        token={token}
        connect={true}
        video={video}
        audio={audio}
      >
        <NestedComponent />
        {video && <VideoConference />}
        {!video && <CustomAudioConference />}
      </LiveKitRoom>
    </LayoutContextProvider>
  );
};

const NestedComponent = () => {
  const participants = useParticipants();
  // useEffect(() => {
  //   console.log('isSpeaking', participants[0].isSpeaking);
  // }, [participants]);
  return <></>;
};
