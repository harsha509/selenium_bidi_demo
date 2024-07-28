require('chromedriver');
const {Builder, By} = require('selenium-webdriver');
const Chrome= require('selenium-webdriver/chrome');
const opts = new Chrome.Options();
const { BiDi, Network } = require('wd-bidi');
const net = require("node:net");

describe('Bidi: Network tests', ()=> {
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

        await network.events.fetchError();
        await driver.get('https://the-internet.herokuapp.com/status_codes/500');
        await driver.sleep(2000);
        // print the subscription result
        let response = await network.events.eventSubscriptionData
        // Convert Map to object
        const obj = Object.fromEntries(response);

        // Convert object to JSON string
        const jsonString = JSON.stringify(obj, null, 2);
        console.log(jsonString);
    })

    after(async ()=> await driver.quit())
})