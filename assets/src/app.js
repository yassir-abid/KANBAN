/* eslint-disable no-new */
const userModule = require('./user');
const listModule = require('./list');
const cardModule = require('./card');
const labelModule = require('./label');
const utilsModule = require('./utils');

const app = {

    init: () => {
        app.addListenerToActions();
        app.checkUser();
    },

    addListenerToActions: () => {
        /* open signup modal */
        const signupButtons = document.querySelectorAll('.signupButton');
        signupButtons.forEach((element) => element.addEventListener('click', userModule.showSignupModal));

        /* open login modal */
        const loginButtons = document.querySelectorAll('.loginButton');
        loginButtons.forEach((element) => element.addEventListener('click', userModule.showLoginModal));

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
        document.querySelector('#loginModal form').addEventListener('submit', app.handleLoginForm);
        document.querySelector('#addListModal form').addEventListener('submit', listModule.handleAddListForm);
        document.querySelector('#addCardModal form').addEventListener('submit', cardModule.handleAddCardForm);
        document.querySelector('#addLabelToCardModal form').addEventListener('submit', labelModule.associateLabelToCard);
        document.querySelector('#editLabelsModal form').addEventListener('submit', labelModule.handleAddLabelForm);
    },

    checkUser: async () => {
        try {
            const response = await fetch(`${utilsModule.base_url}/checkuser`);
            const user = await response.json();
            if (user) {
                userModule.handleAuthentication(user.firstname, user.lastname);
                app.getListsFromAPI();
                app.getLabelsFromAPI();
            }
        } catch (error) {
            console.error(error);
        }
    },

    getListsFromAPI: async () => {
        try {
            document.querySelector('.card-lists').innerHTML = '';
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

    handleLoginForm: async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        try {
            const response = await fetch(`${utilsModule.base_url}/login`, {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (result === 'credentials are invalid') {
                userModule.showError('loginModal', 'Le couple identifiant/mot de passe est invalide');
            } else {
                utilsModule.hideModals();
                userModule.handleAuthentication(result.firstname, result.lastname);
                app.getListsFromAPI();
                app.getLabelsFromAPI();
            }
        } catch (error) {
            console.error(error);
        }
    },

};

document.addEventListener('DOMContentLoaded', app.init);
