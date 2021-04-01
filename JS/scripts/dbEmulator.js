String.prototype.hashCode = function() {
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash;
    }
    return hash;
}

export 
class DbEmulator {
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
            this.save().then(
                result => {
                    alert(result);
                    console.log(result);
                },
                error => alert(error)
            );
        }
        else {
            throw new Error(`User \'${userName}\' already exists!`);
        }
    }

    authenticateUser(userName, password) {
        console.log(this.tree);
        try {
            if (this.tree[userName].passwordHash === password.hashCode()) {
                this.tree.currentUser = userName;
                this.save().then(
                    result => {
                        alert(result);
                        console.log(result);
                    },
                    error => alert(error)
                );
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

    save() {
        let that = this;
        return new Promise(function(resolve, reject) {
            try {
                localStorage.setItem(that.appName, JSON.stringify(that.tree));
                resolve('Saving achieved success.');
            }
            catch (e) {
                console.log(e);
                reject(new Error('Saving has failed!'));
            }

        });
    }

    getPaletteList() {
        if (this.tree.currentUser != null) {
            let list = [];
            for (var key in this.tree[this.tree.currentUser].palettes) {
                list.push(key);
            }
            console.log(list);
            return list;
        }
    }

    
    getPalette(paletteTitle) {
        if (this.tree.currentUser != null) {
            return this.tree[this.tree.currentUser].palettes[paletteTitle];
        }
    }

    savePalette(palette) {
        if (this.tree.currentUser != null) {
            if (this.tree[this.tree.currentUser].palettes == null) {
                this.tree[this.tree.currentUser].palettes = {};
            }
            this.tree[this.tree.currentUser].palettes[palette.title] = palette;
            
            this.save().then(
                result => {
                    alert(result);
                    console.log(result);
                },
                error => alert(error)
            );
        }  
    }

    logout() {
        this.tree.currentUser = null;
        this.save();
    }
}