import { Actor } from "../../types"
import { ScriptLineMessage } from "../script"

export const runLineMessage = async (line: ScriptLineMessage, actor: Actor, threadId: string): Promise<Facebook.IMessageInfo> =>
{
  const info = await new Promise<Facebook.IMessageInfo>((res, rej) =>
    actor.api.sendMessage(line.text, threadId, (err, info) =>
      (err) ? rej(err) : res(info)
    )
  )

  return info
}
