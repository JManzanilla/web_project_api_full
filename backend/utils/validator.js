const urlValidator = {
  validator: function (v) {
    return /^https?:\/\/(www\.)?[\w\-._~:/?%#[\]@!$&'()*+,;=]+#?$/i.test(v);
  },
  message: (props) => `${props.value} no es una URL válida`,
};

module.exports = {
  urlValidator,
};
