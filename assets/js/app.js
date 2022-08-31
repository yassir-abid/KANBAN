/* eslint-disable no-undef */
/* eslint-disable no-new */
const app = {

    init: () => {
        app.addListenerToActions();
        app.getListsFromAPI();
        app.getLabelsFromAPI();
    },

    addListenerToActions: () => {
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
