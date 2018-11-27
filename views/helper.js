function header() {
    return `
    <header>
        <h1>Super Duper Page of Fun!</h1>
    </header>
    `;
}

function logoutButton() {
    return `
    <div>
        <form action="/logout" method="POST">
        <input type="submit" value="logout">
        </form>
    </div>
    `;
}

function loginOrRegister() {
    return `
    <div>
        <a href="/login">Login</a>
        |
        <a href="/register">Register</a>
    </div>
    `;
}

function footer() {
    return `
    <footer>
        <p>&copy; 2000 seecko loko, 🤪</p>
    </footer>
    `;
}

module.exports = {
    header,
    footer,
    logoutButton,
    loginOrRegister
};
