# Job Job
This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.18. The known latest compatible version is 1.0.0-rc.1.

## Auth0 setup
- navigate to https://manage.auth0.com/#/
- click New Client
- choose Single Page Web Applications as client type
- navigate to that client's Settings
  - retrieve Client ID and Client Secret
- find Allowed Callback URLs
  - fill "http://localhost:3000/, https://jtb-fpg.herokuapp.com/", etc.
- (optional?) just to make sure, find Allowed Origins (CORS)
  - fill in "https://jtb-fpg.herokuapp.com"
- navigate to https://manage.auth0.com/#/connections/social
  - click Google or your desired social connection
  - follow their instructions on "How to Obtain a Client ID"
  - in the Clients tab of the social connection setup (same modal), enable this social connection
  for the Client that you just created

## App integrations setup
- **10,000ft** (dev is https://vnext.10000ft.com/settings and prod is https://app.10000ft.com/settings)
  - navigate to URL above
  - click Developer API 
  - retrieve long string of token
- **Box** (https://fancypantsgroup.app.box.com/developers/services/edit/)
  - create an App with desired name (ideally we should have 2 apps)
  - retrieve client_id and client_secret under OAuth2 Parameters
  - fill in redirect_uri, if you have 2 apps, url for dev should be the following:
    - dev: http://localhost:3000/auth/box (or whichever port you're using)
    - prod: https://jtb-fpg.herokuapp.com/auth/box (or where the app lives)
- **Trello** (https://trello.com/app-key)
  - the key found in the URL above is used to retrieve the token using your app
- **Slack** (https://api.slack.com/apps)
  - click Create New App
  - navigate to Basic Information
    - find App Credentials
    - retrieve Client ID and Client Secret
  - navigate to OAuth & Permissions
    - find Redirect URLs
    - add http://localhost:3000/auth/slack for dev
    - add https://jtb-fpg.herokuapp.com/auth/slack for prod
  

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

## Deploying 
Development platform is Heroku. 

## Further help
To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md). Contact the contributors for more information.


## Maintenance Notes
- To add **Trello board templates** (requires admin access)
  - navigate to a template board on your browser
  - type ".json" after the URL (e.g. https://trello.com/b/0Rldf1OT/fpg-ny-tech-job-s-the-builder.json
  - find "id" (e.g. "581900d33f0838a3be9abb1c")
  - grab the ID and the name use that in JTB's [New Job page](https://jtb-fpg.herokuapp.com/#/jobs/new)
- To change **Box project template** (requires Heroku access)
  - grab the ID of the folder in its URL 
  - replace the current BOX_TEMPLATE_FOLDER value with the new ID
  
