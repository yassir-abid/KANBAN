/* eslint-disable no-param-reassign */
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
};

module.exports = userModule;
