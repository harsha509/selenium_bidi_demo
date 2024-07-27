require('chromedriver');
const {Builder, By} = require('selenium-webdriver');
const Chrome= require('selenium-webdriver/chrome');
const opts = new Chrome.Options();
const { BiDi, Network } = require('wd-bidi');

describe('Bidi: Input tests', ()=> {
    let driver;

    before(async ()=> {
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(opts.set('webSocketUrl', true))
            .build();
    })

    it('should pause input', async () => {
        const caps = await driver.getCapabilities();
        let WebSocketUrl = caps['map_'].get('webSocketUrl')
        const conn = new BiDi(WebSocketUrl.replace('localhost', '127.0.0.1'));
        const network = new Network(conn);
        const params= {
            phases: ['beforeRequestSent'],
        }
        await network.addIntercept(params);
        await driver.get('https://www.selenium.dev/selenium/web/bidi/logEntryAdded.html');

    })

    after(async ()=> await driver.quit())
})