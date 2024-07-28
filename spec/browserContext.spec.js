require('chromedriver');
const {Builder} = require('selenium-webdriver');
const Chrome= require('selenium-webdriver/chrome');
const opts = new Chrome.Options();
const {BiDi, BrowsingContext } = require('wd-bidi');

describe('BrowserContext: Create and listen to event', ()=> {
  let driver;

  before(async ()=> {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(opts.set('webSocketUrl', true))
      .build();
  })

  it('should listen browserContext contextCreated event', async () => {
    const caps = await driver.getCapabilities();
    let WebSocketUrl = caps['map_'].get('webSocketUrl')
    const conn = new BiDi(WebSocketUrl.replace('localhost', '127.0.0.1'));

    // Subscribe to events
    const browsingContext = new BrowsingContext(conn);
    await browsingContext.events.contextCreated();

    // create a tab
    await browsingContext.create({type: 'tab'})

    // print the subscription result
    console.log(await browsingContext.events.eventSubscriptionData)
  })

  it('should listen browserContext load event', async () => {
    const caps = await driver.getCapabilities();
    let WebSocketUrl = caps['map_'].get('webSocketUrl')
    const conn = new BiDi(WebSocketUrl.replace('localhost', '127.0.0.1'));

    // Subscribe to events
    const browsingContext = new BrowsingContext(conn);
    await browsingContext.events.load();

    await driver.get('https://www.selenium.dev');
    await driver.sleep(1000);

    // print the subscription result
    console.log(await browsingContext.events.eventSubscriptionData)
  })

  after(async ()=> await driver.quit())
})