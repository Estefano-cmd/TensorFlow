function logs(data){
    const types = ['SETOSA', 'VERSICOLOR', 'VIRGINICA'];
    data.forEach((item) => {
      const max = Math.max(...item);
      const index = item.findIndex((i) => i === max);
      console.log(`Item: ${item} Máximo: ${max} Índice: ${index}, Tipo: ${types[index]}`);
    });
}

module.exports = {logs}