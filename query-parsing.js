//query-parsing.js
//mbankole 2017

var fs = require('fs')
var csvdata = require('csvdata')
var csv = require('csv-parser')
var ExcelCSV = require('excelcsv')

//parses the forms into the internal query object format
exports.parse_form = function (form_data) {
  var parsed = {}
  parsed['type'] = form_data['qtype']
  delete form_data['qtype']
  delete form_data['action']
  parsed['data'] = new Array()
  var num = -1
  for (field in form_data) {
    if (field.charAt(field.length - 1) != num.toString()) {
      num = num + 1
      parsed['data'].push({})
    }
    var nfield = field.slice(0, -1)
    parsed['data'][parsed['data'].length - 1][nfield] = form_data[field]
  }
  return(parsed)
}

//parses a digikey csv into the internal query object format, deletes the original
exports.parse_digikey_csv = function (csv_path) {
  var parsed = {}
  parsed['type'] = 'N/A'
  parsed['data'] = new Array()
  parsed2 = csvdata.load(csv_path).then(function (data) {
    //console.log(data)
    for (var item = 0; item < data.length; item++) {
      //console.log(data[item])
      parsed['data'].push({})
      parsed['data'][parsed['data'].length - 1]['supplier'] = 'digikey'
      parsed['data'][parsed['data'].length - 1]['quantity'] = data[item]['Quantity']
      parsed['data'][parsed['data'].length - 1]['name'] = data[item]['Description']
      parsed['data'][parsed['data'].length - 1]['supplier_prt'] = data[item]['Part Number']
    }
    //console.log(parsed)
    return parsed
  })
  fs.unlink(csv_path, function(err) {
   if (err) {
      return console.error(err);
   }
  });
  return parsed2
}

//parses a digikey csv into the internal query object format, deletes the original
exports.parse_digikey_csv2 = function (csv_path) {
  var parsed = {}
  parsed['type'] = 'N/A'
  parsed['data'] = new Array()
  fs.createReadStream(csv_path)
  .pipe(csv())
  .on('data', function (data) {
    parsed['data'].push({})
    console.log(data)
    //console.log(data[Index])
    //console.log(data[Quantity])
    parsed['data'].push({})
    parsed['data'][parsed['data'].length - 1]['supplier'] = 'digikey'
    parsed['data'][parsed['data'].length - 1]['quantity'] = data['Quantity']
    parsed['data'][parsed['data'].length - 1]['name'] = data['Description']
    parsed['data'][parsed['data'].length - 1]['supplier_prt'] = data['Part Number']
    console.log(parsed);
    //console.log('Name: %s Age: %s', data.NAME, data.AGE)
  })
  return parsed
}

exports.parse_altium_bom = function (bom_path) {
  var header = ['Comment', 'Supplier 1', 'Supplier Part Number 1', 'Manufacturer 1', 'Quantity', 'LogicalDesignator', 'In CMR Stock?']
  var parser = new ExcelCSV(bom_path, 'uploads/edit_uploads/intermediate.csv')
  var csv = parser.header(header).row(function (worksheet, row) {
    if (worksheet[0] != '') {
      //console.log(worksheet)
      for (var i = 0; i < worksheet.length; i++) {
        worksheet[i] = html_escape(worksheet[i])
      }
      return worksheet
    }
  }).init()
  fs.unlink(bom_path, function(err) {
   if (err) {
      return console.error(err);
   }
  });
  var parsed = {}
  parsed['type'] = 'N/A'
  parsed['data'] = new Array()
  parsed2 = csvdata.load('uploads/edit_uploads/intermediate.csv').then(function (data) {
    //console.log(data)
    for (var item = 2; item < data.length; item++) {
      //console.log(data[item])
      parsed['data'].push({})
      parsed['data'][parsed['data'].length - 1]['name'] = data[item]['Comment']
      parsed['data'][parsed['data'].length - 1]['supplier'] = data[item]['Supplier 1']
      parsed['data'][parsed['data'].length - 1]['supplier_prt'] = data[item]['Supplier Part Number 1']
      parsed['data'][parsed['data'].length - 1]['mfg'] = data[item]['Manufacturer 1']
      parsed['data'][parsed['data'].length - 1]['quantity'] = data[item]['Quantity']
    }
    //console.log(parsed)
    return parsed
  })
  fs.unlink('uploads/edit_uploads/intermediate.csv', function(err) {
   if (err) {
      return console.error(err);
   }
  });
  return parsed2
}

function html_escape(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
