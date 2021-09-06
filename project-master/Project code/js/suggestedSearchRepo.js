let getSearchedRepos = localStorage.getItem("Searched repository");
let getSearchedReposObj = JSON.parse(getSearchedRepos);
let searchedRepoArray = []
searchedRepoArray  = getSearchedReposObj

let outputRef = document.getElementById("searchedResults");
let output = "";

function viewSearchedRepo(num){
  // Save the desired location to local storage
    localStorage.setItem("Searched repository" + "-selectedIndex", num);
    // And load the view repo stat page
    location.href = 'viewSearchedRepoStats.html';

}


for(let i = 0; i < searchedRepoArray.length; i++){
  output += "<span class=\"mdl-chip mdl-chip--contact\" onclick=\"viewSearchedRepo("+i+");\">";
  output += "<span class=\"mdl-chip__text\">"+searchedRepoArray[i]+"</span></span><br><br>";
}

outputRef.innerHTML = output;
