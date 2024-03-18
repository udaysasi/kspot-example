# README

This is a project created to solve the daily problem of Collaborating and Scheduling meetings and gatherings. A lot of time is wasted to find a common time to meet/gather when a lot of people are involved. The matters get worse when trying to find a common time a bunch of students are available. [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### What does this repository contain?

This repository contains basic application - serverside in nodejs and ui in Angular 14. The code structure is as follows:

- src --> contains all controllers written in nodejs. This will serve the API endpoints
- ui --> An angular 14 admin template [Link](https://preview.themeforest.net/item/fuse-angularjs-material-design-admin-template/full_screen_preview/12931855) that contains the basic components for typical UI development. This folder conatins its own `package.json` that contains all dependencies required to run the Angular project
- `package.json` with all server side dependencies
- `server.js` file that kickstarts the application

### How do I get set up for development?

- Clone this repository
- Navigate to `kspot-example/ui` directory
- Install all the dependencies by running `npm install`
- Run `npm run start` to start the UI. By default, the application is running on post 4200
- Open a new terminal and navigate to `kspot-example` directory
- Install all the dependencies by running `npm install`
- Run `node server.js` to start the server. The server starts up and is listening for requests on port 3080. The server listens for requests starting with `/api`
- A proxy configuration file `proxy.conf.json` is defined in the ui directory that directs all `/api` traffic to the server
- Open a browser and navigate to http://localhost:4200

### Getting ready for Production

- Navigate to `kspot-example/ui` directory
- Install all the dependencies by running `npm install`
- Run `npm run build` to build the UI. Once the process is complete, a `dist` folder is created in the `kspot-example/ui` directory.
- Navigate to `kspot-example` directory
- Install all the dependencies by running `npm install`
- Run `node server.js` to start the server. The server starts up and is listening for requests on port 3080. `server.js` is setup to serve all static content (endpoints that are not `/api`) from the `kspot-example/ui/dist` directory.
- Open a browser and navigate to http://localhost:3080

### Contribution guidelines

- Writing tests
- Code review
- Other guidelines

### Who do I talk to?

- [Uday](mailto:uday@kloudspot.com)
