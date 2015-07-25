var db = null;

var showConfig = function(config) {
  $('#config').show();
};

var removeByValue = function(arr,value) {
 var index = arr.indexOf(value);
 arr.splice(index, 1);
 return arr;
}

var showSubmissions = function(submissions) {
  $('#submissions').show();
  $('#deletions').show();
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
      $('#deletions').hide();
      showForm(config);
    });
  });
  return false;
};

var settingsClicked = function() {
  console.log("settings clicked");
  $('#theform').hide(); 
  loadSettingsAndConfig(function(err,obj) {
    if(!obj.config) {
      showConfig(obj.config);
    };
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
/*  var html = '<h1>' + config.title + '</h1>\n';
  html += '<h2>' + config.subtitle + '</h2>\n';
  html += '<form id="thesubmissionform" onsubmit="return submitForm();">\n';
  for(var i in config.fields) {
    html += renderControl(config.fields[i],'text','');
  }
  html += '<button type="submit" class="btn btn-default">Submit</button>\n';
  html += '</form>';*/
  var html = config.theform;
  html = html.replace(/<form/gm,'<form id="theform"');
  var snippet = '<div class="control-group">\n';
  snippet += '  <label class="control-label" for="submitbutton"></label>\n';
  snippet += '  <div class="controls">\n';
  snippet += ' <input type="button" class="btn btn-danger" value="Submit" onclick="submitClicked()">\n';
  snippet += ' </div>\n';
  snippet += '</div>\n';
  html = html.replace("</fieldset>", snippet + '</fieldset>'); 
  $('#submissionform').html(html);
  $('#submissionform').show(); 
  $('#submissions').hide();
  $('#deletions').hide();
  $('#config').hide();
};

var formToJSON = function( selector )
{
     var form = {};
     $(selector).find(':input[name]:enabled').each( function() {
         var self = $(this);
         console.log(self);
         var name = self.attr('name');
         var ctrltype = self.attr('type');
         console.log(ctrltype);
         switch(ctrltype) {
           case "checkbox":
           case "radio":
             if(self.is(':checked')) {
               if (form[name]) {
                  form[name] = form[name] + ',' + self.val();
               }
               else {
                  form[name] = self.val();
               }
             }
             break;
           
           case "text":
           case "password":
           case "textarea":
           case "select":
           default: 
             if (form[name]) {
                form[name] = form[name] + ',' + self.val();
             }
             else {
                form[name] = self.val();
             }
             break;
         }
         

     });
     console.log(form);
     return form;
}
var submitClicked = function() {
  
  console.log("Submit clicked");
  var obj = formToJSON('#theform');
  obj.type="submission";
  db.post(obj, function(err, data) {
    $("#theform")[0].reset();
    alert("Thank you!");
  });  
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
       home();
    });
  }
};

var upload = function() {
  var url = $('#url').val();
  if(url.length>0) {
    db.sync(url).then(function (result) {
      alert("Synced to Cloudant URL " + url);
      home();
    }).catch(function (err) {
      alert("Sync failed: " + err)
    });;
  } else {
    alert("You must supply a url");
  }
};

var saveClicked = function() {
  console.log("saveClicked!");
  var theform = $('#render').val();
  var config = { };
  config._id = "config";
  config.theform = theform
  loadConfig(function(err, data) {
    if(!err && data != null) {
      config._rev = data._rev;
    }
    db.put(config, function(err, data) {
      $('#config').hide();
      $('#submissions').hide();
      $('#deletions').hide();
      showForm(config);
    });
  });
};

window.onload = function() {

  db = new PouchDB('proforma');
  
  home();
 
  setTimeout(function() {
    $('#jumbo').hide();
    $('#formtabs :last').remove();
    $('#formtabs :last').remove();
    $('#formtabs :last').remove();
    $('#formtabs :last').remove();
        $('#formtabs :last').remove();
  }, 3000);    
  
  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      if (confirm('A new version of this site is available. Load it?')) {
        window.location.reload();
      }
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);
  
};