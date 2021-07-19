const { downloadImage, composite, resize, remove } = require('./utils');

exports.handler = async (event) => {
  try {
    const buf = await downloadImage(event.url);
    const composited = await composite(buf);
    const resized = await resize(composited, 300);

    const response = {
      statusCode: 200,
      headers: {
          'Content-Type': 'image/png',
          'Access-Control-Allow-Origin': '*' 
      },
      body: resized,
    };
    return response;
  } catch(e) {
    console.error(e)
  }
}