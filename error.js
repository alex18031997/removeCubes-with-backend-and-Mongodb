module.exports = (message) => {
    const err = new Error();
    err.name = 'Oops an error has occurred';
    err.message = message;
    return err;
}