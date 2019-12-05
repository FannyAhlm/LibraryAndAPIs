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
                let response = await fetch(baseUrl + `${key}&id=${id}&title=${newTitleValue}&author=${oldAuthorTitle}&op=update`);
                let data = await response.json();
                console.log(data , i);
    
                if(data.status === "success"){
                    console.log(data , 'inne i fetch loop');

                    listTitle.removeChild(newInputTitle);
                    spanTitle.innerText = newTitleValue;
                    listTitle.appendChild(spanTitle);
                    textToDiv('Succeeded to update book Title!')
                    break;
                }
            }
        }
        if(i === 5){
            console.log(data , 'i fel loop antagligen');
            listTitle.removeChild(newInputTitle);
            spanTitle.innerText = oldValueTitle;
            listTitle.appendChild(spanTitle);
            textToDiv('Failed to update book Title');

        }

    }
});