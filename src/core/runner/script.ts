export type ScriptLineActionType = "null" | "typing" | "message" | "changeNickname";

export interface ScriptLine
{
  label?: string;
  actor: string;
  actionType: ScriptLineActionType;
  actionWaitTime: number;
  actionTime: number;
}

export type ScriptLineTyping = ScriptLine

export interface ScriptLineMessage extends ScriptLine
{
  actionType: "message";
  text: string;
}

export type ScriptLineType = ScriptLineTyping | ScriptLineMessage | ScriptLineChangeNickname

export interface ScriptLineChangeNickname extends ScriptLine
{
  target: "self" | string;
  nickname: string;
}

export type ScriptStringAliasMap = { [key: string]: string }

export interface ScriptAliases
{
  actor?: ScriptStringAliasMap
}

export interface Script
{
  alias?: ScriptAliases;

  lines: ScriptLineType[];
}
