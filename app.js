var express = require('express'),
  cfenv = require('cfenv'),
  appEnv = cfenv.getAppEnv(),
  app = express();


// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
