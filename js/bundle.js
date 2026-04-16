const header = document.querySelector('header');

if (header) {
  const toggleScrolledClass = () => {
    if (window.scrollY > 0) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', toggleScrolledClass);
  toggleScrolledClass();
}


const popup = document.querySelector('.header-popup');
const openButton = document.querySelector('.button-popup-menu');
const closeButton = document.querySelector('.button-popup-close');

function openPopup() {
  popup.classList.add('show');
}

function closePopup() {
  popup.classList.remove('show');
}

openButton.addEventListener('click', openPopup);
closeButton.addEventListener('click', closePopup);

popup.addEventListener('click', function(e) {
  if (e.target === popup) {
    closePopup();
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && popup.classList.contains('show')) {
    closePopup();
  }
});


document.addEventListener('DOMContentLoaded', function() {
  const steps = document.querySelectorAll('.quiz-step');
  let currentStep = 0;
  let isTransitioning = false;

  showStep(currentStep);

  document.querySelectorAll('.quiz-answer').forEach(answer => {
    answer.addEventListener('click', function() {
      if (isTransitioning) return;

      isTransitioning = true;

      const radio = this.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;

        setTimeout(() => {
          if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
          }
          isTransitioning = false;
        }, 300);
      } else {
        isTransitioning = false;
      }
    });
  });

  document.querySelectorAll('.input-wrapper').forEach(wrapper => {
    const checkbox = wrapper.querySelector('input[type="checkbox"]');
    const label = wrapper.querySelector('label');

    if (checkbox && label) {
      wrapper.addEventListener('click', function(e) {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
      });
    }
  });

  const phoneInput = document.querySelector('input[type="tel"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');

      if (value.startsWith('7') || value.startsWith('8')) {
        value = value.substring(1);
      }

      if (value.length > 10) {
        value = value.substring(0, 10);
      }

      let formattedValue = '+7 (';

      if (value.length > 0) {
        formattedValue += value.substring(0, 3);
      }
      if (value.length > 3) {
        formattedValue += ') ' + value.substring(3, 6);
      }
      if (value.length > 6) {
        formattedValue += '-' + value.substring(6, 8);
      }
      if (value.length > 8) {
        formattedValue += '-' + value.substring(8, 10);
      }

      e.target.value = formattedValue;
    });

    phoneInput.addEventListener('keydown', function(e) {
      if (e.key === 'Backspace' && this.value.length <= 4) {
        e.preventDefault();
      }
    });
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 11;
  }

  function showStep(stepIndex) {
    steps.forEach((step, index) => {
      step.style.display = index === stepIndex ? 'block' : 'none';
    });
  }

  function validateStep5() {
    const step5 = document.querySelector('.quiz-step-5');
    const inputs = step5.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"]');
    const consentCheckbox = step5.querySelector('input[type="checkbox"]');

    let isValid = true;

    inputs.forEach(input => {
      input.classList.remove('invalid');
    });
    if (consentCheckbox) {
      consentCheckbox.parentElement.classList.remove('invalid');
    }

    inputs.forEach(input => {
      if (input.type === 'tel') {
        if (!isValidPhone(input.value)) {
          isValid = false;
          input.classList.add('invalid');
        }
      } else if (input.type === 'email') {
        if (input.value.trim() === '' || !isValidEmail(input.value)) {
          isValid = false;
          input.classList.add('invalid');
        }
      } else if (input.type === 'text') {
        const submitButton = step5.querySelector('input[type="submit"]');
        if (input !== submitButton && input.value.trim() === '') {
          isValid = false;
          input.classList.add('invalid');
        }
      }
    });

    if (consentCheckbox && !consentCheckbox.checked) {
      isValid = false;
      consentCheckbox.parentElement.classList.add('invalid');
    }

    return isValid;
  }

  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function(e) {
      if (currentStep === steps.length - 1) {
        const isValid = validateStep5();

        if (!isValid) {
          e.preventDefault();
          const firstInvalid = document.querySelector('.quiz-step-5 .invalid');
          if (firstInvalid) {
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      } else {
        e.preventDefault();
      }
    });
  }

  const step5Inputs = document.querySelectorAll('.quiz-step-5 input');
  step5Inputs.forEach(input => {
    input.addEventListener('input', function() {
      this.classList.remove('invalid');

      if (this.type === 'checkbox') {
        this.parentElement.classList.remove('invalid');
      }
    });
  });
});


class TabsManager {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.tabButtons = this.container.querySelectorAll('.nav-button');
    this.tabPanels = this.container.querySelectorAll('.tab-panel');
    this.tabImage = this.container.querySelector('.tab-panel-image img');
    this.isAnimating = false;
    this.currentTab = 1;

    this.rotationOffsets = {
      1: -14,   // первый таб -14°
      2: 14,    // второй таб +14°
      3: 38,    // третий таб +38°
      4: 82,    // четвертый таб +82°
      5: 106,   // пятый таб +106°
      6: 132,   // шестой таб +132°
      7: 164    // седьмой таб +164°
    };

    this.init();
  }

  init() {
    this.tabButtons[0].classList.add('active');
    this.tabPanels[0].classList.add('active');
    this.tabImage.style.transform = `rotate(${this.rotationOffsets[1]}deg)`;

    this.tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        if (this.isAnimating) return;
        this.switchTab(parseInt(e.target.dataset.tabId));
      });
    });
  }

  switchTab(targetTabId) {
    const targetButton = this.container.querySelector(`.nav-button[data-tab-id="${targetTabId}"]`);
    const targetPanel = this.container.querySelector(`.tab-panel[data-tab-id="${targetTabId}"]`);

    if (targetButton.classList.contains('active')) return;

    this.isAnimating = true;

    this.tabButtons.forEach(btn => btn.classList.remove('active'));
    this.tabPanels.forEach(panel => panel.classList.remove('active'));

    this.rotateImage(this.rotationOffsets[targetTabId]);

    targetButton.classList.add('active');
    targetPanel.classList.add('active');

    setTimeout(() => {
      this.isAnimating = false;
    }, 600);
  }

  rotateImage(rotation) {
    this.tabImage.style.transition = 'transform 0.6s';
    this.tabImage.style.transform = `rotate(${rotation}deg)`;
  }

  setRotationOffset(tabId, degrees) {
    this.rotationOffsets[tabId] = degrees;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TabsManager('.tabs-block');
});


document.addEventListener('DOMContentLoaded', function() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  if (accordionItems) {
    accordionItems.forEach(item => {
      const trigger = item.querySelector('.accordion-item-header');
      const content = item.querySelector('.accordion-item-content');

      trigger.addEventListener('click', function() {
        const parent = this.parentNode;

        if (parent.classList.contains('active')) {
          parent.classList.remove('active');
          content.style.height = '0';
        } else {
          document.querySelectorAll('.accordion-item').forEach(child => {
            child.classList.remove('active');
            child.querySelector('.accordion-item-content').style.height = '0';
          });
          parent.classList.add('active');
          content.style.height = content.scrollHeight + 'px';
        }
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const videoContainers = document.querySelectorAll('.testimonial-video');

  videoContainers.forEach(container => {
    const video = container.querySelector('video');
    const playButton = container.querySelector('.play-video');

    if (video && playButton) {
      playButton.addEventListener('click', function() {
        if (video.paused) {
          video.play();
          playButton.style.opacity = '0';
          playButton.style.visibility = 'hidden';
        } else {
          video.pause();
          playButton.style.opacity = '1';
          playButton.style.visibility = 'visible';
        }
      });

      video.addEventListener('ended', function() {
        playButton.style.opacity = '1';
        playButton.style.visibility = 'visible';
      });

      video.addEventListener('play', function() {
        playButton.style.opacity = '0';
        playButton.style.visibility = 'hidden';
      });
    }
  });
});

function checkVisibility() {
  const blocks = document.querySelectorAll('.animate-section');

  blocks.forEach(block => {
    if (block.hasAttribute('data-animated')) {
      return;
    }

    const rect = block.getBoundingClientRect();
    const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;

    if (isVisible) {
      setTimeout(() => {
        block.classList.add('animated');
        block.setAttribute('data-animated', 'true');
      }, 500);
    }
  });
}

window.addEventListener('load', checkVisibility);
window.addEventListener('scroll', checkVisibility);


document.addEventListener('DOMContentLoaded', function() {
  const filterItems = document.querySelectorAll('.filter-item');

  filterItems.forEach(item => {
    item.addEventListener('click', function() {
      filterItems.forEach(filter => {
        filter.classList.remove('active');
      });

      this.classList.add('active');
    });
  });
});


document.addEventListener('DOMContentLoaded', function() {
  const wrapper = document.querySelector('.running-line-wrapper');
  const runningLine = document.querySelector('.running-line');

  if (!wrapper || !runningLine) {
    return;
  }

  for (let i = 0; i < 10; i++) {
    const clone = runningLine.cloneNode(true);
    wrapper.appendChild(clone);
  }
});

document.querySelectorAll('.benefits-cards').forEach(container => {
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener('mousedown', (e) => {
    isDown = true;
    container.classList.add('grabbing');
    container.style.cursor = 'grabbing';
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    e.preventDefault();
  });

  container.addEventListener('mouseleave', () => {
    isDown = false;
    container.classList.remove('grabbing');
  });

  container.addEventListener('mouseup', () => {
    isDown = false;
    container.classList.remove('grabbing');
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1;
    container.scrollLeft = scrollLeft - walk;
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const fixedWidgets = document.querySelector('.fixed-widgets');
  const buttonWidgets = document.querySelector('.button-widgets');
  const widgetsList = document.querySelector('.widgets-list');

  if (!buttonWidgets || !widgetsList) return;

  function toggleWidgetsList() {
    const isActive = buttonWidgets.classList.contains('active');

    if (isActive) {
      buttonWidgets.classList.remove('active');
      widgetsList.classList.remove('active');
    } else {
      buttonWidgets.classList.add('active');
      widgetsList.classList.add('active');
    }
  }

  buttonWidgets.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleWidgetsList();
  });

  document.addEventListener('click', function(e) {
    if (!fixedWidgets.contains(e.target) && widgetsList.classList.contains('active')) {
      buttonWidgets.classList.remove('active');
      widgetsList.classList.remove('active');
    }
  });


  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && widgetsList.classList.contains('active')) {
      buttonWidgets.classList.remove('active');
      widgetsList.classList.remove('active');
    }
  });
});


document.addEventListener('DOMContentLoaded', function() {
  var modalButtons = document.querySelectorAll('.open-modal-dialog'),
      overlay = document.querySelector('body'),
      closeButtons = document.querySelectorAll('.modal-dialog .modal-close');

  var currentOpenModal = null;

  async function openModal(modalBtn) {
    return new Promise(resolve => {
      var modalId = modalBtn.getAttribute('data-src'),
          modalElem = document.querySelector('.modal-dialog.' + modalId);

      if (currentOpenModal && currentOpenModal !== modalElem) {
        closeModalDirectly(currentOpenModal);
      }

      overlay.classList.add('modal-open');
      modalElem.style.display = 'flex';

      setTimeout(function() {
        modalElem.classList.add('modal-opening');
        currentOpenModal = modalElem;
        resolve();
      }, 0);
    });
  }

  async function closeModal(closeBtn) {
    return new Promise(resolve => {
      var modal = closeBtn.closest('.modal-dialog');
      modal.classList.remove('modal-opening');
      modal.classList.add('modal-closing');

      setTimeout(function() {
        modal.classList.remove('modal-closing');
        modal.style.display = 'none';
        overlay.classList.remove('modal-open');
        if (currentOpenModal === modal) {
          currentOpenModal = null;
        }
        resolve();
      }, 500);
    });
  }

  function closeModalDirectly(modalElem) {
    modalElem.classList.remove('modal-opening');
    modalElem.style.display = 'none';

    if (currentOpenModal === modalElem) {
      currentOpenModal = null;
    }

    var anyModalOpen = document.querySelector('.modal-dialog[style*="display: flex"]');
    if (!anyModalOpen) {
      overlay.classList.remove('modal-open');
    }
  }

  /* open modal */
  modalButtons.forEach(function(modalBtn) {
    modalBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      await openModal(modalBtn);
    });
  });

  /* close modal */
  closeButtons.forEach(function(closeBtn) {
    closeBtn.addEventListener('click', async function(e) {
      await closeModal(closeBtn);
    });
  });

  document.querySelectorAll('.modal-dialog').forEach(function(item) {
    item.addEventListener('click', async function(e) {
      if (e.target !== e.currentTarget) {
        return;
      } else {
        await closeModal(this);
      }
    });
  });

});
