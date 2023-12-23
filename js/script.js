const bukus = [];
const RENDER_EVENT = 'render-buku';

function generateId() {
  return +new Date();
}

function generateBukuObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  };
}

function saveToLocalStorage() {
  localStorage.setItem('bukus', JSON.stringify(bukus));
}

function loadFromLocalStorage() {
  const storedBukus = localStorage.getItem('bukus');
  if (storedBukus) {
    bukus.push(...JSON.parse(storedBukus));
  }
}

function tambahBuku() {
  const title = document.getElementById('judul').value;
  const author = document.getElementById('penulis').value;
  const year = parseInt(document.getElementById('tahun').value);

  let checkBox = document.getElementById('bukuIsCompleted');
  let isComplete = checkBox.checked;

  if (!isComplete) {
    isComplete = false;
  } else {
    isComplete = true;
  }

  const generatedID = generateId();
  const bukuObject = generateBukuObject(generatedID, title, author, year, isComplete);
  bukus.push(bukuObject);
  saveToLocalStorage();

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function () {
  const btntambah = document.getElementById('tambahBuku');
  btntambah.addEventListener('submit', function (event) {
    event.preventDefault();
    tambahBuku();
  });

  loadFromLocalStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
});

document.addEventListener(RENDER_EVENT, function () {
  console.log(bukus);
});

function makeBuku(bukuObject) {
  const textTitle = document.createElement('h3');
  textTitle.classList.add('sorotan');
  textTitle.innerText = bukuObject.title;

  const p1 = document.createElement('p');
  p1.innerText = 'Penulis = ' + bukuObject.author;

  const p2 = document.createElement('p');
  p2.innerText = 'Tahun Terbit = ' + bukuObject.year;

  const btnSelesaiDibaca = document.createElement('button');
  btnSelesaiDibaca.classList.add('tosca');
  btnSelesaiDibaca.innerText = 'Selesai Dibaca';

  const btnHapus = document.createElement('button');
  btnHapus.classList.add('red');
  btnHapus.innerText = 'Hapus';

  const aksi = document.createElement('div');
  aksi.classList.add('aksi');
  aksi.append(btnSelesaiDibaca, btnHapus);

  const article = document.createElement('article');
  article.append(textTitle, p1, p2, aksi);

  if (bukuObject.isComplete) {
    btnSelesaiDibaca.innerText = 'Belum Selesai Dibaca';
  } else {
    btnSelesaiDibaca.innerText = 'Selesai Dibaca';
  }

  btnHapus.addEventListener('click', function () {
    const index = bukus.findIndex(b => b.id === bukuObject.id);

    if (index !== -1) {
      bukus.splice(index, 1);
      saveToLocalStorage();
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
  });

  return article;
}

document.addEventListener(RENDER_EVENT, function () {
  const bukuBelumDibaca = document.getElementById('bukuBelumDibaca');
  const bukuSelesaiDibaca = document.getElementById('bukuSelesaiDibaca');

  bukuBelumDibaca.innerHTML = '';
  bukuSelesaiDibaca.innerHTML = '';

  bukus.forEach(function (bukuObject) {
    const bukuElement = makeBuku(bukuObject);

    const btnSelesaiDibaca = bukuElement.querySelector('.tosca');
    btnSelesaiDibaca.addEventListener('click', function () {
      if (bukuObject.isComplete) {
        bukuObject.isComplete = false;
      } else {
        bukuObject.isComplete = true;
      }

      saveToLocalStorage();
      document.dispatchEvent(new Event(RENDER_EVENT));
    });

    if (bukuObject.isComplete) {
      bukuSelesaiDibaca.appendChild(bukuElement);
    } else {
      bukuBelumDibaca.appendChild(bukuElement);
    }
  });
});
