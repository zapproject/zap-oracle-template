'use strict'

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

var data = null;

var xhr = new XMLHttpRequest();

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === this.DONE) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "https://api-pub.bitfinex.com/v2/platform/status");

xhr.send(data);