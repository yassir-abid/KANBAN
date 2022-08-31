const utilsModule = {
    base_url: 'http://localhost:3000',
    hideModals: () => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach((modal) => modal.classList.remove('is-active'));
    },
};

module.exports = utilsModule;
