require('chromedriver');
const {Builder} = require('selenium-webdriver');
const Chrome= require('selenium-webdriver/chrome');
const opts = new Chrome.Options();
const {BiDi, BrowsingContext } = require('wd-bidi');

describe('BrowserContext: Sample Bidi tests', ()=> {
  let driver;

  before(async ()=> {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(opts.set('webSocketUrl', true))
      .build();
  })

  it('should listen browserContext events', async () => {
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

  after(async ()=> await driver.quit())
})