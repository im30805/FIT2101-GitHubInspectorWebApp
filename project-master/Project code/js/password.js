function storeUser(){
  let adduser = new User("user","user12345");
  let adduser2 = new User("ziling","hiimziling");
  let user_array = [adduser,adduser2];
  let getUser = localStorage.getItem(KEY_LOGIN);
  let getUserObject= JSON.parse(getUser);

  //storage dont have any crop data stored yet
  if (getUserObject===null)
  {
    //check local storage exist
    if (typeof(Storage) !== "undefined")
    {
      //chg obj to string and store
      let getUserStr= JSON.stringify(user_array);
      localStorage.setItem(KEY_LOGIN, getUserStr);
    }
    else
    {
     console.log("Error: localStorage is not supported by current browser.");
    }
  }
}


function checkPassword(){
  storeUser();
  let check = false;
  let retrieveKey = localStorage.getItem(KEY_LOGIN);
  let userObj = JSON.parse(retrieveKey);

  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;

  for (let i=0; i<userObj.length;i++){
    if (userObj[i]._username === user && userObj[i]._password === pass){
        check = true;
      }
  }

  if (check === true){
    location.href = "index.html";
  }
  else{
      alert("Invalid input. Please re-enter your username and password.");
  }



}
