export default class ImageApiService {
    constructor () {
        this.searchQuery = '';
        this.page = 1;
        this.URL = 'https://pixabay.com/api/';
        this.KEY = '19046001-7d44b7f00f708df4674bb235b';
        this.perPage = 12;
    }

    async fetchImages() {
    const response = await fetch(`${this.URL}?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=${this.perPage}&key=${this.KEY}`)
    return await response.json();
    };

    incrementPage() {
        this.page += 1;
    }

    restPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}