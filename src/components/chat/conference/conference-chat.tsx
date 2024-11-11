import {
  ChatProps,
  useChat,
  useMaybeLayoutContext,
} from '@livekit/components-react';
import type { ChatMessage } from '@livekit/components-core';
import { FormEvent, useEffect, useRef } from 'react';
import React from 'react';
import {
  ChatEntry,
  cloneSingleChild,
} from '@/components/chat/conference/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const ConferenceChat = ({ ...props }: ChatProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const ulRef = useRef<HTMLUListElement | null>(null);

  const { send, chatMessages, isSending } = useChat();

  const layoutContext = useMaybeLayoutContext();
  const lastReadMsgAt = useRef<ChatMessage['timestamp']>(0);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (inputRef.current && inputRef.current.value.trim() !== '') {
      if (send) {
        await send(inputRef.current.value);
        inputRef.current.value = '';
        inputRef.current.focus();
      }
    }
  };

  useEffect(() => {
    if (ulRef) {
      ulRef.current?.scrollTo({ top: ulRef.current?.scrollHeight });
    }
  }, [ulRef, chatMessages]);

  useEffect(() => {
    if (!layoutContext || chatMessages.length === 0) {
      return;
    }

    if (
      layoutContext.widget.state?.showChat &&
      chatMessages.length > 0 &&
      lastReadMsgAt.current !== chatMessages[chatMessages.length - 1]?.timestamp
    ) {
      lastReadMsgAt.current = chatMessages[chatMessages.length - 1]?.timestamp;
      return;
    }

    const unreadMessageCount = chatMessages.filter(
      (msg) => !lastReadMsgAt.current || msg.timestamp > lastReadMsgAt.current
    ).length;

    const { widget } = layoutContext;
    if (
      unreadMessageCount > 0 &&
      widget.state?.unreadMessages !== unreadMessageCount
    ) {
      widget.dispatch?.({ msg: 'unread_msg', count: unreadMessageCount });
    }
  }, [chatMessages, layoutContext?.widget]);

  return (
    <div className={'flex flex-col flex-1'} {...props}>
      <Separator
        className={'h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md mx-auto'}
      />
      <ul
        className={
          'flex w-full max-h-full flex-col gap-1 overflow-auto list-none m-0 p-0 flex-1'
        }
        ref={ulRef}
      >
        {props.children
          ? chatMessages.map((msg, idx) =>
              cloneSingleChild(props.children, {
                entry: msg,
                key: msg.id ?? idx,
              })
            )
          : chatMessages.map((msg, idx, allMsg) => {
              const hideName = idx >= 1 && allMsg[idx - 1].from === msg.from;
              // If the time delta between two messages is bigger than 60s show timestamp.
              const hideTimestamp =
                idx >= 1 && msg.timestamp - allMsg[idx - 1].timestamp < 60_000;
              console.log('msg', msg);
              return (
                <ChatEntry
                  key={msg.id ?? idx}
                  hideName={hideName}
                  hideTimestamp={hideName === false ? false : hideTimestamp} // If we show the name always show the timestamp as well.
                  entry={msg}
                />
              );
            })}
      </ul>
      <form onSubmit={handleSubmit}>
        <div className={'relative p-4 pb-4 flex gap-4 items-center'}>
          <Input
            className={
              'px-6 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
            }
            disabled={isSending}
            ref={inputRef}
            type="text"
            placeholder="Enter a message..."
            onInput={(ev) => ev.stopPropagation()}
            onKeyDown={(ev) => ev.stopPropagation()}
            onKeyUp={(ev) => ev.stopPropagation()}
          />
          <Button
            className={
              'dark:text-zinc-200 dark:bg-zinc-800 text-zinc-800 bg-zinc-200 border-none'
            }
            variant={'outline'}
            type="submit"
            disabled={isSending}
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};
