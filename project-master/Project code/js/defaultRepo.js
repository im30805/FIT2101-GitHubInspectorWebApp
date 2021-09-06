let repoArray = [];
let repoArrayShortName = [];

async function displayInitialRepo(){
  const url = "https://api.github.com/search/repositories?q=pushed:>=2019-07-29&per_page=5";
  const response = await fetch(url);
  const result = await response.json();
  let output = "";

  result.items.forEach(i =>{
    repoArray.push(i.full_name);
    repoArrayShortName.push(i.name);
  });

  let getRepoKey = localStorage.getItem(STORAGE_KEY_INIT_REPO);
  let getRepoObj = JSON.parse(getRepoKey);

  if(getRepoObj === null){
    if (typeof(Storage) !== "undefined")
    {
      //chg obj to string and store
      let getRepoString= JSON.stringify(repoArray);
      localStorage.setItem(STORAGE_KEY_INIT_REPO, getRepoString);
    }
    else
    {
     console.log("Error: localStorage is not supported by current browser.");
    }
  }

  let outputRef = document.getElementById("divResult");

  for(let i = 0; i < repoArrayShortName.length; i++){
      //output += "<button onclick=\"viewInitialRepo("+i+");\" class=\"mdl-button mdl-js-button">"
      output += "<span class=\"mdl-chip mdl-chip--contact\" onclick=\"viewInitialRepo("+i+");\">";
      output += "<img class=\"mdl-chip__contact\" src=\"images/search.png\"></img>";
      output += "<span class=\"mdl-chip__text\">"+repoArrayShortName[i]+"</span></span><br><br>";


  }

  outputRef.innerHTML = output;


}

displayInitialRepo();

function viewInitialRepo(num){
  // Save the desired location to local storage
    localStorage.setItem(STORAGE_KEY_VIEW_STAT + "-selectedIndex", num);
    // And load the view repo stat page
    location.href = 'viewInitialRepoStats.html';

}
