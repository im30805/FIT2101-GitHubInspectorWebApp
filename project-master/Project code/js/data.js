// Use this file for code which does stuff with the data from github
// Most of the functions in here already exist in their respective js files.
// This acts like a backup(?) now.



//Displays data from many issues
function display_data(issueList) {
  counter = 1;
  issueList.items.forEach(i =>{
    i.issue_number = counter;
    console.log("Issue number = " + counter++);
    console.log("Created = " + i.created_at);
    console.log("Updated = " + i.updated_at);
    console.log("Comments = " + i.comments);
    console.log("Closed = " + i.closed_at);
})}

//Function which gives 2 arrays corresponding to the Comments per issue
//The two arrays are issue number, and issue number
// This will later be turned into average response time per issue
// the arrays will be average response time(total response time divided by total comments) and issue issue_number
function comments_vs_issue(object){
  object.items.forEach(i =>{
  issue_array.push(i.issue_number);
  let final_time = new Date(i.updated_at);
  let initial_time = new Date(i.created_at);
  let total_time = final_time - initial_time;
  let num_comment = i.comments;
  let avg_time = total_time/num_comment;
  avg_time = Math.round(avg_time/3.6e+6);
  comment_array.push(avg_time);
}
)}

// This function will save a repo to local storage. it turns the repo into a string then sets it in ls with a key
// The repo should be an object
//currently can only store 1 repo
function save_repo_LS(repo) {
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



}

// This function uses the key given as input and parses the repo (which is a string) to an object.
function load_repo_LS(repoKey) {
  let getRepoKey = localStorage.getItem(STORAGE_KEY_INIT_REPO);
  let getRepoObj = JSON.parse(getRepoKey);

}



function viewInitialRepo(num){
  // Save the desired location to local storage
    localStorage.setItem(STORAGE_KEY_VIEW_STAT + "-selectedIndex", num);
    // And load the view location page.
    location.href = 'viewRepoStats.html';

}





async function getStatsIssue(){

  const url = "https://api.github.com/search/issues?q=repo:" + repoName + "/" + repoName + "&updated:>=2019-01-01&comments:>=50";
  //const url = "https://api.github.com/search/issues?q=repo:tensorflow/tensorflow&updated:>=2019-01-01&per_page=100";
  const response = await fetch(url);
  const result = await response.json();


  console.log(result);
  display_data(result);
  comments_vs_issue(result);
      document.getElementsByClassName("mdl-card__supporting-text")[0].innerHTML = result.total_count + " Issues";

}



//Function which finds the total number of files in a given repository, and their names
function getStatsfile(){
  const url = "https://api.github.com/repos/" +

}


//Function which gets the list of contributors to a file, aswell as the total number of contributors
>>>>>>> Stashed changes
