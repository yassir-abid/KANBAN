/* eslint-disable no-new */
const app = {

    base_url: 'http://localhost:3000',

    init: () => {
        app.addListenerToActions();
        app.getListsFromAPI();
        app.getLabelsFromAPI();
    },

    addListenerToActions: () => {
        /* open add list modal */
        document.getElementById('addListButton').addEventListener('click', app.showAddListModal);

        /* open add card modal */
        const addCardButtons = document.querySelectorAll('.add-card-icon');
        addCardButtons.forEach((element) => element.addEventListener('click', app.showAddCardModal));

        /* open edit label modal */
        document.getElementById('editLabelButton').addEventListener('click', app.showEditLabelsModal);
        document.getElementById('addLabelButton').addEventListener('click', app.showAddLabelForm);

        /* close modals */
        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach((btn) => btn.addEventListener('click', app.hideModals));

        /* handle forms */
        document.querySelector('#addListModal form').addEventListener('submit', app.handleAddListForm);
        document.querySelector('#addCardModal form').addEventListener('submit', app.handleAddCardForm);
        document.querySelector('#addLabelToCardModal form').addEventListener('submit', app.associateLabelToCard);
        document.querySelector('#editLabelsModal form').addEventListener('submit', app.handleAddLabelForm);
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

    showEditCardForm: async (event) => {
        const container = event.target.closest('.columns');
        container.querySelector('h3').classList.add('is-hidden');
        container.querySelector('form').classList.remove('is-hidden');
    },

    showAddLabelToCardModal: async (event) => {
        const { cardId } = event.target.closest('.box').dataset;
        const modal = document.querySelector('#addLabelToCardModal');
        modal.querySelector('input[type="hidden"]').value = cardId;
        try {
            const cardResponse = await fetch(`${app.base_url}/cards/${cardId}`);
            const card = await cardResponse.json();

            const labelsResponse = await fetch(`${app.base_url}/labels`);
            const labels = await labelsResponse.json();

            const select = modal.querySelector('select');
            select.innerHTML = '';
            labels.forEach((label) => {
                const foundedLabel = card.labels.find((cardLabel) => cardLabel.id === label.id);
                if (!foundedLabel) {
                    const option = document.createElement('option');
                    option.textContent = label.title;
                    option.value = label.id;
                    select.appendChild(option);
                }
            });
        } catch (error) {
            console.error(error);
        }

        modal.classList.add('is-active');
    },

    showEditLabelsModal: (event) => {
        event.preventDefault();
        document.getElementById('editLabelsModal').classList.add('is-active');
    },

    showEditLabelForm: (event) => {
        const label = event.target.closest('div[data-label-id]');
        label.querySelector('#label-name').classList.add('is-hidden');
        label.querySelector('form').classList.remove('is-hidden');
    },

    showAddLabelForm: (event) => {
        event.target.classList.add('is-hidden');
        event.target.nextElementSibling.classList.remove('is-hidden');
    },

    hideModals: () => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach((modal) => modal.classList.remove('is-active'));
    },

    getLabelsFromAPI: async () => {
        try {
            const response = await fetch(`${app.base_url}/labels`);
            const labels = await response.json();

            labels.forEach((label) => {
                app.makeLabelInEditModal(label);
            });
        } catch (error) {
            console.error(error);
        }
    },

    getListsFromAPI: async () => {
        try {
            const response = await fetch(`${app.base_url}/lists`);
            const lists = await response.json();
            const orderedlists = lists.sort(app.comparePosition);
            orderedlists.forEach((list) => {
                app.makeListInDOM(list);
                list.cards.forEach((card) => {
                    app.makeCardInDOM(card);
                    card.labels.forEach((label) => app.makeLabelInDOM(label));
                });
            });
            // eslint-disable-next-line no-undef
            new Sortable(document.querySelector('.card-lists'), {
                animation: 150,
                ghostClass: 'blue-background-class',
                onEnd: app.handleDropList,
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
        form.querySelector('input[name="position"]').value = list.position;

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

    handleEditListForm: async (event) => {
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

    handleDropList: () => {
        const allLists = document.querySelectorAll('.panel');

        allLists.forEach(async (list, index) => {
            const positionInput = list.querySelector('input[name="position"');
            positionInput.value = index + 1;

            const formData = new FormData(list.querySelector('form'));

            try {
                await fetch(`${app.base_url}/lists/${formData.get('list-id')}`, {
                    method: 'PATCH',
                    body: formData,
                });
            } catch (error) {
                console.error(error);
            }
        });
    },

    comparePosition: (listA, listB) => listA.position - listB.position,

    makeCardInDOM: (card) => {
        const template = document.getElementById('cardTemplate');
        const clone = document.importNode(template.content, true);

        clone.querySelector('h3').textContent = card.title;
        clone.querySelector('.box').dataset.cardId = card.id;
        clone.querySelector('.box').style.backgroundColor = card.color;

        clone.querySelector('.edit-card-icon').addEventListener('click', app.showEditCardForm);
        clone.querySelector('.delete-card-icon').addEventListener('click', app.deleteCard);
        clone.querySelector('.add-label-icon').addEventListener('click', app.showAddLabelToCardModal);

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
        labelHTML.querySelector('.label-title').textContent = label.title;
        labelHTML.dataset.labelId = label.id;
        labelHTML.style.backgroundColor = label.color;

        labelHTML.querySelector('.delete').addEventListener('click', app.dissociateLabelFromCard);

        const card = document.querySelector(`div[data-card-id="${label.card_has_label.card_id}"]`);
        card.querySelector('.labels').appendChild(clone);
    },

    makeLabelInEditModal: (label) => {
        const template = document.getElementById('edit-label-template');
        const clone = document.importNode(template.content, true);
        clone.querySelector('#label-name').textContent = label.title;
        clone.querySelector('input[name="title"]').value = label.title;
        clone.querySelector('div[data-label-id]').dataset.labelId = label.id;
        clone.querySelector('input[name="label-id"]').value = label.id;
        clone.querySelector('input[name="color"]').value = label.color;

        clone.querySelector('.edit-label-icon').addEventListener('click', app.showEditLabelForm);
        clone.querySelector('form').addEventListener('submit', app.handleEditLabelForm);
        clone.querySelector('.delete-label-icon').addEventListener('click', app.deleteLabel);

        document.querySelector('#editLabelsModal .labels').appendChild(clone);
    },

    associateLabelToCard: async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const cardId = formData.get('card_id');
        try {
            const response = await fetch(`${app.base_url}/cards/${cardId}/labels`, {
                method: 'POST',
                body: formData,
            });
            const card = await response.json();
            const label = card.labels.find((cardLabel) => Number(cardLabel.id) === Number(formData.get('label_id')));

            app.makeLabelInDOM(label);
            app.hideModals();
        } catch (error) {
            console.error(error);
        }
    },

    dissociateLabelFromCard: async (event) => {
        const labelHTML = event.target.closest('.tag');
        const { labelId } = labelHTML.dataset;
        const { cardId } = event.target.closest('.box').dataset;

        // eslint-disable-next-line no-restricted-globals
        if (!confirm('Voulez-vous vraiment supprimer ce label ?')) return;

        try {
            await fetch(`${app.base_url}/cards/${cardId}/labels/${labelId}`, {
                method: 'DELETE',
            });
            labelHTML.remove();
        } catch (error) {
            console.error(error);
        }
    },

    handleEditLabelForm: async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        try {
            const response = await fetch(`${app.base_url}/labels/${formData.get('label-id')}`, {
                method: 'PATCH',
                body: formData,
            });
            const label = await response.json();

            const labelHTML = event.target.closest('div[data-label-id]').querySelector('div#label-name');
            labelHTML.textContent = label.title;
            labelHTML.classList.remove('is-hidden');
            event.target.classList.add('is-hidden');

            const labelsInDOM = document.querySelectorAll('.tag[data-label-id]');
            labelsInDOM.forEach((el) => {
                if (Number(el.dataset.labelId) === label.id) {
                    const title = el.querySelector('.label-title');
                    title.textContent = label.title;
                    // eslint-disable-next-line no-param-reassign
                    el.style.backgroundColor = label.color;
                }
            });
        } catch (error) {
            console.error(error);
        }
    },

    deleteLabel: async (event) => {
        // eslint-disable-next-line no-restricted-globals
        if (!confirm('Voulez-vous vraiment supprimer ce label ?')) return;

        const id = event.target.closest('div[data-label-id]').dataset.labelId;

        try {
            await fetch(`${app.base_url}/labels/${id}`, {
                method: 'DELETE',
            });
            event.target.closest('div[data-label-id]').remove();

            const labelsInDOM = document.querySelectorAll('.tag[data-label-id]');
            labelsInDOM.forEach((el) => {
                if (Number(el.dataset.labelId) === Number(id)) {
                    el.remove();
                }
            });
        } catch (error) {
            console.error(error);
        }
    },

    handleAddLabelForm: async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        try {
            const response = await fetch(`${app.base_url}/labels`, {
                method: 'POST',
                body: formData,
            });
            const label = await response.json();

            app.makeLabelInEditModal(label);

            const button = document.getElementById('addLabelButton');
            button.classList.remove('is-hidden');
            button.nextElementSibling.classList.add('is-hidden');
        } catch (error) {
            console.error(error);
        }
    },

};

document.addEventListener('DOMContentLoaded', app.init);
