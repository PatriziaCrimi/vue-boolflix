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
    language_choice: 'it-IT',
    products_list: [],
    languages_list: [
      {
        code: 'de',
        language: 'Detusch',
        url: 'germany_heart',
      },
      {
        code: 'el',
        language: 'Greek',
        url: 'greece_heart',
      },
      {
        code: 'en',
        language: 'English',
        url: 'uk_heart',
      },
      {
        code: 'es',
        language: 'Español',
        url: 'spain_heart',
      },
      {
        code: 'fr',
        language: 'French',
        url: 'france_heart',
      },
      {
        code: 'ja',
        language: 'Japanese',
        url: 'japan_heart',
      },
      {
        code: 'it',
        language: 'Italiano',
        url: 'italy_heart',
      },
      {
        code: 'pt',
        language: 'Portuguese',
        url: 'brazil_heart',
      },
      {
        code: 'zh',
        language: 'Chinese',
        url: 'china_heart',
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
        // Emptying the array containing the results of the search
        this.products_list = [];

        // Defining the parameters for both the AJAX calls
        let api_params = {
          params: {
            api_key: api_key,
            language: this.language_choice,
            query: this.product_searched,
          }
        };
        // ------------------------ AJAX call for movies ------------------------
        axios
        .get(api_root + '/search/movie', api_params)
        // NB: Only the "response" to the AJAX call is ASYNC (what is in "then()")
        .then(response => {
          // Filling the array of products with the movies found in the first AJAX call while concatening whatever was already in the "products_list" array (if the second AJAX call had ended first, this array would contain already the tv series) --> This part of code needs to be repeated in both AJAX calls because of ASYNC

          // ***** OPTION 1 - CONCAT() *****
          this.products_list = this.products_list.concat(response.data.results);
          /*
          // ***** OPTION 2 - SPREAD OPERATOR *****
          this.products_list = [...this.products_list, ...response.data.results];
          */
          console.log('Products list (after movies AJAX call): ', this.products_list);

          // Search ended
          this.is_searching = false;
        });

        // ---------------------- AJAX call for tv series ----------------------
        axios
        .get(api_root + '/search/tv', api_params)
        .then(response => {
          // Filling the array of products with the tv series found in the second AJAX call while concatening whatever was already in the "products_list" array (if the first AJAX call had ended first, this array would contain already the movies) --> This part of code needs to be repeated in both AJAX calls because of ASYNC

          // ***** OPTION 1 - CONCAT() *****
          this.products_list = this.products_list.concat(response.data.results);
          /*
          // ***** OPTION 2 - SPREAD OPERATOR *****
          this.products_list = [...this.products_list, ...response.data.results];
          */
          console.log('Products list (after tv series AJAX call): ', this.products_list);

          // Search ended
          this.is_searching = false;
        });
        // ------------------------ End of AJAX calls ------------------------
        this.product_searched = '';
      }
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
    getUrlPoster(current_product) {
      return img_url_root + img_size + current_product.poster_path;
    },
    getUrlFlag(current_product) {
      return 'img/flags/' + this.languages_list[this.languageProduct(current_product)].url + '.png';
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
    getFullStars(current_vote) {
      return Math.ceil(current_vote / 2);
    },
    getEmptyStars(current_vote) {
      return 5 - this.getFullStars(current_vote);
    }
  },  // Closing methods
});
