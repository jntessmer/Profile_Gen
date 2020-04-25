//nodes and packages to install 
const fs = require("fs");

const inquirer = require("inquirer");

const axios = require("axios");

const convertFactory = require("electron-html-to");

let generateHTML = require("./generateHTML.js");

let newHTML;
let color;

function promptUser(){
    return inquirer.prompt([
        {
            type: "input",
            message: "What is your GitHub username?",
            name: "username",
        },
        {
            type: "list",
            name: "color",
            message: "What is your favorite color?",
            choices: ["orange", "red", "blue", "purple"],
        }
    ])
}
 
promptUser().then(function (data) {
    console.log(data)
        username = data.username;
        console.log("Username: " + username);
        color = data.color;
            console.log("Color: " + color);

            let queryURL = "https://api.github.com/users/" + username;
            console.log(queryURL);

            let queryURLStarrred = `https://api.github.com/users/${username}/starred`;


            axios.get(queryURL)
            .then(function(response){
        
            axios.get(queryURLStarrred).
            then((responseStarred) => {

                let newHTML = generateHTML({color, responseStarred, ...response.data});
                writeToFile(newHTML);

            }).catch(error => {
                    console.log(error);
                });

                function writeToFile(data){
                    fs.writeFile('profile.html', data, 'utf8', function(err) {
                    if (err) {
                        return console.log(err);
                    } else console.log("You did it!");
                    });
                }

                var conversion = convertFactory({
                converterPath: convertFactory.converters.PDF
                });

                    conversion({ html: newHTML}, function(err, result) {
                        if (err) {
                            return console.log(err);
                        } 

                    result.stream.pipe(fs.createWriteStream('./profile.pdf'));
                    conversion.kill();
                    });
                })
                .catch(error => {
                    console.log(error);
                });
            });