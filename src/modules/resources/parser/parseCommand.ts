import { parseCommandAlias } from "./parseCommandAlias";
import { parseCommandCondition } from "./parseCommandCondition";
import { parseCommandScript } from "./parseCommandScript";
import { ParserState } from "./parser";

export const parseCommand = (state: ParserState) =>
{
  switch (state.command)
  {
    case "alias":
      parseCommandAlias(state)
      break;

    case "script":
      parseCommandScript(state)
      break;

    case "condition":
      parseCommandCondition(state)
      break;
  }

  delete state.command

  state.commandBuffer = []
}
