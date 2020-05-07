# raspi-pool

Raspi-pool is a swimming pool manager service to control devices (lights, water & heating pump, ...). It's also using sensors to get some data (e.g. temperate of the water).

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

## Raspberry

Once docker and postgres are installed correctly,
the image can be built then ran:

```sh
  nohup docker build -t raspi-pool . &

  nohup docker run --rm --device /dev/mem --device /dev/gpiomem -p 3000:3000  --privileged -t raspi-pool &
```

## GPIO

- BCM 4: water temperature (1-wire protocol - ds18b20) with 4.7k Ohm.
- BCM 26: outside temperature (1-wire protocol - ds18b20) with 4.7k Ohm.
- BCM 22: box temperature (am2320) with 10k Ohm.
- Pin 29 & 31: vertical actuator 1
- Pin 33 & 35: vertical actuator 2
- Pin 32: pool light
- Pin 38: tree light
- Pin 40: water pump
- Pin 36: heating pump

### Useful Resources

- https://pinout.xyz/pinout/pin11_gpio17
