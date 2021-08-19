import { TokenType } from "../dictionary";
import { ParserState } from "./parser";

export interface ParserCommandAliasState
{
  actor: string;
  value: string;
}

export const parseCommandAlias = (state: ParserState) =>
{
  const aliasState: ParserCommandAliasState = {
    actor: "",
    value: "",
  }

  const buffer = state.commandBuffer
  const script = state.resource.script

  for (const index in buffer)
  {
    const token = buffer[index]

    switch (token.type)
    {
      case TokenType.actor:
        aliasState.actor = token.value || ""
        break;

      case TokenType.string:
        aliasState.value = token.value || ""
        break;

      default:
        throw new Error("invalid: unexpected argument")
    }
  }

  if (!script.alias)
    script.alias = {}

  if (!script.alias.actor)
    script.alias.actor = {}

  script.alias.actor[aliasState.actor] = aliasState.value
}
