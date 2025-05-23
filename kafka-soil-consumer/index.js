const { Kafka } = require('kafkajs');
const chalk = require('chalk');

const kafka = new Kafka({
  clientId: 'soil-sensor-consumer',
  brokers: ['localhost:9092'], // Update this if your Kafka runs elsewhere
});

const consumer = kafka.consumer({ groupId: 'soil-group' });

const printSoilData = (data) => {
  console.log(chalk.bold.green('\n🔔 New Soil Sensor Data Received!'));
  console.log(chalk.cyan(`🌾 Farm      : ${data.farmName}`));
  console.log(chalk.cyan(`📍 Location  : ${data.location}`));
  console.log(chalk.cyan(`🆔 Sensor ID : ${data.sensorId}`));
  console.log(chalk.magenta(`🌡️ Temp (°C) : ${data.temperature}`));
  console.log(chalk.blue(`💧 Moisture %: ${data.moisture}`));
  console.log(chalk.yellow(`🧪 pH Level  : ${data.pH}`));
  console.log(chalk.gray(`🕒 Timestamp : ${new Date(data.timestamp * 1000).toLocaleString()}`));

  // Optional alerts
  if (data.moisture < 20) {
    console.log(chalk.red.bold('⚠️ ALERT: Moisture critically low!'));
  }
  if (data.pH < 5.5 || data.pH > 7.5) {
    console.log(chalk.red.bold('⚠️ ALERT: pH level out of range!'));
  }
};

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'test', fromBeginning: false });

  console.log(chalk.green('✅ Listening to topic "test"...'));

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const payload = JSON.parse(message.value.toString());
        printSoilData(payload);
      } catch (err) {
        console.error(chalk.red('❌ Error parsing message'), err);
      }
    },
  });
};

run().catch((err) => {
  console.error('Error running consumer:', err);
});
