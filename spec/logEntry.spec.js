require('chromedriver');
const {Builder, By} = require('selenium-webdriver');
const Chrome= require('selenium-webdriver/chrome');
const opts = new Chrome.Options();
const { Session, BiDi, Log} = require('wd-bidi');

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
    const conn = new BiDi(WebSocketUrl.replace('localhost', '127.0.0.1'));
    const log = new Log(conn);

    // Subscribe to log events
    await log.events.entryAdded();

    await driver.get('https://www.selenium.dev/selenium/web/bidi/logEntryAdded.html');

    //generic log
    await driver.findElement(By.id('consoleLog')).click();
    await driver.sleep(1000);
    console.log(log.events.eventSubscriptionData)

    // console error
    await driver.findElement(By.id('consoleError')).click();
    await driver.sleep(1000);
    console.log(log.events.eventSubscriptionData)

    //js exception
    await driver.findElement(By.id('jsException')).click();
    await driver.sleep(1000);
    console.log(log.events.eventSubscriptionData)

    // log with stacktrace
    await driver.findElement(By.id('logWithStacktrace')).click();
    await driver.sleep(1000);
    console.log(log.events.eventSubscriptionData);
  })

  after(async ()=> await driver.quit())
})