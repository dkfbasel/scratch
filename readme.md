README
------
This is a template for projects using Go for the backend and Vue.js for the
frontend.

Directory Structure
-------------------
```
- build         // contains all information required to run the project in production
    - bin       // contains all binaries to run the service
    - public    // contains all files that should be served by the service
    - templates // contains all templates required for the service

- docs          // documentation and asset source files for the project

- src           // contains all development information
    - backend   // contains the golang code for the web server		 
    - frontend  // contains the web application front-end source code
    - docker-compose.yml    // configuration for development containers

- test          // directory for separate test data and integration tests

- readme.md     // readme file for every project
```

Golang Tools
------------
All golang packages should be vendored in the src/backend/vendor folder.
Govendor (github.com/kardianos/govendor) should be used to vendor all go package
dependencies until an official vendoring solution is available.

Tests should be created in respective test files and should employ the package
[github.com/smartystreets/goconvey](https://github.com/smartystreets/goconvey). However, goconvey should not be installed
in the vendor folder but directly in your gopath (i.e. with go get).

Configuration should be stored in a separate config.yaml file. It should also be
possible to overwrite the configuration with environment variables. The package
[github.com/jinzhu/configor](https://github.com/jinzhu/configor) can be used for this.

For error handling the package [github.com/pkg/errors](https://github.com/pkg/errors) should be used. This will
allow to add context to errors.

Please use the package [github.com/uber-go/zap](https://github.com/uber-go/zap) to create structured logs. Logs
should be sent to the standard out, so it is possible to later collect all
logs from different docker services in a central place.

The echo framework [github.com/labstack/echo](https://github.com/labstack/echo) can be used as web framework for
services. However, try to use only the standard library in packages that can
be used by external projects. This helps to avoid problems with dependencies
on different versions of external packages.

A special docker container dkfbasel/hot-reload-go is provided for development.
This container will auto-compile and start the go binary every time a file
in the project directory is changed.

The package [github.com/eirwin/stubble](https://github.com/eirwin/stubble) can be used to setup a simple json mock
api for testing and initial frontend development.


Vue.js
------
The frontend should be developed using Vue.js employing various components that
compose the application.

Eslint should be used to ensure that the code-style conforms to the team standard.
A respective .eslintrc file is provided in the frontend directory.

Stylus should be used to write css specifications and should be kept in a
separate .styl file next to the component specification.

A special docker container dkfbasel/hot-reload-webpack is provided to support
hot-reload development and simplify building the code with webpack.
This container does provide all node_modules that are required to build the
application. Therefore only project specific packages need to be included in
the file package.json (i.e. vue, vuex, vue-router, axios).

Yarn (https://yarnpkg.com) should be used instead of npm to load additional
node_modules.


Version-Control
---------------
Git should be used for all directories as version control system. The branching
should follow the git-flow model
(http://jeffkreeftmeijer.com/2010/why-arent-you-using-git-flow/).

All production releases should be integrated in the master branch and be given a
respective tag. Tags should follow semantic versioning (i.e. major.minor.patch).
In addition, a high level description of the changes should be added to every tag.


Project Description
-------------------
..

How To Build
------------
..

How To Run
----------
All projects should be packed into docker containers. A basic dockerfile is
already provided in the build directory. Alpine-Linux should be used a base image
to allow inspection of the running processes in the container without having
to use huge images.

A docker-compose configuration should be provided to run all required containers.
