const uri = '/api/TodoItems';
const curi = '/api/ItemCategories';
let todos = [];

function getItems() {
    fetch(uri)
    .then(response => response.json())
    .then(data => {
        _displayItems(data);
    })
    .catch(error => console.error('Unable to get items.', error));
}

function getCategories() {
    fetch(curi)
        .then(response => response.json())
        .then(data => _displayCategories(data))
        .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
    const addNameTextbox = document.getElementById('add-name');
    const addCategoryTextbox = document.getElementById('add-category');

    const item = {
        isComplete: false,
        name: addNameTextbox.value.trim(),
        categoryId: addCategoryTextbox.value.trim()
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}

function addCategory() {
    const addTitleTextbox = document.getElementById('add-title');

    const category = {
        title: addTitleTextbox.value.trim(),
    };

    fetch(curi, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    })
        .then(response => response.json())
        .then(() => {
            getCategories();
            addTitleTextbox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}

function updateCategory() {
    const categoryId = document.getElementById('edit-category').value.trim();
    const category = {
        id: categoryId,
        title: document.getElementById('edit-title').value.trim()
    };

    fetch(curi + '/' + categoryId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    })
        .then(() =>
        {
            getItems();
            getCategories();
            document.getElementById('edit-title').value = '';
        })
        .catch(error => console.error('Unable to update item.', error));
}

function deleteCategory() {
    const categoryId = document.getElementById('edit-category').value.trim();

    fetch(curi + '/' + categoryId, {
        method: 'DELETE',
    })
        .then(() =>
        {
            getItems();
            getCategories();
        })
        .catch(error => console.error('Unable to update item.', error));
}

function deleteItem(id){
    fetch(uri + '/' + id, {
    method: 'DELETE',
    })
    .then(() => {
        console.log(`Item with id "${id}" deleted successfully.`);
        // Optionally, refresh the category list
        getItems();
    })
    .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
    const item = todos.find(item => item.id === id);

    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isComplete').checked = item.isComplete;
    document.getElementById('editForm').style.display = 'block';
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId, 10),
        isComplete: document.getElementById('edit-isComplete').checked,
        name: document.getElementById('edit-name').value.trim(),
        categoryId: document.getElementById('edit-item-category').value.trim()
    };

    fetch(uri + '/' + itemId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'to-do' : 'to-dos';

    // TODO
}

function _displayCategories(data) {
    const addCategoryTextbox = document.getElementById('add-category');
    const editCategoryTextbox = document.getElementById('edit-category');
    const editItemCategoryTextbox = document.getElementById('edit-item-category');
    addCategoryTextbox.innerHTML = '';
    editCategoryTextbox.innerHTML = '';
    editItemCategoryTextbox.innerHTML = '';
    data.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id; // Assuming category has an id
        option.textContent = category.title; // Assuming category has a name
        addCategoryTextbox.appendChild(option);
    });
    data.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id; // Assuming category has an id
        option.textContent = category.title; // Assuming category has a name
        editCategoryTextbox.appendChild(option);
    });
    data.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id; // Assuming category has an id
        option.textContent = category.title; // Assuming category has a name
        editItemCategoryTextbox.appendChild(option);
    });

}

function _displayItems(data) {
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';

    const button = document.createElement('button');

    // Fetch all categories first and map them by their IDs
    fetch(curi) // Adjust the API endpoint as necessary
        .then(response => response.json())
        .then(categories => {
            const categoryMap = {};
            categories.forEach(category => {
                categoryMap[category.id] = category.title; // Map category ID to title
            });

            // Now populate the table with items
            data.forEach(item => {
                let isCompleteCheckbox = document.createElement('input');
                isCompleteCheckbox.type = 'checkbox';
                isCompleteCheckbox.disabled = true;
                isCompleteCheckbox.checked = item.isComplete;

                let editButton = button.cloneNode(false);
                editButton.innerText = 'Edit';
                editButton.setAttribute('onclick', 'displayEditForm(' + item.id + ')');

                let deleteButton = button.cloneNode(false);
                deleteButton.innerText = 'Delete';
                deleteButton.setAttribute('onclick', 'deleteItem(' + item.id + ')');

                let tr = tBody.insertRow();

                let td1 = tr.insertCell(0);
                td1.appendChild(isCompleteCheckbox);

                let td2 = tr.insertCell(1);
                let textNode = document.createTextNode(item.name);
                td2.appendChild(textNode);

                let td3 = tr.insertCell(2);
                let categoryNode = document.createTextNode(categoryMap[item.categoryId] || 'Unknown');
                td3.appendChild(categoryNode);

                let td4 = tr.insertCell(3);
                td4.appendChild(editButton);

                let td5 = tr.insertCell(4);
                td5.appendChild(deleteButton);
            });

            todos = data; // Update the global `todos` variable
        })
        .catch(error => console.error('Unable to get categories.', error));
}
