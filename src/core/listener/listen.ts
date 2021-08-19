import { Actor } from "../types";
import { ErrorCallback, EventCallback, Listener } from './listener';

export const listen = (actor: Actor): Listener =>
{
  const listener = {
    errorHandlers: [] as ErrorCallback[],
    eventHandlers: [] as EventCallback[],

    onError: (cb: ErrorCallback) => listener.errorHandlers.push(cb),
    onEvent: (cb: EventCallback) => listener.eventHandlers.push(cb),
  }

  actor.api.listenMqtt((err, event) =>
  {
    if (err)
    {
      listener.errorHandlers.forEach(h => h(err))

      return
    }

    listener.eventHandlers.forEach(h => h(event))
  })

  return listener
}
