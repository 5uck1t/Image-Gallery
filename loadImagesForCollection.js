const params = new URLSearchParams(window.location.search);
const id = params.get("id");
console.log("Collection ID:", id);

const title = document.getElementById("title");
title.innerHTML = id;

// Helper function: generate a low-res thumbnail from full image
function createThumbnail(src, maxWidth = 400, callback) {
  const image = new Image();
  image.src = src;
  image.onload = () => {
    const scale = maxWidth / image.width;
    const canvas = document.createElement("canvas");
    canvas.width = maxWidth;
    canvas.height = image.height * scale;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const lowResSrc = canvas.toDataURL("image/jpeg", 0.7); // compressed
    callback(lowResSrc);
  };
  image.onerror = () => {
    // fallback to original src if image fails to load
    callback(src);
  };
}

fetch("Photos.json")
  .then(res => res.json())
  .then(data => {
    const photos = data[id] || [];
    const container = document.getElementById("photos");

    photos.forEach(photo => {
      // Outer gallery item
      const item = document.createElement("div");
      item.className = "gallery-item rounded-lg overflow-hidden shadow-md bg-white";
      item.setAttribute("data-aos", "zoom-in");

      // Image element
      const img = document.createElement("img");
      img.alt = photo.title || "Photo";
      img.loading = "lazy";
      img.className = "w-full h-48 object-cover cursor-pointer";

      // Create low-res thumbnail first
      createThumbnail(`${photo.filename}`, 400, (lowResSrc) => {
        img.src = lowResSrc;
      });

      // Store full image for lightbox
      img.dataset.full = `${photo.filename}`;

      img.onclick = () => {
        openLightbox(img);
      };

      // Content wrapper
      const content = document.createElement("div");
      content.className = "p-4";

      // Owner (Instagram link if available)
      // const owner = document.createElement("p");
      // if (photo.title && photo.title !== "-") {
      //   owner.innerHTML =
      //     'Owner: <a href="https://instagram.com/' +
      //     photo.title +
      //     '" class="text-blue-600 underline" target="_blank">@' +
      //     photo.title +
      //     "</a>";
      // } else {
      //   owner.textContent = "Owner: ❌";
      // }

      // Date
      const date = document.createElement("p");
      date.className = "text-sm text-gray-500";
      date.textContent = photo.date || "";

      // Button wrapper
      const buttonWrapper = document.createElement("div");
      buttonWrapper.className = "flex justify-between items-center mt-3";

      // Download button
      const downloadBtn = document.createElement("button");
      downloadBtn.className = "text-indigo-600 hover:text-indigo-800";
      downloadBtn.innerHTML = `<i data-feather="download" class="w-4 h-4"></i>`;
      downloadBtn.onclick = () => {
        const a = document.createElement("a");
        a.href = img.dataset.full; // download full-res image
        a.download = photo.filename;
        a.click();
      };

      buttonWrapper.appendChild(downloadBtn);
      // content.appendChild(owner);
      content.appendChild(date);
      content.appendChild(buttonWrapper);

      item.appendChild(img);
      item.appendChild(content);
      container.appendChild(item);
    });

    // Refresh feather icons
    if (window.feather) {
      feather.replace();
    }
  })
  .catch(err => console.error("Error loading photos:", err));

// Lightbox - shows full-res image
function openLightbox(element) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  lightboxImg.src = element.dataset.full || element.src; // full-res
  lightboxImg.alt = element.alt;
  lightbox.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.add("hidden");
  document.body.style.overflow = "auto";
}

// Loader overlay
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) loader.style.opacity = 0;
    setTimeout(() => {
      if (loader) loader.style.display = "none";
    }, 500);
  }, 500);
});
