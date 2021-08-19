import { ErrorCallback, Listener } from "../listener";
import { Room } from "./room";
import { Splitter, SplitterEventCallback } from "./splitter";

export const split = (listener: Listener): Splitter =>
{
  const splitter = {
    rooms: [] as Room[],
    errorHandlers: [] as ErrorCallback[],
    eventHandlers: [] as SplitterEventCallback[],

    onEvent: (cb: SplitterEventCallback) => splitter.eventHandlers.push(cb),
    onError: (cb: ErrorCallback) => splitter.errorHandlers.push(cb),
  }

  listener.onEvent(event =>
  {
    if (event.type !== "message")
    {
      return;
    }

    const msg = event as Facebook.IReceivedMessage
    let room = splitter.rooms.find(r => r.threadId === msg.threadID)

    if (!room)
    {
      room = { threadId: msg.threadID, handledMessages: [] }

      splitter.rooms.push(room)
    }

    splitter.eventHandlers.forEach(h => h(room as Room, msg))
  })

  listener.onError(err =>
    splitter.errorHandlers.forEach(h => h(err))
  )

  return splitter
}
