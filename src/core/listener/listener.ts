export type ErrorCallback = (error: Facebook.IError) => void
export type EventCallback = (event: Facebook.IReceived) => void

export interface Listener
{
  onError: (cb: ErrorCallback) => void;
  onEvent: (cb: EventCallback) => void;
}
