let key = '5YyUL';
let counter = 0;

let searchWords = [ 'book', 'books', 'letter', 'letters', 'read', 'text', 'library'];

const baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=';

const viewRequest = baseUrl + '&op=select';

window.addEventListener('load', () => {

    let errorCounter = document.querySelector('p#counter>span');
    updateErrors();

    let getKeyBtn = document.getElementById('getKey');
    getKeyBtn.addEventListener('click', getUserKey);

    let ownKeyBtn = document.querySelector('button.ownKey');
    ownKeyBtn.addEventListener('click', useThisKey);

    let createBookBtn = document.getElementById('createBookBtn');
    createBookBtn.addEventListener('click', newBook);

    let showBooksBtn = document.querySelector('.showBooks');
    showBooksBtn.addEventListener('click', showBooks);

});

function updateErrors(){
    let errorCounter = document.querySelector('p#counter>span');

    errorCounter.innerText = counter;
}

async function getUserKey(){
    let response = await fetch("https://www.forverkliga.se/JavaScript/api/crud.php?requestKey");
    let data = await response.json();

    if(data.status === "success"){
        let userId = data.key;
        key = userId;
        keyToDiv(key);
    } else {
        keyToDiv("Error, try again!");
    }

};

function useThisKey(){
    let userInputKey = document.querySelector('input.ownKey');
    

    let userKey = userInputKey.value;
    if(userKey.length === 5){
        key = userKey
        keyToDiv('');
    } else {
        keyToDiv('This is not a valid Key, try again!')
    }
}

function keyToDiv(result){
    let keyDiv = document.getElementById('keyResult');
    keyDiv.innerText = result;
}


function statusDiv(result){
    let errorDiv = document.getElementById('errorDiv');
    let newStatusMessage = document.createElement('p');
    newStatusMessage.classList.add('errors');
    newStatusMessage.innerText = result;
    errorDiv.appendChild(newStatusMessage);
    
}

async function newBook(){
    let bookTitle = document.getElementById('bookTitle').value;
    let bookAuthor = document.getElementById('bookAuthor').value;

    let response = await fetch(baseUrl + `${key}&title=${bookTitle}&author=${bookAuthor}&op=insert`);
    let data = await response.json();

    if(data.status === "success"){
        console.log(data); 
        statusDiv("Succeded to create new book!")  
    } else {
        for(let i=0; i < 5; i++){
            counter++;
            updateErrors();
            let response = await fetch(baseUrl + `${key}&title=${bookTitle}&author=${bookAuthor}&op=insert`);
            let data = await response.json();
            console.log(data);

            if(data.status === "success"){
                statusDiv("Succeded to create new book!");
                break;
            } else {
                statusDiv(data.message);

            }
        }
    }
    
}


function createBook(id, title, author, updated){

    let existingBooks = document.getElementsByClassName('id'+id);

    if(existingBooks.length < 1){

        let imgSearch = Math.floor(Math.random()*Math.floor(7));

        let randomImg = document.createElement('img');
        randomImg.src =  'https://source.unsplash.com/150x200?' + imgSearch;
        randomImg.alt = 'randomPic';
    
        let bookCard = document.createElement('div');
        bookCard.classList.add('bookCard', 'id'+id);

        let ul = document.createElement('ul');

        let listTitle = document.createElement('li');
        listTitle.innerText = 'Title: '
        let spanTitle = document.createElement('span');
        spanTitle.innerText = title;
        listTitle.appendChild(spanTitle);

        let listAuthor = document.createElement('li');
        listAuthor.innerText = 'Author: '
        let spanAuthor = document.createElement('span');
        spanAuthor.innerText = author;
        listAuthor.appendChild(spanAuthor)

        let listUpdated = document.createElement('li');
        listUpdated.innerText = 'Updated: '
        let spanUpdated = document.createElement('span');
        spanUpdated.innerText = updated;
        listUpdated.appendChild(spanUpdated);

        let btnDiv = document.createElement('div');
        btnDiv.classList.add('bookBtns');

        let changeBtn = document.createElement('button');
        changeBtn.innerText = 'Change info'
        changeBtn.classList.add('changeBook');

        changeBtn.addEventListener('click', () => changeBookInfo(listTitle, listAuthor, spanTitle, spanAuthor, id));

        let deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete book';
        deleteBtn.classList.add('deleteBook');

        deleteBtn.addEventListener('click', () => deleteBookFromServer(id, bookCard));

        btnDiv.appendChild(changeBtn);
        btnDiv.appendChild(deleteBtn);

        ul.appendChild(listTitle);
        ul.appendChild(listAuthor);
        ul.appendChild(listUpdated);

        bookCard.appendChild(randomImg);
        bookCard.appendChild(ul);
        bookCard.appendChild(btnDiv);

        let mainDiv = document.querySelector('main.books');
        mainDiv.appendChild(bookCard);
    }
}




async function showBooks(){
    let response = await fetch(baseUrl + `${key}&op=select`)
    let data = await response.json();

    if(data.status == 'success'){
        for(let i=0; i < data.data.length; i++){
            createBook(data.data[i].id, data.data[i].title, data.data[i].author, data.data[i].updated);   
        }
    } else {

        for(let i=0; i < 5; i++){
            counter++;
            updateErrors();
            let response = await fetch(baseUrl + `${key}&op=select`)
            let data = await response.json();


            if(data.status === "success"){
                for(let i=0; i < data.data.length; i++){
                    createBook(data.data[i].id, data.data[i].title, data.data[i].author, data.data[i].updated);   
                }
                statusDiv('Succeeded to show books!');
                break;
            } else {
                statusDiv(data.message);

            }
        }
    }
}

async function deleteBookFromServer(id, bookCard){

    let mainGrid = document.querySelector('main.books');
    let response = await fetch(baseUrl + `${key}&id=${id}&op=delete`)
    let data = await response.json();

    console.log(data);

    if(data.status == 'success'){
        mainGrid.removeChild(bookCard);
        statusDiv('Succeeded to delete book!');
       
    } else {
        for(let i=0; i < 5; i++){
            counter++;
            updateErrors();
            let response = await fetch(baseUrl + `${key}&id=${id}&op=delete`)
            let data = await response.json();

            if(data.status === "success"){
                mainGrid.removeChild(bookCard);
                statusDiv('Succeeded to delete book!')
                break;
            } else {
                statusDiv(data.message);
            }
        }

    }
}

async function changeBookInfo(listTitle, listAuthor, spanTitle, spanAuthor, id){

    let oldValueTitle = spanTitle.innerText;
    let oldValueAuthor = spanAuthor.innerText;
    
    let newInputTitle = document.createElement('input');
    newInputTitle.placeholder = oldValueTitle;
    let newInputAuthor = document.createElement('input');
    newInputAuthor.placeholder = oldValueAuthor;

    listTitle.removeChild(spanTitle);
    listTitle.appendChild(newInputTitle);
    listAuthor.removeChild(spanAuthor);
    listAuthor.appendChild(newInputAuthor);

    newInputTitle.addEventListener('blur', async() => {
        console.log(listTitle, newInputTitle);
        if(newInputTitle.value === ''){
            listTitle.removeChild(newInputTitle);
            spanTitle.innerText = oldValueTitle;
            listTitle.appendChild(spanTitle);
        } else {
            let newTitleValue = newInputTitle.value;
            let i = 0;
    
            let response = await fetch(baseUrl + `${key}&id=${id}&Title=${newTitleValue}&title=${oldValueTitle}&op=update`);
            let data = await response.json();
            if(data.status !== "success"){
    
                for(i; i < 5; i++){
                    counter++;
                    updateErrors();
                    let response = await fetch(baseUrl + `${key}&id=${id}&title=${newTitleValue}&author=${oldValueAuthor}&op=update`);
                    let data = await response.json();
                    statusDiv(data.message);
        
                    if(data.status === "success"){
    
                        listTitle.removeChild(newInputTitle);
                        spanTitle.innerText = newTitleValue;
                        listTitle.appendChild(spanTitle);
                        statusDiv('Succeeded to update book Title!')
                        break;
                    }
                }
            }
            if(i === 4){
          
                listTitle.removeChild(newInputTitle);
                spanTitle.innerText = oldValueTitle;
                listTitle.appendChild(spanTitle);
                statusDiv(data.message);
    
            }
    
        }
    });

    newInputAuthor.addEventListener('blur', async() => {
        console.log(listAuthor, newInputAuthor);
        if(newInputAuthor.value === ''){
            listAuthor.removeChild(newInputAuthor);
            spanAuthor.innerText = oldValueAuthor;
            listAuthor.appendChild(spanAuthor);
        } else {
            let newAuthorValue = newInputAuthor.value;
            let i = 0;

            let response = await fetch(baseUrl + `${key}&id=${id}&author=${newAuthorValue}&title=${oldValueTitle}&op=update`);
            let data = await response.json();
            if(data.status !== "success"){

                for(i; i < 5; i++){
                    counter++;
                    updateErrors();
                    let response = await fetch(baseUrl + `${key}&id=${id}&author=${newAuthorValue}&title=${oldValueTitle}&op=update`);
                    let data = await response.json();
                    console.log(data , i);
        
                    if(data.status === "success"){

                        listAuthor.removeChild(newInputAuthor);
                        spanAuthor.innerText = newAuthorValue;
                        listAuthor.appendChild(spanAuthor);
                        statusDiv('Succeeded to update book author!')
                        break;
                    }
                }
            }
            if(i === 5){

                listAuthor.removeChild(newInputAuthor);
                spanAuthor.innerText = oldValueAuthor;
                listAuthor.appendChild(spanAuthor);
                statusDiv(data.message);

            }

        }
    });

}