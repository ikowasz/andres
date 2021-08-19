import { TokenType } from "../dictionary";
import { Token } from "../tokenize";
import { ParserState } from "./parser";

interface PartEval
{
  func: (text: string) => boolean,
  operator: string,
}

const parseCondition = (tokens: Token[]) =>
{
  const conditionState = {
    cutting: false,
    buffer: [] as Token[],
    partEvals: [] as PartEval[],
    parensIndex: 0,
    comparison: "",
    value: "",
    operator: "",
  }

  const addPartEval = () =>
  {
    if (!conditionState.comparison && !conditionState.value)
      return

    const partEvalCreator = (comparison: string, value: string) =>
      (text: string) =>
      {
        switch (comparison)
        {
          case "contains":
            return text.indexOf(value) >= 0;

          case "match": {
            const regEx = new RegExp(value)
            return regEx.test(text)
          }

          default:
            throw new Error("invalid: unknown comparison")
        }
      }

    const partEval = {
      func: partEvalCreator(conditionState.comparison, conditionState.value),
      operator: conditionState.operator,
    }

    conditionState.comparison = ""
    conditionState.value = ""
    conditionState.operator = ""

    conditionState.partEvals.push(partEval)
  }

  for (const index in tokens)
  {
    const token = tokens[index]

    if (conditionState.cutting)
    {
      if (token.type === TokenType.parensStart)
        conditionState.parensIndex++

      if (token.type === TokenType.parensEnd)
        conditionState.parensIndex--

      if (conditionState.parensIndex < 0)
        throw new Error("invalid: unsuspected closing bracked")

      if (conditionState.parensIndex === 0)
      {
        const cutCondition = parseCondition(conditionState.buffer)

        conditionState.partEvals.push({
          func: cutCondition,
          operator: conditionState.operator
        })

        conditionState.comparison = ""
        conditionState.value = ""
        conditionState.operator = ""
        conditionState.cutting = false

        continue;
      }

      conditionState.buffer.push(token)
      continue;
    }

    switch (token.type)
    {
      case TokenType.parensStart:
        conditionState.buffer = []
        conditionState.cutting = true
        conditionState.parensIndex++
        break;

      case TokenType.contains:
        conditionState.comparison = "contains"
        break;

      case TokenType.match:
        conditionState.comparison = "match"
        break;

      case TokenType.string:
        conditionState.value = token.value || ""
        break;

      case TokenType.and:
        addPartEval()
        conditionState.operator = "and"
        break;

      case TokenType.or:
        addPartEval()
        conditionState.operator = "or"
        break;
    }
  }

  {
    addPartEval()
  }

  const sumEvalCreator = (partEvals: PartEval[]) =>
    (text: string) =>
    {
      let accu = false

      for (const index in partEvals)
      {
        const partEval = partEvals[index]
        const outcome = partEval.func(text)

        switch (partEval.operator)
        {
          case "":
            accu = outcome
            break;

          case "and":
            accu = accu && outcome
            break;

          case "or":
            accu = accu || outcome
            break;

          default:
            throw new Error("invalid: unsupported operator")
        }
      }

      return accu
    }

  const sumEval = sumEvalCreator(conditionState.partEvals)

  return sumEval
}

export const parseCommandCondition = (state: ParserState) =>
{
  const condition = parseCondition(state.commandBuffer)

  state.resource.condition = condition
}
