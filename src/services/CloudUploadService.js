require('dotenv').config()
const cloudinary = require('cloudinary').v2
const { promisify } = require('util')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

const uploadCloud = promisify(cloudinary.uploader.upload)

class CloudUploadService {
  async saveSeriesLogo(pathFile, id) {
    const { public_id: idCloudLogo, secure_url: urlLogo } = await uploadCloud(
      pathFile,
      {
        public_id: id?.replace('cardsJpg/', ''),
        folder: 'seriesLogo',
      },
    )
    return { idCloudLogo, urlLogo }
  }

  async saveImg(pathFile, id) {
    const { public_id: idCloudJpg, secure_url: imgUrl } = await uploadCloud(
      pathFile,
      {
        public_id: id?.replace('cardsJpg/', ''),
        folder: 'cardsJpg',
      },
    )
    return { idCloudJpg, imgUrl }
  }

  async deleteOldAvatar(id) {
    await cloudinary.uploader.destroy(id, (err, result) => {
      console.log(result, err)
    })
  }

  async saveWebm(pathFile, id) {
    const { public_id: idCloudWebm, secure_url: webmUrl } = await uploadCloud(
      pathFile,
      {
        resource_type: 'video',
        public_id: id?.replace('cardsWebm/', ''),
        folder: 'cardsWebm',
      },
    )
    return { idCloudWebm, webmUrl }
  }
}

module.exports = CloudUploadService
