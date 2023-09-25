$(async function () {
    await getTableWithUsers();
    getNewUserTab();
    getDefaultModal();
})


const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAllUsers: async () => await fetch('api/admin/users'),
    findOneUser: async (id) => await fetch(`api/admin/users/${id}`),
    addNewUser: async (user) => await fetch('api/admin/users', {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`api/admin/users/`, {
        method: 'PUT',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) =>
        await fetch(`api/admin/users/${id}`, {method: 'DELETE', headers: userFetchService.head})
}

async function getTableWithUsers() {
    let table = $('#tableWithAllUsers tbody');
    table.empty();

    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.surname}</td>     
                            <td>${user.age}</td>     
                            <td>${user.login}</td>     
                            <td>${user.rolesString}</td>     
                            <td> 
                                <button type="button" class="btn btn-info" data-action="edit"
                                data-userid="${user.id}" data-bs-target="#someDefaultModal">
                                Edit
                                </button>
                            </td>
                                        
                            <td>
                                <button type="button" class="btn btn-danger" data-action="delete" 
                                data-userid="${user.id}" data-toggle="modal" data-target="#someDefaultModal">
                                Delete
                                </button> 
                            </td>
                       </tr>
                )`;
                table.append(tableFilling);
            })
        })

    $("#tableWithAllUsers").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');
        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}


async function getNewUserTab() {
    let tabContent = $('#profile')
    $('#profile-tab').on('show.bs.tab', async () => {
        let tabFilling = `<div class="border p-2 bg-light"><h5>Add new User</h5></div>
                            <div class="col border p-3 bg-white text-center">
                                <div class="col-4 mx-auto">
                                        <label for="firstName" class="form-label">First name</label>
                                        <input type="text" class="form-control form-control-sm" id="firstName">

                                        <label for="lastName" class="form-label">Last name</label>
                                        <input type="text" class="form-control form-control-sm" id="lastName">

                                        <label for="age" class="form-label">Age</label>
                                        <input type="number" class="form-control form-control-sm" id="age">

                                        <label for="login" class="form-label">Login</label>
                                        <input type="text" class="form-control form-control-sm" id="login">

                                        <label for="password" class="form-label">Password</label>
                                        <input type="password" class="form-control form-control-sm" id="password">

                                        <label for="Role" class="form-label">Role</label>
                                        <select class="form-select form-control-sm" size="2" id="Role" 
                                        multiple aria-label="Role">
                                            <option value="ROLE_ADMIN">Admin</option>
                                            <option value="ROLE_USER">User</option>
                                        </select>
                                        <div class="col py-2">
                                            <button type="submit" class="btn btn-success" id="addNewUserButton"
                                            onclick="addNewUser()">Add new user</button>
                                        </div>
                                </div>
                            </div>`
        tabContent.append(tabFilling)
    }).on('hidden.bs.tab', async () => {
        tabContent.empty()
    })
}

async function addNewUser() {
    let tabProfile = $('#profile')
    let name = tabProfile.find('#firstName').val().trim()
    let surname = tabProfile.find('#lastName').val().trim()
    let age = tabProfile.find('#age').val().trim()
    let login = tabProfile.find('#login').val().trim()
    let password = tabProfile.find('#password').val()
    let role = tabProfile.find('#Role').val()[0]

    let data = {
        login: login,
        password: password,
        name: name,
        surname: surname,
        age: age,
        profession: role
    }
    const response = await userFetchService.addNewUser(data);

    if (response.ok) {
        getTableWithUsers();
        const triggerEl = document.querySelector('#myTab button[data-bs-target="#home"]')
        bootstrap.Tab.getInstance(triggerEl).show()
    }
}

async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        // backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        // console.log(thisModal,userid)
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function editUser(modal, id) {
    let preUser = await userFetchService.findOneUser(id);
    let user = preUser.json();

    modal.find('.modal-title').html('Edit user');

    let editButton = `<button  class="btn btn-primary" id="editButton">Edit</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(editButton);

    user.then(user => {
        let bodyForm = `
            <div class="modal-body">
                <div class="col-6 mx-auto text-center">
                    <form class="form-group" id="editUser">
                    
                        <label class="form-label">ID</label>
                        <input type="text" class="form-control" id="id" name="id" value="${user.id}" disabled readonly>
                        
                        
                        <label class="form-label">First name</label>
                        <input class="form-control" type="text" id="name" value="${user.name}">
                        
                        <label class="form-label">Last name</label>
                        <input class="form-control" type="text" id="surname" value="${user.surname}">
                        
                        <label class="form-label">Age</label>
                        <input class="form-control" type="number" id="age" value="${user.age}">
                        
                        <label class="form-label">Login</label>
                        <input class="form-control" type="text" id="login" value="${user.login}">
                        
                        <label class="form-label">Password</label>
                        <input class="form-control" type="password" id="password">  
                        
                        <label class="form-label">Role</label>
                        <select class="form-select form-control-sm" size="2" multiple aria-label="Role" id="profession">
                            <option value="ROLE_ADMIN">Admin</option>
                            <option value="ROLE_USER">User</option>
                        </select>
                        
                    </form>
                </div>
            </div>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $('#editButton').on('click', async () => {
        let id = modal.find("#id").val().trim();
        let name = modal.find("#name").val().trim();
        let surname = modal.find("#surname").val().trim();
        let age = modal.find("#age").val().trim();
        let login = modal.find("#login").val().trim();
        let password = modal.find("#password").val().trim();
        let profession = modal.find("#profession").val()[0]
        let data = {
            id: id,
            login: login,
            password: password,
            name: name,
            surname: surname,
            age: age,
            profession: profession
        }
        const response = await userFetchService.updateUser(data, id);

        if (response.ok) {
            getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}

async function deleteUser(modal, id) {
    let preUser = await userFetchService.findOneUser(id);
    let user = preUser.json();

    modal.find('.modal-title').html('Delete user');

    let deleteButton = `<button  class="btn btn-danger" id="deleteButton">Delete</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(deleteButton);

    user.then(user => {
        let bodyForm = `
            <div class="modal-body">
                <div class="col-6 mx-auto text-center">
                    <form class="form-group" id="deletUser">
                    
                        <label class="form-label">ID</label>
                        <input type="text" class="form-control" id="id" name="id" value="${user.id}" disabled readonly>
                        
                        
                        <label class="form-label">First name</label>
                        <input class="form-control" type="text" id="name" value="${user.name}" disabled readonly>
                        
                        <label class="form-label">Last name</label>
                        <input class="form-control" type="text" id="surname" value="${user.surname}" disabled readonly>
                        
                        <label class="form-label">Age</label>
                        <input class="form-control" type="number" id="age" value="${user.age}" disabled readonly>
                        
                        <label class="form-label">Login</label>
                        <input class="form-control" type="text" id="login" value="${user.login}" disabled readonly>
                        
                        <label class="form-label">Role</label>
                        <select class="form-select form-control-sm" size="2" multiple aria-label="Role" 
                        id="profession" disabled readonly>
                            <option value="ROLE_ADMIN">Admin</option>
                            <option value="ROLE_USER">User</option>
                        </select>
                        
                    </form>
                </div>
            </div>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $('#deleteButton').on('click', async () => {
        const response = await userFetchService.deleteUser(id);

        if (response.ok) {
            getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}