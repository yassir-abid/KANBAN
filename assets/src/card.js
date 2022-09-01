const labelModule = require('./label');
const utilsModule = require('./utils');

const cardModule = {
    makeCardInDOM: (card) => {
        const template = document.getElementById('cardTemplate');
        const clone = document.importNode(template.content, true);

        clone.querySelector('h3').textContent = card.title;
        clone.querySelector('.box').dataset.cardId = card.id;
        clone.querySelector('.box').style.backgroundColor = card.color;

        clone.querySelector('.edit-card-icon').addEventListener('click', cardModule.showEditCardForm);
        clone.querySelector('.delete-card-icon').addEventListener('click', cardModule.deleteCard);
        clone.querySelector('.add-label-icon').addEventListener('click', labelModule.showAddLabelToCardModal);

        const form = clone.querySelector('form');
        form.addEventListener('submit', cardModule.handleEditCardForm);
        form.querySelector('input[name="title"]').value = card.title;
        form.querySelector('input[name="card-id"]').value = card.id;
        form.querySelector('input[name="color"]').value = card.color;
        form.querySelector('input[name="position"]').value = card.position;

        const list = document.querySelector(`div[data-list-id="${card.list_id}"]`);
        list.querySelector('.panel-block').appendChild(clone);
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

    handleAddCardForm: async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        try {
            const response = await fetch(`${utilsModule.base_url}/cards`, {
                method: 'POST',
                body: formData,
            });
            const card = await response.json();
            cardModule.makeCardInDOM(card);
            utilsModule.hideModals();
        } catch (error) {
            console.error(error);
        }
    },

    handleEditCardForm: async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const h3 = event.target.closest('.columns').querySelector('h3');
        try {
            const response = await fetch(`${utilsModule.base_url}/cards/${formData.get('card-id')}`, {
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
            await fetch(`${utilsModule.base_url}/cards/${id}`, {
                method: 'DELETE',
            });
            card.remove();
        } catch (error) {
            console.error(error);
        }
    },

    handleDropCard: async (event) => {
        const listHTML = event.to.parentNode;
        const cards = listHTML.querySelectorAll('.box');

        cards.forEach(async (card, index) => {
            const positionInput = card.querySelector('input[name="position"');
            positionInput.value = index + 1;

            const formData = new FormData(card.querySelector('form'));
            formData.set('list_id', listHTML.dataset.listId);

            try {
                await fetch(`${utilsModule.base_url}/cards/${formData.get('card-id')}`, {
                    method: 'PATCH',
                    body: formData,
                });
            } catch (error) {
                console.error(error);
            }
        });
    },
};

module.exports = cardModule;
