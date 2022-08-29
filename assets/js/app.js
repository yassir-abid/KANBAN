const app = {

    base_url: 'http://localhost:3000',

    init: () => {
        app.getListsFromAPI();
    },

    getListsFromAPI: async () => {
        try {
            const response = await fetch(`${app.base_url}/lists`);
            const lists = await response.json();
            console.log(lists);
        } catch (error) {
            console.error(error);
        }
    },

};

document.addEventListener('DOMContentLoaded', app.init);
