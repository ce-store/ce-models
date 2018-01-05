var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET json list of models. */
router.get('/', function(req, res, next) {
  var models = listModels();
  res.json(models);
});


/* GET model load commands. */
router.get('/*', function(req, res, next) {
  var path = req.path;
  if(path && path.length > 1){
    if(path = path.substr(1));
  }
  if(path.endsWith('/')){
    path = path.substring(0,path.length-1);
  }

  var commandFiles = getFiles(path + '/cmd');
  var agentFiles = getFiles(path + '/agents');
  var modelFiles = getFiles(path + '/model');
  var hudsonFiles = getFiles(path + '/hudson');
  var factFiles = getFiles(path + '/facts');

  var baseUrl = false;
  if(req.secure){
    baseUrl = 'https://'+req.headers.host;
  }
  else{
    baseUrl = 'http://'+req.headers.host;
  }

  res.setHeader('content-type', 'text/plain');
  res.render('index', {
    layout: 'model_load',
    base_url: baseUrl,
    command_files: commandFiles,
    agent_files: agentFiles,
    model_files: modelFiles,
    hudson_files: hudsonFiles,
    fact_files: factFiles
  });
});


function getFilesFromConfig(path){
  var files = false;
  var json = false;
  var inputFile = 'public/models/' + path + '/.config.json';

  try{
    json = fs.readFileSync(inputFile,{
      encoding: 'utf8'
    });
  }
  catch(e){
  }

  if(json){
    files = JSON.parse(json);
  }
  return files;
}

function writeFilesToConfig(path, files){
  var outputFile = 'public/models/' + path + '/.config.json';
  var json = JSON.stringify(files,null,4);
  fs.writeFile(outputFile, json, function(err) {
    if(err) {
        console.log(err);
    }
  });
}

function getFiles(path){
  var configFiles = [];
  var files = []
  try{
    fs.accessSync('public/models/' + path, fs.R_OK);

    // try loading list from config or else dynamically load them
    files = getFilesFromConfig(path);
    if(!files){
      files = fs.readdirSync('public/models/'+ path);
      files = files.filter(function(file) {
        return file.toLocaleLowerCase().substr(-3) === '.ce';
      });
      writeFilesToConfig(path, files);
    }
    else{
      console.log('got cached files');
    }

    for(var i=0; i < files.length; i++){
      files[i] = 'models/' + path + '/' + files[i];
      configFiles[i] = files[i];
    }
  }
  catch(e){
    console.log(e);
  }

  return files;
}


function listModels(){
  var models = []
  try{
    fs.accessSync('public/models/', fs.R_OK)
    var models = fs.readdirSync('public/models/');
  }
  catch(e){
    console.log(e);
  }

  return models;
}


module.exports = router;
