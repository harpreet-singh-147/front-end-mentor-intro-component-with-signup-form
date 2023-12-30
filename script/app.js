const subscriptionForm = document.querySelector('.subscription__form');
const inputs = subscriptionForm.querySelectorAll('.subscription__form-input');
const errorIcons = subscriptionForm.querySelectorAll(
  '.subscription__form-error-icon'
);
const errorMessages = subscriptionForm.querySelectorAll(
  '.subscription__form-error'
);

const updateLabelPosition = input => {
  input.classList.toggle('has-content', input.value.trim() !== '');
};

const mapAndCapitalise = camelCase => {
  return camelCase
    .split(/(?=[A-Z])/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const validateInput = input => {
  const type = input.getAttribute('type');
  const value = input.value.trim();
  let isValid = true;
  let errorMessage = '';

  input.style.color = 'hsl(249, 10%, 26%)';

  if (!value) {
    isValid = false;
    errorMessage = `${mapAndCapitalise(input.name)} cannot be empty`;
  }

  if (type === 'email' && value) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Looks like this is not an email';
    }
  }

  if (type === 'password' && value) {
    if (value.length < 8) {
      isValid = false;
      errorMessage = 'Password must be at least 8 characters long';
    }
  }

  return { isValid, errorMessage };
};

const showError = (input, errorIcon, errorMessage, validationErrorMessage) => {
  input.setAttribute('aria-invalid', 'true');
  input.classList.add('input-error');

  errorIcon.style.visibility = 'visible';
  errorMessage.textContent = validationErrorMessage;

  const naturalHeight = errorMessage.scrollHeight + 'px';
  errorMessage.style.maxHeight = naturalHeight;

  errorMessage.style.visibility = 'visible';

  setTimeout(() => {
    errorIcon.style.opacity = 1;
    errorMessage.style.opacity = 1;
  }, 10);
};

const hideError = (input, errorIcon, errorMessage) => {
  input.setAttribute('aria-invalid', 'false');
  input.classList.remove('input-error');
  input.style.borderColor = 'black';
  errorIcon.style.opacity = 0;

  errorMessage.style.opacity = 0;
  errorMessage.style.maxHeight = 0;

  errorIcon.style.visibility = '';
  errorMessage.textContent = '';
  errorMessage.style.visibility = '';
};

const handleSubmit = e => {
  e.preventDefault();
  let isFormValid = true;
  let firstInvalidInput = null;
  let allEmpty = true;

  let formData = {};

  inputs.forEach((input, i) => {
    const { isValid, errorMessage: validationErrorMessage } =
      validateInput(input);
    const errorIcon = errorIcons[i];
    const errorMessage = errorMessages[i];

    formData[input.name] = input.value.trim();

    if (input.value.trim() !== '') {
      allEmpty = false;
    }

    if (!isValid) {
      input.style.borderColor = 'hsl(0, 100%, 74%)';
      input.style.color = 'hsl(0, 100%, 74%)';
      showError(input, errorIcon, errorMessage, validationErrorMessage);
      isFormValid = false;

      if (!firstInvalidInput) {
        firstInvalidInput = input;
      }
    } else {
      hideError(input, errorIcon, errorMessage);
    }
  });

  if (firstInvalidInput) {
    firstInvalidInput.focus();
    firstInvalidInput.style.color = 'hsl(0, 100%, 74%)';
  } else if (allEmpty) {
    inputs[0].focus();
  }

  if (isFormValid) {
    console.log(formData);
  }
};

const handleInput = (input, errorIcon, errorMessage) => {
  const { isValid, errorMessage: validationErrorMessage } =
    validateInput(input);

  if (isValid) {
    hideError(input, errorIcon, errorMessage);
  } else {
    showError(input, errorIcon, errorMessage, validationErrorMessage);
  }

  updateLabelPosition(input);
};

inputs.forEach((input, i) => {
  const errorIcon = errorIcons[i];
  const errorMessage = errorMessages[i];
  input.style.color = 'hsl(249, 10%, 26%)';

  input.addEventListener('input', () =>
    handleInput(input, errorIcon, errorMessage)
  );

  input.addEventListener('change', () =>
    handleInput(input, errorIcon, errorMessage)
  );

  input.addEventListener('focus', () =>
    handleInput(input, errorIcon, errorMessage)
  );

  input.addEventListener('blur', e => {
    inputs.forEach((input, i) => {
      const errorIcon = errorIcons[i];
      const errorMessage = errorMessages[i];

      if (input.value.trim().length === 0) {
        hideError(input, errorIcon, errorMessage);
      }
    });
  });
});

document.addEventListener('click', e => {
  if (!subscriptionForm.contains(e.target)) {
    inputs.forEach((input, i) => {
      const errorIcon = errorIcons[i];
      const errorMessage = errorMessages[i];

      if (input.value.trim().length === 0) {
        hideError(input, errorIcon, errorMessage);
      }
    });
    inputs[0].focus();
  }
});

subscriptionForm.addEventListener('submit', handleSubmit);
