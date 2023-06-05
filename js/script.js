'use strict';

void function() {
    const form = document.querySelector('#todoForm');
    const inputs = Array.from(form.querySelectorAll('textarea, input:not([type=reset])'));
    const dataKey = 'todoListKey';
    const todoItemsBox = document.querySelector('#todoItems');
     let currentId = 1;
     const dataID = 'data-id';

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const data = {};
        inputs.forEach(({name, value}) => {
            data[name] = value;
        });

        const saveData = saveToDoItems(data);

        reflectionToDoItem(createToDoItems(saveData));
        event.target.reset();
    })
    const createToDoItems = ({title, description, id}) => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('col-4');
        wrapper.setAttribute(dataID, id);
        wrapper.innerHTML =
                            `<div class="taskWrapper">
                                <div class="taskHeading">${ title }</div>
                                <div class="taskDescription">${ description }</div>
                                <button class="mt-3 remove-todo btn btn-danger btn-sm">
                                    <i class="bi bi-x-circle"></i>
                                        <span>Delete</span>
                                </button>
                            </div>`
        return wrapper;
    }
    const reflectionToDoItem = (dom) => {
        if(!(dom instanceof HTMLElement)) return
        todoItemsBox.prepend(dom);
    }
    const removeTodoItemFromDOM = ({ id }) => {
        todoItemsBox.querySelector(`[${dataID}='${id}']`).remove()
    }
    const getToDoItems = () => {
        const checkData = JSON.parse(localStorage.getItem(dataKey));
        console.log(checkData);
        if(!checkData) {
            return [];
        } else {
            return checkData;
        }
    }
    const saveToDoItems = (dataSave) => {
        const checkData = getToDoItems();
        const dataClone = {...dataSave, id: currentId}
        checkData.push(dataClone);
        localStorage.setItem(dataKey, JSON.stringify(checkData));
        currentId +=1;
        return getToDoItems().at(-1);

    }
    const removeItemId = (id) => {
        const checkData = getToDoItems();
        const index = checkData.findIndex(item => item.id === id);
        const removeItem = checkData.splice(index, 1);
        localStorage.setItem(dataKey, JSON.stringify(checkData));
        return removeItem[0];
    }

    todoItemsBox.addEventListener('click',(event) => {
        event.stopPropagation();

        if(!event.target.classList.contains('remove-todo')) return;
        const todoItemID = Number(event.target.closest(`[${dataID}]`).getAttribute(dataID));
        const removedEl = removeItemId(todoItemID);
        removeTodoItemFromDOM(removedEl);
    })

    const loadedHandler = () => {
        const data = getToDoItems()
        if(!data.length) return;
        currentId = Number(data.at(-1).id) + 1;
        data.forEach(item => {
            const template = createToDoItems(item);
            reflectionToDoItem(template);
        })
    document.removeEventListener('DOMContentLoaded', loadedHandler)
    }
    document.addEventListener('DOMContentLoaded', loadedHandler)

}()


