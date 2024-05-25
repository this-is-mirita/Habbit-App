'use strict'

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';
let globalActiveHabbitId;
/* page*/
const page = {
	menu: document.querySelector('.menu__list'),
	header: {
		h1: document.querySelector('.h1'),
		progressPercent: document.querySelector('.progress__percent'),
		progressCoverBar: document.querySelector('.progress__cover-bar'),
	},
	content: {
		daysContainer: document.getElementById('days'),
		nextDay: document.querySelector('.habbit__day')
	},
	popup: {
		index: document.getElementById('add-habbit-popup'),
		iconField: document.querySelector('.popup__form input[name="icon"]')
	}
}
// console.log(page.menu);
// untils 
function loadData() {
	const habbitsStrings = localStorage.getItem(HABBIT_KEY);
	//Преобразование полученной строки данных через JSON.parse.
	const habbitArray = JSON.parse(habbitsStrings);

	//isArray проверяет является ли массив и вернет true или false
	//Проверка, что данные представляют собой массив.
	if (Array.isArray(habbitArray)) {
		//Обновление глобального состояния habits
		habbits = habbitArray;
	}
}
//сохранение данных в localStorage
function saveData() {
	//Преобразование данных habits в строку через JSON.stringify и сохранение.
	localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}
/* render side menu */
function rerenderMenu(activeHabbit) {
	for (const habbit of habbits) {
		//console.log(habbit.id, habbit.name, habbit.icon); 
		const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
		//console.log(page.menu);
		//console.log(existed);
		if (!existed) {
			// Процесс создания новых элементов из JavaScript, 
			// включая добавление атрибутов и классов через
			// document.createElement и setAttribute.
			const element = document.createElement('button');
			element.setAttribute('menu-habbit-id', habbit.id);
			element.classList.add('menu__item');
			element.addEventListener('click', () => rerender(habbit.id));
			element.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}" />`;
			if (activeHabbit.id === habbit.id) {
				element.classList.add('menu__item_active');
			}
			page.menu.appendChild(element);
			continue;
		}
		if (activeHabbit.id === habbit.id) {
			existed.classList.add('menu__item_active');
		} else {
			existed.classList.remove('menu__item_active');
		}

	}
}

function resetForm(form, fields) {
	for (const field of fields) {
		form[field].value = '';
	}
}

function validateAndGetFormData(form, fields) {
	const formData = new FormData(form);
	const res = {};
	for (const field of fields) {
		const fieldValue = formData.get(field);
		form[field].classList.remove('error');
		if (!fieldValue) {
			form[field].classList.add('error');
		}
		res[field] = fieldValue;
	}
	let isValid = true;
	for (const field of fields) {
		if (!res[field]) {
			isValid = false;
		}
	}
	if (!isValid) {
		return;
	}
	return res;
}


// жендер шапки h1 и progress cover bar
function rerenderHead(activeHabbit) {
	//console.log(activeHabbit);
	//console.log(activeHabbit);
	// рендер h1 в зависимости от нажотого меню
	page.header.h1.innerText = activeHabbit.name;
	const progress = activeHabbit.days.length / activeHabbit.target > 1
		? 100
		: activeHabbit.days.length / activeHabbit.target * 100;
	page.header.progressPercent.innerText = progress.toFixed(0) + '%';
	// toFixed(0) округление до целого 13.3333 = 14 
	page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`);
}
function rerenderContent(activeHabbit) {
	page.content.daysContainer.innerHTML = '';
	for (const index in activeHabbit.days) {
		const element = document.createElement('div');
		element.classList.add('habbit');
		element.innerHTML = `<div class="habbit__day">День ${Number(index) + 1}</div>
              <div class="habbit__comment">${activeHabbit.days[index].comment}</div>
              <button class="habbit__delete" onclick="deleteDay(${index})">
                <img src="./images/delete.svg" alt="Удалить день ${index + 1}" />
              </button>`;
		page.content.daysContainer.appendChild(element);
	}
	page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
}
// days work добавление дней на формах
/* work with days */
function addDays(event) {
	event.preventDefault();
	const data = validateAndGetFormData(event.target, ['comment']);
	if (!data) {
		return;
	}
	habbits = habbits.map(habbit => {
		if (habbit.id === globalActiveHabbitId) {
			return {
				...habbit,
				days: habbit.days.concat([{ comment: data.comment }])
			}
		}
		return habbit;
	});
	resetForm(event.target, ['comment']);
	rerender(globalActiveHabbitId);
	saveData();
}
function deleteDay(index) {
	habbits = habbits.map(habbit => {
		if (habbit.id === globalActiveHabbitId) {
			habbit.days.splice(index, 1);
			return {
				...habbit,
				days: habbit.days
			};
		}
		return habbit;
	});
	rerender(globalActiveHabbitId);
	saveData();

};
function togglePopup() {
	if (page.popup.index.classList.contains('cover_hidden')) {
		page.popup.index.classList.remove('cover_hidden');
	} else {
		page.popup.index.classList.add('cover_hidden');
	}

	// const openButton = document.querySelector('.menu__add');

	// const openCover = document.querySelector('.cover');
	// openButton.addEventListener('click', () => {
	// 	if(openCover){
	// 		openCover.classList.remove('cover-hidden')
	// 	}
	// });
	// const closeButton = document.querySelector('.popup__close');
	// closeButton.addEventListener('click', () => {
	// 	if(closeButton){
	// 		openCover.classList.add('cover-hidden')
	// 	}
	// })
}
function rerender(activeHabbitId) {
	globalActiveHabbitId = activeHabbitId;
	const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
	if (!activeHabbit) {
		return;
	}
	document.location.replace(document.location.pathname + '#' + activeHabbitId);
	rerenderMenu(activeHabbit);
	rerenderHead(activeHabbit);
	rerenderContent(activeHabbit);
}
// выбор иконки
function setIcon(context, icon) {
	page.popup.iconField.value = icon;
	const activeIcon = document.querySelector('.icon.icon_active');
	activeIcon.classList.remove('icon_active');
	context.classList.add('icon_active');
}


function addHabbit(event) {
	event.preventDefault();
	const data = validateAndGetFormData(event.target, ['name', 'icon', 'target']);
	if (!data) {
		return;
	}
	const maxId = habbits.reduce((acc, habbit) => acc > habbit.id ? acc : habbit.id, 0);
	habbits.push({
		id: maxId + 1,
		name: data.name,
		target: data.target,
		icon: data.icon,
		days: []
	});
	resetForm(event.target, ['name', 'target']);
	togglePopup();
	saveData();
	rerender(maxId + 1);
}
// СамоВызывающаяся Функция
//Вызов функции loadData для загрузки и отображения данных при старте приложения.
/* init */
(() => {
	loadData()
	const hashId = Number(document.location.hash.replace('#', ''));
	const urlHabbit = habbits.find(habbit => habbit.id == hashId);
	if(urlHabbit){ 
		rerender(urlHabbit.id);
	}else{
		rerender(habbits[0].id)
	}
})();
