import { Actor } from "../types";
import { sleep } from "../utils/time";
import { runLine } from "./line/runLine";
import { Script } from "./script";
import { selectActor } from "./selectActor";

export const run = async (script: Script, actors: Actor[], threadId: string): Promise<void> =>
{
  for (let lineId = 0; lineId < script.lines.length; lineId++)
  {
    const line = script.lines[lineId]
    const actor = selectActor(line.actor, script.alias?.actor || {}, actors)

    if (line.actionWaitTime > 0)
    {
      await sleep(line.actionWaitTime)
    }

    await Promise.all([
      runLine(line, actor, threadId),
      sleep(line.actionTime),
    ])
  }
}
