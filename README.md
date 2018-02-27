#Menuridae
##Unofficial lyrebird.ai API

This is not affiliated with lyrebird.ai, may break without warning, and may violate their terms of service to use. 

To start, you must sign up with lyrebird.ai and train your voice model there.

##Example

Assuming you have a .env file in the format:

    EMAIL=blah@blah.com
    PASSWORD=blah

You can run this like:


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
