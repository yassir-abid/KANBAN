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
        const addCardButtons = document.querySelectorAll('.add-card-icon');
        addCardButtons.forEach((element) => element.addEventListener('click', app.showAddCardModal));

        /* close modals */
        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach((btn) => btn.addEventListener('click', app.hideModals));

        /* handle forms */
        document.querySelector('#addListModal form').addEventListener('submit', app.handleAddListForm);
        document.querySelector('#addCardModal form').addEventListener('submit', app.handleAddCardForm);
    },

    showAddListModal: () => {
        const modal = document.getElementById('addListModal');
        modal.querySelector('input[name="title"]').value = '';
        modal.classList.add('is-active');
    },

    showEditListForm: (event) => {
        event.target.classList.add('is-hidden');
        event.target.nextElementSibling.classList.remove('is-hidden');
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

    showEditCardForm: (event) => {
        const container = event.target.closest('.columns');
        container.querySelector('h3').classList.add('is-hidden');
        container.querySelector('form').classList.remove('is-hidden');
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
                console.log(list);
                list.cards.forEach((card) => {
                    app.makeCardInDOM(card);
                    card.labels.forEach((label) => app.makeLabelInDOM(label));
                });
            });
        } catch (error) {
            console.error(error);
        }
    },

    makeListInDOM: (list) => {
        const template = document.getElementById('listTemplate');
        const clone = document.importNode(template.content, true);

        clone.querySelector('.add-card-icon').addEventListener('click', app.showAddCardModal);
        clone.querySelector('.delete-list-icon').addEventListener('click', app.deleteList);

        const title = clone.querySelector('h2');
        title.textContent = list.title;
        title.addEventListener('dblclick', app.showEditListForm);

        const form = clone.querySelector('form');
        form.addEventListener('submit', app.handleEditListForm);
        form.querySelector('input[name="title"]').value = list.title;
        form.querySelector('input[name="list-id"]').value = list.id;

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

    async handleEditListForm(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const titleHTML = event.target.previousElementSibling;
        try {
            const response = await fetch(`${app.base_url}/lists/${formData.get('list-id')}`, {
                method: 'PATCH',
                body: formData,
            });
            const list = await response.json();

            titleHTML.textContent = list.title;

            event.target.classList.add('is-hidden');
            titleHTML.classList.remove('is-hidden');
        } catch (error) {
            console.error(error);
        }
    },

    deleteList: async (event) => {
        const list = event.target.closest('div[data-list-id]');
        const id = list.dataset.listId;

        // eslint-disable-next-line no-restricted-globals
        if (!confirm('Voulez-vous vraiment supprimer cette liste ?')) return;

        try {
            await fetch(`${app.base_url}/lists/${id}`, {
                method: 'DELETE',
            });
            list.remove();
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

        clone.querySelector('.edit-card-icon').addEventListener('click', app.showEditCardForm);
        clone.querySelector('.delete-card-icon').addEventListener('click', app.deleteCard);

        const form = clone.querySelector('form');
        form.addEventListener('submit', app.handleEditCardForm);
        form.querySelector('input[name="title"]').value = card.title;
        form.querySelector('input[name="card-id"]').value = card.id;
        form.querySelector('input[name="color"]').value = card.color;

        const list = document.querySelector(`div[data-list-id="${card.list_id}"]`);
        list.querySelector('.panel-block').appendChild(clone);
    },

    handleAddCardForm: async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        try {
            const response = await fetch(`${app.base_url}/cards`, {
                method: 'POST',
                body: formData,
            });
            const card = await response.json();
            app.makeCardInDOM(card);
            app.hideModals();
        } catch (error) {
            console.error(error);
        }
    },

    handleEditCardForm: async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const h3 = event.target.closest('.columns').querySelector('h3');
        try {
            const response = await fetch(`${app.base_url}/cards/${formData.get('card-id')}`, {
                method: 'PATCH',
                body: formData,
            });
            const updatedCard = await response.json();
            h3.textContent = updatedCard.title;

            const cardDOM = event.target.closest('.box');
            cardDOM.style.backgroundColor = updatedCard.color;

            event.target.classList.add('is-hidden');
            h3.classList.remove('is-hidden');
        } catch (error) {
            console.error(error);
        }
    },

    deleteCard: async (event) => {
        const card = event.target.closest('div[data-card-id]');
        const id = card.dataset.cardId;

        // eslint-disable-next-line no-restricted-globals
        if (!confirm('Voulez-vous vraiment supprimer cette carte ?')) return;

        try {
            await fetch(`${app.base_url}/cards/${id}`, {
                method: 'DELETE',
            });
            card.remove();
        } catch (error) {
            console.error(error);
        }
    },

    makeLabelInDOM: (label) => {
        const template = document.getElementById('label-template');
        const clone = document.importNode(template.content, true);

        const labelHTML = clone.querySelector('.tag');
        labelHTML.textContent = label.title;
        labelHTML.dataset.labelId = label.id;
        labelHTML.style.backgroundColor = label.color;

        const card = document.querySelector(`div[data-card-id="${label.card_has_label.card_id}"]`);
        card.querySelector('.labels').appendChild(clone);
    },

};

document.addEventListener('DOMContentLoaded', app.init);
