import rpio from 'rpio';

const RECEIVE_PIN = 13;

const runScript = async () => {
  rpio.init({
    gpiomem: true /* Use /dev/gpiomem */,
    mapping: 'physical' /* Use the P1-P40 numbering scheme */,
    mock: undefined /* Emulate specific hardware in mock mode */,
  });

  rpio.open(RECEIVE_PIN, rpio.INPUT);
  const buffer = new Buffer(1000);
  rpio.readbuf(RECEIVE_PIN, buffer);
  rpio.close(RECEIVE_PIN);

  console.log(buffer.join('-'));
};

runScript()
  .then(() => {
    console.log('script finished successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error(`script failed: ${error.message}`);
    process.exit(1);
  });
