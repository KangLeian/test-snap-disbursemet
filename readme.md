# Simple Example Integration Demo for DUITKU SNAP Disbursement

To run this project you might need to fork this project then run on your localhost.
First, you need install Node JS and npm at least version 6.14.15.

You'll need nodemon installed on your local as well.

This project is only for learning and understanding purpose only. You might follow the code and put to your real project but please make sure that this is just an example. For further information and updates check the documentation.

## Project Preparation

### configuration

On folder config remove name `example.` from `example.index.js` to `index.js`.

Edit the file with your own credential. If you haven't get any please contact Duitku.

```javascript
module.exports = {
    clientKey: "DBXXXXXX",
    userId: "XXXXXX",
    channelId: "95221",
    clientSecret: "0fc994ffYTM3MWRiNGItMjI1Zi00MGMyLWQzYmYtMDhkYzMzNTYyMDBic92632b01ac",
    accessToken: "YTM3MWRiNGItMjI1Zi00MGMyLWQzYmYtMDhkYzMzNTYyMDBi",
    sandboxDomain: "https://snapdev.duitku.com"
}
```

Make sure you have an RSA key pairs. And you'll need provide Duitku your public key. Use the private key to get Token Auth Bearer.

Put your key as `privatekey.pem` on mykey folder.

You should have this file on your project

```ftp
App
 |
 |- config
 |  |
 |  --index.js
 |
 |- mykey
 |  |
 |  |--privatekey.pem
 |
 etc.
```

### NPM Install

Make sure you have install at least npm version 6.14.15.

Run command on your terminal and check the version.

```shell
npm -v
```

Install nodemon.

```shell
npm i -g nodemon
```

Don't forget to install your project also after before you run the project.

```shell
npm i
```

## Run Project

To run your project run this command below.

```shell
nodemon app.js
```

You'll have a running project on port 3000. Go to [localhost 3000](http://localhost:3000/).