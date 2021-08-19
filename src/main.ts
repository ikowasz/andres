import { Config, Controller } from "./core";
import { load as loadRes } from "./modules/resources";

export const main = async (config: Config): Promise<void> =>
{
  const controller = new Controller(config)

  controller
    .addCondition(await loadRes('rodzyny'))
    .addCondition(await loadRes('ananas'))
    .addCondition(await loadRes('andres'))

  await controller.start()
}
