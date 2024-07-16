require('chromedriver');
const {Builder, By} = require('selenium-webdriver');
const Chrome= require('selenium-webdriver/chrome');
const opts = new Chrome.Options();
const { BiDi, Storage } = require('wd-bidi');

describe('Bidi: Storage', ()=> {
  let driver;

  before(async ()=> {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(opts.set('webSocketUrl', true))
      .build();
  })

  it('Should perform getCookies', async () => {
    const caps = await driver.getCapabilities();
    let WebSocketUrl = caps['map_'].get('webSocketUrl')
    const conn = new BiDi(WebSocketUrl.replace('localhost', '127.0.0.1'));
    const storage = new Storage(conn);

    await driver.get('https://www.selenium.dev');

    await driver.manage().addCookie({
      name: 'raw_IP_and_port',
      value: '172.16.12.225:62210'
    });

    let cookieResult = await storage.getCookies({});
    console.log(cookieResult)
  })
  after(async ()=> await driver.quit())
})