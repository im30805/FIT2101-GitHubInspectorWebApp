let name_array = []
let temp =""

function readData(){
  let data = document.getElementById("searchForRepo").value;
  temp = data;
  repoSearch();



}

function check_search(result){
    result.items.forEach(i =>{
      if (i.full_name && i.full_name.includes(temp)){
        name_array.push(i.full_name)
      }
     })
     console.log(name_array)


     let getRepoKey = localStorage.getItem("Searched repository");
     let getRepoObj = JSON.parse(getRepoKey);

     if(getRepoObj === null){
       if (typeof(Storage) !== "undefined")
        {
          //chg obj to string and store
          let getRepoString= JSON.stringify(name_array);
          localStorage.setItem("Searched repository", getRepoString);
        }
        else
        {
          console.log("Error: localStorage is not supported by current browser.");
        }
     }
     else if(getRepoObj !== null){

          for(let i = 0; i < getRepoObj.length; i++){
              localStorage.removeItem(getRepoObj[i])
          }

          let getKeyAgain = localStorage.getItem("Searched repository")
          let getObjAgain = JSON.parse(getKeyAgain);

          if (typeof(Storage) !== "undefined")
          {
              //chg obj to string and store
               let getRepoString= JSON.stringify(name_array);
               localStorage.setItem("Searched repository", getRepoString);
          }
          else
          {
               console.log("Error: localStorage is not supported by current browser.");
          }
       }


}

async function repoSearch(){

  if (temp != ""){
    const url = "https://api.github.com/search/repositories?q=" + temp + "&per_page=1000&order=desc";
    const response = await fetch(url);
    const result = await response.json();
    check_search(result);
    console.log(url)
  }
    location.href = 'suggestedSearchRepo.html'


}
