const trigger = document.querySelector('#open-consultants');
const overlay = document.querySelector('#consultant-overlay');
const closeButton = document.querySelector('#close-popup');
const list = document.querySelector('#consultants-list');
let opening = false;

function waLink(phone) {
  const message = encodeURIComponent('Olá! Vim pelo site da Xingyu e gostaria de falar com uma consultora.');
  return `https://wa.me/${phone}?text=${message}`;
}

async function loadConsultants() {
  const response = await fetch('/api/rotation/next', { method: 'POST' });
  if (!response.ok) throw new Error('Falha ao carregar rodízio');
  return response.json();
}

function renderConsultants(consultants) {
  list.innerHTML = '';
  consultants.forEach((consultant, index) => {
    const link = document.createElement('a');
    link.className = 'consultant-link';
    link.href = waLink(consultant.whatsapp);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.innerHTML = `<span class="consultant-name">${consultant.name}</span><span class="consultant-action">Falar pelo WhatsApp →</span>`;
    link.addEventListener('click', () => {
      fetch('/api/events/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultantId: consultant.id, position: index + 1 })
      }).catch(() => {});
    });
    list.appendChild(link);
  });
}

async function openPopup() {
  if (opening || !overlay.hidden) return;
  opening = true;
  try {
    const { consultants } = await loadConsultants();
    renderConsultants(consultants);
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  } finally {
    opening = false;
  }
}

function closePopup() {
  overlay.hidden = true;
  document.body.style.overflow = '';
  trigger.focus();
}

trigger.addEventListener('click', openPopup);
closeButton.addEventListener('click', closePopup);
overlay.addEventListener('click', (event) => {
  if (event.target === overlay) closePopup();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !overlay.hidden) closePopup();
});
