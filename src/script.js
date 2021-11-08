function initProject() {
    const button = document.getElementsByClassName('button')[0];
    button.addEventListener('mouseover',newToDo);
    button.addEventListener('mouseleave',newToDo);
    button.addEventListener('mousedown',newToDo);
    button.addEventListener('mouseup',newToDo);
    const inputLine = document.querySelector('input');
    const sortButton = document.getElementsByClassName('sort')[0];
    sortButton.addEventListener('click',sortTask);
    getStorage();
}

let i = 0;
let taskNumbr = [];

function newToDo (event) {
    const taskList = document.getElementsByClassName('tasks')[0];
    const inputLine = document.querySelector('input');
    switch (event.type) {
        case 'mouseover':
            event.currentTarget.style.background = '#AA68FE';
            break;
        case 'mouseup' :
            // Создание нового задания
            const task = document.createElement('div');
            task.id = i;
            task.draggable = true;
            task.addEventListener('dragstart',eventHandler);
            task.addEventListener('dragend',eventHandler);
            task.addEventListener('dragenter',eventHandler);
            task.classList.add('task');
            taskList.append(task);
            const taskName = document.createElement('input');
            taskName.addEventListener('change',onChange);
            taskName.value = inputLine.value;
            let obj = {                     //Создание объекта и пуш в массив
                taskText: taskName,
                div: task
            }
            taskNumbr.push(obj);
            task.append(taskName);
            storageForm(taskNumbr);
            inputLine.value = "";
            // Создание кнопки удаления
            const deleteButton = document.createElement('div');
            deleteButton.classList.add('deleteButton');
            deleteButton.addEventListener('click',removeTask);
            task.append(deleteButton);
            break;
            case 'mouseleave' :
            event.currentTarget.style.background = "#9953F1";
            break;
    }
}

function removeTask (event) {
    switch (event.type) {
        case 'click':
            event.currentTarget.parentElement.remove()
            taskNumbr.forEach((element, index) => {
                if (element.div == event.currentTarget.parentElement) {
                    taskNumbr.splice(index, 1)
                }
            });
            storageForm(taskNumbr);
            break;
    }
}
function sortTask (event) {
    if (event.currentTarget.classList.contains('sort')){
        taskNumbr.sort((a, b) => {
            if (isNaN(a.taskText.value)||isNaN(b.taskText.value)){
                return a.taskText.value > b.taskText.value ? 1 : -1
            } else {
                return +a.taskText.value > +b.taskText.value ? 1 : -1
            }
        });
        event.currentTarget.classList.remove('sort')
        event.currentTarget.classList.add('sortUp')
    } else if (event.currentTarget.classList.contains('sortUp')){
        taskNumbr.sort((a, b) => {
            if (isNaN(a.taskText.value)||isNaN(b.taskText.value)){
                return a.taskText.value < b.taskText.value ? 1 : -1
            } else {
                return +a.taskText.value < +b.taskText.value ? 1 : -1
            }
        });
        event.currentTarget.classList.remove('sortUp')
        event.currentTarget.classList.add('sort')
    }
    storageForm(taskNumbr);

    let list = document.getElementsByClassName('tasks')[0];
    taskNumbr.forEach(element => {
        list.append(element.div);
    });
}

function onChange(event){
    storageForm(taskNumbr)
}

let activeCard = null;
function eventHandler(event) {
    const sortButton = document.querySelector('#sbtn');
    if (sortButton.classList.contains('sortUp') == true) {
        sortButton.classList.remove('sortUp')
        sortButton.classList.add('sort')    
    }
    switch (event.type) {
        case 'dragstart':
            activeCard = event.currentTarget;
            event.target.classList.add('select');
            const dropZone = document.createElement('div');
            dropZone.classList.add('dropLine');
            break;
        case 'dragend':
            event.target.classList.remove('select');
            const arr = [...activeCard.parentElement.children];
            const newArr = []
            for (i = 1; i < arr.length; i++) {
                newArr.push(arr[i].firstChild.value);
            }
            localStorage.setItem('array', JSON.stringify(newArr))
            break;
        case 'dragenter':
            if (event.currentTarget.classList.contains('task')) {
                changeCards(activeCard, event.currentTarget);
            }
            break;
    }
}

function changeCards(active, enter,line) {
    const arr = [...active.parentElement.children]; //Создание массива элементов которые мы двигаем
    const activeIndex = arr.indexOf(active); //Узнаем индекс активного элемента
    const otherIndex = arr.indexOf(enter); //Узнаем индекс элементов в которые мы входим
    const cont = active.parentElement; //Контейнер с элементами
    if(activeIndex < otherIndex) { //Сравнение индексов и перемещение в контейнере в зависимости от результата
        cont.insertBefore(enter, active); 
        cont.insertBefore(line, active); 
    } else if (activeIndex > otherIndex) {
        cont.insertBefore(active, enter);
    }
}

function storageForm(arr) {
    let newArr = [];
    arr.forEach(element => {
        newArr.push(element.taskText.value);
    });
    localStorage.setItem('array', JSON.stringify(newArr))
}

function getStorage() {
    const taskList = document.getElementsByClassName('tasks')[0];
    const arr = JSON.parse(localStorage.getItem('array'));
    arr.forEach((element, index) => {
        const task = document.createElement('div');
            task.draggable = true;
            task.addEventListener('dragstart',eventHandler);
            task.addEventListener('dragend',eventHandler);
            task.addEventListener('dragenter',eventHandler);
            task.addEventListener('dragover',eventHandler);
            task.classList.add('task');
            taskList.append(task);
            const taskName = document.createElement('input');
            taskName.addEventListener('change',onChange);
            taskName.value = element;
            let obj = {                     //Создание объекта и пуш в массив
                taskText: taskName,
                div: task
            }
            taskNumbr.push(obj);
            task.append(taskName);
            // Создание кнопки удаления
            const deleteButton = document.createElement('div');
            deleteButton.classList.add('deleteButton');
            deleteButton.addEventListener('click',removeTask);
            task.append(deleteButton);
    });
}

window.addEventListener('load', initProject)