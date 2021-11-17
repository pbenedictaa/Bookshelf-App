const STORAGE_KEY = "BOOKSHELF";

let uncompleteBookshelfList = [];

function isStorageExist() {
    if(typeof(Storage) === undefined){
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

function saveData() {
    const parsed = JSON.stringify(uncompleteBookshelfList);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let title = JSON.parse(serializedData);
    if(title !== null)
        uncompleteBookshelfList = title;

    document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
    if(isStorageExist())
        saveData();
}

function composeBookObject(title, author, year, isCompleted) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isCompleted
    };
}

function findBook(bookId) {
    for(book of uncompleteBookshelfList){
        if(book.id === bookId)
            return book;
    }
    return null;
}

function findBookIndex(bookId) {
    let index = 0
    for (book of uncompleteBookshelfList) {
        if(book.id === bookId)
            return index;
        index++;
    }

    return -1;
}

function refreshDataFromBooks() {
    const listUncompleted = document.getElementById(UNCOMPLETED_BOOK_LIST_ID);
    let listCompleted = document.getElementById(COMPLETED_BOOK_LIST_ID);

    for(book of uncompleteBookshelfList){
        const newBook = makeBook(book.title, book.author, book.year, book.isCompleted);
        newBook[BOOK_ID] = book.id;

        if(book.isCompleted ){
            listCompleted.append(newBook);
        } else {
            listUncompleted.append(newBook);
        }
    }
}