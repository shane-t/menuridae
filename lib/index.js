const request = require('request-promise');
const cheerio = require('cheerio');

class APIWrapper {
  constructor () {
    this.loginUrl = 'https://lyrebird.ai/account/login';
    this.generateUrl = 'https://lyrebird.ai/api/generate/';
    this.myVoiceUrl = 'https://lyrebird.ai/my/voice/';
    this.jar = request.jar();
  }

  async logout () {
    this.jar = request.jar();
  }

  async login (email = null, password = null) {
    if (email === null || password === null) {
      throw new Error('Supply username and password');
    }

    const csrfmiddlewaretoken = await this.getCSRFToken();

    const formData = {
      username: email,
      password,
      csrfmiddlewaretoken
    };

    await request({
      uri: this.loginUrl,
      method: 'POST',
      resolveWithFullResponse: true,
      headers: { referer: this.loginUrl },
      jar: this.jar,
      formData,
      simple: false
    });

    if (this.loggedIn) {
      return true;
    }
    return false;
  }

  async generate (input) {
    if (!input || !input.texts || input.texts.length !== 1) {
      throw new Error('Supply input');
    }

    if (!this.loggedIn) {
      throw new Error('Not logged in');
    }

    const csrfToken = await this.getCSRFToken();

    const r = {
      uri: this.generateUrl,
      method: 'POST',
      jar: this.jar,
      json: true,
      body: {
        texts: input.texts
      },
      headers: {
        referer: this.loginUrl,
        'X-CSRFToken': csrfToken
      },
      resolveWithFullResponse: true,
      simple: false
    };

    const result = await (request(r));

    return result.body[0].utterance.audio_file;
  }

  async getCSRFToken () {
    const formPage = await request({ uri: this.loginUrl, jar: this.jar });
    const $ = cheerio.load(formPage);

    const form = $('form[method=POST]');
    const inputs = form.find('input');
    const formData = {};
    inputs.each((i, input) => {
      if (input.attribs.name) {
        formData[input.attribs.name] = input.attribs.value;
      }
    });

    return formData.csrfmiddlewaretoken;
  }

  get loggedIn () {
    // check for cookie
    const { idx } = this.jar._jar.store;
    return !!(idx['lyrebird.ai'] && idx['lyrebird.ai']['/'] && idx['lyrebird.ai']['/'].sessionid);
  }
}

module.exports = APIWrapper;
