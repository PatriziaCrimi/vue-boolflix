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
    searching: false,
    products_found: true,
    language_choice: 'it-IT',
    products_list: [],
    movies_list: [],
    series_list: [],
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
        this.searching = true;
        this.title_searched = this.product_searched.trim();
        // Emptying the array containing the results of the search
        this.products_list = [];
        // ------------------ AJAX call for movies ------------------
        axios
        .get(api_root + '/search/movie', {
          params: {
            api_key: api_key,
            language: this.language_choice,
            query: this.product_searched,
          }
          // NB: Only the "response" to the AJAX call is ASYNC (what is in "then()")
        }).then(response => {
          this.products_list = response.data.results;
          console.log(this.products_list);
          // Checking that the search has given some results
          if (!this.products_list.length) {
            this.products_found = false;
          } else {
            this.products_found = true;
          }
          this.searching = false;
        });
        // ------------------ AJAX call for tv series ------------------
        axios
        .get(api_root + '/search/tv', {
          params: {
            api_key: api_key,
            language: this.language_choice,
            query: this.product_searched,
          }
          // NB: Only the "response" to the AJAX call is ASYNC (what is in "then()")
        }).then(response => {
          this.series_list = response.data.results;
          console.log(this.series_list);
          /*
          // Checking that the search has given some results
          if (!this.series_list.length) {
            this.products_found = false;
          } else {
            this.products_found = true;
          }
          this.searching = false;
          */
        });
        // ------------------ End of AJAX call ------------------
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
  },  // Closing methods
});
