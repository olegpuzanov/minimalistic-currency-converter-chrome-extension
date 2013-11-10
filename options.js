function check_options() {
  if ( this.id == 's_thousands' ) {
    var select_decimal = document.getElementById("s_decimal");
    if ( this.value == '.' ) {
      select_decimal.selectedIndex = 1;
    } else if ( this.value == ',' ) {
      select_decimal.selectedIndex = 0;
    }
  } else if ( this.id == 's_decimal' ) {
    var select_thousands = document.getElementById("s_thousands");
    if ( this.value == '.' ) {
      select_thousands.selectedIndex = 0;
    } else if ( this.value == ',' ) {
      select_thousands.selectedIndex = 1;
    }
  }
}

function save_options() {
  var select_thousands = document.getElementById("s_thousands");
  var select_decimal = document.getElementById("s_decimal");
  localStorage["s_thousands"] = select_thousands.children[select_thousands.selectedIndex].value;
  localStorage["s_decimal"] = select_decimal.children[select_decimal.selectedIndex].value;

  var status = document.getElementById("status");
  status.style.visibility = 'visible';
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
    status.style.visibility = 'visible';
  }, 1000);
}

function restore_options() {
  var s_thousands = localStorage["s_thousands"];
  var s_decimal = localStorage["s_decimal"];

  if ( s_thousands ) {
    var select_thousands = document.getElementById("s_thousands");
    for (var i = 0; i < select_thousands.children.length; i++) {
      var child = select_thousands.children[i];
      if (child.value == s_thousands) {
        child.selected = "true";
        break;
      }
    }
  }

  if ( s_decimal ) {
    var select_decimal = document.getElementById("s_decimal");
    for (var i = 0; i < select_decimal.children.length; i++) {
      var child = select_decimal.children[i];
      if (child.value == s_decimal) {
        child.selected = "true";
        break;
      }
    }
  } 
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#s_thousands').addEventListener('change', check_options);
document.querySelector('#s_decimal').addEventListener('change', check_options);
document.querySelector('#save').addEventListener('click', save_options);