// Copyright (c) Oleg Puzanov (http://olegpuzanov.com/)

var CurrencyConvertor = {
  /**
   * @type {string}
   * @private
   */
  url: 'http://www.google.com/ig/calculator?hl=en&q=%amount%%from%=?%to%',

  /**
   * @public
   */
  getRate: function() {
    var amount = document.getElementById('amount').value;
    var from = document.getElementById('from').value;
    var to = document.getElementById('to').value;

    // clear results container by setting blank space to avoid content jumping
    document.getElementById('result').innerHTML = '&nbsp;';

    // save amount, from and to values to local stogare
    chrome.storage.local.set({'amount': amount});
    chrome.storage.local.set({'from': from});
    chrome.storage.local.set({'to': to});

    // set parameters for api url
    var url = this.url.replace('%amount%', amount)
                      .replace('%from%', from)
                      .replace('%to%', to);
    
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.onload = this.showResult.bind(this);
    req.send(null);
  },

  /**
   * @param {ProgressEvent} e The XHR ProgressEvent.
   * @private
   */
  showResult: function (e) {
    // if response is not empty - process it, otherwise show error message
    if ( e.target.responseText != '' ) {
      // add double quotes to keys to get valid json and then parse JSON
      var response = JSON.parse(e.target.responseText.replace('lhs', '"lhs"')
                                                     .replace('rhs', '"rhs"')
                                                     .replace('error', '"error"')
                                                     .replace('icc', '"icc"'));
      // round to the second decimal place
      response.rhs = response.rhs.replace(/((?:[1-9]\d*|0)?(?:\.\d+)?)/, CurrencyConvertor.roundValue);;

      document.getElementById('result').innerHTML = response.rhs;     
    } else {
      document.getElementById('result').innerHTML = 'oops something went wrong';
    }
  },

  /**
   * Validate amount input
   * @public
   */
   validate: function(e) {
    var evnt = e || window.event;
    var key = evnt.keyCode || evnt.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\./;
    if( !regex.test(key) ) {
      evnt.returnValue = false;
      if(evnt.preventDefault) evnt.preventDefault();
    }
   },

   roundValue: function(v) {
    return Math.round(parseFloat(v) * 100) / 100;
   }
};

// attach validation to amount field
document.getElementById('amount').addEventListener('keypress', function () {
  CurrencyConvertor.validate(event);
});

// load saved "amount", "from" and "to" values (if any) from local storage 
document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.local.get('amount', function (result) {
    if ( undefined != result.amount ) {
      document.getElementById('amount').value = result.amount;
    }
  });

  chrome.storage.local.get('from', function (result) {
    if ( undefined != result.from ) {
      var from = document.getElementById("from");
      for(var i, j = 0; i = from.options[j]; j++) {
          if(i.value == result.from) {
              from.selectedIndex = j;
              break;
          }
      }     
    }
  });

  chrome.storage.local.get('to', function (result) {
    if ( undefined != result.to ) {
      var to = document.getElementById("to");
      for(var i, j = 0; i = to.options[j]; j++) {
          if(i.value == result.to) {
              to.selectedIndex = j;
              break;
          }
      }     
    }
  }); 
});

// attach events to button "Convert" click and "Amount" submit event
document.getElementById('convertBtn').addEventListener('click', function () {
  CurrencyConvertor.getRate();
});

document.getElementById('amount').addEventListener('keypress', function (event) {
  if ( event.keyCode == 13 ) {
    CurrencyConvertor.getRate();
  }
});