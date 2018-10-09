export class AuthService {
      constructor() {
        this._authed = false;
        this._name = "";
      }

      static getName() {
          return this._name;
      }

      static isAuthed() {
        return this._authed;
      }

      static authenticate(name) {
          this._name = name;
          this._authed = true;
      }

      static logout() {
          this._authed = false;
      }
  }