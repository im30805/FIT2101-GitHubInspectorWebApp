let getHistoryKey = localStorage.getItem("Recent viewed repository");
let getHistoryObj = JSON.parse(getHistoryKey);

let outputRef = document.getElementById("viewedRepos");
let output = "";


for(let i = 0; i < 5 && i < getHistoryObj.length; i++){
  output += "<span class=\"mdl-chip mdl-chip--contact\" onclick=\"viewSeenRepo("+i+");\">";
  output += "<span class=\"mdl-chip__text\">"+getHistoryObj[i]+"</span></span><br><br>";
}

outputRef.innerHTML = output;

function viewSeenRepo(num){
  // Save the desired location to local storage
    localStorage.setItem("Recent viewed repository" + "-selectedIndex", num);
    // And load the view repo stat page
    location.href = 'viewRecentRepo.html';
}
