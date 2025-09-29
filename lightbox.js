function openLightbox(element) {
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            
            lightboxImg.src = element.src;
            lightboxImg.alt = element.alt;
            lightbox.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.add('hidden');
  document.body.style.overflow = 'auto';
}