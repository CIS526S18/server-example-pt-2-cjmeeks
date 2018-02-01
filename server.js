"use strict";

// PORT definition
const PORT = 3095;

// Import the HTTP library
const http = require('http');

// Import the fs library 
const fs = require('fs');

const cache = {}
cache['openhouse.html'] = fs.readFileSync('public/openhouse.html');
cache['openhouse.css'] = fs.readFileSync('public/openhouse.css');
cache['openhouse.js'] = fs.readFileSync('public/openhouse.js');
/**@function serveIndex
 *  serving the index
 * @param {http.ServerResponse} res - server response object 
 */
function serveIndex(path,res){
    fs.readdir(path,function(err, files){
        if(err){
            console.error(err);
            res.statusCode = 500;
            res.end("Server Error");
        }
        var html = "<p>Index of " + path + "</p>";
        html += "<ul>";
        html += files.map(function(item){
                    return "<li><a href='" + item + "'>" + item + "</a></li>";
                }).join("");
        html += "</ul>";
        res.end(html);
    });
}
/**@function handleRequest
 * handles request coming into the server
 * @param {http.ClientRequest} req - request object
 * @param {http.ServerResponse} res - response object 
 */
function handleRequest(req, res) {
    switch(req.url) {
        case '/':
            serveIndex('public', res);
            break;
        case '/openhouse.html':
            getFile('public/openhouse.html', res);
            break;
        case '/openhouse.css':
            getFile('public/openhouse.css', res);
            break;
        case '/openhouse.js':
            getFile('public/openhouse.js', res);
            break;
        default:
            res.statusCode = 404;
            res.end("File Not Found");
    }

}
/** @function getFile
 * this function gets the file specified and response to request accordingly
 * @param {string} filename - name of file to read
 * @param {http.serverResponse} res  - response object to response to the request
 */
function getFile(filename, res){
    fs.readFile(filename, function(err, data){
        if(err){
            console.err(err);
            res.statusCode = 500;
            res.end("Server Error");
            return;
        }
        res.end(data);
    });
}

// Create the web server
var server = http.createServer(handleRequest);

// Start listening on port PORT
server.listen(PORT, function(){
    console.log("Listening on port " + PORT);
});