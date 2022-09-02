/* eslint-disable no-restricted-globals */
const utilsModule = {
    base_url: `${location.origin}`,
    hideModals: () => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach((modal) => modal.classList.remove('is-active'));
    },
};

module.exports = utilsModule;
