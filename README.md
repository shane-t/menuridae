# Menuridae
## Unofficial lyrebird.ai API

This is not affiliated with [lyrebird.ai](lyrebird.ai), may break without warning, and may violate their terms of service to use. 

The `generate()` method allows you to send a text string and returns a promise that resolves to the URL (on S3) of the generated TTS audio (in MP3 format).

To start, you must sign up with [lyrebird.ai](lyrebird.ai) and train your voice model there.

Install this package with `npm install menuridae`

## Example

Assuming you have a .env file in the format:
  

    EMAIL=blah@blah.com
    PASSWORD=blah

You can run it this like:
  

    const request = require('request');
    const dotenv = require('dotenv');
    const fs = require('fs');
    const Client = require('../index');

    dotenv.config();

    async function generateFromText(utterance) {
      const client = new Client;
      await client.login(process.env.EMAIL, process.env.PASSWORD);
      const url = await client.generate({ texts : [ utterance ] });

      return url;
    }

    generateFromText('Hello world')
    .then(url => request(url).pipe(fs.createWriteStream('./output.mp3')));

(try running `node examples/generateAndDownload`)
