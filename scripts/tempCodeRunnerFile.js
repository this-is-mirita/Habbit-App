'use strict'

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY'

/* page*/
const page = {
    menu: document.querySelector('.menu__list'),
}
// untils 
function loadData(){
    const habbitsStrings = localStorage.getItem(HABBIT_KEY)
    //Преобразование полученной строки данных через JSON.parse.
    const habbitArray = JSON.parse(habbitsStrings)

    //isArray проверяет является ли массив и вернет true или false
    //Проверка, что данные представляют собой массив.
    if(Array.isArray(habbitArray)){
        //Обновление глобального состояния habits
        habbits = habbitArray
    }
}
//сохранение данных в localStorage
function saveData(){
    //Преобразование данных habits в строку через JSON.stringify и сохранение.
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits))
}
/* render */
function rerenderMenu(activeHabbit){
    if(!activeHabbit){
        return;
    }
    for(const habbit of habbits){
        const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`)
        if(!existed){
            // создание
            const element = document.createElement('button')
            element.setAttribute('menu-habbit=id', habbit.id)
            element.classList.add('menu__item')
            element.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}" />`
            if(activeHabbit.id === habbit.id) {
                existed.classList.add('menu__item_active')
            }
            page.menu.appendChild(element)
            continue;
        }
        if(activeHabbit.id === habbit.id) {
            existed.classList.add('menu__item_active')
        }else{
            existed.classList.remove('menu__item_active')
        }
    }
}

function rerender(activeHabbitId){
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    rerenderMenu(activeHabbit)
}

// СамоВызывающаяся Функция
//Вызов функции loadData для загрузки и отображения данных при старте приложения.

/* init */
(() => {
    loadData()
})()