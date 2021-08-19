import { createReadStream, ReadStream } from "fs"
import { resolve } from "./resolve"

export const read = (resPath: string): ReadStream =>
{
  const path = resolve(resPath)
  const stream = createReadStream(path)

  return stream
}
