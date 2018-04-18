# Node Authentication
#### This application is a simple CLI express-node authentication solution using Passport.js
#### Dependencies: Node, NPM, Nodemon, json-server
This application has a client, server, and database sections. The client folder is only used to store a text file for cookies (`cookie-file.txt`). The server is a typical express server with lots of console logging to illustrate the authentication process. The `/db` folder is a mock JSON db using the npm package `json-server`. You can find the user credentials for two users in the `db.json` file.
# How to Run
1. Run `npm install` in both `/db` and `/server` directories
2. Open a terminal for the database server and run `npm run json:server` in `/db`
3. Open a terminal for the node server and run `npm run dev:server` in `/server`
4. Communicate with the server using `cURL`. I have supplied a simplified `cURL` cheatsheet that you can use to form your commands.

# cURL Options Cheatsheet
### Example: `curl http://localhost:3000/login -c cookie-file.txt -H 'Content-Type: application/json' -d '{"email":"test@test.com", "password":"password"}' -L`
Option | Description
--- | ---
`-c`, `-cookie-jar` \<filename\> | Specify to which file you want curl to write all cookies after a completed operation
`-b`, `--cookie` \<data\> | Pass the data to the HTTP server in the Cookie header. It is supposedly the data previously received from the server in a "Set-Cookie:" line. The data should be in the format "NAME1=VALUE1; NAME2=VALUE2". If no '=' symbol is used in the argument, it is instead treated as a filename to read previously stored cookie from. This option also activates the cookie engine which will make curl record incoming cookies, which may be handy if you're using this in combination with the -L, --location option or do multiple URL transfers on the same invoke. If the file name is exactly a minus ("-"), curl will instead the contents from stdin. The file format of the file to read cookies from should be plain HTTP headers (Set-Cookie style) or the Netscape/Mozilla cookie file format. The file specified with -b, --cookie is only used as input. No cookies will be written to the file. To store cookies, use the -c, --cookie-jar option. Users very often want to both read cookies from a file and write updated cookies back to a file, so using both -b, --cookie and -c, --cookie-jar in the same command line is common.
`-v`, `--verbose` | Makes curl verbose during the operation. Useful for debugging and seeing what's going on "under the hood".
`-X`, `--request` \<command\> | Specifies a custom request method to use when communicating with the HTTP server. The specified request method will be used instead of the method otherwise used (which defaults to GET). For example: `curl -X GET http://localhost:3000`
`-d`, `--data` \<data\> | Sends the specified data in a POST request to the HTTP server, in the same way that a browser does when a user has filled in an HTML form and presses the submit button. This will cause curl to pass the data to the server using the content-type application/x-www-form-urlencoded.
`-H`, `--header` \<header/@file\> | Extra header to include in the request when sending HTTP to a server. You may specify any number of extra headers. You will need to use this because `cURL` implicitly sends data as `application/x-www-form-urlencoded` and for this application you should change this header to `application/json`.
`-L`, `--location` | If the server reports that the requested page has moved to a different location (indicated with a Location: header and a 3XX response code), this option will make curl redo the request on the new place. This is necessary for redirects in this application.

Partial Code Credit: Evan Gow, [Server & Authentication Basics: Express, Sessions, Passport, and cURL](https://medium.com/@evangow/server-authentication-basics-express-sessions-passport-and-curl-359b7456003d)