const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

openModalBtn?.addEventListener('click', () => {
  modal?.classList.add('open');
});

closeModalBtn?.addEventListener('click', () => {
  modal?.classList.remove('open');
});

// Fetch example
fetch('https://jsonplaceholder.typicode.com/posts')
  .then(response => response.json())
  .then(data => {
    const postsContainer = document.getElementById('posts');
    if (postsContainer) {
      data.forEach((post: { title: string; body: string }) => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `<h2>${post.title}</h2><p>${post.body}</p>`;
        postsContainer.appendChild(postElement);
      });
    }
  });
