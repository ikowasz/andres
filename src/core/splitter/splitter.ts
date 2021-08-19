import { ErrorCallback } from "../listener";
import { Room } from "./room";

export type SplitterEventCallback = (room: Room, event: Facebook.IReceivedMessage) => void;

export interface Splitter
{
  onEvent: (cb: SplitterEventCallback) => void;
  onError: (cb: ErrorCallback) => void;
}
