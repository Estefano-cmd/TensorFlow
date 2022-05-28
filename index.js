const tf = require('@tensorflow/tfjs');
const { training, testing } = require('./data')
const { formatUpdate } = require('./transform')
const { logs } = require('./logs')

// Mapping the trainingdata
const trainingData = tf.tensor2d(training.map(item => [item[0], item[1], item[2], item[3]]))


// Mapping the testing data
const testingData = tf.tensor2d(testing.map(item => [item[0], item[1], item[2], item[3]]), [30,4])




// creating model
const outputData = tf.tensor2d(training.map((item) => {
    const type = item[4];
    return [type === 0 ? 1 : 0, type === 1 ? 1 : 0, type === 2 ? 1 : 0];
  }))

// Creating Model
const model = tf.sequential();


model.add(tf.layers.dense(
    {   inputShape: 4, 
        activation: 'sigmoid', 
        units: 10
    }
));

model.add(tf.layers.dense(
    {
        inputShape: 10, 
        units: 3, 
        activation: 'softmax'
    }
));

model.summary();

// compiling model
model.compile({
    loss: "categoricalCrossentropy",
    optimizer: tf.train.adam()
})

async function train_data(){
    console.log('......Loss History.......');
    for(let i=0;i<40;i++){
     let res = await model.fit(trainingData, outputData, {epochs: 40});
     console.log(`Iteration ${i}: ${res.history.loss[0]}`);
  }
}

async function main() {
    await train_data();
    console.log('....Model Prediction .....')
    /* model.predict(testingData).print(); */
    const resultTensor = model.predict(testingData)

    const formatedData = formatUpdate(resultTensor)
    /* console.log(formatedData) */

    logs(formatedData)
}

main();
  
