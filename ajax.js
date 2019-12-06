let key = '5YyUL';

let searchWords = [ 'book', 'books', 'letter', 'letters', 'read', 'text', 'library'];

const baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=';

const viewRequest = baseUrl + '&op=select';

window.addEventListener('load', () => {

    let getKeyBtn = document.getElementById('getKey');
    getKeyBtn.addEventListener('click', getUserKey);

    let ownKeyBtn = document.querySelector('button.ownKey');
    ownKeyBtn.addEventListener('click', useThisKey);

    let createBookBtn = document.getElementById('createBookBtn');
    createBookBtn.addEventListener('click', newBook);

    let showBooksBtn = document.querySelector('.showBooks');
    showBooksBtn.addEventListener('click', showBooks);

});

function updateErrors(err){
    let errorCounter = document.querySelector('p#counter>span');

    errorCounter.innerText = err;
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
    let oldErrors = errorDiv.children;
    let arrayOldErrors = Array.from(oldErrors);

    arrayOldErrors.forEach(child => {
        errorDiv.removeChild(child);
    });

    for(let i = 0; i < result.length; i++){

        let newStatusMessage = document.createElement('p');
        newStatusMessage.classList.add('errors');
        newStatusMessage.innerText = result[i];
        errorDiv.appendChild(newStatusMessage);
    }
}

async function newBook(){
    let i = 0;
    let statusList = [];
    let bookTitle = document.getElementById('bookTitle').value;
    let bookAuthor = document.getElementById('bookAuthor').value;

    let response = await fetch(baseUrl + `${key}&title=${bookTitle}&author=${bookAuthor}&op=insert`);
    let data = await response.json();

    if(data.status === "success"){
        statusList.push("Succeded to create new book!")
        statusDiv(statusList);
        updateErrors(i);
        showBooks('ny bok');
    } else {
        i = 1;
        statusList.push(data.message);
        for(i; i < 6; i++){
    
            let response = await fetch(baseUrl + `${key}&title=${bookTitle}&author=${bookAuthor}&op=insert`);
            let data = await response.json();

            if(data.status === "success"){
                statusList.push("Succeded to create new book!")
                statusDiv(statusList);
                showBooks('ny bok');

                break;
            } else {
                statusList.push(data.message);
                statusDiv(statusList);
            }
        }
        updateErrors(i);
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
        if(mainDiv.firstChild === null){
            mainDiv.appendChild(bookCard);
        } else{
            mainDiv.insertBefore(bookCard, mainDiv.firstChild);
        }
    }
}




async function showBooks(fromWhereIsFunctionCalled){
    let i = 0;
    let statusList = [];

    if(fromWhereIsFunctionCalled === 'ny bok'){
        statusList = ["Succeded to create new book!"];
    }

    let response = await fetch(baseUrl + `${key}&op=select`)
    let data = await response.json();

    if(data.status == 'success'){

        for(let i = 0; i < data.data.length; i++){
            createBook(data.data[i].id, data.data[i].title, data.data[i].author, data.data[i].updated);   
        }

        statusList.push('Succeeded to show books!');
        statusDiv(statusList);

    } else {
        i = 1;
        statusList.push(data.message);

        for(i; i < 6; i++){
    
            let response = await fetch(baseUrl + `${key}&op=select`)
            let data = await response.json();


            if(data.status === "success"){
                for(let i = 0; i < data.data.length; i++){
                    createBook(data.data[i].id, data.data[i].title, data.data[i].author, data.data[i].updated);   
                }
                statusList.push('Succeeded to show books!');
                statusDiv(statusList);

                break;
            } else {
                statusList.push(data.message)
                statusDiv(statusList);

            }
        }
        updateErrors(i);
    }
}

async function deleteBookFromServer(id, bookCard){
    let i = 0;
    let statusList = [];

    let mainGrid = document.querySelector('main.books');
    let response = await fetch(baseUrl + `${key}&id=${id}&op=delete`)
    let data = await response.json();


    if(data.status == 'success'){
        mainGrid.removeChild(bookCard);
        statusList.push('Succeeded to delete book!')
        statusDiv(statusList);
        updateErrors(i);
       
    } else {
        statusList.push(data.message);
        i = 1;
        for(i; i < 6; i++){
    
            let response = await fetch(baseUrl + `${key}&id=${id}&op=delete`)
            let data = await response.json();

            if(data.status === "success"){
                mainGrid.removeChild(bookCard);
                statusList.push('Succeeded to delete book!');
                statusDiv(statusList);

                break;

            } else {
                statusList.push(data.message)
                statusDiv(statusList);
            }
        }
        updateErrors(i);

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
        let statusList = [];

        if(newInputTitle.value === ''){
            listTitle.removeChild(newInputTitle);
            spanTitle.innerText = oldValueTitle;
            listTitle.appendChild(spanTitle);
        } else {
            let newTitleValue = newInputTitle.value;
            let i = 0;

            let response = await fetch(baseUrl + `${key}&id=${id}&title=${newTitleValue}&author=${oldValueAuthor}&op=update`);
            let data = await response.json();

            if(data.status === "success"){
                listTitle.removeChild(newInputTitle);
                spanTitle.innerText = newTitleValue;
                listTitle.appendChild(spanTitle);

                statusList.push('Succeeded to update book Title!');
                statusDiv(statusList);
                updateErrors(i);
            } else {

                statusList.push(data.message);
                i = 1;
    
                for(i; i < 6; i++){
            
                    let response = await fetch(baseUrl + `${key}&id=${id}&title=${newTitleValue}&author=${oldValueAuthor}&op=update`);
                    let data = await response.json();
        
                    if(data.status === "success"){
    
                        listTitle.removeChild(newInputTitle);
                        spanTitle.innerText = newTitleValue;
                        listTitle.appendChild(spanTitle);

                        statusList.push('Succeeded to update book Title!')
                        statusDiv(statusList);

                        break;
                    } else {

                        statusList.push(data.message);
                        statusDiv(statusList);
                    }
                    if(i === 5){
          
                        listTitle.removeChild(newInputTitle);
                        spanTitle.innerText = oldValueTitle;
                        listTitle.appendChild(spanTitle);

                        statusList.push(data.message);
                        statusDiv(statusList);
            
                    }
                }
                updateErrors(i);
            }
    
        }
    });

    newInputAuthor.addEventListener('blur', async() => {
        let statusList = [];
        if(newInputAuthor.value === ''){
            listAuthor.removeChild(newInputAuthor);
            spanAuthor.innerText = oldValueAuthor;
            listAuthor.appendChild(spanAuthor);
        } else {
            let newAuthorValue = newInputAuthor.value;
            let i = 0;
        
            let response = await fetch(baseUrl + `${key}&id=${id}&author=${newAuthorValue}&title=${oldValueTitle}&op=update`);
            let data = await response.json();
        
            if(data.status === "success"){
                listAuthor.removeChild(newInputAuthor);
                spanAuthor.innerText = newAuthorValue;
                listAuthor.appendChild(spanAuthor);
        
                statusList.push('Succeeded to update book Author!');
                statusDiv(statusList);
                updateErrors(i);
            } else {
        
                statusList.push(data.message);
                i = 1;
        
                for(i; i < 6; i++){
            
                    let response = await fetch(baseUrl + `${key}&id=${id}&author=${newAuthorValue}&title=${oldValueTitle}&op=update`);
                    let data = await response.json();
        
                    if(data.status === "success"){
        
                        listAuthor.removeChild(newInputAuthor);
                        spanAuthor.innerText = newAuthorValue;
                        listAuthor.appendChild(spanAuthor);
        
                        statusList.push('Succeeded to update book Author!')
                        statusDiv(statusList);
        
                        break;
                    } else {
        
                        statusList.push(data.message);
                        statusDiv(statusList);
                    }
                    if(i === 5){
          
                        listAuthor.removeChild(newInputAuthor);
                        spanAuthor.innerText = oldValueAuthor;
                        listAuthor.appendChild(spanAuthor);
        
                        statusList.push(data.message);
                        statusDiv(statusList);
            
                    }
                }
                updateErrors(i);
            }
        }
    });

}