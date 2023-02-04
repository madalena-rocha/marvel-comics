/* MARVEL API */

const API_KEY = "02f6da60b186a7d2d5581a94b5a767ff";
const TIMESTAMP = "1675345356";
const HASH = "05ff9359ec48fda4bc2fa09a27f4e9a2";

/* COMICS LIST */

const comics = document.querySelector("#comics");

/* COMIC MODAL */

const comicModal = document.getElementById("comic-modal");
const close = document.getElementsByClassName("close")[0];
const comicTitle = document.getElementById("comic-title");
const comicImage = document.getElementById("comic-image");
const comicDescription = document.getElementById("comic-description");
const sendButton = document.getElementById("send-button");

/* MAP MODAL */

const mapModal = document.getElementById("map-modal");
const map = document.getElementById("map");
const okButton = document.getElementById("ok-button");

/* ADDRESS MODAL */

const addressModal = document.getElementById("address-modal");
const shippingAddress = document.getElementById("shipping-address");
const finishButton = document.getElementById("finish-button");

/* INFINITE SCROLL */

let currentPage = 1;

loadData(currentPage);

comics.addEventListener("scroll", function() {
  if (this.scrollHeight - this.scrollTop <= this.clientHeight + 20) {
    currentPage++;
    loadData(currentPage);
  }
});

/* LOAD COMICS */

async function loadData(page) {
  fetch(
    `http://gateway.marvel.com/v1/public/comics?ts=${TIMESTAMP}&apikey=${API_KEY}&hash=${HASH}&limit=20&offset=${
      (page - 1) * 20
    }`
  )
    .then((response) => response.json())
    .then((data) => {
      data.data.results.forEach((element) => {
        const listItem = document.createElement("li");
        const comicID = element.id;
        const srcImage =
          element.thumbnail.path + "." + element.thumbnail.extension;
        const comicName = element.title;

        listItem.innerHTML += `
          <button onClick="handleOpenModal(${comicID})" class="comic">
            <img src="${srcImage}" alt="">
            <h3>${comicName}</h3>
          </button>
        `;
        comics.appendChild(listItem);
      });
    });
}

/* COMIC MODAL */

async function handleOpenModal(id) {
  const comicId = id;
  fetch(
    `https://gateway.marvel.com/v1/public/comics/${comicId}?ts=${TIMESTAMP}&apikey=${API_KEY}&hash=${HASH}`
  )
    .then((response) => response.json())
    .then((data) => {
      const comic = data.data.results[0];
      comicTitle.innerHTML = comic.title;
      comicImage.src = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
      comicDescription.innerHTML = comic.description;
      comicModal.style.display = "block";
    })
    .catch((error) => {
      console.error(error);
    });
}

close.addEventListener("click", () => {
  comicModal.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target == comicModal) {
    comicModal.style.display = "none";
  }
});

/* GOOGLE MAPS */

function initMap() {}

/* MAP MODAL */

function OpenMap() {
  comicModal.style.display = "none";
  mapModal.style.display = "block";

  let pos;

  let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: { lat: -34.397, lng: 150.644 },
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      map.setCenter(pos);

      let marker = new google.maps.Marker({
        position: pos,
        map: map,
        draggable: true,
      });

      let geocoder = new google.maps.Geocoder();

      okButton.addEventListener("click", () => {
        geocoder.geocode(
          { latLng: marker.getPosition() },
          function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              address = results[0].formatted_address;
              console.log("Endereço selecionado: " + address);
              mapModal.style.display = "none";
              OpenAddressModal();
            } else {
              console.log(
                "Não foi possível obter o endereço. Status: " + status
              );
            }
          }
        );
      });
    });
  }
}

sendButton.addEventListener("click", function() {
  OpenMap();
});

/* ADDRESS MODAL */

function OpenAddressModal() {
  addressModal.style.display = "block";
  shippingAddress.innerHTML =
    "O quadrinho será enviado para o endereço: " + address;
}

finishButton.addEventListener("click", () => {
  addressModal.style.display = "none";
});
