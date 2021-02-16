const points = document.querySelector('.points span'); // получаем данные из points
const getTime = document.querySelector('.time span'); // получаем кол. сек.
let countPoints = 0; // переменная которая будет счетчиком pints
let leftTime = 0; // переменная которая будет счетчиком time
const modal = document.querySelector('.modal'); // получаем модальное окно
let localObj = []; // пустой объект куда будет передаваться данные для local storage
const header = document.querySelector('.header h1');
const admin = document.querySelector('#admin');
let username;


fetch('http://localhost:3000/getUserName', {
    method: 'POST'
}).then(data => data.json())
    .then(data => {
        if (data.message.role === 'admin') admin.classList.add('btn');
        header.innerHTML = `Добро пожаловать ${data.message.name} !`;
        username = data.message.name;
    });


// функция которая возвращат случайное число в заданом диапазоне
const getRandomNum = (a, b,) => {
    let rand = a + Math.random() * (b + 1 - a);
    return Math.floor(rand);
}
// присваиваемый каждому кубику случайный цвет
const setRandomColor = () => {
    countPoints = 0;
    points.innerHTML = countPoints;
    leftTime = 0;
    getTime.innerHTML = leftTime;
    let col = document.querySelectorAll('.random');
    for (let item of col) {
        item.style.background = `rgb(${getRandomNum(0, 255)} ${getRandomNum(0, 255)} ${getRandomNum(0, 255)})`;
    }
}
setRandomColor(); // сразу же вызываем функцию

// добавляем событие клик для кубиков которое удаляет кубик и добавляет очки

const row = document.querySelector('.row');
row.addEventListener('click', closeCube);

function closeCube(e) {
    if (e.target.className !== 'col-md-2 blackWhite' && e.target.className !== 'row' && e.target.getAttribute('data') < 3 && start.classList[1] === 'hide') {
        e.target.classList.add('hide');
        countPoints = countPoints + +e.target.getAttribute('data');
        points.innerHTML = countPoints;
        for (let i = 0; i < getRandomNum(0, 3); i++) {
            createElem()
        }
    } else if (start.classList[1] !== 'hide' && logIn.classList[1] !== 'hide') {
        alert('Для начала/продолжения игры нажмите кнопку "Старт"')
    }
}

// добавляем событие даблклик для больших кубиков которое удаляет кубик и добавляет очки

row.addEventListener('dblclick', closeBigCube);

function closeBigCube(e) {
    if (e.target.className !== 'col-md-2 blackWhite' && e.target.className !== 'row' && e.target.getAttribute('data') >= 3 && start.classList[1] === 'hide') {
        e.target.classList.add('hide');
        countPoints = countPoints + +e.target.getAttribute('data');
        points.innerHTML = countPoints;
        for (let i = 0; i < getRandomNum(0, 3); i++) {
            createElem()
        }
    } else if (start.classList[1] !== 'hide' && logIn.classList[1] !== 'hide') {
        alert('Для начала/продолжения игры нажмите кнопку "Старт"')
    }
}

// создаем случайное количество новых элементов

const createElem = () => {
    const elem = document.createElement('div');
    const md = getRandomNum(1, 3);
    elem.className = `col-md-${md}`;
    elem.classList.add('random');
    elem.setAttribute('data', md)
    elem.style.background = `rgb(${md} ${getRandomNum(0, 255)} ${getRandomNum(0, 255)})`;
    row.prepend(elem)
}

// функция timer добавляет +1 к leftTime

let interVal; // объявляем переменную для хранения в ней setInterval
const timer = () => {
    getTime.innerHTML = leftTime++;
    if (leftTime === 60) {
        showModal();
    }
}

// показываем модальное окно

const showModal = () => {
    document.querySelector('.result p').innerHTML = countPoints;
    modal.style.display = 'flex';
    clearInterval(interVal);
}

// программируем кнопки "старт" и "пауза"

const pause = document.querySelector('.pause');
const start = document.querySelector('.start');

const changePauseOnStart = () => {
    pause.classList.remove('btn');
    pause.classList.add('hide');
    start.classList.remove('hide');
    start.classList.add('btn');
}

start.addEventListener('click', () => {
    if (leftTime === 0) {
        leftTime++
        getTime.innerHTML = leftTime++
    }
    interVal = setInterval(timer, 1000); // запускаем setInterval для с интервалом 1 сек, счетчика секунл
    start.classList.remove('btn');
    start.classList.add('hide');
    pause.classList.remove('hide');
    pause.classList.add('btn');

})

pause.addEventListener('click', () => {
    clearInterval(interVal); // останавливаем setInterval
    changePauseOnStart();
})

// программируем кнопку "новая игра"

document.querySelector('.newGame').addEventListener('click', () => {
    clearInterval(interVal);
    setRandomColor();
    changePauseOnStart();
});

// программируем клавиши модального окна "Сохранить и "Отмена"

document.querySelector('.resCnc').addEventListener('click', () => {
    clearInterval(interVal);
    setRandomColor();
    changePauseOnStart();
    modal.style.display = 'none'
});

//функция которая отправляет данные на сервер

const setToBackEnd = () => {

    let b = {
        name: username,
        result: countPoints
    }
    localObj.push(b);
    fetch('http://localhost:3000/form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(localObj)
    })
    modal.style.display = 'none';
    localObj = [];
}

// функция получает данные с input и сетит их на сервер

document.querySelector('.resSave').addEventListener('click', () => {
    setToBackEnd();
    setRandomColor();
    changePauseOnStart();
    setTimeout(checkResult, 500);
})

// сохраняем данные на сервер

const tableResult = document.querySelector('.table-result p');
const clearBtn = document.querySelector('.clearBtn');

// функция которая проверяет данные на сервере и отрисовует таблицы поля с результатами

const checkResult = () => {
    fetch('http://localhost:3000/result')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.length === 0) {
                tableResult.innerHTML = 'Здесь пока нет записей'
            } else {
                let out = '';
                document.querySelector('.table-result').style.display = 'block';
                for (let item in data) {
                    out += `<p>Место: ${+item + 1}, Имя: ${data[item].name}, Результат: ${data[item].result}</p>`;
                }
                tableResult.innerHTML = out;
            }

        });
}


// кнопка очистки таблицы с результатами

clearBtn.addEventListener('click', () => {
    fetch('http://localhost:3000/clean', {
        method: 'POST'
    })
        .then((data) => {
            tableResult.innerHTML = 'Здесь пока нет записей'
            document.querySelector('.table-result').style.display = 'flex';
            clearBtn.style.display = 'none';
            checkResult();
        });
})
checkResult();

// логика для кнопки выхода

const logout = document.querySelector('.logout').addEventListener('click', () => {
    fetch('http://localhost:3000/logout', {
        method: 'POST'
    }).then(data => data)
        .then(data => {
            if (data.status === 200) {
                location.reload();
            }
        })
});

