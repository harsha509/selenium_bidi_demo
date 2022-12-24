require('chromedriver');
const {Builder} = require('selenium-webdriver');
const Chrome= require('selenium-webdriver/chrome');
const opts = new Chrome.Options();
const { BIDI } = require('wd-bidi');

describe('Sample Bidi tests', ()=> {
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
    const bidi = new BIDI(WebSocketUrl.replace('localhost', '127.0.0.1'));

    // Subscribe to log events
    await bidi.send({
      method: 'session.subscribe',
      params: { events: ['log.entryAdded'] }
    })

    // trigger an event
    await driver.executeScript('console.log("Hello Bidi")', [])

    // listen to logEvent message and print
    bidi.socket.on('message', (data) => {
      console.log(JSON.parse(Buffer.from(data.toString())))
    })
  })

  after(async ()=> await driver.quit())

})

