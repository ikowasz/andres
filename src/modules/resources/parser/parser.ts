import { Script } from "../../../core";
import { Token } from "../tokenize";

export interface Resource
{
  condition: (text: string) => boolean;
  script: Script;
}

export interface ParserState
{
  command?: string;
  commandBuffer: Token[];
  parensLevel: number;
  resource: Resource;
}
