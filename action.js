// ------------------- CONSTANTS & VARIABLES INITIALIZATION --------------------

const api_root = 'https://api.themoviedb.org/3';
const api_key = '04718b82fcb8a7a13f6af06054b04c74';
const img_url_root = 'https://image.tmdb.org/t/p/';
const img_size = 'w342';

// ------------------------------ VUE JS ------------------------------

let app = new Vue({
  el: '#root',
  data: {
    page_title: 'Boolflix',
    product_searched: '',
    title_searched: '',
    is_searching: false,
    is_product_found: true,
    language_choice: 'it-IT',
    movies_list: [],
    series_list: [],
    products_list: [],
    languages_list: [
      {
        code: 'de',
        language: 'Detusch',
        url: 'germany_heart.png',
      },
      {
        code: 'el',
        language: 'Greek',
        url: 'greece_heart.png',
      },
      {
        code: 'en',
        language: 'English',
        url: 'uk_heart.png',
      },
      {
        code: 'es',
        language: 'Español',
        url: 'spain_heart.png',
      },
      {
        code: 'fr',
        language: 'French',
        url: 'france_heart.png',
      },
      {
        code: 'ja',
        language: 'Japanese',
        url: 'japan_heart.png',
      },
      {
        code: 'it',
        language: 'Italiano',
        url: 'italy_heart.png',
      },
      {
        code: 'pt',
        language: 'Portuguese',
        url: 'brazil_heart.png',
      },
      {
        code: 'zh',
        language: 'Chinese',
        url: 'china_heart.png',
      },
    ],
  },  // Closing data
  methods: {
    searchProduct() {
      // Checking that the user is actually searching for something (space is not a valid input)
      if(this.product_searched.trim()) {
        // Empty string is considered "false"
        this.is_searching = true;
        this.title_searched = this.product_searched.trim();
        // Emptying the arrays containing the results of the search
        this.movies_list = [];
        this.series_list = [];
        this.products_list = [];
        // ------------------------ AJAX call for movies ------------------------
        axios
        .get(api_root + '/search/movie', {
          params: {
            api_key: api_key,
            language: this.language_choice,
            query: this.product_searched,
          }
          // NB: Only the "response" to the AJAX call is ASYNC (what is in "then()")
        }).then(response => {
          // Filling the array of movies
          this.movies_list = response.data.results;
          console.log('Movies list: ', this.movies_list);
        });
        // ---------------------- AJAX call for tv series ----------------------
        axios
        .get(api_root + '/search/tv', {
          params: {
            api_key: api_key,
            language: this.language_choice,
            query: this.product_searched,
          }
          // NB: Only the "response" to the AJAX call is ASYNC (what is in "then()")
        }).then(response => {
          // Filling the array of tv series
          this.series_list = response.data.results;
          console.log('Series list: ', this.series_list);

          // Filling the array of products containing the results of all the searches
          this.products_list = [...this.movies_list, ...this.series_list];
          console.log('Products list: ', this.products_list);
          // Checking that the search has given some results
          if (!this.products_list.length) {
            this.is_product_found = false;
          } else {
            this.is_product_found = true;
          }
          this.is_searching = false;
        });
        // ------------------------ End of AJAX calls ------------------------
        this.product_searched = '';
      }
    },
    urlPoster(current_product) {
      return img_url_root + img_size + current_product.poster_path;
    },
    isMovie(current_product) {
      for (let key in current_product) {
        // If one of the keys is "original_title" or "title", then it is a movie
        if (current_product.hasOwnProperty('original_title') || current_product.hasOwnProperty('title')) {
          return true;
        // If one of the keys is "original_name" or "name", then it is a tv serie
        } else if (current_product.hasOwnProperty('original_name') || current_product.hasOwnProperty('name')){
          return false;
        // If none of the above, it returns null and in the HTML it throws an error message: "Title not available"
        } else {
          return null;
        }
      }
    },
    languageProduct(current_product) {
      let index_product_language = '';
      this.languages_list.forEach((language_details, index_language) => {
        // If the language code of the product is the same as the language code of any of the languages available, then I must store the index of the language details, so to retrieve its properties/vaues to be printed on screen
        if (current_product.original_language === language_details.code) {
          index_product_language = index_language;
        }
      });
      return index_product_language;
    },
    getVote(vote) {
      return Math.round(vote / 2);
    },
    fullStars(current_product) {
      return this.getVote(current_product.vote_average);
    },
    emptyStars(current_product) {
      let full_stars = this.getVote(current_product.vote_average);
      return 5 - full_stars;
    }
  },  // Closing methods
});
