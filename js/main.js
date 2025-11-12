async function toggleBookmark(postId, btn) {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in first");
      return;
    }

    const userRes = await fetch(`${USERS_URL}/${userId}`);
    const user = await userRes.json();

    let bookmarks = user.bookmarks || [];
    const idStr = String(postId);
    const isBookmarked = bookmarks.map(String).includes(idStr);

    // Add or remove bookmark
    if (isBookmarked) {
      bookmarks = bookmarks.filter(b => String(b) !== idStr);
    } else {
      bookmarks.push(idStr);
    }

    // Update user in database
    await fetch(`${USERS_URL}/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookmarks })
    });

    // Toggle icon color and style
    const icon = btn.querySelector("i");
    icon.classList.toggle("fa-solid");
    icon.classList.toggle("fa-regular");
    btn.classList.toggle("active-bookmark");

  } catch (err) {
    console.error("Error toggling bookmark:", err);
  }
}

// ===== LOAD POSTS =====
async function loadPosts() {
  try {
    const res = await fetch(POSTS_URL);
    const posts = await res.json();

    const userId = localStorage.getItem("userId");
    let userBookmarks = [];

    if (userId) {
      const userRes = await fetch(`${USERS_URL}/${userId}`);
      const user = await userRes.json();
      userBookmarks = (user.bookmarks || []).map(String);
    }

    const container = document.getElementById("postsContainer");
    

    posts.forEach(post => {
      const isBookmarked = userBookmarks.includes(String(post.id));

      const postEl = document.createElement("div");
      postEl.classList.add("post");
      postEl.innerHTML = `
        <h3><i class="fa-solid fa-user"></i> ${post.username}</h3>
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        ${post.image ? `<img src="${post.image}" alt="Post image">` : ""}
        <div class="tags">
          ${post.tags.map(t => `<span>#${t}</span>`).join("")}
        </div>
        <div class="actions">
          <button><i class="fa-regular fa-heart"></i> ${post.likes}</button>
          <button class="bookmark-btn post-bookmark ${isBookmarked ? "active-bookmark" : ""}" id="book_${post.id}">
            <i class="${isBookmarked ? "fa-solid" : "fa-regular"} fa-bookmark"></i>
          </button>
          <button><i class="fa-regular fa-comment"></i> ${post.comments.length}</button>
        </div>
      `;

      container.appendChild(postEl);

      // Bookmark click listener
      const bookmarkBtn = postEl.querySelector(`#book_${post.id}`);
      bookmarkBtn.addEventListener("click", () => toggleBookmark(post.id, bookmarkBtn));
    });
  } catch (err) {
    console.error("Error loading posts:", err);
  }
}

loadPosts();

// ===== ADD POST POPUP =====
const addPostBtn = document.getElementById("addPost");
const popupOverlay = document.getElementById("popupOverlay");
const cancelPostBtn = document.getElementById("cancelPost");
const postForm = document.getElementById("postForm");
let popupOpen = false;

addPostBtn.addEventListener("click", e => {
  e.preventDefault();
  if (!popupOpen) {
    popupOverlay.style.display = "flex";
    popupOpen = true;
  }
});

function closePopup() {
  popupOverlay.style.display = "none";
  popupOpen = false;
  postForm.reset();
}

cancelPostBtn.addEventListener("click", closePopup);
popupOverlay.addEventListener("click", e => {
  if (e.target === popupOverlay) closePopup();
});

postForm.addEventListener("submit", async e => {
  e.preventDefault();

  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();
  const image = document.getElementById("postImage").value.trim();
  const tagsInput = document.getElementById("postTags").value.trim();
  const tags = tagsInput ? tagsInput.split(",").map(t => t.trim()) : [];

  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");

  if (!title || !content) {
    // alert("Please fill in all required fields");
    showToast("Please fill in all required fields")
    return;
  }

  const newPost = {
    id: crypto.randomUUID(),
    userId,
    username,
    title,
    content,
    image,
    tags,
    likes: 0,
    comments: []
  };

  try {
    await fetch(POSTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    });

    // alert("Post added successfully!");
    showToast("Post added successfully!","success")
    
    closePopup();
    loadPosts();
  } catch (error) {
    console.error("Error adding post:", error);
  }
});
async function loadBookmarkedPosts() {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in first!");
      window.location.href = "login.html";
      return;
    }

    const userRes = await fetch(`${USERS_URL}/${userId}`);
    const user = await userRes.json();

    const postsRes = await fetch(POSTS_URL);
    const allPosts = await postsRes.json();

    const bookmarkedPosts = allPosts.filter(post =>
      user.bookmarks.map(String).includes(String(post.id))
    );

    const container = document.getElementById("bookmarksContainer");
    

    if (bookmarkedPosts.length === 0) {
      container.innerHTML = "<p>No bookmarked posts yet.</p>";
      return;
    }

    bookmarkedPosts.forEach(post => {
      const postEl = document.createElement("div");
      postEl.classList.add("post");
      postEl.innerHTML = `
        <h3><i class="fa-solid fa-user"></i> ${post.username}</h3>
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        ${post.image ? `<img src="${post.image}" alt="Post image">` : ""}
        <div class="tags">
          ${post.tags.map(t => `<span>#${t}</span>`).join("")}
        </div>
      `;
      container.appendChild(postEl);
    });
  } catch (error) {
    console.error("Error loading bookmarked posts:", error);
  }
}
document.addEventListener("DOMContentLoaded", loadBookmarkedPosts);