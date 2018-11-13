const db = require('./db');

class Todo {
    constructor(id, name, completed) {
        this.id = id;
        this.name = name;
        this.completed = completed;
    }
    // CREATE
    static add(name, completed) {
        return db
            .one(
                `insert into todos (name, completed)
            values ($1, $2)
            returning id`,
                [name, completed]
            )
            .then(todo => {
                console.log(todo);
                const t = new Todo(todo.id, name, completed);
                return t;
            });
    }

    // RETRIEVE
    static getAll() {
        return db.any('select * from todos').then(todoArray => {
            const instanceArray = todoArray.map(todoObj => {
                const t = new Todo(todoObj.id, todoObj.name);
                return t;
            });
            return instanceArray;
        });
    }

    static getById(id) {
        return db
            .one(`select * from todos where id = $1`, [id])
            .catch(err => {
                return {
                    name: 'No todo found.'
                };
            })
            .then(result => {
                const t = new Todo(result.id, result.name, result.completed);
                return t;
            });
    }

    // UPDATE

    assignToUser(userId) {
        this.userId = userId;
        return db.result(
            `update todos
        set user_id=$2
          where id=$1`,
            [this.id, userId]
        );
    }

    updateName(name) {
        this.name = name;
        return db.result(
            `update todos
        set name=$2
          where id=$1`,
            [this.id, name]
        );
    }

    updateCompleted(didComplete) {
        this.didComplete = didComplete;
        return db.result(
            `update todos 
        set completed=$2 
          where id=$1`,
            [this.id, didComplete]
        );
    }

    markCompleted() {
        return db.result(
            `update todos 
	      set completed=$2 
	        where id=$1`,
            [this.id, true]
        );
    }

    markPending() {
        return db.result(
            `update todos 
	      set completed=$2 
	        where id=$1`,
            [this.id, false]
        );
    }

    // DELETE
    static deleteById(id) {
        return db.result(
            `delete from todos 
        where id = $1`,
            [id]
        );
    }
}

// CREATE
// function add(name, completed) {
//   return db.one(
//     `insert into todos (name, completed)
//         values
//             ($1, $2)
//         returning id
//     `,
//     [name, completed]
//   );
// }

// RETRIEVE
// // example of grabbing all the rows
// function getAll() {
//   return db.any("select * from todos");
// }

// // example of grabbing one row
// function getById(id) {
//   return db.one(`select * from todos where id = $1`, [id]).catch(err => {
//     // Got nuthin'
//     // console.log('you did not get a todo');
//     return {
//       name: "No todo found."
//     };
//   });
// }

// UPDATE

// function assignToUser(todoId, userId) {
//   return db.result(
//     `
//         update todos
//             set user_id = $2
//         where id = $1
//     `,
//     [todoId, userId]
//   );
// }

// // example of updating a row
// function updateName(id, name) {
//   return db.result(
//     `update todos
//         set name=$2
//     where id=$1`,
//     [id, name]
//   );
// }

// function updateCompleted(id, didComplete) {
//   return db.result(
//     `update todos
//         set completed=$2
//     where id=$1`,
//     [id, didComplete]
//   );
// }

// function markCompleted(id) {
//   // return updateCompleted(id, true);
//   return db.result(
//     `update todos
// 	                    set completed=$2
// 	                where id=$1`,
//     [id, true]
//   );
// }

// function markPending(id) {
//   // return updateCompleted(id, false);
//   return db.result(
//     `update todos
// 	                    set completed=$2
// 	                where id=$1`,
//     [id, false]
//   );
// }

// DELETE
// example of deleting a row
// function deleteById(id) {
//   return db.result(`delete from todos where id = $1`, [id]);
// }

// static assignToUser(todoId, userId) {
//     return db
//         .result(
//             `update users
//           set user_id = $2
//             where id = $1`,
//             [todoId, userId]
//         )
//         .then(result => {
//             const u = new User(result.todoId, result.userId);
//             return u;
//         });
// }
//   static updateName(id, name) {
//     return db
//         .result(
//             `update users
//           set name=$2
//             where id=$1`,
//             [id, name]
//         )
//         .then(result => {
//             const u = new User(result.id, result.name);
//             return u;
//         });
// }
//   static updateCompleted(id, didComplete) {
//     return db
//         .result(
//             `update todos
//           set completed=$2
//             where id=$1`,
//             [id, didComplete]
//         )
//         .then(result => {
//             const u = new User(result.id, result.didComplete);
//             return u;
//         });
// }

//   static markCompleted(id) {
//     return db
//         .result(
//             `update todos
// 	        set completed=$2
// 	           where id=$1`,
//             [id, true]
//         )
//         .then(result => {
//             const u = new User(result.id, result.true);
//             return u;
//         });
// }

//   static markPending(id) {
//     return db
//         .result(
//             `update todos
// 	        set completed=$2
// 	          where id=$1`,
//             [id, false]
//         )
//         .then(result => {
//             const u = new User(result.id, result.false);
//             return u;
//         });
// }

module.exports = Todo;
// module.exports = {
//   add,
//   assignToUser,
//   deleteById,
//   getAll,
//   getById,
//   markCompleted,
//   markPending,
//   updateName
// };
