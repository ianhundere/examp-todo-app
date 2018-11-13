function registrationForm() {
    return `
        <form action="/register" method="POST">
            <label> 
                Name:
                <input type="text" name="name"> <br> 
            </label>
            
            <label>
                Username:
                <input type="text" name="username"> <br>
            </label>
            <label>
                Password:
                <input type="password" name="password"> <br>
            </label>
            <br>
            <button>Register!</button>
        </form>
    `;
}

module.exports = registrationForm;
