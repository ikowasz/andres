import { ScriptLine, ScriptLineMessage } from "../../../core";
import { TokenType } from "../dictionary";
import { ParserState } from "./parser";

export interface ParserCommandScriptLineState
{
  modified: boolean;
  actor: string;
  time: string;
  command: string;
  commandParams: string[];
  parensIndex: number;
}

const getFreshScriptState = () => ({
  modified: false,
  actor: "",
  time: "",
  command: "",
  commandParams: [],
  parensIndex: 0,
})

const parseTime = (timeStr: string) =>
{
  const parts = timeStr.split('+')

  return {
    actionTime: (parts[0]?.length > 0) ? parseInt(parts[0]) : 0,
    actionWaitTime: (parts[1]?.length > 0) ? parseInt(parts[1]) : 0,
  }
}

const saveLineState = (state: ParserState, lineState: ParserCommandScriptLineState) =>
{
  const time = parseTime(lineState.time)

  const line: ScriptLine = {
    actor: lineState.actor,
    actionType: "null",
    actionTime: time.actionTime,
    actionWaitTime: time.actionWaitTime,
  }

  switch (lineState.command)
  {
    case "typing":
      line.actionType = "typing";
      break;

    case "message": {
      const msg = line as ScriptLineMessage

      msg.actionType = "message"
      msg.text = lineState.commandParams[0]
      break;
    }

    default:
      throw new Error("invalid: unsupported line command")
  }

  state.resource.script.lines.push(line)
}


export const parseCommandScript = (state: ParserState) =>
{
  let scriptState: ParserCommandScriptLineState = getFreshScriptState()

  const buffer = state.commandBuffer

  for (const index in buffer)
  {
    const token = buffer[index]

    scriptState.modified = true

    if (scriptState.parensIndex > 0)
    {
      if (token.type === TokenType.parensEnd)
      {
        scriptState.parensIndex--
        continue
      }

      scriptState.commandParams.push(token.value || "")
    }

    switch (token.type)
    {
      case TokenType.actor:
        scriptState.actor = token.value || ""
        break

      case TokenType.time:
        scriptState.time = token.value || ""
        break

      case TokenType.parensStart:
        if (scriptState.command)
          throw new Error("invalid: nested line command unsupported")

        scriptState.command = token.value || ""
        scriptState.parensIndex++
        break

      case TokenType.parensEnd:
        throw new Error("invalid: unexpected closing bracket")

      case TokenType.comma:
        saveLineState(state, scriptState)
        scriptState = getFreshScriptState()
        break;
    }
  }

  if (scriptState.modified)
    saveLineState(state, scriptState)
}
