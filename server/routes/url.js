const express = require('express');
const router = express.Router()
const validUrl = require('valid-url');
const config = require('config');
const shortid = require('shortid');


const Url = require('../models/Url')

router.post('/shorten', async (req, res) => {

  const { longUrl, customCode } = req.body;
  const baseUrl = config.get("baseUrl")
  let urlCode, shortUrl

  if (validUrl.isUri(longUrl)) {

    try {
      if (customCode) {
        let customCheck = await Url.findOne({ urlCode: customCode });
        if (customCheck) {
          return res.status(400).json('code in use')
        } else {
          urlCode = customCode
          shortUrl = `${baseUrl}/${customCode}` 
        }
      } else {
        let url = await Url.findOne({ longUrl })
        if (url) {
          //url already shortened.
          return res.status(203).json(url);
        }
        urlCode = shortid.generate();
        shortUrl = `${baseUrl}/${urlCode}`
      }
      var longUrlSize = longUrl.length;
      var shortUrlSize = shortUrl.length;
      url = new Url({
        longUrl,
        shortUrl,
        urlCode,
        date: new Date(),
        longUrlSize,
        shortUrlSize
      });
      await url.save();
      res.json(url)
    } catch (error) {
      console.error(error);
      res.status(500).json('server error')
    }

  } else {
    return res.status(401).json(`Invalid long url : ${longUrl}`);
  }

})

module.exports = router;
