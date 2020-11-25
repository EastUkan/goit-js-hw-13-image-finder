import './styles.css';
import debounce from 'lodash.debounce';

import onOpenModal from './js/open-modal.js';
import listImagesTpl from './templates/listImages.hbs';
import ImageApiService from './js/apiService.js';
import { noticeEmptyQuery, noticeNoImages } from './js/notise.js';

const imageApiService = new ImageApiService();

const refs = {
  inputForm: document.querySelector('.form-control'),
  galeryImages: document.querySelector('.gallery'),
  sentinel: document.querySelector('#sentinel'),
  card: document.querySelector('.photo-card'),
};

refs.inputForm.addEventListener('input', debounce(onInputSerch, 1000));
refs.galeryImages.addEventListener('click', onOpenModal);
window.addEventListener('keydown', onKeydownEnter);

function onInputSerch() {
  if (imageApiService.page === 2) {
    return
  } else {
    onSerch();
  };
};

async function onSerch() {
  try {
    imageApiService.query = refs.inputForm.value;
    imageApiService.restPage();
    clearCountysContainer();
    fetchImageslist();
    imageApiService.incrementPage();
  } catch (error) {
    console.log(error);
    console.log('Ваш запит не виконано. Помилка');
  }
};

function appendImagesMarkup(listImages) {
  refs.galeryImages.insertAdjacentHTML('beforeend', listImagesTpl(listImages));
};

async function fetchImageslist() {
  try {
    imageApiService.fetchImages().then(images => {
      noticeOnSearchInput(images);
      appendImagesMarkup(images);
    });
  } catch (error) {
    console.log(error)
  }
};
  
function clearCountysContainer() {
  refs.galeryImages.innerHTML = '';
};

function noticeOnSearchInput(images) {
  if (imageApiService.query === '') {
      clearCountysContainer();
      return noticeEmptyQuery();
  } else if (images.hits.length === 0) {
    return noticeNoImages();
    }
}

function onKeydownEnter(evt) {
    if (evt.code !== 'Enter') {
        return
    } else {
      evt.preventDefault();
      onSerch();
  };   
};

function onEntry(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && imageApiService.query !== '') {
        imageApiService.fetchImages().then(images => {
          appendImagesMarkup(images);
        });
        imageApiService.incrementPage();
      }
    });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
observer.observe(refs.sentinel);

