const fs = require('fs');
const { downloadImage, composite, resize, saveToS3 } = require('./utils');

const bucket = 'lambda-images-bucket';

const img = 'https://img.fumumu.net/wp-content/uploads/2020/02/fumumu20200227yoshitakayuriko1-1200x800.jpg'

exports.handler = (async () => {
  try {
    const buf = await downloadImage(img);
    const composited = await composite(buf);
    // console.log(composited);
    const resized = await resize(composited, 200);
    fs.writeFileSync('./secondDemo.png', resized);
    // const key = await saveToS3(bucket, event.name, resized);
    // return { key };

    // const response = {
    //   statusCode: 200,
    //   headers: {
    //       'Content-Type': 'application/json',
    //       'Access-Control-Allow-Origin': '*' 
    //   },
    //   body: resized,
    // };
    // return response;
  } catch(e) {
    console.error(e)
  }
})();