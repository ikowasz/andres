import listenAll from "./listener";
import { Messenger } from "./messenger";
import run from "./runner";
import split, { Room } from "./splitter";
import { Config, ControllerCondition, Script } from "./types";

export interface IController
{
  addCondition: (condition: ControllerCondition) => this;
  start: () => Promise<this>;
}

export class Controller implements IController
{
  private config: Config;
  private conditions: ControllerCondition[] = [];
  private messenger: Messenger;

  constructor(config: Config)
  {
    this.config = config
    this.messenger = new Messenger
  }

  addCondition(condition: ControllerCondition)
  {
    this.conditions.push(condition)

    return this
  }

  async start()
  {
    const actors = await this.messenger.joinPool(this.config.actors)

    console.log(`actors pool created, count: ${actors.length}, actors:\n${JSON.stringify(actors.map(a => a.name), null, 2)}\n`)

    const listener = listenAll(actors)
    const splitter = split(listener)

    splitter.onEvent(this.eventHandlerGuard.bind(this))

    return this
  }

  private async getEventScript(event: Facebook.IReceivedMessage)
  {
    const conditions = this.conditions

    for (let i = 0; i < conditions.length; i++)
    {
      const condition = conditions[i]

      const result = await condition(event)

      if (result !== false)
        return result
    }

    return undefined
  }

  private async eventHandler(room: Room, event: Facebook.IReceivedMessage)
  {
    const actors = this.messenger.getActors()
    const script = await this.getEventScript(event)

    if (!script)
    {
      console.log('no valid action found')
      return
    }

    await run(script as Script, actors, room.threadId)

    console.log('action finished')
  }

  private async eventHandlerGuard(room: Room, event: Facebook.IReceivedMessage)
  {
    const actors = this.messenger.getActors()

    console.log(`new event received, room: ${room.threadId}, event:\n${JSON.stringify(event, null, 2)}\n`)

    if (typeof actors.find(a => a.api.getCurrentUserID() === event.senderID) !== "undefined")
    {
      console.log('message sent from another actor, ommiting')
      return
    }

    while (typeof room.action !== "undefined")
    {
      console.log('pending action, wait...')

      await room.action
    }

    console.log('running new action')

    if (room.handledMessages.indexOf(event.messageID) >= 0)
    {
      console.log('event was already handled, ommiting')
      return
    }

    room.handledMessages.push(event.messageID)

    room.action = this.eventHandler(room, event)
      .finally(() => delete room.action)
  }
}
