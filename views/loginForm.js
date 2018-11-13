function loginForm() {
    return `
        <form action="/login" method="POST">
            <label>
                Username:
                <input type="text" name="username"> <br>
            </label>
            <label>
                Password:
                <input type="password" name="password"> <br>
            </label>
            <br>
            <button>Login</button>
        </form>
    `;
}

module.exports = loginForm;
