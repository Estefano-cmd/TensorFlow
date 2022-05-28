const tf = require('@tensorflow/tfjs')
const { training, testing } = require('./data')
const { formatUpdate } = require('./transform')
const { logs } = require('./logs')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log(testing[0])
// Mapping the trainingdata
const trainingData = tf.tensor2d(training.map(item => [item[0], item[1], item[2], item[3]]))

// Mapping the testing data
function prepareInput (input) {
  // testing.map(item => [item[0], item[1], item[2], item[3]]), [testing.length,4]
  return tf.tensor2d(input.map(item => [item[0], item[1], item[2], item[3]]), [input.length, 4])
}

// creating model
const outputData = tf.tensor2d(training.map((item) => {
  const type = item[4]
  return [type === 0 ? 1 : 0, type === 1 ? 1 : 0, type === 2 ? 1 : 0]
}))

// Creating Model
const model = tf.sequential()

model.add(tf.layers.dense(
  {
    inputShape: 4,
    activation: 'sigmoid',
    units: 10
  }
))

model.add(tf.layers.dense(
  {
    inputShape: 10,
    units: 3,
    activation: 'softmax'
  }
))

model.summary()

// compiling model
model.compile({
  loss: 'categoricalCrossentropy',
  optimizer: tf.train.adam()
})

async function trainData () {
  /* console.log('......Loss History.......'); */
  console.log('TRAINING DATA....')
  for (let i = 0; i < 40; i++) {
    await model.fit(trainingData, outputData, { epochs: 40 })
    /* console.log(`Iteration ${i}: ${res.history.loss[0]}`); */
  }
}

function question () {
  readline.question('Insertar Datos([5.1, 3.5, 1.4, 0.2]): ', input => {
    const inputData = JSON.parse(input)
    console.log(inputData)
    resolveData([inputData])

    /* console.log(testingData) */
    question()
  })
}

function resolveData (input) {
  const testingData = prepareInput(input)
  const resultTensor = model.predict(testingData)
  const formatedData = formatUpdate(resultTensor)
  logs(formatedData)
}

async function main () {
  await trainData()
  /* console.log('....Model Prediction .....') */
  console.log('PROBANDO ENTRENAMIENTO')
  resolveData(testing)

  question()
}

main()

// [4.6, 3.2, 1.4, 0.2, 0],[6.7, 3.1, 4.4, 1.4, 1],[5.7, 2.5, 5.0, 2.0, 2],
