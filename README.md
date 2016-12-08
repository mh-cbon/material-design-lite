# Material Design Lite - Fork

this forks add several components to the MDL base.

It s not AAA compliant all browsers, but could be!

- custom-selectfield: Mdl integration fo the select field.
- custom-chipautocomplete: An autocomplete field which records selected data into chips.
- custom-cropper: An input file which opens an image cropper and appropriately sets form values.
- custom-input-file: An input file support for mdl.
- custom-tinymce: A textfield which supports tinymce integration right out of the box.
- custom-datefield: A text field which diplays an awesome date picker.
- custom-datatable: Improved data table which can enable/disable a button, set checkbox values.
- custom-expander: Easily expand nodes with css classes.
- custom-dialog: A dialog box implementation.
- custom-dup: A component which add / remove a component template.
- custom input confirm: A component to handle input confirmation (double input).
- custom right panel over: A component which displays a web page in a right panel over the existing content.

componentHandler.downgradeElementRecursive: a method to downgrade a node recursively.


To see an half-functional version, check
- [general test](https://mh-cbon.github.io/material-design-lite/test.html)
- [form ajax](https://mh-cbon.github.io/material-design-lite/test-form-ajax.html)
- [loader over](https://mh-cbon.github.io/material-design-lite/test-loaderover.html)
- [ajax table](https://mh-cbon.github.io/material-design-lite/test-ajax-table.html)
- [ajax table with form](https://mh-cbon.github.io/material-design-lite/test-form-ajax-table.html)

To see an full-functional version, please, clone the project, run `gulp serve`, browse
- [general test](http://localhost:5000/test.html)
- [form ajax](http://localhost:5000/test-form-ajax.html)
- [loader over](http://localhost:5000/test-loaderover.html)
- [ajax table](http://localhost:5000/test-ajax-table.html)
- [ajax table with form](http://localhost:5000/test-form-ajax-table.html)

### Install

```sh
npm i @mh-cbon/material-design-lite --save
```

### Your local workflow

```sh
git clone https://github.com/mh-cbon/material-design-lite.git
cd material-design-lite
npm i
npm i node-sass # for some reasons you need to install it explicitly to trigger the install script.
./node_modules/.bin/gulp default
./node_modules/.bin/gulp test:web
./node_modules/.bin/gulp nightmare
./node_modules/.bin/gulp serve
./node_modules/.bin/gulp gh # publish your updates on your own gh-pages branch.
./node_modules/.bin/gulp build # to build dist folder
npm run patch|minor|major # to publish an npm package of the built dist folder
```

# Material Design Lite

[![GitHub version](https://badge.fury.io/gh/google%2Fmaterial-design-lite.svg)](https://badge.fury.io/gh/google%2Fmaterial-design-lite)
[![npm version](https://badge.fury.io/js/material-design-lite.svg)](https://badge.fury.io/js/material-design-lite)
[![Bower version](https://badge.fury.io/bo/material-design-lite.svg)](https://badge.fury.io/bo/material-design-lite)
[![Gitter version](https://img.shields.io/gitter/room/gitterHQ/gitter.svg)](https://gitter.im/google/material-design-lite)
[![Dependency Status](https://david-dm.org/google/material-design-lite.svg)](https://david-dm.org/google/material-design-lite)

> An implementation of [Material Design](http://www.google.com/design/spec/material-design/introduction.html)
components in vanilla CSS, JS, and HTML.

Material Design Lite (MDL) lets you add a Material Design look and feel to your
static content websites. It doesn't rely on any JavaScript frameworks or
libraries. Optimized for cross-device use, gracefully degrades in older
browsers, and offers an experience that is accessible from the get-go.

## Want to contribute?

If you found a bug, have any questions or want to contribute. Follow our
[guidelines](https://github.com/google/material-design-lite/blob/master/CONTRIBUTING.md),
and help improve the Material Design Lite. For more information visit our
[wiki](https://github.com/google/material-design-lite/wiki).

If you are submitting a bug fix or a new component for the 1.x line, please send those into `mdl-1.x` currently.

The `master` branch is where we are working on 2.0.
It is currently **highly** experimental and no support building or using it will be provided.

## Use MDL on your site?

**This document is targeted at developers that will contribute to or compile
MDL. If you are looking to use MDL on your website or web app please head to
[getmdl.io](http://getmdl.io).**

## Browser Support in v1


| IE9 | IE10 | IE11 | Chrome | Opera | Firefox | Safari | Chrome (Android) | Mobile Safari |
|-----|------|------|--------|-------|---------|--------|------------------|---------------|
| B   | A    | A    | A      | A     | A       | A      | A                | A             |

A-grade browsers are fully supported. B-grade browsers will gracefully degrade
to our CSS-only experience.

## Browser Support in v2 (in development)

Supported evergreen browsers:

- Chrome
- Edge
- Firefox
- Opera

Supported versioned browsers:

- Internet Explorer 11
- Safari 8
- Mobile Safari 8

### Download / Clone

Clone the repo using Git:

```bash
git clone https://github.com/google/material-design-lite.git
```

Alternatively you can [download](https://github.com/google/material-design-lite/archive/master.zip)
this repository.

Windows users, if you have trouble compiling due to line endings then make sure
you configure git to checkout the repository with `lf` (unix) line endings. This
can be achieved by setting `core.eol`.

```bash
git config core.eol lf
git config core.autocrlf input
git rm --cached -r .
git reset --hard
```

> Remember, the master branch is considered unstable. Do not use this in
production. Use a tagged state of the repository, npm, or bower for stability!

## Feature requests

If you find MDL doesn't contain a particular component you think would be
useful, please check the issue tracker in case work has already started on it.
If not, you can request a [new component](https://github.com/Google/material-design-lite/issues/new?title=[Component%20Request]%20{Component}&body=Please%20include:%0A*%20Description%0A*%20Material%20Design%20Spec%20link%0A*%20Use%20Case%28s%29).
Please keep in mind that one of the goals of MDL is to adhere to the Material
Design specs and therefore some requests might not be within the scope of this
project.

## License

© Google, 2015. Licensed under an
[Apache-2](https://github.com/google/material-design-lite/blob/master/LICENSE)
license.
