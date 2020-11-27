// ------------------- CONSTANTS & VARIABLES INITIALIZATION --------------------

const api_root = 'https://api.themoviedb.org/3';
const api_key = '04718b82fcb8a7a13f6af06054b04c74';
const poster_url_root = 'https://image.tmdb.org/t/p/';
const poster_size = 'w342';
const poster_na = 'img/poster_na.png';
let language_choice = 'it-IT';
// Defining the parameters for most of the next AJAX calls
let api_params = {
  params: {
    api_key: api_key,
    language: language_choice,
  }
};

// ------------------------------ VUE JS ------------------------------

let app = new Vue({
  el: '#root',
  data: {
    page_title: 'Boolflix',
    product_searched: '',
    title_searched: '',
    is_searching: false,
    index_active_product: '',
    products_list: [],
    genres_list: [],
    cast_list: [],
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
  mounted: function() {
    this.getGenresList();
  },  // Closing mounted
  methods: {
    getGenresList() {
      // -------------------- AJAX call for movies genres --------------------
      axios
      .get(api_root + '/genre/movie/list', api_params)
      .then(response => {
        this.genres_list = this.genres_list.concat(response.data.genres);
        console.log('Genres list (movies call): ', this.genres_list);
      });
      // ------------------- AJAX call for tv series genres -------------------
      axios
      .get(api_root + '/genre/tv/list', api_params)
      .then(response => {
        this.genres_list = this.genres_list.concat(response.data.genres);
        console.log('Genres list (tv series call): ', this.genres_list);
      });
    },
    getProducts(response_array) {
      // ***** OPTION 1 - CONCAT() *****
      this.products_list = this.products_list.concat(response_array);
      /*
      // ***** OPTION 2 - SPREAD OPERATOR *****
      this.products_list = [...this.products_list, ...response_array];
      */
      console.log('Products list: ', this.products_list);
      // Search ended
      this.is_searching = false;
    },
    searchProduct() {
      // Checking that the user is actually searching for something (space is not a valid input)
      if(this.product_searched.trim()) {
        // Empty string is considered "false"
        this.is_searching = true;
        this.title_searched = this.product_searched.trim();
        // Emptying the array containing the results of the search
        this.products_list = [];

        // Defining the parameters for both the next AJAX calls
        let api_params_query = {
          params: {
            api_key: api_key,
            language: language_choice,
            query: this.product_searched,
          }
        };

        // ------------------------ AJAX call for movies ------------------------
        axios
        .get(api_root + '/search/movie', api_params_query)
        // NB: Only the "response" to the AJAX call is ASYNC (what is in "then()")
        .then(response => {
          // Filling the array of products with the movies found in this AJAX call while concatening whatever was already in the "products_list" array (if the second AJAX call had ended first, this array would contain already the tv series)
          this.getProducts(response.data.results); // --> This part of code needs to be repeated in both AJAX calls because of ASYNC
        });

        // ---------------------- AJAX call for tv series ----------------------
        axios
        .get(api_root + '/search/tv', api_params_query)
        .then(response => {
          // Filling the array of products with the tv series found in this AJAX call while concatening whatever was already in the "products_list" array (if the first AJAX call had ended first, this array would contain already the movies)
          this.getProducts(response.data.results); // --> This part of code needs to be repeated in both AJAX calls because of ASYNC
        });
        // ------------------------ End of AJAX calls ------------------------
        // Emptying the input value
        this.product_searched = '';
      }
    },
    getProductGenres(current_product) {
      let product_genres_list = [];
      // Retrieving the genres codes for the current product
      let current_product_genres_codes = current_product.genre_ids;
      // Scanning the array of all genres (created in "mounted")
      this.genres_list.forEach((genre_listed) => {
        // Scanning the array of genres codes of this current product
        current_product_genres_codes.forEach((product_genre_code) => {
          if(genre_listed.id === product_genre_code) {
            if(!product_genres_list.includes(genre_listed.name)) {
              product_genres_list.push(genre_listed.name);
            }
          }
        });
      });
      console.log('Product genres list: ' , product_genres_list);
      console.log('Product genres list: ' + product_genres_list.join(', '));
      return product_genres_list.join(', ');
    },
    getCast(current_product) {
      let api_path_param_movie = {
          movie_id: current_product.id,
      };
      // Checking if the current product is a movie or a tv serie
      if(this.isMovie(current_product)) {
        // --------------------- AJAX call for movies cast ---------------------
        axios
        .get(api_root + '/movie/', api_path_param_movie , '/credits', api_params)
        .then(response => {
          this.cast_list = response.cast
          // slice(0, 5);
          console.log(this.cast_list);
        });
      } else {
        // ------------------- AJAX call for tv series cast -------------------
        let api_path_param_serie = {
            tv_id: current_product.id,
        };
        axios
        .get(api_root + '/tv/', api_path_param_serie , '/credits', api_params)
        .then(response => {
          this.cast_list = response;
          // slice(0, 5);
          console.log(this.cast_list);
        });
      }
    },
    isMovie(current_product) {
      // If one of the keys is "original_title" or "title", then it is a movie
      if (current_product.hasOwnProperty('original_title') || current_product.hasOwnProperty('title')) {
        return true;
      // If one of the keys is "original_name" or "name", then it is a tv serie
      } else if (current_product.hasOwnProperty('original_name') || current_product.hasOwnProperty('name')){
        return false;
      // If none of the above, it returns null and in the HTML it throws an error message: "Title not available"
      }
      return null;
    },
    getUrlPoster(current_product) {
      if (current_product.poster_path) {
        return poster_url_root + poster_size + current_product.poster_path;
      }
      return poster_na;
    },
    getUrlFlag(current_product) {
      return 'img/flags/' + this.languages_list[this.getIndexLanguage(current_product)].url + '.png';
    },
    getIndexLanguage(current_product) {
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
    },
    flipCard(index_product) {
      this.index_active_product = index_product;
    },
  },  // Closing methods
});
