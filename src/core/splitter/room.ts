export interface Room
{
  threadId: string;
  handledMessages: string[];
  action?: Promise<void>;
}
