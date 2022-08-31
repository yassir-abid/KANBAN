const utilsModule = require('./utils');

const labelModule = {
    makeLabelInDOM: (label) => {
        const template = document.getElementById('label-template');
        const clone = document.importNode(template.content, true);

        const labelHTML = clone.querySelector('.tag');
        labelHTML.querySelector('.label-title').textContent = label.title;
        labelHTML.dataset.labelId = label.id;
        labelHTML.style.backgroundColor = label.color;

        labelHTML.querySelector('.delete').addEventListener('click', labelModule.dissociateLabelFromCard);

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

        clone.querySelector('.edit-label-icon').addEventListener('click', labelModule.showEditLabelForm);
        clone.querySelector('form').addEventListener('submit', labelModule.handleEditLabelForm);
        clone.querySelector('.delete-label-icon').addEventListener('click', labelModule.deleteLabel);

        document.querySelector('#editLabelsModal .labels').appendChild(clone);
    },

    showAddLabelToCardModal: async (event) => {
        const { cardId } = event.target.closest('.box').dataset;
        const modal = document.querySelector('#addLabelToCardModal');
        modal.querySelector('input[type="hidden"]').value = cardId;
        try {
            const cardResponse = await fetch(`${utilsModule.base_url}/cards/${cardId}`);
            const card = await cardResponse.json();

            const labelsResponse = await fetch(`${utilsModule.base_url}/labels`);
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

    associateLabelToCard: async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const cardId = formData.get('card_id');
        try {
            const response = await fetch(`${utilsModule.base_url}/cards/${cardId}/labels`, {
                method: 'POST',
                body: formData,
            });
            const card = await response.json();
            const label = card.labels.find((cardLabel) => Number(cardLabel.id) === Number(formData.get('label_id')));

            labelModule.makeLabelInDOM(label);
            utilsModule.hideModals();
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
            await fetch(`${utilsModule.base_url}/cards/${cardId}/labels/${labelId}`, {
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
            const response = await fetch(`${utilsModule.base_url}/labels/${formData.get('label-id')}`, {
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
            await fetch(`${utilsModule.base_url}/labels/${id}`, {
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
            const response = await fetch(`${utilsModule.base_url}/labels`, {
                method: 'POST',
                body: formData,
            });
            const label = await response.json();

            labelModule.makeLabelInEditModal(label);

            const button = document.getElementById('addLabelButton');
            button.classList.remove('is-hidden');
            button.nextElementSibling.classList.add('is-hidden');
        } catch (error) {
            console.error(error);
        }
    },
};

module.exports = labelModule;
