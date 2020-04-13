# raspi-pool

## ⚡️ Quick start

1. **Clone and enter the repo.**

   ```sh
   git clone git@github.com:rv2e/raspi-pool.git
   cd raspi-pool
   ```

1. **Install dependencies.**

   ```sh
   nvm use
   yarn install
   ```

1. **Run the backend.**

   1. **Create You Env**
      The backend needs some credentials to work. They are directly taken from the `.env` file that you have to create. Feel free to copy the `.env-sample` file which contains a basic setup.
   1. **Create Postgres Database**
      You can use the `db:create` command to directly create the database:

      ```sh
      yarn db:create
      ```

   1. **Apply The Migrations**
      Before starting the application, your database needs the latest migrations. You can run this command:

      ```sh
      yarn db:migration:run
      ```

   1. **Start The App**
      You can use the `start` command or the `start:dev` (with hot reload) to run the application:

      ```sh
      yarn start[:dev]
      ```

      Now the server should listen to the port 3000.

1. **Load the Jest tests in watch mode.**

   Use the test command to run the tests in watch mode.

   ```sh
   yarn test:watch
   ```

   Notes:

   - The tests use another dotenv configuration. You can take a look at this file `.env.test`. Make sure to also create a database for the e2e tests.

1. **Other useful commands.**

   - Run the linter: `yarn lint`
   - Build the app: `yarn build`
   - Generate migrations: `yarn db:migration:generate -n <migration_name>`
   - Seed the database: `yarn db:seed`
