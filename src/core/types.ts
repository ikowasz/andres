import { Script } from './runner';

export * from './listener/listener';
export * from './runner/script';
export * from './splitter/splitter';

export type MessengerLoginAppState = any;
export type ControllerCondition = (event: Facebook.IReceived) => Promise<Script | false>;

export interface Config
{
  actors: ActorParameters[]
}

export interface LoginCredentials
{
  login: string;
  password: string;
}

export interface ActorParameters
{
  name: string;
  credentials: LoginCredentials;
  appState?: MessengerLoginAppState;
}

export interface Actor
{
  name: string
  api: Facebook.API;
}
