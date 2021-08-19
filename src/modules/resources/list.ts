import { lstat, readdir } from "fs/promises"
import path from "path"
import { DEFAULT_RESOURCES_LOCATION, resolve } from "./resolve"

export const list = async (dirPath?: string): Promise<string[]> =>
{
  const out = []
  const dir = dirPath ? resolve(dirPath) : DEFAULT_RESOURCES_LOCATION
  const content = await readdir(dir)

  for (const index in content)
  {
    const entityName = content[index]
    const entityPath = path.resolve(dir, entityName)

    const stat = await lstat(entityPath)

    if (stat.isDirectory())
    {
      const subList = await list(entityPath)

      out.push(...subList)
      continue
    }

    out.push(entityPath)
  }

  return out
}
