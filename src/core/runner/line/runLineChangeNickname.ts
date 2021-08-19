import { Actor } from "../../types"
import { ScriptLineChangeNickname } from "../script"

export const runLineChangeNickname = async (line: ScriptLineChangeNickname, actor: Actor, threadId: string): Promise<void> =>
  new Promise<void>((res, rej) =>
    actor.api.changeNickname(line.nickname, threadId, line.target, (err) =>
      err ? rej(err) : res()
    )
  )

