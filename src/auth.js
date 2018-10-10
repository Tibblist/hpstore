var _authed = false;
var _name = "";

export class AuthService {
      constructor() {
        console.log("Contructor for AuthService ran!");
      }

      static getName() {
          return _name;
      }

      static isAuthed() {
        return _authed;
      }

      static authenticate(name) {
          console.log("Authenticated user: " + name);
          _name = name;
          _authed = true;
      }

      static logout() {
          console.log("Logged out!");
          _authed = false;
      }
  }