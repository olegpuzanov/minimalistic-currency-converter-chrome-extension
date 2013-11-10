// Copyright (c) Oleg Puzanov (http://olegpuzanov.com/)

var CurrencyConvertor = {
  /**
   * @type {string}
   * @private
   */
  url: 'http://olegpuzanov.com/tools/rates/index.php?amount=%amount%&from=%from%&to=%to%&s_thousands=%s_thousands%&s_decimal=%s_decimal%',

  /**
   * @public
   */
  getRate: function() {
    var amount = document.getElementById('amount').value;
    var from = document.getElementById('from').value;
    var to = document.getElementById('to').value;

    var s_thousands = localStorage["s_thousands"] || ',';
    var s_decimal = localStorage["s_decimal"] || '.';

    var regex = new RegExp("[^0-9-" + s_decimal + "]", ["g"]);
    amount = parseFloat(("" + amount).replace(/\((.*)\)/, "-$1").replace(regex, '').replace(s_decimal, '.'));

    // clear results container by setting blank space to avoid content jumping
    document.getElementById('result').innerHTML = 'loading ...';

    // save amount, from and to values to local stogare
    chrome.storage.local.set({'amount': amount});
    chrome.storage.local.set({'from': from});
    chrome.storage.local.set({'to': to});

    // set parameters for api url
    var url = this.url.replace('%amount%', amount)
                      .replace('%from%', from)
                      .replace('%to%', to)
                      .replace('%s_thousands%', s_thousands)
                      .replace('%s_decimal%', s_decimal);

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
      document.getElementById('result').innerHTML = JSON.parse(e.target.responseText);
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

    var format = localStorage["format"];
    var regex = /[0-9]|\.|\,|\s/;

    if( !regex.test(key) ) {
      evnt.returnValue = false;
      if(evnt.preventDefault) evnt.preventDefault();
    }
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