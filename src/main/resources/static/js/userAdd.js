FulfillUserTable()
async function FulfillUserTable() {
    let table = $('#userTable tbody');
    let currentId = table.text().trim()
    table.empty()

    fetch(`api/user/users/${currentId}`)
        .then(user => user.json())
        .then(user => {
            let tableFilling = `$(
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.surname}</td>
                    <td>${user.age}</td>
                    <td>${user.login}</td>
                    <td>${user.rolesString}</td>
                </tr>
            )`;
            table.append(tableFilling)
        })
}