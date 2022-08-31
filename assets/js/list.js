/* eslint-disable no-undef */
/* eslint-disable no-new */

const listModule = {
    makeListInDOM: (list) => {
        const template = document.getElementById('listTemplate');
        const clone = document.importNode(template.content, true);

        clone.querySelector('.add-card-icon').addEventListener('click', cardModule.showAddCardModal);
        clone.querySelector('.delete-list-icon').addEventListener('click', listModule.deleteList);

        const title = clone.querySelector('h2');
        title.textContent = list.title;
        title.addEventListener('dblclick', listModule.showEditListForm);

        const form = clone.querySelector('form');
        form.addEventListener('submit', listModule.handleEditListForm);
        form.querySelector('input[name="title"]').value = list.title;
        form.querySelector('input[name="list-id"]').value = list.id;
        form.querySelector('input[name="position"]').value = list.position;

        clone.querySelector('.panel').dataset.listId = list.id;

        // eslint-disable-next-line no-undef
        new Sortable(clone.querySelector('.panel-block'), {
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
        event.target.classList.add('is-hidden');
        event.target.nextElementSibling.classList.remove('is-hidden');
    },

    handleAddListForm: async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
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
