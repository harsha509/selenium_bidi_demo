require('chromedriver');
const {Builder} = require('selenium-webdriver');
const Chrome= require('selenium-webdriver/chrome');
const opts = new Chrome.Options();
const {BiDi, Browser, Script, BrowsingContext} = require('wd-bidi');
const assert = require("node:assert");

describe('Script: Sample Bidi tests', ()=> {
  let driver;
  let browser;
  let script;
  let browsingContext;

  before(async ()=> {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(opts.set('webSocketUrl', true))
      .build();

    const caps = await driver.getCapabilities();
    let WebSocketUrl = caps['map_'].get('webSocketUrl')
    const conn = new BiDi(WebSocketUrl.replace('localhost', '127.0.0.1'));

     browser = new Browser(conn);
     script = new Script(conn);
     browsingContext = new BrowsingContext(conn);
  })

  it('can call function with declaration', async () => {
    const { result: { realms } } = await script.getRealms({});

    const params = {
      functionDeclaration: '()=>1+2',
      awaitPromise: false,
      target: { realm: realms[0].realm }
    };

    const { result } = await script.callFunction(params);
    assert.equal(result.type, 'success');
    assert.equal(result.result.type, 'number');
    assert.equal(result.result.value, 3);
  })

  it('can call function to get iframe browsing context', async () => {

    await driver.get('https://www.selenium.dev/selenium/web/iframes.html');
    let res = await browsingContext.getTree({});

    const params = {
      functionDeclaration: '() => document.querySelector(\'iframe[id="iframe1"]\').contentWindow',
      awaitPromise: false,
      target: {
        context: res.result.contexts[0].context
      }
    };

    const {result} = await script.callFunction(params);
    assert.equal(result.type, 'success');
    assert.equal(result.result.type, 'window');
  })

  it('can call function to get element', async () => {

    await driver.get('https://www.selenium.dev/selenium/web/bidi/logEntryAdded.html');
    let res = await browsingContext.getTree({});

    const params = {
      functionDeclaration: '() => document.getElementById("consoleLog")',
      awaitPromise: false,
      target: {
        context: res.result.contexts[0].context
      }
    };

    const {result} = await script.callFunction(params);
    assert.equal(result.type, 'success');
    assert.equal(result.result.type, 'node');
    assert.equal(result.result.value.localName, 'button');
  })

  it('can listen to realm created message', async () => {

    let res = await browsingContext.getTree({});
    await script.events.realmCreated();

    let params = {
      context: res.result.contexts[0].context,
      url:'https://www.selenium.dev/selenium/web/blank.html',
      wait: 'complete'
    }

    await browsingContext.navigate(params);
    await driver.sleep(500)

    let response = await script.events.eventSubscriptionData;
    const obj = Object.fromEntries(response);

    assert.equal(obj.realmCreated.type, 'event');
    assert.equal(obj.realmCreated.params.type, 'window');
  })

  after(async ()=> await driver.quit())
})