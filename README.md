# node-plantuml

A Node.js module and CLI for running [PlantUML](http://plantuml.sourceforge.net/).

[![npm Version](https://img.shields.io/npm/v/node-plantuml.svg)](https://www.npmjs.com/package/node-plantuml) [![Build Status](https://travis-ci.org/markushedvall/node-plantuml.svg)](https://travis-ci.org/markushedvall/node-plantuml) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

[PlantUML](http://plantuml.sourceforge.net/) is a popular diagramming tool that uses simple textual descriptions to draw UML diagrams. With the API provided by this module you can easily generate PlantUML diagrams directly from your Node.js application. It can also be used to encode and decode PlantUML source files.

This module also provides an easy to use and flexible command line interface for doing the same kind of operations as enabled by the API.

Install [Graphviz](http://www.graphviz.org/) to be able to generate all diagram types.

# Install

```
npm install node-plantuml
```

If you want to use the CLI node-plantuml can be install it globally:

```
npm install node-plantuml -g
```

# Example

Diagrams can be created from source files.

```javascript
var plantuml = require('node-plantuml');
var fs = require('fs');

var gen = plantuml.generate("input-file");
gen.out.pipe(fs.createWriteStream("output-file.png");
```

If your application will be making multiple PlantUML requests, it might be a good idea to enable the usage of Nailgun.

Following is an example of a simple web server for generating images from encoded PlantUML source.

```javascript
var express = require('express');
var plantuml = require('node-plantuml');

var app = express();

plantuml.useNailgun(); // Activate the usage of Nailgun

app.get('/png/:uml', function(req, res) {
  res.set('Content-Type', 'image/png');

  var decode = plantuml.decode(req.params.uml);
  var gen = plantuml.generate({format: 'png'});

  decode.out.pipe(gen.in);
  gen.out.pipe(res);
});

app.get('/svg/:uml', function(req, res) {
  res.set('Content-Type', 'image/svg+xml');

  var decode = plantuml.decode(req.params.uml);
  var gen = plantuml.generate({format: 'svg'});

  decode.out.pipe(gen.in);
  gen.out.pipe(res);
});

app.listen(8080);
```

# CLI

The node-plantuml CLI can be accessed with the puml command.
```shell
puml generate file.puml -o file.png
```

It's also possible to use stdin and stdout for input and output.
```shell
puml decode UDfpLD2rKt0200GS0Iy0 | puml generate > file.png
```

Simple textual one-liners can also be used as input.
```shell
puml generate --unicode --text "A -> B: Hello"
    ┌─┐          ┌─┐
    │A│          │B│
    └┬┘          └┬┘
     │   Hello    │
     │───────────>│
    ┌┴┐          ┌┴┐
    │A│          │B│
    └─┘          └─┘
```

There are multiple options for input and for output. And the output can be in multiple different formats.
```
Usage: puml [options] [command]


Commands:

  generate [options] [file]  Generate an UML diagram from PlantUML source
  encode [options] [file]    Encodes PlantUML source
  decode <url>               Decodes PlantUML source
  testdot                    Test the installation of Graphviz dot

Options:

  -h, --help     output usage information
  -V, --version  output the version number
```

```
Usage: generate [options] [file]

Generate an UML diagram from PlantUML source

Options:

  -h, --help            output usage information
  -p, --png             ouput an UML diagram as a PNG image
  -s, --svg             ouput an UML diagram as an SVG image
  -e, --eps             ouput an UML diagram as an EPS image
  -u, --unicode         ouput an UML diagram in unicode text
  -a, --ascii           ouput an UML diagram in ASCII text
  -o --output [file]    the file in which to save the diagram
  -c, --config [file]   config file read before the diagram
  -t, --text [text]     UML text to generate from
  -d, --dot [file]      specify Graphviz dot executable
  -i, --include [path]  specify the path to include from
  -C, --charset [charset]  specify the charset of PlantUML source
```

```
Usage: encode [options] [file]

Encodes PlantUML source

Options:

  -h, --help         output usage information
  -t, --text [text]  UML text to encode
```

```
Usage: decode [options] <url>

Decodes PlantUML source

Options:

  -h, --help  output usage information
```

# Config templates

With predefined configuration templates the looks of the diagrams can be altered. For a more classic black and white look the classic configuration template can be used.
![alt tag](http://www.plantuml.com/plantuml/img/UDgjb3rFmp0GXdV_YjjeGK7C3AWV0qAg0Ab2B2oESqcFkdOvErIbyDznqxfVILi6rhl7zxxlsKd7USc-d6WXBkxH84iDpiyrcKAuCPcfP3a1DvAPdOKQv58x52FA41InqYXsC6CzzgGQ5snBa_MjjWol8_9uo5ZEa5VzdWu7WdXVI-SW8rbKWZKBqu39ukpuYDKKjeXQAdMzPqfBZm_AcY5z8TmS8h0G0Crw05rcEzkT7z2Qva_8DSIF4et24z5SH1RDWv_33P6YgJI-hh7VFk9sG3aEo62pnHSNBbEwKnPBXnNn7ojPBVSfTSYVoDN8g-Mpe7pUQc-1lZMAqMC4ktycUqV9OPc-e_BhlbtpmPyELRAcAZCMv3no7DUANBjgb-OCi9ADJRVIhwT9ak-xpHP4FSD-Fpg_J99jKJo6ZmbIwxsTWCrZlDkw1NWpa8TBY4w1J4Fyy0gqtjIlD_iJ7JJPyX_n2m4TUEG0)

Compared to the standard PlantUML look:
![alt tag](http://www.plantuml.com/plantuml/img/UDgDaJ4EmZ0CHVUSmcCB2WTWG8NkCB2ofC55GMai9IuI0kuEj4qGAWZM_vzYFwS8h3otZHL2MnK2RAg0_eGUBW9W2exOrESi5xS8bEIqHyO8BlycLr_9RLiTKVFGqy2NPEqZDUIwsEF114OVdyiYbtTrwtu0_TXOXdx-s4RAwo9TGOmTtlku-KJALoZMn0WLCLC3L4Uz-NW5s3ceoITbCEw3FcXbRSfdwNwYGBT__jqTLUUSCW00)

# License
MIT
