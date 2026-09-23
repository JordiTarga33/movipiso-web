(() => {
  const calculator = document.querySelector('[data-calculator]');
  const backdrop = document.querySelector('[data-modal-backdrop]');
  const openButtons = document.querySelectorAll('[data-open-calculator]');
  const closeButton = document.querySelector('[data-close-calculator]');
  const prevButton = document.querySelector('[data-prev]');
  const nextButton = document.querySelector('[data-next]');
  const actions = document.querySelector('[data-calculator-actions]');
  const steps = [...document.querySelectorAll('.step')];
  const progress = document.querySelector('[data-progress]');
  const stepLabel = document.querySelector('[data-step-label]');
  const stepName = document.querySelector('[data-step-name]');
  const form = document.getElementById('move-calculator');
  const toast = document.querySelector('[data-toast]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const contactPlaceholders = document.querySelectorAll('[data-contact-placeholder]');

  let currentStep = 1;
  let lastFocused = null;
  let toastTimer = null;
  const names = ['Ruta', 'Accesos', 'Volumen', 'Fecha y servicios', 'Contacto opcional'];

  const setMinDate = () => {
    const input = form.elements.date;
    if (!input) return;
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    input.min = `${yyyy}-${mm}-${dd}`;
  };

  const showToast = (message) => {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('is-visible');
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
  };

  const openCalculator = (event) => {
    lastFocused = event?.currentTarget || document.activeElement;
    calculator.hidden = false;
    backdrop.hidden = false;
    document.body.classList.add('modal-open');
    currentStep = 1;
    showStep();
    requestAnimationFrame(() => closeButton.focus());
  };

  const closeCalculator = () => {
    calculator.hidden = true;
    backdrop.hidden = true;
    document.body.classList.remove('modal-open');
    lastFocused?.focus?.();
  };

  const showStep = () => {
    steps.forEach(step => step.classList.remove('is-active'));

    if (currentStep === 'result') {
      document.querySelector('[data-step="result"]').classList.add('is-active');
      progress.style.width = '100%';
      stepLabel.textContent = 'Resultado';
      stepName.textContent = 'Simulación';
      actions.hidden = true;
      return;
    }

    document.querySelector(`[data-step="${currentStep}"]`).classList.add('is-active');
    progress.style.width = `${currentStep * 20}%`;
    stepLabel.textContent = `Paso ${currentStep} de 5`;
    stepName.textContent = names[currentStep - 1];
    prevButton.disabled = currentStep === 1;
    nextButton.textContent = currentStep === 5 ? 'Ver estimación →' : 'Siguiente →';
    actions.hidden = false;
  };

  const validateStep = () => {
    const active = document.querySelector(`[data-step="${currentStep}"]`);
    const required = [...active.querySelectorAll('[required]')];
    for (const field of required) {
      if (!field.checkValidity()) {
        field.reportValidity();
        field.focus();
        return false;
      }
    }
    return true;
  };

  const readChecked = (name) => [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(el => el.value);

  const demoEstimate = () => {
    const data = new FormData(form);
    const route = data.get('route');
    const rooms = Number(data.get('rooms') || 1);
    const boxes = Number(data.get('boxes') || 0);
    const originFloor = Number(data.get('originFloor') || 0);
    const destinationFloor = Number(data.get('destinationFloor') || 0);
    const originLift = form.elements.originLift.checked;
    const destinationLift = form.elements.destinationLift.checked;
    const specials = readChecked('special');
    const services = readChecked('service');

    let base = 155;
    base += rooms * 92;
    base += boxes * 34;
    base += route === 'metro' ? 68 : route === 'province' ? 145 : 28;
    if (!originLift) base += originFloor * 24;
    if (!destinationLift) base += destinationFloor * 24;
    base += specials.length * 48;
    base += services.length * 42;

    const min = Math.round(base / 10) * 10;
    const max = Math.round((base * 1.22) / 10) * 10;

    document.querySelector('[data-result-min]').textContent = min;
    document.querySelector('[data-result-max]').textContent = max;

    const origin = data.get('origin') || 'Origen';
    const destination = data.get('destination') || 'Destino';
    const roomLabel = {
      '0.25':'Solo algunos muebles',
      '0.5':'Estudio',
      '1':'1 habitación',
      '2':'2 habitaciones',
      '3':'3 habitaciones',
      '4':'4+ habitaciones'
    }[String(data.get('rooms'))] || 'Volumen por confirmar';

    document.querySelector('[data-result-summary]').innerHTML = [
      `<strong>Ruta:</strong> ${escapeHtml(origin)} → ${escapeHtml(destination)}`,
      `<strong>Volumen:</strong> ${roomLabel}`,
      `<strong>Accesos:</strong> origen planta ${originFloor}${originLift ? ' con ascensor' : ' sin ascensor'} · destino planta ${destinationFloor}${destinationLift ? ' con ascensor' : ' sin ascensor'}`,
      `<strong>Extras indicados:</strong> ${specials.length + services.length || 'ninguno'}`
    ].join('<br>');

    currentStep = 'result';
    showStep();
  };

  const escapeHtml = (value) => String(value)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'","&#039;");

  openButtons.forEach(button => button.addEventListener('click', openCalculator));
  closeButton.addEventListener('click', closeCalculator);
  backdrop.addEventListener('click', closeCalculator);

  prevButton.addEventListener('click', () => {
    if (currentStep === 'result') return;
    currentStep = Math.max(1, currentStep - 1);
    showStep();
  });

  nextButton.addEventListener('click', () => {
    if (!validateStep()) return;
    if (currentStep === 5) return demoEstimate();
    currentStep += 1;
    showStep();
  });

  form.addEventListener('submit', event => event.preventDefault());

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !calculator.hidden) closeCalculator();
  });

  menuToggle.addEventListener('click', () => {
    const willOpen = mobileMenu.hidden;
    mobileMenu.hidden = !willOpen;
    menuToggle.setAttribute('aria-expanded', String(willOpen));
  });

  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mobileMenu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  contactPlaceholders.forEach(button => button.addEventListener('click', () => {
    showToast('Falta conectar el número real de WhatsApp de Movipiso.');
  }));

  setMinDate();
  showStep();
})();