Promise.all([
  fetch("Collections.json").then(res => res.json()),
  fetch("Photos.json").then(res => res.json())
])
.then(([collections, photos]) => {

      const container = document.getElementById("collections");

      collections.forEach(col => {
        
        // Create outer div
        const item = document.createElement("div");
        item.onclick = () => {
          window.location.href = `collection.html?id=${col.id}`;
        };
        item.className = "collection-item rounded-lg overflow-hidden shadow-md bg-white transition hover:shadow-lg";
        item.setAttribute("data-aos", "zoom-in");

        // Image
        const img = document.createElement("img");
        img.src = col.image;
        img.alt = col.title;
        img.className = "w-full h-48 object-cover";

        // Content wrapper
        const content = document.createElement("div");
        content.className = "p-4";

        // Title
        const title = document.createElement("h3");
        title.className = "font-medium text-gray-900";
        title.textContent = col.title;

        // Count
        const photoList = photos[col.id] || [];
        const count = document.createElement("p");
        count.className = "text-sm text-gray-500";
        count.textContent = `${photoList.length} photos`;

        // Build structure
        content.appendChild(title);
        content.appendChild(count);
        item.appendChild(img);
        item.appendChild(content);


        // Append to container
        container.appendChild(item);
      });
    })
    .catch(err => console.error("Error loading collections:", err));

    