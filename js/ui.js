document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebarToggle');
  const addPostBtn = document.getElementById('addPost');
  const popupOverlay = document.getElementById('popupOverlay');
  const cancelPost = document.getElementById('cancelPost');
  const postForm = document.getElementById('postForm');

  // restore collapsed state from localStorage
  const stored = localStorage.getItem('devres_sidebar_collapsed');
  if (stored === 'true') {
    sidebar.classList.add('collapsed');
  }

  // Toggle sidebar collapse/expand
  toggle.addEventListener('click', function () {
    const collapsed = sidebar.classList.toggle('collapsed');
    localStorage.setItem('devres_sidebar_collapsed', collapsed ? 'true' : 'false');
  });

  // Open popup
  if (addPostBtn) {
    addPostBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openPopup();
    });
  }

  // Cancel / close popup
  if (cancelPost) {
    cancelPost.addEventListener('click', function (e) {
      e.preventDefault();
      closePopup();
    });
  }

  // close popup if clicking outside the popup box
  if (popupOverlay) {
    popupOverlay.addEventListener('click', function (e) {
      // only close if clicked on overlay (not when clicking inside popup)
      if (e.target === popupOverlay) closePopup();
    });
  }

  // Escape key closes popup and collapses overlay bar on small screens
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closePopup();
      // if on mobile and sidebar is overlayed (not applicable in this layout) — no extra code necessary
    }
  });

  function openPopup() {
    if (!popupOverlay) return;
    popupOverlay.style.display = 'flex';
    document.body.classList.add('modal-open'); // block page scroll including aside
  }

  function closePopup() {
    if (!popupOverlay) return;
    popupOverlay.style.display = 'none';
    document.body.classList.remove('modal-open');
    if (postForm) postForm.reset(); // optional: clear form when closed
  }

  // If popup is submitted, close popup (you may already have your own behavior)
  if (postForm) {
    postForm.addEventListener('submit', function (e) {
      // your existing post submission code should handle adding post; we close overlay after submit
      // if your submission is async, close only on success; here we just close and rely on your main.js
      // e.preventDefault(); // don't prevent if you already handle it elsewhere
      closePopup();
    });
  }
});


function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icon = {
    info: "⚠️",
    success: "✅",
    error: "❌"
  }[type];

  toast.innerHTML = `
    <span class="icon">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(120%)";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
