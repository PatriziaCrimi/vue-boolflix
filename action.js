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
    search_item: '',
  },  // Closing data
  methods: {
    searchProduct() {
      // AJAX call
      axios
      .get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: '04718b82fcb8a7a13f6af06054b04c74',
          query: this.search_item,
        }
      }).then(response => {
        console.log(response);
        console.log(response.data.results);
      });
      this.search_item = '';
    },
  },  // Closing methods
});