const express = require('express');
const router = express.Router()
const config = require('config');
const shortid = require('shortid');


const Url = require('../models/Url')

router.post('/shorten', async (req, res) => {

  let { longUrl, customCode } = req.body;
  const baseUrl = config.get("baseUrl")
  


  try {
    if (customCode) {
      let customCheck = await Url.findOne({ urlCode: customCode });
      if (customCheck) {
        return res.status(400).json('custom code in use')
      } else {
        var urlCode = customCode
        var shortUrl = `${baseUrl}/${customCode}`
        var isCustom = true
      }
    }
    else {
      var url = await Url.find({ longUrl })
      if (url) {
        for (urls of url) {
          if (!urls.isCustom) {
            return res.status(203).json(urls);
          }
        }
      }
      var urlCode = shortid.generate();
      var shortUrl = `${baseUrl}/${urlCode}`
    }
    var longUrlSize = longUrl.length;
    var shortUrlSize = shortUrl.length;
    if(longUrl.slice(0,7) != 'http://' && longUrl.slice(0,8) != 'https://'){
      longUrl = 'http://' + longUrl;
    }
    url = new Url({
      longUrl,
      shortUrl,
      urlCode,
      date: new Date(),
      longUrlSize,
      shortUrlSize,
      isCustom
    });
    await url.save();
    res.json(url)
  } catch (error) {
    console.error(error);
    res.status(500).json('server error')
  }
})

module.exports = router;
