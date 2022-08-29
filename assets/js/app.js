const app = {

    base_url: 'http://localhost:3000',

    init: () => {
        app.addListenerToActions();
        app.getListsFromAPI();
    },

    addListenerToActions: () => {
        /* open add list modal */
        document.getElementById('addListButton').addEventListener('click', app.showAddListModal);

        /* open add card modal */
        const addCardButtons = document.querySelectorAll('.is-pulled-right');
        addCardButtons.forEach((element) => element.addEventListener('click', app.showAddCardModal));

        /* close modals */
        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach((btn) => btn.addEventListener('click', app.hideModals));

        /* handle forms */
        document.querySelector('#addListModal form').addEventListener('submit', app.handleAddListForm);
    },

    showAddListModal: () => {
        const modal = document.getElementById('addListModal');
        modal.querySelector('input[name="title"]').value = '';
        modal.classList.add('is-active');
    },

    showAddCardModal: (event) => {
        const listHTML = event.target.closest('.panel');
        const listID = listHTML.dataset.listId;

        const modal = document.getElementById('addCardModal');

        const listIdInput = modal.querySelector('input[name="list_id"]');
        listIdInput.value = listID;

        const titleInput = modal.querySelector('input[name="title"]');
        titleInput.value = '';

        modal.classList.add('is-active');
    },

    hideModals: () => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach((modal) => modal.classList.remove('is-active'));
    },

    getListsFromAPI: async () => {
        try {
            const response = await fetch(`${app.base_url}/lists`);
            const lists = await response.json();
            lists.forEach((list) => {
                app.makeListInDOM(list);
                list.cards.forEach((card) => app.makeCardInDOM(card));
            });
        } catch (error) {
            console.error(error);
        }
    },

    makeListInDOM: (list) => {
        const template = document.getElementById('listTemplate');
        const clone = document.importNode(template.content, true);

        clone.querySelector('.is-pulled-right').addEventListener('click', app.showAddCardModal);
        clone.querySelector('h2').textContent = list.title;
        clone.querySelector('.panel').dataset.listId = list.id;

        document.querySelector('.card-lists').appendChild(clone);
    },

    handleAddListForm: async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        try {
            const response = await fetch(`${app.base_url}/lists`, {
                method: 'POST',
                body: formData,
            });
            const list = await response.json();
            app.makeListInDOM(list);
            app.hideModals();
        } catch (error) {
            console.error(error);
        }
    },

    makeCardInDOM: (card) => {
        const template = document.getElementById('cardTemplate');
        const clone = document.importNode(template.content, true);

        clone.querySelector('h3').textContent = card.title;
        clone.querySelector('.box').dataset.cardId = card.id;
        clone.querySelector('.box').style.backgroundColor = card.color;

        const list = document.querySelector(`div[data-list-id="${card.list_id}"]`);
        list.querySelector('.panel-block').appendChild(clone);
    },

};

document.addEventListener('DOMContentLoaded', app.init);
