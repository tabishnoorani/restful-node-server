This is a NODE server for the the project IMREGO (underconstruction).

Below you will find some information on how to perform common tasks.<br>

## Table of Contents

- [Setting up the config.js file](#CONFIG.JS)
- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
  - [npm start](#npm-start)
  - [npm test](#npm-test)
  - [npm run build](#npm-run-build)
  - [npm run eject](#npm-run-eject)

## CONFIG.JS

This project contains config.js file in the 'src' folder. The purpose of this file is to declare some variables which are ment to be used globally.

This config.js contains following content:

export default {
    PORT: '4000',
    database : {
        mlab:{
            URL: [URL for the Database],
        }
    },    
    jwt: {
        SECRET_KEY: [JWT secret code for JWT token]
    }
}


## Folder Structure

-bin:
 |-dev
 |-production
    DescriptionThis folder contain calling of files for 'start' and 'production' script executions.
-dist:
    It contains all the files and folder covertered from ES2015 to normal Javascript.
-src:
    This contains the actual code.
-test:
    This is to run the tests.

## SRC FILE STRUCTURE
-index.js
    This is the entry file for the server.
-config.js
    This file contains all the general and secret variables.
-database
    This folder contains all the mongoose activities.
-

## USER AUTH PROCESS
-Signup
 POSTs the profile with un and pw.
 stores the info with  bcrypted password.
 

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Server URL is [http://localhost:4000].

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `npm run build`

Builds the app for production to the `dist` folder.<br>

### `npm run production`

It correctly bundles NODE API in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!
