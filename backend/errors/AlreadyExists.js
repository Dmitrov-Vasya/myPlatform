class AlreadyExists extends Error {
  constructor(message) {
    super(message);
    this.name = 'AlreadyExists';
    this.status = 409;
  }
}

module.exports = AlreadyExists;
