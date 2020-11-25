// ------------------- CONSTANTS & VARIABLES INITIALIZATION --------------------

const api_root = 'https://api.themoviedb.org/3';
const api_key = '04718b82fcb8a7a13f6af06054b04c74';

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
    is_movies_search_ended: false,
    is_series_search_ended: false,
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
          this.is_movies_search_ended = true;
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
          this.is_series_search_ended = true;

          // Checking that both searches have ended
          if (this.is_movies_search_ended && this.is_series_search_ended) {
            // Filling the array of products containing the results of all the searches
            this.products_list = [...this.movies_list, ...this.series_list];
            console.log('Products list: ', this.products_list);
            // Checking that the search has given some results
            if (!this.products_list.length) {
              this.is_product_found = false;
            } else {
              this.is_product_found = true;
            }
          }
        });
        // ------------------------ End of AJAX calls ------------------------
        this.is_searching = false;
        this.product_searched = '';
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
    checkMovie(current_product) {
      for (let key in current_product) {
        if (current_product.hasOwnProperty(key)) {
          // Se una delle chiavi è "original_name" oppure "name" ho a che fare con una serie TV,
          // Se invece una delle chiavi è "title" oppure "original_title" ho a che fare con un film
        }
      }
    },
  },  // Closing methods
});
