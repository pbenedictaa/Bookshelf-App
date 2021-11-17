const UNCOMPLETED_BOOK_LIST_ID = "uncompleteBookshelfList";
const COMPLETED_BOOK_LIST_ID = "completeBookshelfList";
const BOOK_ID = "bookId";

function makeBook(title, author, year, isCompleted) {
    const bookTitle = document.createElement("h3");
    bookTitle.innerHTML = title;
    const bookAuthor = document.createElement("p");
    bookAuthor.innerHTML = `Penulis: <span id="author">` + author + `</span>`;
    const bookYear = document.createElement("p");
    bookYear.innerHTML = `Tahun: <span id="year">` + year + `</span>`;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(bookTitle, bookAuthor, bookYear);

    const container = document.createElement("div");
    container.classList.add("item", "shadow", "book-list")
    container.append(textContainer);

    if(isCompleted){
        container.append(
            createUndoButton(),
            createRedButton()
        );
    }else {
        container.append(
            createGreenButton(),
            createRedButton()
        );
    }
    return container;
}

function createUndoButton() {
    return createButton("green", "Belum Selesai Dibaca", function(event){
        undoFromCompleted(event.target.parentElement);
    });
}

function createRedButton() {
    return createButton("red", "Hapus Buku", function(event){
        if(confirm("Apakah anda yakin ingin menghapus buku ini?")){
            removeFromCompleted(event.target.parentElement);
        }
    });
}

function createGreenButton() {
    return createButton("green", "Selesai dibaca", function(event){
        addToComplete(event.target.parentElement);
    });
}

function createButton(buttonTypeClass, buttonText, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.innerText = buttonText;
    button.addEventListener("click", function (event) {
        eventListener(event);
        event.stopPropagation();
    });
    return button;
}

function addBook() {
    const uncompletedBookList = document.getElementById(UNCOMPLETED_BOOK_LIST_ID);
    const checkComplete = document.getElementById(COMPLETED_BOOK_LIST_ID);

    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const isCompleted = document.getElementById("inputBookIsComplete").checked;
    
    const book = makeBook(bookTitle, bookAuthor, bookYear, isCompleted);
    const bookObject = composeBookObject(bookTitle, bookAuthor, bookYear, isCompleted);
    book[BOOK_ID] = bookObject.id;
    uncompleteBookshelfList.push(bookObject);

    // const checkbox = document.getElementById("inputBookIsComplete");
    // let check = false;
    if(isCompleted){
        // check = true
        // book.isCompleted = true;
        checkComplete.append(book);
    } else{
        // check = false
        uncompletedBookList.append(book);
    }
    updateDataToStorage();
}

function addToComplete(bookElement) {
    const listCompleted = document.getElementById(COMPLETED_BOOK_LIST_ID);
    const taskTitle = bookElement.querySelector(".inner > h3").innerText;
    const taskAuthor = bookElement.querySelector("span#author").innerText;
    const taskYear = bookElement.querySelector("span#year").innerText;

    const newBook = makeBook(taskTitle, taskAuthor, taskYear, true);
    const book = findBook(bookElement[BOOK_ID]);
    book.isCompleted = true;
    newBook[BOOK_ID] = book.id;

    listCompleted.append(newBook);
    bookElement.remove();
    updateDataToStorage();
}

function removeFromCompleted(bookElement) {
    const bookPosition = findBookIndex(bookElement[BOOK_ID]);
    uncompleteBookshelfList.splice(bookPosition, 1);

    bookElement.remove();
    updateDataToStorage();
}

function undoFromCompleted(bookElement){
    const listUncompleted = document.getElementById(UNCOMPLETED_BOOK_LIST_ID);
    const taskTitle =  bookElement.querySelector(".inner > h3").innerText;
    const taskAuthor = bookElement.querySelector("span#author").innerText;
    const taskYear = bookElement.querySelector("span#year").innerText;

    const newBook = makeBook(taskTitle, taskAuthor, taskYear, false);
    const book = findBook(bookElement[BOOK_ID]);
    book.isCompleted = false;
    newBook[BOOK_ID] = book.id;

    listUncompleted.append(newBook);
    (bookElement).remove();
    updateDataToStorage();
}

const searchList = document.querySelector("#searchBookTitle");
searchList.addEventListener("keyup", searchBook);
function searchBook(e){
    const searchList = e.target.value.toLowerCase();
    let bookList = document.querySelectorAll(".book-list");

    bookList.forEach((book) =>{
        const book_title = book.firstChild.textContent.toLowerCase();
        if(book_title.indexOf(searchList) != -1){
            book.setAttribute("style", "display: block;");
        } else{
            book.setAttribute("style", "display: none !important;");
        }
    })
}

const deleteAll = document.querySelector("#deleteAllBook");
deleteAll.addEventListener("click", deleteAllItem);
function deleteAllItem(){
    const uncompletedBookList = document.getElementById(UNCOMPLETED_BOOK_LIST_ID);
    const checkComplete = document.getElementById(COMPLETED_BOOK_LIST_ID);
    if(confirm("Apakah anda yakin ingin menghapus seluruh buku?")){
        uncompletedBookList.innerHTML = "";
        checkComplete.innerHTML = "";
    }
    updateDataToStorage();
}