require('chromedriver');
const {Builder, By} = require('selenium-webdriver');
const Chrome= require('selenium-webdriver/chrome');
const opts = new Chrome.Options();
const { Input, BiDi, BrowsingContext } = require('wd-bidi');

describe('Bidi: Input tests', ()=> {
  let driver;

  before(async ()=> {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(opts.set('webSocketUrl', true))
      .build();
  })

  it('should perform wheel input action', async () => {
    const caps = await driver.getCapabilities();
    let WebSocketUrl = caps['map_'].get('webSocketUrl')
    const conn = new BiDi(WebSocketUrl.replace('localhost', '127.0.0.1'));
    const input = new Input(conn);
    const browsingContext = new BrowsingContext(conn);

    await driver.get('https://www.selenium.dev/selenium/web/scroll3.html');

    let res = await browsingContext.getTree({});
    console.log(res.result.contexts[0].context)
    // none input
    const params = {
      "context": res.result.contexts[0].context,
      "actions": [
        {
          "type": "wheel",
          "id": "2",
          "actions": [
            {
              "type": "pause",
              "duration": 50
            },
            {
              "type": "scroll",
              "x": 0,
              "y": 0,
              "deltaX": 0,
              "deltaY": 1500,
              "duration": 10,
              "origin": "viewport"
            }
          ]
        }
      ]
    }
    await input.performActions(params);
  })

  after(async ()=> await driver.quit())
})