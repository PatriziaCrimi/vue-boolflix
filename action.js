/* ASSIGNMENT
MILESTONE 1
Creare un layout di base con una barra di ricerca composta da un input e un pulsante.
Quando l'utente clicca sul pulsante,
facciamo una chiamata all'API https://api.themoviedb.org/3/search/movie
ricordandoci di passare la nostra API key
e la query di ricerca, ossia il testo inserito dall'utente nell'input.
Con i risultati che riceviamo, visualizziamo in pagina una card per ogni film, stampando per ciascuno:
- titolo
- titolo in lingua originale
- lingua originale
- voto

MILESTONE 2
La seconda milestone è a sua volta suddivisa in 3 punti:
1- sostituire il voto numerico su base 10 in un voto su base 5
e visualizzare in totale 5 stelline, di cui tante piene quanto è il voto arrotondato (non gestiamo stelline a metà). Ad esempio, se il voto è 8.2, dobbiamo visualizzare 4 stelline piene e 1 stellina vuota (in totale sempre 5)
2- sostituire la lingua con una bandierina che identifica il paese.
Suggerimento: scarichiamo una manciata di bandierine relative alle lingue che vogliamo gestire (attenzione che la lingua è "en", non "us" o "uk").
Quindi andremo ad inserire solamente le bandierine che sappiamo di avere,
mentre per le altre lingue di cui non abbiamo previsto la bandierina, lasciamo il codice della lingua testuale
3- aggiungere ai risultati anche le serie tv. Attenzione che alcune chiavi per le serie tv sono diverse da quelle dei film, come ad esempio "title" per i film e "name" per le serie.
*/


// ------------------------------ VUE JS ------------------------------

let app = new Vue({
  el: '#root',
  data: {
    page_title: 'VUE Boolflix',
    product_searched: '',
    language_choice: 'it',  // creare una SELECT
    products_list: [],
    language_object: {},
  },  // Closing data
  methods: {
    searchProduct() {
      if(this.product_searched === '') {
        // Error message in case of empty search
        alert('Empty search. Please enter a valid input in the search bar.')
      } else {
        // AJAX call
        axios
        .get('https://api.themoviedb.org/3/search/movie', {
          params: {
            api_key: '04718b82fcb8a7a13f6af06054b04c74',
            language: this.language_choice,
            query: this.product_searched,
          }
        }).then(response => {
          this.products_list = response.data.results;
          console.log(this.products_list);
        });
        this.product_searched = '';
      }
    },
    languageProduct(current_product) {
      switch (current_product.original_language) {
        case 'de':
          this.language_object = {
            language: 'Detusch',
            url: 'img/flags/germany_heart.png',
          };
          break;
        case 'el':
          this.language_object = {
            language: 'Greek',
            url: 'img/flags/greece_heart.png',
          };
          break;
        case 'en':
          this.language_object = {
            language: 'English',
            url: 'img/flags/uk_heart.png',
          };
          break;
        case 'es':
          this.language_object = {
            language: 'Español',
            url: 'img/flags/spain_heart.png',
          };
          break;
        case 'fr':
          this.language_object = {
            language: 'French',
            url: 'img/flags/france_heart.png',
          };
          break;
        case 'it':
          this.language_object = {
            language: 'Italiano',
            url: 'img/flags/italy_heart.png',
          };
          break;
        case 'ja':
          this.language_object = {
            language: 'Japanese',
            url: 'img/flags/japan_heart.png',
          };
          break;
        case 'pt':
          this.language_object = {
            language: 'Portuguese',
            url: 'img/flags/brazil_heart.png',
          };
          break;
        case 'zh':
          this.language_object = {
            language: 'Chinese',
            url: 'img/flags/china_heart.png',
          };
          break;
        default:
          this.language_object = {
            language: current_product.original_language,
            url: '',
          };
      } // Closing switch
      return this.language_object;
    },
  },  // Closing methods
});
