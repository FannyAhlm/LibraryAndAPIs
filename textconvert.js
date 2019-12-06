else {
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
    
            let response = await fetch(baseUrl + `${key}&id=${id}&Author=${newAuthorValue}&author=${oldValueAuthor}&op=update`);
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