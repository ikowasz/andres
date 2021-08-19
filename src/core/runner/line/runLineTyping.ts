import { Actor } from "../../types"
import { ScriptLineTyping } from "../script"

export const runLineTyping = async (_line: ScriptLineTyping, actor: Actor, threadId: string): Promise<void> =>
{
  await new Promise<void>((res, rej) =>
    actor.api.sendTypingIndicator(threadId, (err) =>
      err ? rej(err) : res()
    )
  )
}
