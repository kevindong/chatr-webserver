# Chatr - Web Server

# Description
This repo consists of the Web portion of the Chatr project. For details on what constitutes the Web portion, see the design document in the main Chatr repo. All development occurs in the `dev` branch. We currently anticipate merging changes into the `master` branch at the end of every sprint. 

# Instructions for setting up the development environment
1. Install Node.js and NPM for your particular platform (Windows, Mac, Linux, etc.).
2. Open up a terminal and clone this repo: `git clone https://github.com/CS307-Group5/chatr-webserver.git`.
3. Enter the newly cloned repo: `cd chatr-webserver`.
4. Change to the `dev` branch: `git checkout dev`.
5. Install all packages: `npm install`.
6. Start Node.js server via nodemon: `npm run start:dev`.

Note 1: The `npm run start:dev` command will automatically restart the local development server anytime it detects a file has changed. Anytime an uncaught exception gets thrown/a stack trace is printed, it'll appear in the terminal that you ran the command on.

# Instructions for deploying to the dev instance on Heroku
Just push your changes to the `dev` branch on Github. Heroku will detect a change has occured and automatically rebuild and deploy. Consequently, don't commit and push until you're done with your local changes.
