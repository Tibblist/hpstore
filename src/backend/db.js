var db = {
    users: [],
    count: 0
}

export const Groups = Object.freeze({
    MEMBER: 1,
    BUILDER: 2,
    ADMIN: 3,
});

export class DB {
    addUser(name, refreshToken, group) {
        
    }
    static testCount() {
        db.count++;
        console.log(db.count);
    }
    static getCount() {
        return db.count;
    }
}