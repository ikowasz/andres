import { ReadStream } from "fs";
import { isColon, isComma, isComment, isEscape, isNewline, isParensEnd, isParensStart, isQuote, isTimeEnd, isTimeStart, isWhitespace, TokenType } from "./dictionary";

export const TOKEN_TYPE_MAP: { [key: string]: TokenType } = {
  "contains": TokenType.contains,
  "match": TokenType.match,
  "&&": TokenType.and,
  "||": TokenType.or,
}

export interface Token
{
  type: TokenType;
  value?: string;
}

export enum TokenizerMode
{
  free,
  string,
  time,
  comment,
}

export interface TokenizerState
{
  mode: TokenizerMode;
  escaped: boolean;
  tokens: Token[];
  stack: string;
  quotes: number;
}

const pushByteToStack = (state: TokenizerState, byte: number) =>
  state.stack += String.fromCharCode(byte)

const flushStack = (state: TokenizerState) =>
{
  const stack = state.stack

  state.stack = ""

  return stack
}

const pushToken = (state: TokenizerState, token: Token) =>
{
  if (state.stack.length > 0)
  {
    pushLastToken(state)
  }

  state.tokens.push(token)
}

const pushCommandStart = (state: TokenizerState) =>
{
  const value = flushStack(state)
  const token: Token = { type: TokenType.parensStart }

  if (value)
  {
    token.value = value
  }

  pushToken(state, token)
}

const pushCommandEnd = (state: TokenizerState) =>
{
  const token: Token = { type: TokenType.parensEnd }

  pushToken(state, token)
}

const pushString = (state: TokenizerState, value: string) =>
{
  const token: Token = {
    type: TokenType.string,
    value
  }

  state.tokens.push(token)
}

const pushTime = (state: TokenizerState, value: string) =>
{
  const token: Token = {
    type: TokenType.time,
    value
  }

  state.tokens.push(token)
}

const pushActor = (state: TokenizerState) =>
{
  let value = flushStack(state)

  if (value.length === 0 && state.tokens[state.tokens.length - 1].type === TokenType.string)
  {
    const lastToken = state.tokens.pop()
    const lastValue = lastToken?.value

    if (!lastValue)
    {
      throw new Error("parsing error: invalid actor")
    }

    value = lastValue
  }

  const token: Token = {
    type: TokenType.actor,
    value
  }

  state.tokens.push(token)
}

const pushLastToken = (state: TokenizerState) =>
{
  const value = flushStack(state)
  const mappedToken = TOKEN_TYPE_MAP[value]
  const type = mappedToken ? mappedToken : TokenType.variable

  const token: Token = { type }

  if (!mappedToken)
    token.value = value

  pushToken(state, token)
}

const pushComma = (state: TokenizerState) =>
{
  if (state.stack.length > 0)
    pushLastToken(state)

  const token: Token = {
    type: TokenType.comma
  }

  pushToken(state, token)
}

const startStringMode = (state: TokenizerState, quotes: number) =>
{
  if (state.stack.length > 0)
    pushLastToken(state)

  state.stack = ""
  state.quotes = quotes;
  state.mode = TokenizerMode.string
}

const finishStringMode = (state: TokenizerState) =>
{
  const value = flushStack(state)

  pushString(state, value)

  state.mode = TokenizerMode.free
}

const startTimeMode = (state: TokenizerState) =>
{
  if (state.stack.length > 0)
  {
    pushLastToken(state)
  }

  state.stack = ""
  state.mode = TokenizerMode.time
}

const finishTimeMode = (state: TokenizerState) =>
{
  const value = flushStack(state)

  pushTime(state, value)

  state.mode = TokenizerMode.free
}

const tokenizeByte = (state: TokenizerState, byte: number) =>
{
  if (state.escaped)
    return pushByteToStack(state, byte)

  if (isEscape(byte))
    return state.escaped = true

  if (state.mode === TokenizerMode.comment)
  {
    if (isNewline(byte))
      state.mode = TokenizerMode.free

    return
  }

  if (state.mode === TokenizerMode.string)
  {
    if (byte === state.quotes)
      return finishStringMode(state)
    else
      return pushByteToStack(state, byte)
  }

  if (state.mode === TokenizerMode.time)
  {
    if (isTimeEnd(byte))
      return finishTimeMode(state)
    else
      return pushByteToStack(state, byte)
  }

  if (isComment(byte))
  {
    if (state.stack.length > 0)
      pushLastToken(state)

    return state.mode = TokenizerMode.comment
  }

  if (isWhitespace(byte))
  {
    if (state.stack.length > 0)
      return pushLastToken(state)
    else
      return
  }

  if (isQuote(byte))
    return startStringMode(state, byte)

  if (isTimeStart(byte))
    return startTimeMode(state)

  if (isParensStart(byte))
    return pushCommandStart(state)

  if (isParensEnd(byte))
    return pushCommandEnd(state)

  if (isColon(byte))
    return pushActor(state)

  if (isComma(byte))
    return pushComma(state)

  return pushByteToStack(state, byte)
}

const tokenizeChunk = (state: TokenizerState, chunk: Buffer) =>
{
  for (let index = 0; index < chunk.byteLength; index++)
  {
    const byte = chunk[index]

    tokenizeByte(state, byte)
  }
}

export const tokenize = async (stream: ReadStream) =>
{
  const state: TokenizerState = {
    mode: TokenizerMode.free,
    escaped: false,
    tokens: [],
    stack: "",
    quotes: 0,
  }

  const readFromStream = async (length?: number): Promise<Buffer> =>
    new Promise<Buffer>((resolve, reject) =>
    {
      stream.once('error', (err) =>
      {
        reject(err)
      })

      stream.once('data', (chunk) =>
      {
        const buffer = (chunk instanceof Buffer) ? chunk : Buffer.from(chunk)

        resolve(buffer)
      })

      stream.read(length)
    })

  while (stream.pending)
  {
    const buff = await readFromStream(1024)

    tokenizeChunk(state, buff)
  }

  return state.tokens
}
