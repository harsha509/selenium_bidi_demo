require('chromedriver');
const {Builder} = require('selenium-webdriver');
const Chrome= require('selenium-webdriver/chrome');
const opts = new Chrome.Options();
const {BiDi, Browser} = require('wd-bidi');

describe('BrowserContext: Sample Bidi tests', ()=> {
  let driver;

  before(async ()=> {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(opts.set('webSocketUrl', true))
      .build();
  })

  it('should perform browser close', async () => {
    const caps = await driver.getCapabilities();
    let WebSocketUrl = caps['map_'].get('webSocketUrl')
    const conn = new BiDi(WebSocketUrl.replace('localhost', '127.0.0.1'));

    // Subscribe to events
    const browser = new Browser(conn);
    console.log(await browser.userContexts)
    await browser.close();
  })

  after(async ()=> await driver.quit())
})