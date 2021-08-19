import { Actor } from "../types";

export const selectActor = (actorIdPar: string, alias: { [key: string]: string }, actors: Actor[]): Actor =>
{
  const actorId = alias[actorIdPar] || actorIdPar;

  if (actors.length === 0)
  {
    throw new Error("no actors")
  }

  let actorIdNumber = parseInt(actorId)

  if (!isNaN(actorIdNumber))
  {
    while (actorIdNumber >= actors.length)
    {
      actorIdNumber -= actors.length
    }

    if (!actors[actorIdNumber])
    {
      throw new Error("invalid actor id")
    }

    return actors[actorIdNumber]
  }

  const actor = actors.find(a => a.name === actorId)

  if (!actor)
  {
    throw new Error("actor name not found")
  }

  return actor
}
