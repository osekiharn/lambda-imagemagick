const GM = require('gm');
const gm = GM.subClass({ imageMagick: true });
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
      .size((error, { width, height }) => {
        return error ?
          reject(error) : resolve({ width, height })
      })
  })
}

const getSelectLgtm = (width) => {
  if (width >= 1000) {
    return './assets/lgtm700.png'
  } else if (width < 1000 && width >= 800) {
    return './assets/lgtm500.png'
  } else if (width < 800 && width >= 500) {
    return './assets/lgtm300.png'
  } else if (width < 500 && width >= 300) {
    return './assets/lgtm150.png'
  } else if (width < 300) {
    return './assets/lgtm100.png'
  }
}

const getGeometry = (lgtmPath, width, height) => {
  return new Promise((resolve, reject) => {
    gm(lgtmPath).size((error, size) => {
      const centerWidth = width / 2;
      const centerHeight = height / 2;
      const left = Math.floor(centerWidth - (size.width / 2));
      const top = Math.floor(centerHeight - (size.height / 2));
      const geometry = '+' + left + '+' + top;
      return error ? reject(error) : resolve(geometry)
    });
  });
}

const getCompositedBuffer = (buf, lgtmPath, geometry) => {
  return new Promise((resolve, reject) => {
    return gm(buf)
      .composite(lgtmPath)
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
    const { width, height } = await getBufferSize(buf) 
    console.log(width);
    const lgtmPath = getSelectLgtm(width)
    console.log(lgtmPath);
    const geometry = await getGeometry(lgtmPath, width, height);
    return await getCompositedBuffer(buf, lgtmPath, geometry);
  } catch(e) {
    console.log(e);
  }
}

