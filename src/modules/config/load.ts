import { readFile } from "fs/promises";
import path from "path";
import { Config } from "../../core";

export interface JsonConfigActorRecord
{
  name: string;
  login: string;
  password: string;
}

export const DEFAULT_CONFIG_LOCATION = path.resolve(process.cwd(), 'botconfig.json')

export const load = async (path: string = DEFAULT_CONFIG_LOCATION): Promise<Config> =>
{
  const buff = await readFile(path)
  const data = JSON.parse(buff.toString())

  if (!data.actors || typeof data.actors !== "object")
  {
    throw new Error("no actors in config")
  }

  const actors = data.actors.map((actor: JsonConfigActorRecord) => ({
    name: actor.name,
    credentials: {
      login: actor.login,
      password: actor.password,
    }
  }))

  const config = {
    actors,
  }

  return config
}
