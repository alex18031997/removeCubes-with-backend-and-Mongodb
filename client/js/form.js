// получаем данные с формы авторизации

const form = document.querySelector('.form-horizontal');
const btnDefault = document.querySelector('.btn-default');
const error = document.querySelector('#error');
const reg = document.querySelector('#reg');


form.addEventListener('click', (e) => {
    e.preventDefault();
});

btnDefault.addEventListener('click', (e) => {
    const login = document.querySelector('#inputName').value;
    const pass = document.querySelector('#inputPassword').value;
    const object = {login, pass}
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(object)
    }).then(data => data)
        .then(data => {
            if (data.status === 403) {
                error.classList.remove('hide');
            } else if (data.status === 200) {
                location.reload();
            }
        })
});

