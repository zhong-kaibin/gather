var url = {
  httpSrc: "https://devapi.bjpio.com",
  // httpSrc: "https://api.bjpio.com",
  params:"?platform=applet&v=1.0.2"
}

function getUrl(url) {
  return 'https://devapi.bjpio.com' + url + "?platform=applet&v=1.0.2"
  // return 'https://api.bjpio.com' + url + "?platform=applet&v=1.0.2"
}

module.exports = {
  url: url,
  getUrl: getUrl
}