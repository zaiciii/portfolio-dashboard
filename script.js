// IMAGE PREVIEW
const imageInput = document.getElementById("image");
if (imageInput) {
  imageInput.addEventListener("change", function () {
    const file = this.files[0];
    const preview = document.getElementById("preview");

    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        preview.src = reader.result;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });
}

// UPLOAD FUNCTION
function upload() {
  let title = document.getElementById("title").value;
  let file = document.getElementById("file").files[0];
  let image = document.getElementById("image").files[0];

  if (title === "") {
    alert("Please enter a title!");
    return;
  }

  // AUTOMATICALLY DETECT TYPE BASED ON PAGE
  let page = window.location.pathname.split("/").pop(); // e.g., "lab.html"
  let type = "Quiz"; // default

  if (page.includes("quiz")) type = "Quiz";
  else if (page.includes("lab")) type = "Lab";
  else if (page.includes("exam")) type = "Exam";

  let reader = new FileReader();

  reader.onload = function () {
    let data = JSON.parse(localStorage.getItem("uploads")) || [];

    data.push({
      type: type,   // AUTOMATIC TYPE
      title: title,
      fileName: file ? file.name : "No file",
      image: image ? reader.result : null,
      date: new Date().toLocaleString()
    });

    localStorage.setItem("uploads", JSON.stringify(data));

    // show temporary "done" message
    const btn = document.querySelector(".form button");
    const originalText = btn.textContent;
    btn.textContent = "✅ Done!";
    btn.disabled = true;

    setTimeout(() => {
      // redirect to dashboard
      window.location.href = "dashboard.html";
    }, 1200);
  };

  if (image) {
    reader.readAsDataURL(image);
  } else {
    reader.onload();
  }
}

// DASHBOARD DISPLAY
if (document.getElementById("quiz-uploads")) {
  let data = JSON.parse(localStorage.getItem("uploads")) || [];

  const sections = {
    Quiz: document.getElementById("quiz-uploads"),
    Lab: document.getElementById("lab-uploads"),
    Exam: document.getElementById("exam-uploads")
  };

  // Clear each section first
  Object.values(sections).forEach(sec => sec.innerHTML = "");

  // Loop over each section type
  Object.keys(sections).forEach(type => {
    // Get all uploads of this type
    const uploads = data.filter(item => item.type === type);

    if (uploads.length === 0) {
      sections[type].innerHTML = "<p>No uploads yet...</p>";
    } else {
      uploads.forEach((item, index) => {
        sections[type].innerHTML += `
          <div class="dashboard-card">
            <p><b>${item.title}</b></p>
            <p>📁 ${item.fileName}</p>
            ${item.image ? `<img src="${item.image}" onclick="openLightbox(this.src)" style="width:100%; border-radius:10px; cursor:pointer;">` : ""}
            <small>${item.date}</small>
            <button onclick="deleteItem(${data.indexOf(item)})" class="delete-btn">Delete</button>
          </div>
        `;
      });
    }
  });
}

function openLightbox(src) {
  document.getElementById("lightbox").style.display = "flex";
  document.getElementById("lightbox-img").src = src;
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

function deleteItem(index) {
  let data = JSON.parse(localStorage.getItem("uploads")) || [];

  if (confirm("Are you sure you want to delete this?")) {
    data.splice(index, 1);
    localStorage.setItem("uploads", JSON.stringify(data));
    location.reload(); // refresh dashboard
  }
}

// FADE IN WHEN PAGE LOADS
window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("show");
});

// FADE OUT WHEN CLICKING LINKS
document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    // skip if no link or same page
    if (!href || href.startsWith("#")) return;

    e.preventDefault();

    document.body.classList.remove("show");

    setTimeout(() => {
      window.location.href = href;
    }, 300);
  });
});

document.querySelectorAll(".nav-link").forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const currentUrl = window.location.href;

  document.querySelectorAll("nav a").forEach(link => {
    if (link.href === currentUrl) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const heading = document.getElementById("upload-heading");
  if (!heading) return;

  const page = window.location.pathname.split("/").pop();

  if (page.includes("quiz")) {
    heading.textContent = "Upload Your Quizzes Here";
  } else if (page.includes("lab")) {
    heading.textContent = "Upload Your Lab Works Here";
  } else if (page.includes("exam")) {
    heading.textContent = "Upload Your Exams Here";
  }
});