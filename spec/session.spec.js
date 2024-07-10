require('chromedriver');
const {Builder} = require('selenium-webdriver');
const Chrome= require('selenium-webdriver/chrome');
const opts = new Chrome.Options();
const { BiDi, Session } = require('wd-bidi');

describe('Sample Bidi tests', ()=> {
  let driver;

  before(async ()=> {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(opts.set('webSocketUrl', true))
      .build();
  })

  it('should listen session', async () => {
    const caps = await driver.getCapabilities();
    let WebSocketUrl = caps['map_'].get('webSocketUrl')
    const conn = new BiDi(WebSocketUrl.replace('localhost', '127.0.0.1'));
    const session = new Session(conn);
    console.log(await session.status)
    await session.endSession();
  })

  after(async ()=> await driver.quit())
})

