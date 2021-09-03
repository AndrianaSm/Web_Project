// Put your client side JS code here
  document.getElementById('searchBtn').addEventListener('click', getBooks);
  document.getElementById('favImg').addEventListener('click', getFav);
  var searchHeader = document.getElementById("searchHeader");
  const results = document.getElementById('results');
  var mybutton = document.getElementById("myTopBtn");
  var input = document.getElementById("sercherBook");
  input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("searchBtn").click();
    }
});

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function() {scrollFunction()};


  function getBooks () {
      let img = "";
      var input = document.getElementById("sercherBook").value;
      searchHeader.innerHTML=""
      results.innerHTML = null;
      if(input!=""){
        searchHeader.innerHTML = `<h1>Αναζήτηση για : ${input}</h1> `;
        fetch(`https://reststop.randomhouse.com/resources/works?search=${input}`,{
            method: 'GET',
            headers :{
              'Accept': 'application/json, image/*'
            }
        })
        .then(res => res.json())
        .then(data => {
          console.log(data.work[1]);
          for (let element of data.work) {
            if(Array.isArray(element.titles.isbn)) {
              img = element.titles.isbn[0].$;
            }else{
              img = element.titles.isbn.$;
            }
            results.innerHTML += displayResults( element.workid, element.titleweb, element.authorweb, img );

          }
        })
        .catch(error => console.log(error));
      }else{
      snackbar("Παρακαλώ γράψτε τις λέξεις κλειδιά!");
      }
    }

    function displayResults(id,title,author,img){
    return (
        `
        <div id="${id}">
        <span><img src="https://images4.penguinrandomhouse.com/cover/${img} "width="200" /></span>
        <span>Τίτλος: ${title}<br></br> Συγγραφέας: ${author} <br></br> Κωδικός: ${id}</span>
	      </div>
        <input id="add-fave" class="favBtn" type="submit" value="add to favorites" onclick="add_to_fav(${id},'${author}','${title}','${img}')"></input>
        <input id="remove-fave" class="favBtn" type="submit" value="remove from favorites" onclick="remove_from_fav(${id},'${author}','${title}','${img}')"></input>
        <hr>
         `
    );
    }

    async function add_to_fav( id, author, title,img) {

      const data_post = {id,title,author,img}

      const options = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_post)
      }
      console.log("im here");
      const res = await fetch('/favbooks',options)
      const json = await res.json();
      console.log(json.status)
      if(json.status=="success"){
        snackbar("Το βιβλίο προστέθηκε στην λίστα των αγαπημένων σας!")
      }else{
        snackbar("Το βιβλίο υπάρχει ήδη στην λίστα των αγαπημένων σας!")

      }
  }


    async function remove_from_fav(id, title, author ,img) {
      const data_post = { id, title, author ,img};
      const options = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_post)
      };
      console.log("im here");
      const res = await fetch('/remove_fav',options);
      const json = await res.json();
      if(json.status == "success") {
        snackbar("Το βιβλίο φαιρέθηκε απο την λίστα με τα αγαπημένα!")
      }else {
        snackbar("Το βιβλίο δεν υπάρχει στην λίστα με τα αγαπημένα!")
      }
  }


  async function getFav() {
    searchHeader.innerHTML = "";
    searchHeader.innerHTML += "<h1>Αγαπημένα</h1>";

    const res = await fetch('/favbooks');
    const data =await res.json();
    for(element of data){
      results.innerHTML += displayResults( element.id, element.title, element.author, element.img );
}

}
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function snackbar(txt) {
  // Get the snackbar DIV
   var x = document.getElementById("snackbar");
   x.innerHTML = txt;
   // Add the "show" class to DIV
   x.className = "show";
   // After 3 seconds, remove the show class from DIV
   setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
