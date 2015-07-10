var db = null;

var showConfig = function(config) {
  if(config) {
    $('#configalert').hide();
    $('#title').val(config.title);
    $('#subtitle').val(config.subtitle);
    $('#fields').val(config.fields.join(","));
    $('#url').val(config.url);
  } else {
    $('#configalert').show();
  }

  $('#config').show();
};

var removeByValue = function(arr,value) {
 var index = arr.indexOf(value);
 arr.splice(index, 1);
 return arr;
}

var showSubmissions = function(submissions) {
  $('#submissions').show();
  var html = "";
  if(submissions.length>0) {
    html = '<table class="table table-striped">\n';
    html += '<tr>\n';
    var keys =  Object.keys(submissions[0].doc);
    keys = removeByValue(keys,"_id");
    keys = removeByValue(keys,"_rev");
    keys = removeByValue(keys,"type");
    for(var i in keys) {
      html += '<th>' + keys[i] + '</th>\n';
    }
    html += '</tr>';
    for(var i in submissions) {
      html += '<tr>';
      for(var j in keys) {
        html += '<td>' + submissions[i].doc[keys[j]] + '</td>\n';
      }
      html += '</tr>';
    }
    html += '</table>';
  } else {
    html = '<div class="alert alert-danger">You have no form submissions yet.</div>'
  }
  $('#submissionsbody').html(html);  

}

var loadConfig = function(callback) {
  db.get('config', function(err, doc) {
    callback(null, (err)?null:doc);
  });
};

var loadSubmissions = function(callback) {
  var map = function(doc) {
    emit(doc.type,null);
  };
  
  // load all the submissions
  db.query(map, {key:"submission", include_docs:true}, function(err,data) {
    callback(err,(err)?null:data.rows)  
  });
};

var loadSettingsAndConfig = function(callback) {
  var obj = {config: null, submissions: null};
  loadSubmissions(function(err,data) {
    obj.submissions = data;
    loadConfig(function(err,data) {
      obj.config = data;
      callback(null, obj);
    })
  })
};

var submitConfig = function() {
  var config = { };
  config._id = "config";
  config.title = $('#title').val();
  config.subtitle = $('#subtitle').val();
  config.fields = $('#fields').val().split(",");
  config.url = $('#url').val();
  loadConfig(function(err, data) {
    if(!err && data != null) {
      config._rev = data._rev;
    }
    db.put(config, function(err, data) {
      $('#config').hide();
      $('#submissions').hide();
      showForm(config);
    });
  });
  return false;
};

var settingsClicked = function() {
  $('#submissionform').hide(); 
  loadSettingsAndConfig(function(err,obj) {
    showConfig(obj.config);
    showSubmissions(obj.submissions);
  });
};


var renderControl = function(name,type,placeholder) {
  var id=name.toLowerCase().replace(/ /g,"_");
  var html = "";
  html += '<div class="form-group">\n';
  html += '<label for="'+id+'">'+name+'</label>\n';
  html += '<input type="'+type+'" class="form-control" id="'+id+'" name="'+id+'" placeholder="">\n';
  html += '</div>\n';
  return html;
}



var showForm = function(config) {
  var html = '<h1>' + config.title + '</h1>\n';
  html += '<h2>' + config.subtitle + '</h2>\n';
  html += '<form id="thesubmissionform" onsubmit="return submitForm();">\n';
  for(var i in config.fields) {
    html += renderControl(config.fields[i],'text','');
  }
  html += '<button type="submit" class="btn btn-default">Submit</button>\n';
  html += '</form>';
  $('#submissionform').html(html);
  $('#submissionform').show(); 
  $('#submissions').hide();
  $('#config').hide();
  
  
};

var submitForm = function() {
  var data = {};
  $("#thesubmissionform").serializeArray().map(function(x){data[x.name] = x.value;});
  data.type="submission";
  db.post(data, function(err, data) {
    $("#thesubmissionform")[0].reset();
    alert("Thank you!");
  })  
  return false;
}


var home = function() {
  loadSettingsAndConfig(function(err,obj) {
    if (obj.config) {
      showForm(obj.config); 
    } else {
      showConfig(obj.config);
      showSubmissions(obj.submissions);
    }
  });
};

var deleteEverything = function() {
  var r = confirm("Press ok to delete all your data!");
  if (r == true) {
    db.destroy(function(err, data) {
       db = new PouchDB('proforma');
       $("#thesubmissionform")[0].reset();
       $("#theconfigform")[0].reset();
       home();
    });
  }
};

var upload = function() {
  var url = $('#url').val();
  if(url.length>0) {
    db.replicate.to(url).then(function (result) {
      alert("Uploaded to Cloudant URL " + url);
    }).catch(function (err) {
      alert("Upload failed: " + err)
    });;
  } else {
    alert("You must supply a url");
  }
}

$( document ).ready(function() {

  db = new PouchDB('proforma');
  
  home();

  setTimeout(function() {
    $('#jumbo').hide();
    
  }, 3000);    
});