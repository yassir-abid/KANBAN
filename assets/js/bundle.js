(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* eslint-disable no-new */
const userModule = require('./user');
const listModule = require('./list');
const cardModule = require('./card');
const labelModule = require('./label');
const utilsModule = require('./utils');

const app = {

    init: () => {
        app.addListenerToActions();
        app.getListsFromAPI();
        app.getLabelsFromAPI();
    },

    addListenerToActions: () => {
        /* open signup modal */
        document.getElementById('signupButton').addEventListener('click', userModule.showSignupModal);

        /* open login modal */
        document.getElementById('loginButton').addEventListener('click', userModule.showLoginModal);

        /* open add list modal */
        document.getElementById('addListButton').addEventListener('click', listModule.showAddListModal);

        /* open add card modal */
        const addCardButtons = document.querySelectorAll('.add-card-icon');
        addCardButtons.forEach((element) => element.addEventListener('click', cardModule.showAddCardModal));

        /* open edit label modal */
        document.getElementById('editLabelButton').addEventListener('click', labelModule.showEditLabelsModal);
        document.getElementById('addLabelButton').addEventListener('click', labelModule.showAddLabelForm);

        /* close modals */
        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach((btn) => btn.addEventListener('click', utilsModule.hideModals));

        /* handle forms */
        document.querySelector('#signupModal form').addEventListener('submit', userModule.handleSignupForm);
        document.querySelector('#addListModal form').addEventListener('submit', listModule.handleAddListForm);
        document.querySelector('#addCardModal form').addEventListener('submit', cardModule.handleAddCardForm);
        document.querySelector('#addLabelToCardModal form').addEventListener('submit', labelModule.associateLabelToCard);
        document.querySelector('#editLabelsModal form').addEventListener('submit', labelModule.handleAddLabelForm);
    },

    getListsFromAPI: async () => {
        try {
            const response = await fetch(`${utilsModule.base_url}/lists`);
            const lists = await response.json();
            const orderedlists = lists.sort(app.comparePosition);
            orderedlists.forEach((list) => {
                listModule.makeListInDOM(list);
                const orderedCards = list.cards.sort(app.comparePosition);
                orderedCards.forEach((card) => {
                    cardModule.makeCardInDOM(card);
                    card.labels.forEach((label) => labelModule.makeLabelInDOM(label));
                });
            });

            // eslint-disable-next-line no-undef
            new Sortable(document.querySelector('.card-lists'), {
                animation: 150,
                ghostClass: 'blue-background-class',
                onEnd: listModule.handleDropList,
            });
        } catch (error) {
            console.error(error);
        }
    },

    getLabelsFromAPI: async () => {
        try {
            const response = await fetch(`${utilsModule.base_url}/labels`);
            const labels = await response.json();

            labels.forEach((label) => {
                labelModule.makeLabelInEditModal(label);
            });
        } catch (error) {
            console.error(error);
        }
    },

    comparePosition: (listA, listB) => listA.position - listB.position,

};

document.addEventListener('DOMContentLoaded', app.init);

},{"./card":2,"./label":3,"./list":4,"./user":5,"./utils":6}],2:[function(require,module,exports){
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

},{"./label":3,"./utils":6}],3:[function(require,module,exports){
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

            const modal = document.getElementById('editLabelsModal');
            modal.querySelector('input[name="title"]').value = '';

            const button = modal.querySelector('#addLabelButton');
            button.classList.remove('is-hidden');
            button.nextElementSibling.classList.add('is-hidden');
        } catch (error) {
            console.error(error);
        }
    },
};

module.exports = labelModule;

},{"./utils":6}],4:[function(require,module,exports){
/* eslint-disable no-new */

const cardModule = require('./card');
const utilsModule = require('./utils');

const listModule = {
    makeListInDOM: (list) => {
        const template = document.getElementById('listTemplate');
        const clone = document.importNode(template.content, true);

        clone.querySelector('.add-card-icon').addEventListener('click', cardModule.showAddCardModal);
        clone.querySelector('.edit-list-icon').addEventListener('click', listModule.showEditListForm);
        clone.querySelector('.delete-list-icon').addEventListener('click', listModule.deleteList);

        clone.querySelector('h2').textContent = list.title;

        const form = clone.querySelector('form');
        form.addEventListener('submit', listModule.handleEditListForm);
        form.querySelector('input[name="title"]').value = list.title;
        form.querySelector('input[name="list-id"]').value = list.id;
        form.querySelector('input[name="position"]').value = list.position;

        clone.querySelector('.panel').dataset.listId = list.id;

        // eslint-disable-next-line no-undef
        new Sortable(clone.querySelector('.panel-block'), {
            group: 'shared',
            animation: 150,
            ghostClass: 'blue-background-class',
            onEnd: cardModule.handleDropCard,
        });

        document.querySelector('.card-lists').appendChild(clone);
    },

    showAddListModal: () => {
        const modal = document.getElementById('addListModal');
        modal.querySelector('input[name="title"]').value = '';
        modal.classList.add('is-active');
    },

    showEditListForm: (event) => {
        const list = event.target.closest('div[data-list-id]');
        list.querySelector('h2').classList.add('is-hidden');
        list.querySelector('form').classList.remove('is-hidden');
    },

    handleAddListForm: async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const allLists = document.querySelectorAll('.panel');
        formData.set('position', allLists.length + 1);
        try {
            const response = await fetch(`${utilsModule.base_url}/lists`, {
                method: 'POST',
                body: formData,
            });
            const list = await response.json();
            listModule.makeListInDOM(list);
            utilsModule.hideModals();
        } catch (error) {
            console.error(error);
        }
    },

    handleEditListForm: async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const titleHTML = event.target.previousElementSibling;
        try {
            const response = await fetch(`${utilsModule.base_url}/lists/${formData.get('list-id')}`, {
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
            await fetch(`${utilsModule.base_url}/lists/${id}`, {
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
                await fetch(`${utilsModule.base_url}/lists/${formData.get('list-id')}`, {
                    method: 'PATCH',
                    body: formData,
                });
            } catch (error) {
                console.error(error);
            }
        });
    },
};

module.exports = listModule;

},{"./card":2,"./utils":6}],5:[function(require,module,exports){
/* eslint-disable no-param-reassign */
const utilsModule = require('./utils');

const userModule = {
    showSignupModal: () => {
        const modal = document.getElementById('signupModal');
        modal.querySelector('.error').textContent = '';
        modal.querySelectorAll('.input').forEach((input) => {
            input.value = '';
        });
        modal.classList.add('is-active');
    },
    showLoginModal: () => {
        const modal = document.getElementById('loginModal');
        modal.querySelector('.error').textContent = '';
        modal.querySelectorAll('.input').forEach((input) => {
            input.value = '';
        });
        modal.classList.add('is-active');
    },
    handleSignupForm: async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        try {
            const response = await fetch(`${utilsModule.base_url}/signup`, {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (result === 'success') {
                utilsModule.hideModals();
                userModule.showLoginModal();
            } else {
                let message;
                if (result === 'email already exists') {
                    message = 'Un compte existe avec cette adresse mail';
                } else if (result === 'email address is incorrect') {
                    message = 'Cette adresse mail est incorrecte';
                } else if (result === 'the password and its confirmation are not identical') {
                    message = 'Le mot de passe et sa confirmation ne sont pas identiques';
                }
                userModule.showError('signupModal', message);
            }
        } catch (error) {
            console.error(error);
        }
    },
    showError: (modal, message) => {
        document.getElementById(modal).querySelector('.error').textContent = message;
    },
};

module.exports = userModule;

},{"./utils":6}],6:[function(require,module,exports){
/* eslint-disable no-restricted-globals */
const utilsModule = {
    base_url: `${location.origin}`,
    hideModals: () => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach((modal) => modal.classList.remove('is-active'));
    },
};

module.exports = utilsModule;

},{}]},{},[1]);
