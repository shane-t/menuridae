const request = require('request');
const dotenv = require('dotenv');
const fs = require('fs');
const Client = require('../index');

dotenv.config();

async function generateFromText (utterance) {
  const client = new Client();
  await client.login(process.env.EMAIL, process.env.PASSWORD);
  const url = await client.generate({ texts: [utterance] });

  return url;
}

generateFromText('Hello world')
  .then(url => request(url).pipe(fs.createWriteStream('./output.mp3')));
