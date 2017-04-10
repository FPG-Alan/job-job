# Job Job
This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.18. The known latest compatible version is 1.0.0-rc.1.

## Local installation
1. Clone project from https://github.com/fancypantsgroup/job-job.git
2. Install MongoDB and run `mongod` in the command line
3. Copy the '.env' file with all the secrets to the root folder of the project
4. Run `npm install` to prep the node_modules folder

## Development server
Run `npm run develop` for a dev server. Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

## Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests [UNUSED]
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests [UNUSED]
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying 
Development platform is Heroku. 

## Further help
To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md). Contact the contributors for more information.


## Maintenance Notes
- To add **Trello board templates** (requires Chrome or a browser where you can see the network requests)
  - navigate to the board on a browser
  - open to Inspector
  - click Network (then refresh the page if the network request list is empty)
  - find a request that looks like https://trello.com/1/boards/*boardID*
  - copy *boardID*, then paste in to the .env file (example TRELLO_BANNER_TEMPLATE_ID=*boardId*)
  - in server/routers/trelloIntegrationRouter.js
    - add something like `var *service*TemplateBoardId = process.env.TRELLO_*service*_TEMPLATE_ID;` (using process.env protects our secret variables)
    - in `trelloIntegrationRouter.post("/")`, find the code that assigns `idBoardSource`
    - add `req.body.serviceType == "*service*" ? *service*TemplateBoardId` before `: null`
  - in client/app/modules/jobs/new-job/new-job.component.ts
    - find the `serviceTypes` attribute/property of the component
    - add to the list `{value: '*service*', display: '*what you want to render as radio choice*'}`
