module.exports = (message) => {
    const err = new Error();
    err.name = 'An error has occurred';
    err.message = message;
    return err;
}