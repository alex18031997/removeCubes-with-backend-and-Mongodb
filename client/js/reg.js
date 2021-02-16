// получаем данные с формы авторизации

const form = document.querySelector('.form-horizontal');
const btnDefault = document.querySelector('.btn-default');
const error = document.querySelector('#error');
const row = document.querySelector('.row');
const resSec = document.querySelector('#resSec');


form.addEventListener('click', (e) => {
    e.preventDefault();
});

btnDefault.addEventListener('click', (e) => {
    const name = document.querySelector('#inputName').value;
    const login = document.querySelector('#inputLogin').value;
    const pass = document.querySelector('#inputPassword').value;
    const PassСon = document.querySelector('#PassСon').value;
    const DataReg = new Date(Date.now());
    const object = {name, login, pass, PassСon, DataReg}
    if (pass === '' || login === '' || PassСon === '' || name === '') {
        error.innerHTML = '* заполните пожалуйста все поля';
        error.classList.remove('hide');
    } else if (pass.length < 8) {
        error.innerHTML = '* пароль должен состоять минимум из 8 символов';
        error.classList.remove('hide');
    } else if (pass !== PassСon) {
        error.innerHTML = '* пароли не совпадают';
        error.classList.remove('hide');
    } else {
        fetch('http://localhost:3000/reg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        }).then(data => data.json())
            .then(data => {
                if (data.message === 'successful') {
                    row.classList.add('hide');
                    resSec.classList.remove('hide');
                } else if (data.message === 'this login is busy') {
                    error.innerHTML = '* данный логин уже занят';
                    error.classList.remove('hide');
                }
                ;
            });
    }

});




