let main = document.querySelector(".main");
let logInStatus = document.querySelector(".login-user-header");
let logOutStatus = document.querySelector(".logout-user-header");
let profileStatus = document.querySelector(".profile-user-header");
let registerStatus = document.querySelector(".register-user-header");
let addBookHeader = document.querySelector(".addBook-header");

let logInForm = document.querySelector(".login-container");
let allBooksContainer = document.querySelector(".all-book-container");
let bookDucksReload = document.querySelector(".book-ducks").addEventListener("click", () =>{
    location.reload();
})

let input = document.querySelector("input");



// log in header
let logInBtn = document.querySelector(".login-user-header").addEventListener("click", () =>{
    registerForm.classList.add("hidden");
    logInForm.classList.remove("hidden");
    allBooksContainer.classList.add("hidden");
    input.value = ""
})

//log in function

let loginIdentifier = document.querySelector("#identifier");
let loginPassword = document.querySelector("#password");

const login = async () => {
    let response = await axios.post("http://localhost:1337/api/auth/local", {
        identifier: loginIdentifier.value,
        password: loginPassword.value
    }).then(response =>{;
    console.log(response);
    sessionStorage.setItem("token", response.data.jwt);
    sessionStorage.setItem("userid", response.data.user.id);
    sessionStorage.setItem("username", response.data.user.username);
    sessionStorage.setItem("email", response.data.user.email);
    logInForm.classList.add("hidden")
    checkLogIn()
    allBooksContainer.classList.remove("hidden")
    addBookHeader.classList.remove("hidden")
    printBooksBtn()
    }).catch(res=>{
        alert("Wrong username or password")
    })  

}
//register function
let registerUsername = document.querySelector("#registerUsername");
let registerEmail = document.querySelector("#registerEmail");
let registerPassword = document.querySelector("#registerPassword");


let registerForm = document.querySelector(".register");
let registerUserBtn = document.querySelector(".register-user-header").addEventListener("click", () =>{
    logInForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    allBooksContainer.classList.add("hidden")
})
//kollar om man är inloggad även om sidar relodar
let checkLogIn = () =>{
    if(sessionStorage.getItem("username")){
        profileStatus.classList.remove("hidden")
        logOutStatus.classList.remove("hidden")
        registerStatus.classList.add("hidden")
        logInStatus.classList.add("hidden")
        addBookHeader.classList.remove("hidden")
        
        profileStatus.innerText = `${sessionStorage.getItem("username")}`
        
    }
}
checkLogIn()
//Log out function
document.querySelector(".logout-user-header ").addEventListener("click", () =>{
    window.sessionStorage.clear();
    location.reload();
})

//register function
const register = async () => {
   await axios.post(
    "http://localhost:1337/api/auth/local/register",
{
    username:registerUsername.value,
    password:registerPassword.value,
    email:registerEmail.value,
    
}).then(response => {;
console.log(response);
sessionStorage.setItem("token", response.data.jwt);
sessionStorage.setItem("id", response.data.user.id);
sessionStorage.setItem("username", response.data.user.username);
sessionStorage.setItem("email", response.data.user.email);
location.reload();


}).catch(res => {
    alert("Remember to write in the right format")
    registerUsername.value = ""
    registerEmail.value = ""
    registerPassword.value = ""

})
}
addBookHeader.addEventListener("click", () =>{
    allBooksContainer.classList.add("hidden");
    document.querySelector(".add-book").classList.remove("hidden");
    profileContainer.classList.add("hidden");
})
























let bookTitle = document.querySelector(".book-title");
let bookAuthor = document.querySelector(".book-author");
let WrittenBook = document.querySelector("#text-book");
let audioBook = document.querySelector("#audio-book");
let bookLenght = document.querySelector(".book-lenght");
let productImage = document.querySelector("#productImage");
let bookRelease = document.querySelector(".book-release");
let bookGenre = document.querySelector(".book-genre");
let bookRating = document.querySelector("#book-rating")


/* let getGenres = async () => {
    let response = await axios.get("http://localhost:1337/api/genres");
    let genres = response.data.data;
    genres.forEach(genre => {
        let checkDiv = document.createElement("div");
        checkDiv.innerHTML= ` 
        <label for="${genre.id}">${genre.attributes.genre}</label>
        <input type="checkbox" value="${genre.attributes.genre}" id="${genre.id}" class="genre-check">`
        bookGenre.append(checkDiv);
    });
}
getGenres() */

let getGenres = async () => {
    let response = await axios.get("http://localhost:1337/api/genres");
    let genres = response.data.data;
    genres.forEach(genre => {
        let checkDiv = document.createElement("div");
        checkDiv.innerHTML= ` 
        <label for="${genre.id}">
        <input type="checkbox" value="${genre.attributes.genre}" id="${genre.id}" class="genre-check">
        <span>${genre.attributes.genre}</span>
        </label>`
        bookGenre.append(checkDiv);
    });
}
getGenres()


audioBook.addEventListener("click", ()=>{bookLenght.placeholder = "book lenght in minutes"});
WrittenBook.addEventListener("click", ()=>{bookLenght.placeholder = "book lenght in pages"});




const addProduct = async () => {
    let image = document.querySelector("#productImage").files;
    let imgData = new FormData();
    imgData.append('files', image[0]);
    let selectedGenres = [];
    document.querySelectorAll("input[type='checkbox']:checked").forEach(genre => {
        selectedGenres.push(genre.value)
    })
    let text = selectedGenres.toString();

     await axios.post("http://localhost:1337/api/upload", imgData, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    }).then(res => {
         axios.post("http://localhost:1337/api/books", {
                data: {
                    image: res.data[0].id,
                    title: bookTitle.value,
                    author: bookAuthor.value,
                    type: audioBook.checked ? audioBook.value : WrittenBook.value,
                    lenght: audioBook.checked ? bookLenght.value + " min": bookLenght.value + " pages",
                    genre: text,
                    release: bookRelease.value,
                    rating: bookRating.value,
                    bookowner: sessionStorage.getItem("username"),
                    bookid: sessionStorage.getItem("userid"),
                    contact: sessionStorage.getItem("email"),

                }
            },
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                }
            })
            allBooksContainer.classList.add("hidden");
                document.querySelector(".add-book").classList.remove("hidden");
            
        })


}
//Skapar bok

 


document.querySelector("#add-book-btn").addEventListener("click", (e) => {
    let genre = document.querySelectorAll("input[type='checkbox']:checked")
  /*   if(bookTitle.value && bookAuthor.value && WrittenBook.value && bookLenght.value && bookRelease.value && genre.length > 0 && bookRating.value){ */
    e.preventDefault()
    addProduct()
 /*    }   */   
    
})



//hämtar och printar ut böckerna

let bookContainer = document.querySelector(".all-book");
let printBooksBtn =  async (e) =>{
    let booksRespone =  await axios.get("http://localhost:1337/api/books?populate=*")
    let books = booksRespone.data.data;
    console.log(books);
    let book = books.map((e)=>{
        let {author, bookid, bookowner, contact, genre, image, lenght, title, type, release,rating} = e.attributes;
        console.log(e)
        return `
        
        <article class="book-style">
        <h3 class="book-title-style text">${title}</h3>
        <img  src="http://localhost:1337${image.data.attributes.url}" alt="${title} cover" class="book-img">
        
        <div class="book-style-text">
        <h4 class="book-author-style text">Written by <br>${author}</h4>
        <p class="book-genre-style text">genres: ${genre.replaceAll(",", " / ")}</p>
        <div class="word-break">${type == `audio` ? `<p class="book-release-style text">release year: ` + release + `</p>` : "" }</div>
        <p class="book-type-style text">type: ${type}</p>
        <div class="word-break"><p class="book-lenght-style text">lenght: ${lenght}</p></div>
        <p class="book-rating-style text">rating: ${rating}</p>
        </div>
        
        <div><p class="book-lender-style text">lender: ${bookowner}</p></div
        <div><p class="book-contact-style text">contact ${contact}</p></div>
        
        </article>
      
        `
    }).join(" ")
    bookContainer.innerHTML = book;

}
printBooksBtn()


//Profile
let profileContainer = document.querySelector(".profile");
let profileBtn = document.querySelector(".profile-user-header").addEventListener("click", async () => {
    if(sessionStorage.getItem("token")){
        profileContainer.innerHTML = ""
        let profile = document.createElement("section");
        let me =  await axios.get(`http://localhost:1337/api/users/me`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
        });
      
        let books =  await axios.get(`http://localhost:1337/api/books?populate=*`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
    })
    let myBooks = books.data.data;
    let b = myBooks.filter(mybook =>{
        return mybook.attributes.contact == me.data.email
    })
    console.log(b)
    createdAt = me.data.createdAt
    let newCreated = createdAt.slice(0, -14);
    profile.innerHTML = `
    
    <h2>${ me.data.username}</h2>
    <p> Email: ${ me.data.email}</p>
    <p> Id: ${ me.data.id}</p>
    <p> Account createt: ${newCreated}</p>
    <h3 class="my-books">My books</h3>
    
    
    `
    
    let bookContainer = document.createElement("div")
    let book = b.map((e)=>{
        let {author, bookid, bookowner, contact, genre, image, lenght, title, type, release, rating} = e.attributes;
        return `
        <article class="book-style">
        <h3 class="book-title-style text">${title}</h3>
        <img  src="http://localhost:1337${image.data.attributes.url}" alt="${title} cover" class="book-img">
        
        <div class="book-style-text">
        <h4 class="book-author-style text">Written by <br>${author}</h4>
        <p class="book-genre-style text">genres: ${genre.replaceAll(",", " / ")}</p>
        <div class="word-break">${type == `audio` ? `<p class="book-release-style text">release year: ` + release + `</p>` : "" }</div>
        <p class="book-type-style text">type: ${type}</p>
        <div class="word-break"><p class="book-lenght-style text">lenght: ${lenght}</p></div>
        <p class="book-rating-style text">rating: ${rating}</p>
        </div>
        
        <div><p class="book-lender-style text">lender: ${bookowner}</p></div
        <div><p class="book-contact-style text">contact ${contact}</p></div>
        
        </article>
        
        `
    }).join(" ")
    bookContainer.innerHTML = book;
    profile.classList.add("profile-style")
    bookContainer.classList.add("book-contailer-style")
    logInForm.classList.add("hidden");
    profileContainer.append(profile, bookContainer);

    }

})


//print my profile

profileStatus.addEventListener("click", () => {
    profileContainer.classList.remove("hidden");
    registerForm.classList.add("hidden");
    logInForm.classList.add("hidden");
    document.querySelector(".add-book").classList.add("hidden");
    allBooksContainer.classList.add("hidden")
})