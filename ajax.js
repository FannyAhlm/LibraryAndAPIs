window.addEventListener('load', () => {

    let testButton = document.getElementById('testBtn');
    let key = testButton.addEventListener('click', getUserKey);
    console.log(key);

 
});

function getUserKey(){
     fetch("https://www.forverkliga.se/JavaScript/api/crud.php?requestKey")
    .then((res) => res.json())
    .then((res) => {
        if(res.status === "success"){
            let userId = res.key;
            console.log(userId);
            return userId;
        } else{
            console.log('Error');
        }
        stuff();
    })
};


const baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?key=' + key;
const viewRequest = baseUrl + '&op=select';

console.log(baseUrl);

function stuff(){
    fetch(viewRequest)
        .then((res) => res.json())
        .then(console.log(res))
        .catch(console.log('error'))
}