# API Role-Based Access Control and Manager

### A management interface for APIs using the following frameworks:
- [Feathers](http://feathersjs.com) Back-end
- Sequelize with MySql | MariaDB
- React Front-end

This application is used to both build your external APIs [RBAC](https://en.wikipedia.org/wiki/Role-based_access_control) and user data models as well as provide a client interface to manage these users, roles and permissions.

You can wire your API up directly to the database or interface with users and access tokens through the [@feathersjs/client](https://docs.feathersjs.com/api/client.html).

## Prerequisites
- Node 10+
- MySql (or MariaDB)

## Packages Used

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications. Feathers will handle all API requests from the client application to modify your data source as well as publish all data changes via socket.io back to a socket connection on the client if you are watching for updates. 

The client is bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started


1. Create MySql database *db_name* (and user if needed)

    ```
    CREATE DATABASE `<db_name>` /*!40100 DEFAULT CHARACTER SET utf8 */;

2. Make sure you have [NodeJS](https://nodejs.org/) and [yarn](https://yarnpkg.com) installed.

3. Install your dependencies

    ```
    cd path/to/api-manager; yarn install
    ```

4. Start your app

    ```
    yarn start
    ```

## Back-end Development

Run `yarn dev` from the root directory will start the Feathers server using [nodemon](https://nodemon.io/) to watch for file changes. 

## Testing

Simply run `yarn test` and all your tests in the `test/` directory will be run.

## Client Development

Run `yarn client` from the root directory which will load the React front-end on local webpack dev server with hot module reloading enabled


## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
