import React from 'react';
import { ReceivedChatMessage } from '@livekit/components-core';
import { MessageFormatter } from '@livekit/components-react';
import clsx from 'clsx';

export interface ChatEntryProps extends React.HTMLAttributes<HTMLLIElement> {
  /** The chat massage object to display. */
  entry: ReceivedChatMessage;
  /** Hide sender name. Useful when displaying multiple consecutive chat messages from the same person. */
  hideName?: boolean;
  /** Hide message timestamp. */
  hideTimestamp?: boolean;
  /** An optional formatter for the message body. */
  messageFormatter?: MessageFormatter;
}

export function cloneSingleChild(
  children: React.ReactNode | React.ReactNode[],
  props?: Record<string, any>,
  key?: any
) {
  return React.Children.map(children, (child) => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child) && React.Children.only(children)) {
      if (child.props.class) {
        // make sure we retain classnames of both passed props and child
        props ??= {};
        props.class = clsx(child.props.class, props.class);
        props.style = { ...child.props.style, ...props.style };
      }
      return React.cloneElement(child, { ...props, key });
    }
    return child;
  });
}

export const ChatEntry: (
  props: ChatEntryProps & React.RefAttributes<HTMLLIElement>
) => React.ReactNode = /* @__PURE__ */ React.forwardRef<
  HTMLLIElement,
  ChatEntryProps
>(function ChatEntry(
  {
    entry,
    hideName = false,
    hideTimestamp = false,
    messageFormatter,
    ...props
  }: ChatEntryProps,
  ref
) {
  const formattedMessage = React.useMemo(() => {
    return messageFormatter ? messageFormatter(entry.message) : entry.message;
  }, [entry.message, messageFormatter]);
  const hasBeenEdited = !!entry.editTimestamp;
  const time = new Date(entry.timestamp);
  const locale = navigator ? navigator.language : 'en-US';

  return (
    <li
      ref={ref}
      className={
        'flex flex-col gap-1 m-[0.25rem] text-zinc-600 dark:text-zinc-200 dark:hover:bg-[#42454f] hover:bg-zinc-200/70 transition-all duration-150 rounded-lg p-2'
      }
      title={time.toLocaleTimeString(locale, { timeStyle: 'full' })}
      data-lk-message-origin={entry.from?.isLocal ? 'local' : 'remote'}
      {...props}
    >
      {(!hideTimestamp || !hideName || hasBeenEdited) && (
        <span
          className={
            'text-[0.75rem] text-[--lk-fg5] text-zinc-400 whitespace-nowrap px-[0.3rem] flex'
          }
        >
          {!hideName && (
            <strong className={'text-sm'}>
              {entry.from?.name || entry.from?.identity}
            </strong>
          )}

          {(!hideTimestamp || hasBeenEdited) && (
            <span className={'ml-auto self-end'}>
              {hasBeenEdited && 'edited '}
              {time.toLocaleTimeString(locale, { timeStyle: 'short' })}
            </span>
          )}
        </span>
      )}

      <span
        className={
          'inline-block rounded-[15px] px-3 py-1 break-words w-fit max-w-[calc(100%-32px)]'
        }
      >
        {formattedMessage}
      </span>
    </li>
  );
});
