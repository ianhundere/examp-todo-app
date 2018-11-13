require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const db = require('./models/db');
app.use(
    session({
        store: new pgSession({
            pgPromise: db
        }),
        secret: 'bingbong0987654321234567890',
        saveUninitialized: false
    })
);

app.use(express.static('public'));

// Configure body-parser to read data sent by HTML form tags
app.use(bodyParser.urlencoded({ extended: false }));

// Configure body-parser to read JSON bodies
app.use(bodyParser.json());

// const Todo = require('./models/Todo');
const User = require('./models/User');
// const bcrypt = require('bcrypt');

const page = require('./views/page');
const userList = require('./views/userList');
const todoList = require('./views/todoList');
const userForm = require('./views/userForm');
const registrationForm = require('./views/registrationForm');
const loginForm = require('./views/loginForm');

app.get('/', (req, res) => {
    const thePage = page('ahoy partnah!');
    res.send(thePage);
});

// ========================================================
// ALL USERS
// ========================================================
// Retrieve all users
app.get('/users', (req, res) => {
    User.getAll().then(allUsers => {
        // res.send(allUsers);
        const usersUL = userList(allUsers);
        const thePage = page(usersUL);
        console.log(thePage);
        res.send(thePage);

        // res.send(page(userList(allUsers)));
    });
});

// Listen for POST requests
// Create a new user
app.post('/users/', (req, res) => {
    console.log(req);
    // console.log(req.body);
    // res.send("ok");
    const newUsername = req.body.name;
    User.add(newUsername).then(theUser => {
        res.send(theUser);
    });
});

// ========================================================
// User Registration
// ========================================================

app.get('/register', (req, res) => {
    // Send them the signup form
    const theForm = registrationForm();
    const thePage = page(theForm);
    res.send(thePage);
    // res.send(page(registrationForm()));
});
app.post('/register/', (req, res) => {
    // Process the signup form
    // 1. Grab the values out of req.body
    const newUsername = req.body.username;
    const newName = req.body.name;
    const newPassword = req.body.password;

    console.log(newUsername);
    console.log(newName);
    console.log(newPassword);
    // 2. Call User.add
    User.add(newUsername, newName, newPassword).then(NewUser => {
        // 3. If that works, redirect to the welcome page
        res.redirect('/welcome');
    });
});

app.get('/welcome', (req, res) => {
    // Send them the welcome page
    res.send(page('<h1>welcomez user</h1>'));
});

// ========================================================
// User Login
// ========================================================

app.get('/login', (req, res) => {
    // Send them the login form
    const theLogin = loginForm();
    const thePage = page(theLogin);
    res.send(thePage);
    // res.send(page(registrationForm()));
});
app.post('/login/', (req, res) => {
    // Process the login form
    // 1. Grab values from login form
    const theUserName = req.body.username;
    const thePassword = req.body.password;
    console.log(theUserName);
    console.log(thePassword);
    // 2. Find a user who name matches 'theUsername'
    User.getByUserName(theUserName)
        .catch(err => {
            console.log(err);
            res.redirect('/login');
        })
        .then(theUser => {
            // const didMatch = bcrypt.compareSync(thePassword, theUser.pwhash);
            if (theUser.passwordDoesMatch(thePassword)) {
                req.session.user = theUser;
                res.redirect('/welcome');
            } else {
                res.redirect('/login');
            }
            // 3. If that works, check to see if the pw matches

            // 4. If that works, redirect to the welcome page
            res.redirect('/welcome');
        });
});
app.get('/welcome', (req, res) => {
    // Send them the welcome page
    console.log(req.session.user);
    res.send(page(`<h1>welcomez ${req.session.user.username}</h1>`));
});

// ========================================================
// Retrieve one user's info

// ========================================================
// Retrieve all todos for a user
app.get(`/users/:id(\\d+)/todos`, (req, res) => {
    User.getById(req.params.id).then(theUser => {
        theUser.getTodos().then(allTodos => {
            const todosUL = todoList(allTodos);
            const thePage = page(todosUL);
            res.send(thePage);
        });
    });
});

// ========================================================
// GET the form for editing one user's info
app.get('/users/:id([0-9]+)/edit', (req, res) => {
    // console.log(req.params.id);
    User.getById(req.params.id)
        .catch(err => {
            res.send({
                message: `no soup for you`
            });
        })
        .then(theUser => {
            res.send(page(userForm(theUser)));
        });
});

// ========================================================
// Process the form for editing one user's info
app.post('/users/:id([0-9]+)/edit', (req, res) => {
    const id = req.params.id;
    const newName = req.body.name;
    // Get the user by their id
    User.getById(id).then(theUser => {
        // call that user's updateName method
        theUser.updateName(newName).then(didUpdate => {
            if (didUpdate) {
                res.redirect(`/users`);
            } else {
                res.send('no go');
            }
        });
    });
});

app.post('/users/:id([0-9]+)/edit', (req, res) => {
    const id = req.params.id;
    const newName = req.body.name;
    // Get the user by their id
    User.getById(id).then(theUser => {
        // call that user's updateName method
        theUser.updateName(newName).then(didUpdate => {
            if (didUpdate) {
                // res.send('yeah you did');
                // res.redirect(`/users/${id}/edit`);
                res.redirect(`/users/`);
            } else {
                res.send('💩');
            }
        });
    });
});

// ========================================================

app.listen(3000, () => {
    console.log('express app is ready.');
});

// app.get("/users/:id(\\d+)", (req, res) => {
//   User.getById(req.params.id).then(userByID => {
//     res.send(userByID);
//   });
// });

// app.get("/users/:name", (req, res) => {
//   User.searchByName(req.params.name).then(userByName => {
//     res.send(userByName);
//   });
// });

// app.get("/todos/:name", (req, res) => {
//   User.getTodos(req.params.name).then(getUserTodos => {
//     res.send(getUserTodos);
//   });
// });

// app.get("/todos/", (req, res) => {
//   Todo.getAll().then(allTodos => {
//     res.send(allTodos);
//   });
// });

// app.get("/todos/:id(\\d+)", (req, res) => {
//   Todo.getById(req.params.id)
//     .catch(err => {
//       res.send({
//         message: `that's a negative`
//       });
//     })
//     .then(theTodo => {
//       res.send(theTodo);
//     });
// });

// Match the string "/users/" followed by one or more digits
// REGEX or Regular Expressions
// app.get("/users/:id([0-9]+)", (req, res) => {
// app.get("/users/:id(\\d+)", (req, res) => {
//   // console.log(req.params.id);
//   User.getById(req.params.id)
//     .catch(err => {
//       res.send({
//         message: `that's a negative`
//       });
//     })
//     .then(theUser => {
//       res.send(theUser);
//     });
// });

// Listen for a PUT/Update request ==================================================================

// app.put("/users/:id(\\d+)", (req, res) => {
//   User.getById(req.params.id).then(theUser => {
//     theUser.updateName("larko").then(result => {
//       res.send(result);
//     });
//   });
// });

// app.put("/users/:userId(\\d+)", (req, res) => {
//   User.getById(req.params.userId).then(theUser => {
//     theUser.assignToUser(5).then(result => {
//       res.send(result);
//     });
//   });
// });

// app.put("/todos/:id(\\d+)", (req, res) => {
//   Todo.getById(req.params.id).then(theTodo => {
//     theTodo.updateName("make burritos").then(result => {
//       res.send(result);
//     });
//   });
// });

// Listen for a DELETE/Delete request ==================================================================

// app.delete("/users/:id(\\d+)", (req, res) => {
//   User.getById(req.params.id).then(theUser => {
//     theUser.delete().then(delUser => {
//       res.send(delUser);
//     });
//   });
// });

// app.delete("/users/:id(\\d+)", (req, res) => {
//   User.deleteById(req.params.id).then(delUserByID => {
//     res.send(delUserByID);
//   });
// });

// ====== example of sending a whole page
// *
// User.getAll()
//   .then(allUsers => {
//     let userList = ``;
//     allUsers.forEach(user => {
//       userList += `<li> ${user.name}</li>`
//     });
//     let thePage = `
//       <!doctype>
//       <html>
//         <head>
//         </head>
//           <body>
//             <h1>allo</h1>
//             <ul>
//               ${userList}
//             </ul>
//           </body>
//         </html >
//         `;
// console.log(allUsers);
// res.send(thePage);
// res.send(allUsers);
// res.status(200).json(allUsers);
// })
// res.send('Hi Express');
// });
// *
