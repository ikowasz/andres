import { TokenType } from "../dictionary";
import { Token } from "../tokenize";
import { parseCommand } from "./parseCommand";
import { ParserState } from "./parser";

export const parseToken = (state: ParserState, token: Token) =>
{
  if (!state.command)
  {
    if (token.type === TokenType.parensStart && token.value)
    {
      state.command = token.value
      state.parensLevel++

      return
    }

    throw new Error("invalid: not inside a command")
  }

  if (token.type === TokenType.parensEnd)
  {
    state.parensLevel--

    if (state.parensLevel < 0)
    {
      throw new Error("invalid: unexpected closing bracket")
    }

    if (state.parensLevel === 0)
    {
      return parseCommand(state)
    }
  }

  if (token.type === TokenType.parensStart)
  {
    state.parensLevel++
  }

  state.commandBuffer.push(token)
}

export const parse = (tokens: Token[]) =>
{
  const state: ParserState = {
    commandBuffer: [],
    parensLevel: 0,
    resource: {
      condition: () => true,
      script: {
        alias: {
          actor: {}
        },
        lines: []
      }
    }
  }

  for (const index in tokens)
  {
    const token = tokens[index]

    parseToken(state, token)
  }

  return state.resource
}
