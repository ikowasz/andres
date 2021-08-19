#!/usr/bin/env node

import { main } from "./main";
import { load } from "./modules/config/load";

export const start = async () =>
{
  const config = await load()

  main(config)
    .catch((err) =>
    {
      console.log('Error!')
      console.error(err)
    })
}

start()
