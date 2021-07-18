const GM = require('gm');
const gm = GM.subClass({ imageMagick: true });
const FileType = require('file-type');
// const AWS = require('aws-sdk');
// const s3 = new AWS.S3();
const axios = require('axios');

exports.downloadImage = async (url) => {
  const res = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(res.data);
}

exports.resize = async (buf, width, height) => {
  return new Promise((resolve, reject) => {
    gm(buf).resize(width, height).noProfile().toBuffer('PNG', (err, buffer) => err ? reject(err) : resolve(buffer));
  });
};

const getBufferSize = (buf) => {
  return new Promise((resolve, reject) => {
    gm(buf)
      .size((error, size) => {
        const lgtmPngWidth = Math.floor(size.width * 0.56);
        const centerWidth = Math.floor(size.width / 2);
        const centerHeight = Math.floor(size.height / 2);
        return error ? reject(error) : resolve({
          lgtmPngWidth,
          centerWidth,
          centerHeight
        })
      })
  })
}

const resizeLgtm = (lgtmPngWidth) => {
  const lgtmPngPath = './lgtm.png';
  return new Promise((resolve, reject) => {
    gm(lgtmPngPath)
      .resize(lgtmPngWidth)
      .write('./tmp/resized.png', (err) => {
        return resolve()
        // return err ? reject(err) : resolve(resizedLgtmBuffer)
      });
  })
}

const getGeometry = (centerWidth, centerHeight) => {
  return new Promise((resolve, reject) => {
    gm('./tmp/resized.png').size((error, size) => {
      const left = Math.floor(centerWidth - (size.width / 2));
      const top = Math.floor(centerHeight - (size.height / 2));
      const geometry = '+' + left + '+' + top;
      return error ? reject(error) : resolve(geometry)
    });
  });
}

const getCompositedBuffer = (buf, geometry) => {
  console.log(gm(buf));

  return new Promise((resolve, reject) => {
    return gm(buf)
      .composite('./tmp/resized.png')
      .geometry(geometry)
      .quality(100)
      .noProfile()
      .toBuffer((err, buffer) => {
        return err ? reject(err) : resolve(buffer)
      });
  })
}

exports.composite = async (buf) => {
  try {
    const { lgtmPngWidth, centerWidth, centerHeight } = await getBufferSize(buf) 
    // const resizedLgtmBuffer = await resizeLgtm(lgtmPngWidth)
    await resizeLgtm(lgtmPngWidth)
    const geometry = await getGeometry(centerWidth, centerHeight);
    return await getCompositedBuffer(buf, geometry);
  } catch(e) {
    console.log(e);
  }
}

exports.saveToS3 = async (bucket, name, buf) => {
  const contentType = await FileType.fromBuffer(buf);
  const key = `${name}.${contentType.ext}`;
  await s3.putObject({
    Bucket: bucket,
    Key: key,
    Body: buf,
    ContentEncoding: 'base64',
    ContentType: contentType.mime,
  }).promise();
  return key;
};