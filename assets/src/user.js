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
    handleAuthentication: (firstname, lastname) => {
        if (firstname || lastname) {
            document.getElementById('loginMessage').textContent = `Bienvenue ${firstname} ${lastname}`;
        }
        document.getElementById('section_home').classList.toggle('is-hidden');
        document.getElementById('section_lists').classList.toggle('is-hidden');
        document.getElementById('loginMessage').classList.toggle('is-hidden');
        document.getElementById('loginButton').classList.toggle('is-hidden');
        document.getElementById('signupButton').classList.toggle('is-hidden');
    },
};

module.exports = userModule;
