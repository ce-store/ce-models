# CE-MODELS
This project provides a central directory for Controlled English (CE) models.  Each CE model is made up files containing CE sentences.

The `core` model is a special model that other CE models depend on. The core model sentences will automatically be loaded before any of the other specific model sentences.

## How to add new models
New models can be added into `ce-models/public/models`.

## Sentence Ordering ##
Sentences are always loaded in the order: model, hudson, facts, agents. Within those categories sentence files are loaded (by default) in alphabetical order. This can be overriden by editing the `.config.json` file.

## Using CE command files ##
More advanced users can make use of CE command files by creating a `cmd` sub-folder within
the model folder.  This can contain any CE commands supported by ce-store including the
loading of other CE files from urls. Should you load files in a command file in this way you
should then prevent them from being loaded by default as well, by editing the `.config.json`
file is each subfolder.  To suppress all files in a folder simply create an empty array in
this file, e.g. `[]`

## Development
### Running in Vagrant
    vagrant up
    vagrant ssh
    cd /vagrant
    npm install
    npm start


## Deployment
Pushing to git master will automatically deploy to production.
