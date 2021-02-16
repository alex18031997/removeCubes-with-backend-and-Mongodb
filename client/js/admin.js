const forSort = document.querySelector('#forSort');
const out = document.querySelector('.tr');
const findUser = document.querySelector('#findUser');
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
let from = 0;
let to = 3;
const pageState = document.querySelector('#pageState');
let pageCount = 1;
pageState.textContent = pageCount;


fetch('http://localhost:3000/admin', {
    method: 'POST'
});

const renderTable = (data) => {
    for (let key in data.message) {
        out.innerHTML += `<tr id="b${key}">`
        let th = document.querySelector(`#b${key}`);
        for (let k in data.message[key]) {
            delete data.message[key].salt;
            delete data.message[key].hashedPassword;
            delete data.message[key].__v;
            th.innerHTML += `<th class="${data.message[key][k]}"> ${data.message[key][k]}</th>`
        }
        out.innerHTML += `</tr>`
    }
}

const getUsers = () => {
    const sorter = {name: 1};
    fetch('http://localhost:3000/adminpanel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sorter)
    }).then(data => data.json())
        .then(data => {
            renderTable(data);
        })
}
getUsers();

let count = -2;
forSort.addEventListener('click', (e) => {
    const sorter = e.target.getAttribute('data');
    count++;
    if (count === 1) count = -1;
    let localObj = {[sorter]: count};
    fetch('http://localhost:3000/adminpanel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(localObj)
    }).then(data => data.json())
        .then(data => {
            out.innerHTML = '';
            renderTable(data);
        });
});

findUser.addEventListener('click', () => {
    const findInput = document.querySelector('#findInput').value;
    let localObj = {findValue: findInput};
    fetch('http://localhost:3000/findUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(localObj)
    }).then(data => data.json())
        .then(data => {
            out.innerHTML = '';
            renderTable(data);
        });
});

next.addEventListener('click', () => {
    pageCount++;
    const pageState = document.querySelector('#pageState');
    pageState.textContent = pageCount;
    from = from + 3;
    to = to + 3;
    let localObj = {
        from: from,
        to: to
    };
    fetch('http://localhost:3000/navPages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(localObj)
    }).then(data => data.json())
        .then(data => {
            out.innerHTML = '';
            renderTable(data);
            if (data.value === 'enough') {
                pageState.textContent = 1;
                from = 0;
                to = 3;
                pageCount = 1;

            }
            ;
        });
});

previous.addEventListener('click', () => {
    pageCount--;
    const pageState = document.querySelector('#pageState');
    pageState.textContent = pageCount;
    from = from - 3;
    to = to - 3;
    let localObj = {
        from: from,
        to: to
    };
    fetch('http://localhost:3000/navPages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(localObj)
    }).then(data => data.json())
        .then(data => {
            out.innerHTML = '';
            renderTable(data);
            if (data.value === 'enough') {
                pageState.textContent = 1;
                from = 0;
                to = 3;
                pageCount = 1;
            }
            ;
        });
});





