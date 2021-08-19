import { Actor } from "../types";
import { listen } from "./listen";
import { ErrorCallback, EventCallback, Listener } from "./listener";

export const listenAll = (actors: Actor[]): Listener =>
{
  const listener = {
    errorHandlers: [] as ErrorCallback[],
    eventHandlers: [] as EventCallback[],

    onError: (cb: ErrorCallback) => listener.errorHandlers.push(cb),
    onEvent: (cb: EventCallback) => listener.eventHandlers.push(cb),
  }

  actors.forEach(actor =>
  {
    const actorListener = listen(actor)

    actorListener.onError(err =>
      listener.errorHandlers.forEach(h => h(err))
    )

    actorListener.onEvent(event =>
      listener.eventHandlers.forEach(h => h(event))
    )
  })

  return listener

}
