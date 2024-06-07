const books = [];
const RENDER_EVENT = 'render-book';

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, timestamp, isCompleted) {
  return {
    id,
    title,
    author,
    timestamp,
    isCompleted
  }
}

function findBook(bookId) {
  for (bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function makeBook(bookObject) {
  const {id, title, author, timestamp, isCompleted} = bookObject;

  const textTitle = document.createElement('h2');
  textTitle.innerText = title;

  const textAuthor = document.createElement('h2');
  textAuthor.innerText = author;
 
  const textTimestamp = document.createElement('p');
  textTimestamp.innerText = timestamp;
 
  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textAuthor, textTimestamp);
 
  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `book-${id}`);

  const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button'); 
    trashButton.addEventListener('click', function () {
      removeBookFromCompleted(id);
    });
 
  if (isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', function () {
      addBookToCompleted(id);
    });
    
    container.append(checkButton, trashButton);
  }

  return container;
}

function addBook() {
  const textBook = document.getElementById('title').value;
  const textAuthor = document.getElementById('author').value;
  const timestamp = document.getElementById('date').value;
 
  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, textBook, textAuthor, timestamp, false);
  books.push(bookObject);
 
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToCompleted (bookId) {
  const bookTarget = findBook(bookId); 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('form');
 
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
 
document.addEventListener(RENDER_EVENT, function () {
   const uncompletedBookList = document.getElementById('books');
   const listCompletedBook = document.getElementById('completed-books');
   
   uncompletedBookList.innerHTML = '';
   listCompletedBook.innerHTML = '';

  for (bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompletedBook.append(bookElement);
    } else {
      uncompletedBookList.append(bookElement);
  }
 }
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';
 
function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}