export class DbEmulator {
    constructor() {
        this.appName = 'Chromatica';

        let jsonTree = localStorage.getItem(this.appName);
        if (jsonTree === null) {
            this.tree = {
                currentUser: null,
            };
            localStorage.setItem(this.appName, JSON.stringify(this.tree));
            this.currentUser = null;
        }
        else {
            this.tree = JSON.parse(jsonTree);
            this.currentUser = this.tree.currentUser;
        }
        if (this.currentUser != null) {
            document.getElementById('join-link').innerHTML = this.currentUser;
        }
    }

    registerUser(userName, password) {
        if (this.tree[userName] === undefined) {
            this.tree[userName] = {
                passwordHash: password.hashCode(),
                palettes: null,
            };
        }
        else {
            throw new Error(`User \'${userName}\' already exists!`);
        }
    }

    authenticateUser(userName, password) {
        try {
            if (this.tree[userName].passwordHash === password.hashCode()) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) {
            console.log(e);
            alert('Unexpected error!');
        }
    }

    savePalette(palette) {
        this.tree.currentUser.palettes[palette.title] = palette.colors;
        return new Promise(function(resolve, reject) {
            try {
                localStorage.setItem(this.appName, JSON.stringify(this.tree));
                resolve('Saving achieved success.');
            }
            catch (e) {
                console.log(e);
                reject(new Error('Saving has failed!'));
            }

        });
        savePromise.then(
            result => {
                alert(result);
                console.log(result);
            },
            error => alert(error)
        );
    }
}

export function registerButtonHandler(db) {
    const signUpLogin = document.getElementById('sign-up-login');
    const signUpPassword = document.getElementById('sign-up-password');
    const signUpConfirm = document.getElementById('sign-up-confirm');
    if (signUpPassword.value === signUpConfirm.value) {
        db.registerUser(signUpLogin.value, signUpPassword.value);
    }
    console.log(db.tree);
}

export function authButtonHandler(db) {
    const signInLogin = document.getElementById('sign-in-login');
    const signInPassword = document.getElementById('sign-in-password');
    const signInConfirm = document.getElementById('sign-in-confirm');
    if (db.authenticateUser(signInLogin.value, signInPassword.value)) {
            document.getElementById('join-link').innerHTML = signInLogin;
    }
    console.log(db.tree);
}

