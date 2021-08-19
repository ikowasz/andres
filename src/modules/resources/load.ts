import { parse } from "./parser/parse"
import { Resource } from "./parser/parser"
import { read } from "./read"
import { tokenize } from "./tokenize"

export const load = async (path: string) =>
{
  const readStream = read(path)
  const tokens = await tokenize(readStream)
  const resource = parse(tokens)

  const conditionCreator = (res: Resource) =>
    async (event: Facebook.IReceived) =>
    {
      if (event.type !== "message")
      {
        return false
      }

      const msg = event as Facebook.IReceivedMessage

      if (!res.condition(msg.body))
      {
        return false
      }

      return res.script
    }

  return conditionCreator(resource)
}
