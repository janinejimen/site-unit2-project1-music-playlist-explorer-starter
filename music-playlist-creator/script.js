document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("playlist-container");
  const modal = document.getElementById("playlist-modal");
  const closeBtn = modal ? modal.querySelector(".close-button") : null;
  const modalArt = document.getElementById("modal-art");
  const modalName = document.getElementById("modal-name");
  const modalAuthor = document.getElementById("modal-author");
  const modalSongs = document.getElementById("modal-songs");
  const shuffleBtn = document.getElementById("shuffle-songs");
  let currentPlaylist = null;

  // 1) Load playlists via fetch().then() chaining
  fetch("data/data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network error: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      let randomIndx = Math.floor(Math.random() * data.playlists.length);
      let randomPlaylist = data.playlists[randomIndx];
      const featuredCointer = document.getElementById("featured-container");
      if(featuredCointer) {
        featureTile(randomPlaylist);
      }
      
      console.log(randomPlaylist);
      const container = document.getElementById("playlist-container");
      if(container) {
        data.playlists.forEach(createPlaylistTile);
      }
    })
    .catch((err) => {
      console.error("Failed to load playlists:", err);
    });

    //creating the featured page 
    function featureTile(pl) {
      document.getElementById("f-art").src = pl.playlist_art;
      document.getElementById("f-name").textContent = pl.playlist_name;
      document.getElementById("f-author").textContent = "By: " + pl.playlist_author;
      updateFeaturedSongs(pl.songs);
    }

    function updateFeaturedSongs(songs) {
      let featuredSongs = document.getElementById("featured-songs");
      featuredSongs.innerHTML = "";
      songs.forEach((song) => {
      const li = document.createElement("li");
      // Create an img element for the song image
      if (song.image) {
      const img = document.createElement("img");
      img.src = song.image;
      img.alt = `${song.title} cover art`;
      li.appendChild(img);
      }
      // Create a div element for the song title and artist
    const detailsDiv = document.createElement("div");

    // Create an h2 element for the song title
    const title = document.createElement("h2");
    title.textContent = song.title;
    detailsDiv.appendChild(title);

    // Create a p element for the artist
    const artist = document.createElement("p");
    artist.textContent = song.artist;
    detailsDiv.appendChild(artist);

    li.appendChild(detailsDiv);

    // Create a p element for the duration
    const duration = document.createElement("p");
    duration.textContent = song.duration;
    li.appendChild(duration);

    featuredSongs.appendChild(li);
      });
    }

  // 2) Create each card
  function createPlaylistTile(pl) {
    const tile = document.createElement("div");
    tile.className = "playlist-tile";
    tile.innerHTML = `
        <img src="${pl.playlist_art}" alt="${pl.playlist_name}">
        <h3>${pl.playlist_name}</h3>
        <p>By ${pl.playlist_author}</p>
        <span class="heart-icon">&#x2665;</span>
        <span class="like-count">${pl.likes}</span>
      `;

    // open modal when clicking the tile (but not the heart)
    tile.addEventListener("click", (e) => {
      if (!e.target.classList.contains("heart-icon")) {
        openModal(pl);
      }
    });

    // toggle like/unlike
    const heart = tile.querySelector(".heart-icon");
    const count = tile.querySelector(".like-count");
    heart.addEventListener("click", (e) => {
      e.stopPropagation();
      let n = parseInt(count.textContent, 10);
      if (heart.classList.contains("liked")) {
        heart.classList.remove("liked");
        count.textContent = --n;
      } else {
        heart.classList.add("liked");
        count.textContent = ++n;
      }
    });

    container.appendChild(tile);
  }

  


// Update the modal songs list
function updateModalSongs(songs) {
  modalSongs.innerHTML = "";
  songs.forEach((song) => {
    const li = document.createElement("li");

    // Create an img element for the song image
    if (song.image) {
      const img = document.createElement("img");
      img.src = song.image;
      img.alt = `${song.title} cover art`;
      li.appendChild(img);
    }

    // Create a div element for the song title and artist
    const detailsDiv = document.createElement("div");

    // Create an h2 element for the song title
    const title = document.createElement("h2");
    title.textContent = song.title;
    detailsDiv.appendChild(title);

    // Create a p element for the artist
    const artist = document.createElement("p");
    artist.textContent = song.artist;
    detailsDiv.appendChild(artist);

    li.appendChild(detailsDiv);

    // Create a p element for the duration
    const duration = document.createElement("p");
    duration.textContent = song.duration;
    li.appendChild(duration);

    modalSongs.appendChild(li);
  });
}
// 4) Close handlers
closeBtn.addEventListener("click", () => {
  modal.classList.remove("show");
});
  modal.addEventListener("click", (e) => {
if (e.target === modal) {
  modal.classList.remove("show");
}
});
  // 3) Populate and show modal
  function openModal(pl) {
    currentPlaylist = pl; // Set the current playlist
    modalArt.src = pl.playlist_art;
    modalName.textContent = pl.playlist_name;
    modalAuthor.textContent = "By " + pl.playlist_author;
    updateModalSongs(pl.songs);
    modal.classList.add("show");
}
// Shuffle button handler
shuffleBtn.addEventListener("click", () => {
  if (currentPlaylist) {
  currentPlaylist.songs = shuffleSongs(currentPlaylist.songs);
  updateModalSongs(currentPlaylist.songs); 
}
});
});
// Shuffle function
function shuffleSongs(songs) {
  let currentIndex = songs.length;
  let shuffledSongs = [...songs]; 
  while (currentIndex != 0) {
  let randomIndex = Math.floor(Math.random() * currentIndex);
  currentIndex--;
  [shuffledSongs[currentIndex], shuffledSongs[randomIndex]] = [shuffledSongs[randomIndex], shuffledSongs[currentIndex]];
  }
  return shuffledSongs;
}