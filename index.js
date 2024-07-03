#!/usr/bin/env node

const { execSync, exec } = require("child_process");
const { program } = require("commander");
const { Console } = require("console");
const fs = require("fs");

const createFolder = (fname) => {
  fs.mkdir(fname, (error) => {
    if (error) {
      console.log(error.message);
    }
  });
};

const createFile = (string, path) => {
  fs.open(path, "w+", (error, fd) => {
    fs.write(fd, string, (error) => {
      if (error) {
        console.log(error.message);
      }
    });
  });
};

const installPackage = async (packageName) => {
  console.log(`Installing ${packageName}...`);

  execSync(`npm install ${packageName}`);

  console.log(`Installed ${packageName} successfully!`);
};

const changePKGJSON = () => {
  exec(`npm pkg set main="server.js"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error modifing package.json: ${error.message}`);
      return;
    }
  });
  exec(
    `npm pkg set scripts.dev="node src/server.js"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error modifing package.json: ${error.message}`);
        return;
      }
    }
  );
};

const appFileText = `
const express = require("express");
const cors = require("cors");

const app = express();



module.exports = { app }
`;

const serverFileText = `
const { app } = require('./app.js');

const port=process.env.PORT || 8000;

app.listen(port, () => {
  console.log("Server is running at port :", port);
})
`;

const gitIgnoreText = `
node_modules/

# dotenv environment variables file
.env
.env.test
.env.production
`;

program
  .name("express-boiler-plate")
  .description("Creates a boilerplate for an express js application")
  .action(async () => {
    createFolder("./public");
    createFolder("./src");
    createFolder("./src/middlewares");
    createFolder("./src/routes");
    createFolder("./src/controllers");
    createFolder("./src/models");
    createFolder("./src/utils");

    await installPackage("express");
    await installPackage("cors");

    createFile(appFileText, "./src/app.js");
    createFile(serverFileText, "./src/server.js");
    createFile("", "./.env");
    createFile(gitIgnoreText, "./.gitignore");

    changePKGJSON();

    console.log("Express boilerplate generated.\n");
    console.log("ENJOY COOKING!!!");
  });

program.parse();
