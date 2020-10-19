module.exports.random = (min = 1, max = 10) => {
    return Math.floor(Math.random() * max) + min;
}

module.exports.percent = (number1 = 1, number2 = 50) => {
    return Math.floor((number1 / number2) * 100);
}