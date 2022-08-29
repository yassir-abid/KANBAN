const app = {

    base_url: 'http://localhost:3000',

    init: () => {
        app.getListsFromAPI();
    },

    getListsFromAPI: async () => {
        try {
            const response = await fetch(`${app.base_url}/lists`);
            const lists = await response.json();
            lists.forEach((list) => {
                app.makeListInDOM(list);
            });
        } catch (error) {
            console.error(error);
        }
    },

    makeListInDOM: (list) => {
        const template = document.getElementById('listTemplate');
        const clone = document.importNode(template.content, true);

        clone.querySelector('h2').textContent = list.title;
        clone.querySelector('.panel').dataset.listId = list.id;

        document.querySelector('.card-lists').appendChild(clone);
    },

};

document.addEventListener('DOMContentLoaded', app.init);
