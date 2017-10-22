//mbankole 2017

var lines = 0;
$(document).ready(function(){
  var socket = io()

  // Emit ready event.
  socket.emit('edit_connect', {msg: 'wtf'})

  // Listeners
  socket.on('uploaded_query_data', function(data) {
    console.log('recieved uploaded_query_data event')
    console.log(data.data)
  })

  socket.on('sessiondata', function(data) {
    console.log('recieved sessiondata event')
    console.log(data)
  })
  add_line();
});

String.prototype.format = function (arguments) {
    var this_string = '';
    for (var char_pos = 0; char_pos < this.length; char_pos++) {
        this_string = this_string + this[char_pos];
    }

    for (var key in arguments) {
        var string_key = '{' + key + '}'
        this_string = this_string.replace(new RegExp(string_key, 'g'), arguments[key]);
    }
    return this_string;
};

function add_line() {
  var newLine = `
  <div id="line{number}" class='card-action'>
    <div class='row'>
      <div class="input-field col s12 l4">
        <input required='true' id="name{number}" name="name{number}" type="text" data-length="256">
        <label for="name{number}">Name/Comment</label>
      </div>
      <div class="input-field col s12 l4">
        <input id="mfg{number}" name="mfg{number}" type="text" data-length="256">
        <label for="mfg{number}">Manufacturer</label>
      </div>
      <div class="input-field col s12 l4">
        <input id="mfg_prt{number}" name="mfg_prt{number}" type="text" data-length="256">
        <label for="mfg_prt{number}">Manufacturer Part #</label>
      </div>
    </div>
    <div class='row'>
      <div class="input-field col s12 l4">
        <input id="supplier{number}" name="supplier{number}" type="text" data-length="256">
        <label for="supplier{number}">Supplier</label>
      </div>
      <div class="input-field col s12 l4">
        <input id="supplier_prt{number}" name="supplier_prt{number}" type="text" data-length="256">
        <label for="supplier_prt{number}">Supplier Part #</label>
      </div>
      <div class="file-field input-field col s12 l4">
        <div class="btn">
          <span>Image</span>
          <input type="file" name='image'>
        </div>
        <div class="file-path-wrapper">
          <input class="file-path validate" type="text" placeholder='image (currently nonfunctional)'>
        </div>
      </div>
    </div>
    <div class='row'>
      <div class="input-field col s12 l4">
        <input value='1' id="quantity{number}" name="quantity{number}" type="number">
        <label for="quantity{number}">Quantity</label>
      </div>
      <div class="input-field col s12 l8">
        <input id="desc{number}" name="desc{number}" type="text" data-length="512">
        <label for="desc{number}">Description</label>
      </div>
    </div>
    <a class="btn-floating btn-large waves-effect waves-light red" onclick="del_line({number})">
      <i class="material-icons">clear</i>
    </a>
  </div>
  `.format({number: lines.toString()});

  $('#lines').append (newLine);
  /*
  $('#name' + lines.toString()).characterCounter();
  $('#mfg' + lines.toString()).characterCounter();
  $('#mfg_prt' + lines.toString()).characterCounter();
  $('#supplier' + lines.toString()).characterCounter();
  $('#supplier_prt' + lines.toString()).characterCounter();
  */
  lines = lines + 1;
};

function del_line(line) {
  if (lines > 1) {
    $('#line' + (line).toString()).remove();
    lines = lines - 1;
  };
};
