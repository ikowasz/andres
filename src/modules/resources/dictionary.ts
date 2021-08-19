export enum TokenType
{
  string = "string",
  time = "time",
  variable = "variable",
  actor = "actor",
  parensStart = "parensStart",
  parensEnd = "parensEnd",
  comma = "comma",

  // conditions
  contains = "contains",
  match = "match",
  and = "and",
  or = "or",
}

export const NEWLINE = 10
export const WHITESPACES = [
  NEWLINE,
  32, // space
  13, // \r
  9,  // tab
]

export const DIGITS = [
  48, // 0
  49, // 1
  50, // 2
  51, // 3
  52, // 4
  53, // 5
  54, // 6
  55, // 7
  56, // 8
  57, // 9
]

export const LOWERCASE = [
  97, // a
  98, // b
  99, // c
  100, // d
  101, // e
  102, // f
  103, // g
  104, // h
  105, // i
  106, // j
  107, // k
  108, // l
  109, // m
  110, // n
  111, // o
  112, // p
  113, // q
  114, // r
  115, // s
  116, // t
  117, // u
  118, // v
  119, // w
  120, // x
  121, // y
  122, // z
]

export const UPPERCASE = [
  65, // A
  66, // B
  67, // C
  68, // D
  69, // E
  70, // F
  71, // G
  72, // H
  73, // I
  74, // J
  75, // K
  76, // L
  77, // M
  78, // N
  79, // O
  80, // P
  81, // Q
  82, // R
  83, // S
  84, // T
  85, // U
  86, // V
  87, // W
  88, // X
  89, // Y
  90, // Z
]

export const LETTERS = [...LOWERCASE, ...UPPERCASE]

export const ESCAPE = 92 // \
export const PARENS_INCREASE = 40 // (
export const PARENS_DECREASE = 41 // )
export const TIME_START = 91 // [
export const TIME_END = 93 // ]
export const COLON = 58 // :
export const COMMENT = 35 // #
export const COMMA = 44 // ,

export const QUOTES = [
  39, // '
  34, // "
  96, // `
]

const contains = (arr: number[], byte: number) => arr.indexOf(byte) >= 0

const containingTest = (arr: number[]) =>
  (byte: number) => contains(arr, byte)

export const isWhitespace = containingTest(WHITESPACES)
export const isLetter = containingTest(LETTERS)
export const isLowercase = containingTest(LOWERCASE)
export const isUppercase = containingTest(UPPERCASE)
export const isDigit = containingTest(DIGITS)
export const isQuote = containingTest(QUOTES)
export const isParensStart = (byte: number) => PARENS_INCREASE === byte
export const isParensEnd = (byte: number) => PARENS_DECREASE === byte
export const isTimeStart = (byte: number) => TIME_START === byte
export const isTimeEnd = (byte: number) => TIME_END === byte
export const isEscape = (byte: number) => ESCAPE === byte
export const isColon = (byte: number) => COLON === byte
export const isNewline = (byte: number) => NEWLINE === byte
export const isComment = (byte: number) => COMMENT === byte
export const isComma = (byte: number) => COMMA === byte
