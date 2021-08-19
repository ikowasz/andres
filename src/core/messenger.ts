import fbLogin from "facebook-chat-api";
import puppeteer from 'puppeteer';
import { Actor, ActorParameters, LoginCredentials, MessengerLoginAppState } from "./types";

export interface IMessenger
{
  joinActor: (params: ActorParameters) => Promise<Actor>;
  joinPool: (params: ActorParameters[]) => Promise<Actor[]>;
  getActors: () => Actor[];
}

export class Messenger implements IMessenger
{
  private loginPromise?: Promise<MessengerLoginAppState>;
  private actors: Actor[] = [];

  private async loginFb(credentials: LoginCredentials)
  {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto("https://www.facebook.com/")

    await page.waitForSelector('#email')
    await page.waitForSelector('button[data-cookiebanner="accept_button"]')
    await page.click('button[data-cookiebanner="accept_button"]')
    await page.type('#email', credentials.login);
    await page.type('#pass', credentials.password);
    await page.click('button[name="login"]');

    await page.waitForSelector('div[role="banner"]')

    const cookies = await page.cookies()

    await browser.close()

    const appStateCookies = cookies.map(({ name: key, ...rest }) => ({ key, ...rest }));

    return appStateCookies
  }

  private async loginFbGuard(credentials: LoginCredentials)
  {
    while (this.loginPromise)
    {
      await this.loginPromise
    }

    this.loginPromise = this.loginFb(credentials)
      .finally(() =>
        delete this.loginPromise
      )

    return this.loginPromise
  }

  private async connectMessenger(appState: MessengerLoginAppState)
  {
    return new Promise<Facebook.API>((res, rej) =>
      fbLogin({ appState }, (err, api) =>
        (err) ? rej(err) : res(api)
      )
    )
  }

  async joinActor(params: ActorParameters)
  {
    let api;

    if (params.appState)
    {
      try
      {
        api = await this.connectMessenger(params.appState)
      } catch (e)
      {
        console.log("invalid app state, trying login with credentials")
      }
    }

    if (!api)
    {
      const appState = await this.loginFbGuard(params.credentials)

      api = await this.connectMessenger(appState)
    }

    const actor = { name: params.name, api }
    this.actors.push(actor)

    return actor
  }

  async joinPool(params: ActorParameters[])
  {
    return Promise.all(
      params.map(actorParams => this.joinActor(actorParams))
    )
  }

  getActors()
  {
    return this.actors
  }
}
