/**
 * FormSubmit.co Compatible Form Validation
 * Modified for FormSubmit.co service
 */
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute('action');

      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      // Check if it's a FormSubmit.co URL
      if (action.includes('formsubmit.co')) {
        handleFormSubmitCo(thisForm);
        return;
      }

      // Original logic for other form handlers
      handleGenericForm(thisForm, action);
    });
  });

  function handleFormSubmitCo(thisForm) {
    // Reset messages
    thisForm.querySelector('.loading').classList.add('d-block');
    thisForm.querySelector('.error-message').classList.remove('d-block');
    thisForm.querySelector('.sent-message').classList.remove('d-block');

    // Basic client-side validation
    if (!validateForm(thisForm)) {
      displayError(thisForm, 'Veuillez remplir tous les champs requis correctement.');
      return;
    }

    // Show success message immediately and submit
    setTimeout(() => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.add('d-block');
      
      // Submit the form after showing success message
      setTimeout(() => {
        thisForm.submit();
      }, 1500);
    }, 1000);
  }

  function handleGenericForm(thisForm, action) {
    // Reset messages
    thisForm.querySelector('.loading').classList.add('d-block');
    thisForm.querySelector('.error-message').classList.remove('d-block');
    thisForm.querySelector('.sent-message').classList.remove('d-block');

    let formData = new FormData(thisForm);

    fetch(action, {
      method: 'POST',
      body: formData,
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error(`${response.status} ${response.statusText}`);
        }
      })
      .then(data => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (data.trim() === 'OK' || response.ok) {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
        } else {
          throw new Error(data || 'Form submission failed');
        }
      })
      .catch((error) => {
        displayError(thisForm, error.message || error);
      });
  }

  function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = '#dc3545';
      } else {
        field.style.borderColor = '#ced4da';
      }

      // Email validation
      if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          isValid = false;
          field.style.borderColor = '#dc3545';
        }
      }
    });

    return isValid;
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    let errorBox = thisForm.querySelector('.error-message');
    errorBox.innerHTML = error;
    errorBox.classList.add('d-block');
  }

})();