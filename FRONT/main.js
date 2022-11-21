const input = document.getElementById('target')

function train() {

    fetch('http://127.0.0.1:8000/train', {
        method: 'POST',
        mode: "cors",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ number: input.value, data: grid.export() }),
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(e => console.error(e));
}

function recognize() {
    fetch('http://127.0.0.1:8000/recognize', {
        method: 'POST',
        mode: "cors",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ number: input.value, data: grid.export() }),
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').value = data.result
            console.log(data.result)
        })

        .catch(e => console.error(e));
}

function precision() {
    fetch('http://127.0.0.1:8000/precision', {
        method: 'GET',
        mode: "cors",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    })
        .then(response => response.json())
        .then(answer => {
            const table = document.getElementById('stats');
           table.innerHTML=
           `<tr>
            <th>Number</th>
            <th>recognition rate</th>
            </tr>`

            for (let i = 0; i < answer.precision.length; i++) {

                // Create an empty <tr> element and add it to the last position of the table:
                let row = table.insertRow();

                // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
                let c0 = row.insertCell(0);
                let c1 = row.insertCell(1);

                // Add some text to the new cells:
                c0.innerHTML = i;
                c1.innerHTML = answer.precision[i]+"%";

            }
            let row = table.insertRow();
            let c0 = row.insertCell(0);
            let c1 = row.insertCell(1);

            // Add some text to the new cells:
            c0.innerHTML = "total";
            c1.innerHTML = Math.round(answer.total)+"%";
        })

        .catch(e => console.error(e));
}


function random() {
    fetch('http://127.0.0.1:8000/random', {
        method: 'GET',
        mode: "cors",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    })
        .then(response => response.json())
        .then(answer => {
            console.log(answer.number)
            grid.import(answer.data)
        })

        .catch(e => console.error(e));
}


function addToTest() {

    fetch('http://127.0.0.1:8000/test', {
        method: 'POST',
        mode: "cors",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ number: input.value, data: grid.export() }),
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(e => console.error(e));
}

function addToTrain() {

    fetch('http://127.0.0.1:8000/addtrain', {
        method: 'POST',
        mode: "cors",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ number: input.value, data: grid.export() }),
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(e => console.error(e));
}

function next() {
    fetch('http://127.0.0.1:8000/next', {
        method: 'GET',
        mode: "cors",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
    })
        .then(response => response.json())
        .then(answer => {
            if(answer.index<0){
                alert("finito")
                return
            }
            console.log(answer.index)
            grid.import(answer.data)
        })

        .catch(e => console.error(e));
}
