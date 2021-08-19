import { Actor } from "../../types"
import { ScriptLine, ScriptLineChangeNickname, ScriptLineMessage } from "../script"
import { runLineChangeNickname } from "./runLineChangeNickname"
import { runLineMessage } from "./runLineMessage"
import { runLineTyping } from "./runLineTyping"

export const runLine = async (line: ScriptLine, actor: Actor, threadId: string): Promise<Facebook.IMessageInfo | void> =>
{
  switch (line.actionType)
  {
    case "typing":
      return runLineTyping(line, actor, threadId)

    case "message":
      return runLineMessage(line as ScriptLineMessage, actor, threadId)

    case "changeNickname":
      return runLineChangeNickname(line as ScriptLineChangeNickname, actor, threadId)
  }
}
