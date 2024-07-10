require('chromedriver');
const {Builder} = require('selenium-webdriver');
const Chrome= require('selenium-webdriver/chrome');
const opts = new Chrome.Options();
const { BiDi, Session} = require('wd-bidi');

describe('Session: Log entry added', ()=> {
  let driver;

  before(async ()=> {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(opts.set('webSocketUrl', true))
      .build();
  })

  it('should listen to log events', async () => {
    const caps = await driver.getCapabilities();
    let WebSocketUrl = caps['map_'].get('webSocketUrl')
    const conn = new BiDi(WebSocketUrl.replace('localhost', '127.0.0.1'));

    // Subscribe to log events
    let subEvent= { events: ['log.entryAdded'] }
    const session = new Session(conn);
    await session.subscribe(subEvent)

    // trigger an event
    await driver.executeScript('console.log("Hello Bidi")', [])

    // listen to logEvent message and print
    conn.getConnection.on('message', (data) => {
      console.log(JSON.parse(Buffer.from(data.toString())))
    })
  })

  after(async ()=> await driver.quit())

})

