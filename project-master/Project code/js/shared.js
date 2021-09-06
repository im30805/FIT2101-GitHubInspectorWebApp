// Storage keys for use throughout the project code
// Use the strings instead of variable name in the codes
// Does not work when using variable name
const STORAGE_KEY_INIT_REPO = "Initial repository";
const STORAGE_KEY_SEARCH_REPO = "Repository search";
const STORAGE_KEY_VIEW_STAT = "Selected repository";
const STORAGE_KEY_VIEW_SEARCH = "Searched repository";
const STORAGE_KEY_HISTORY = "Recent viewed repository"
const KEY_LOGIN = "Login"

class User
{
  constructor(username,password){
    this._username = username;
    this._password = password;
  }

  set getuser(newUsername)
{
    this._username = newUsername;
}

  get getuser()
  {
    return this._username
  }

  set getpass(newPassword)
{
    this._password = newPassword;
}

  get getuser()
  {
    return this._password
  }

}
