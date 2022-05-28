function formatUpdate(data){
    let item = [];
    const result = []
    data.dataSync().forEach((value, i) => {
      if (i % 3 == 0) {
        item = [];
        result.push(item)
      }
      item.push(value);
    })
    return result
}

module.exports = {formatUpdate};