/* LOGIN */
logIn = async () => {
    let user = Moralis.User.current();
    if (!user) {
        // controllo se l'utente è connesso dal cellulare o pc
        if (typeof screen.orientation === 'undefined') {
            // cellulare
            const user = await Moralis.authenticate({
                provider: "walletconnect",
                signingMessage: "Login on gabrielbenolli.com (mobile login)",
                mobileLinks: [
                    "rainbow",
                    "metamask",
                    "argent",
                    "trust",
                    "imtoken",
                    "pillar",
                ]
            }).then(function (user) {
                checkUser();
                //location.reload();
            }).catch(function (error) {
                changeValue("error", "<b>Error:</b> " + error.message + "<br><b>Code:</b> " + error.code);
                console.log(error);
            });
        } else {
            // pc
            user = await Moralis.authenticate({
                signingMessage: "Login on gabrielbenolli.com (desktop login)",
            }).then(function (user) {
                checkUser();
                //location.reload();
            }).catch(function (error) {
                changeValue("error", "<b>Error:</b> " + error.message + "<br><b>Code:</b> " + error.code);
                console.log(error);
            });
        }
    }
}

logInWC = async () => {
    let user = Moralis.User.current();
    if (!user) {
        // controllo se l'utente è connesso dal cellulare o pc
        if (typeof screen.orientation === 'undefined') {
            // cellulare
            const user = await Moralis.authenticate({
                provider: "walletconnect",
                signingMessage: "Login on gabrielbenolli.com (mobile login)",
                mobileLinks: [
                    "rainbow",
                    "metamask",
                    "argent",
                    "trust",
                    "imtoken",
                    "pillar",
                ]
            }).then(function (user) {
                checkUser();
                //location.reload();
            }).catch(function (error) {
                changeValue("error", "<b>Error:</b> " + error.message + "<br><b>Code:</b> " + error.code);
                console.log(error);
            });
        } else {
            // cellulare
            const user = await Moralis.authenticate({
                provider: "walletconnect",
                signingMessage: "Login on gabrielbenolli.com (mobile login)",
                mobileLinks: [
                    "rainbow",
                    "metamask",
                    "argent",
                    "trust",
                    "imtoken",
                    "pillar",
                ]
            }).then(function (user) {
                checkUser();
                //location.reload();
            }).catch(function (error) {
                changeValue("error", "<b>Error:</b> " + error.message + "<br><b>Code:</b> " + error.code);
                console.log(error);
            });
        }
    }
}

// Register with email/password + check user
async function register() {
    console.log("register chiamata");

    // Get the user credential
    const _email = document.getElementById('email').value;
    const _password = document.getElementById('password').value;

    // Create a new user and set email and password attributes
    const user = new Moralis.User();
    user.set("username", _email);
    user.set("email", _email);
    user.set("ethAddress", "0x" + _email);
    user.set("password", _password);

    // Sign them up with one line of code
    try {
        await user.signUp();
        sendEmailVerification(_email);
        console.log("sendverification chiamata chiamata");
    } catch (error) {
        alert("Error: " + error.code + " " + error.message);
    }
    checkUser();
}

// Sign in with email/password + check user
async function userSignIn() {
    const user = Moralis.User.current();
    if (!user) {
        const _email = document.getElementById('email').value;
        const _password = document.getElementById('password').value;

        // Log them in with one line of code
        try {
            const user = await Moralis.User.logIn(_email, _password);

            //ACCESSO CONSENTITO SOLO SE VERIFICATO
            const Monster = Moralis.Object.extend("_User");
            const query = new Moralis.Query(Monster);

            query.equalTo("ethAddress", user.get("ethAddress"));

            const result = await query.first();
            console.log(result);
            console.log(result.get("emailVerified"));
            if (!result.get("emailVerified")) {
                alert("Devi verificare il tuo account per poter accedere, controlla la tua casella postale, la mail di verifica potrebbe essere nella SPAM");
                logOut();
            }
            // END ACCESSO CONSENTITO SOLO SE VERIFICATO

        } catch (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    } else alert('A user is already logged in');

    checkUser();
}

function resetPassword() {
    const email = document.getElementById('email').value;
    //getting email from email input
    if (email) {
        Moralis.User.requestPasswordReset(email)
            .then(() => {
                alert("Password change mail sent successfully");
                // Password reset request was sent successfully
            })
            .catch((error) => {
                // Show the error message somewhere
                alert("Error: " + error.code + " " + error.message);
            });
    } else {
        alert("Enter email first");
    }
};

// verify with email
async function verify() {

    // Get the user credential
    const _email = document.getElementById('email').value;
    const _password = document.getElementById('password').value;
    // Sign them up with one line of code
    try {
        sendEmailVerification(_email);
    } catch (error) {
        alert("Error: " + error.code + " " + error.message);
    }
    checkUser();
}

async function sendEmailVerification(email) {
    console.log("send email chiamata");
    await Moralis.User.requestEmailVerification(email)
        .then(() => {
            //user will get an email with a link. If the user clicks on the link his user get authenticated.
            alert("Verification email sent successfully");
        })
        .catch((error) => {
            // Show the error message somewhere
            alert("Error: " + error.code + " " + error.message);
        });
};


//CLOUD FUNCTION CHE NON CREDO SERVA

// Moralis.Cloud.define("sendEmailToUser", function (request) {
//     Moralis.Cloud.sendEmail({
//         to: request.user.get("email"),
//         subject: "Fundamentals",
//         html: "TestMail"
//     });
// });


document.getElementById("login_button").onclick = logIn;
document.getElementById("login_wc").onclick = logInWC;
document.getElementById("login_button2").onclick = userSignIn;
document.getElementById("register_button").onclick = register;
document.getElementById("reset_button").onclick = resetPassword;
document.getElementById("verification-button").onclick = verify;