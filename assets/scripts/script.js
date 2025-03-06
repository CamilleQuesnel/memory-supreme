

// initialisation du script
$(document).ready(function() {
    //gestion du local storage & de l'email
$('#submit').on('click', function(e) {
    e.preventDefault(); // Empêcher la soumission par défaut
    
    // Vérifier l'email avant de créer le compte
    if (testEmail()) {
        // Vérifier si l'email est unique
        if (isEmailAlreadyUsed()) {
            // Si tout est valide, enregistrer
            sendToLocalStorage();
        }
    }
});
    // Vérifie la saisie du nom qui doit faire + que 3 caractères
    $('#name').on('input', testName);
    // Vérifier que le format d'email soit bien respecté
    $('#email').on('input', testEmail);
    // Vérifie la saisie du mot de passe
    $('#mdp').on ('input', testPassword);
    // Désactive le bouton submit par défaut
    $('#submit').prop('disabled', true);
    $('#name, #email').on('input', toggleSubmitButton);
    // Change la couleur selon la sécurité du pwd
    $('#mdp').on('input',testColorPassword);
    // Confirmation deuxième saisie ok
    $('#confirmMdp').on('input', checkPassword) ;
});

function testName() {
    let name = $('#name').val();
    if (name.length < 3) {
        $("#name-alert").text('Attention : votre saisie doit faire au moins 3 caractères');
        $('#name-alert').css('color', 'red');
        return false;
    } else {
        $("#name-alert").text('');
        return true;
    }
}

function testEmail() {
    let email = $('#email').val();
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        $("#email-alert").text('Attention : veuillez entrer un email valide');
        $('#email-alert').css('color', 'red');
        return false;
    } else {
        $("#email-alert").text('');
        return true;
    }
}

function testPassword() {
    let pwd = $('#mdp').val();
    console.log("Valeur saisie :", '"' + pwd + '"', "Longueur :", pwd.length);
    let pwdPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{6,}$/;

    if (!pwdPattern.test(pwd)) {
        
        return false;
    } else {
        $("#security-text").text('');
        return true;
    }
}

//change la couleur en fonction de la longueur du password
function testColorPassword() {
    let pwd = $('#mdp').val();
    let hasNumber = /\d/.test(pwd);//vérifie les chiffres
    let hasSymbol = /[\W_]/.test(pwd); // Vérifie si un symbole est présent

    let securityColor = $('#security-color');
    let securityText = $('#security-text');
    let colorRed = $('#red-color');
    let colorYellow = $('#yellow-color');
    let colorGreen = $('#green-color');
    let lowText = $('#low-text');
    let mediumText = $('#medium-text');
    let highText = $('#hight-text');

    // Réinitialiser la visibilité de tous les éléments
    securityColor.css("visibility", "hidden");
    securityText.css("visibility", "hidden");
    colorRed.css("visibility", "hidden");
    colorYellow.css("visibility", "hidden");
    colorGreen.css("visibility", "hidden");
    lowText.css("visibility", "hidden");
    mediumText.css("visibility", "hidden");
    highText.css("visibility", "hidden");

    if (pwd.length >= 1) {
        securityColor.css("visibility", "visible");
        securityText.css("visibility", "visible");
        colorRed.css("visibility", "visible");
        lowText.css("visibility", "visible");

        if (pwd.length >= 6 && hasNumber || pwd.length >= 6 && hasSymbol) {
            colorYellow.css("visibility", "visible");
            mediumText.css("visibility", "visible");
        
            if (pwd.length >= 9 & testPassword() == true) {
                colorYellow.css("visibility", "visible");
                mediumText.css("visibility", "visible");
                colorGreen.css("visibility", "visible");
                highText.css("visibility", "visible");}
        }
    }
}

//Confirme la deuxième saisie du password
function checkPassword() {
    let isPasswordValid = testPassword();
    let confirmPassword = $('confirmMdp').val();
    if (confirmPassword != isPasswordValid){
    $('#submit').prop('disabled', !isPasswordValid)
    }
}

//le bouton création du compte reste inactif tant que la saisie est incorrecte
function toggleSubmitButton() {
    let isNameValid = testName();
    let isEmailValid = testEmail();
    let isPasswordValid = testPassword();
    $('#submit').prop('disabled', !(isNameValid && isEmailValid && isPasswordValid));
    return true;
}

//envoi les données dans le localStorage à l'appui de submit

    function sendToLocalStorage() {
        let newUser = {
            name: $('#name').val(),
            email: $('#email').val(),
            password: $('#mdp').val() 
        };

        // Récupérer le tableau d'utilisateurs existant dans localStorage 
        let users = JSON.parse(localStorage.getItem("users")) || [];

        // Ajouter le nouvel utilisateur au tableau
        users.push(newUser);

        // Sauvegarder dans localStorage
        localStorage.setItem("users", JSON.stringify(users));
        
        // Rediriger ou afficher un message de succès
        alert('Compte créé avec succès !');
    }

//teste si l'email est déjà dans le LocalStorage
    function isEmailAlreadyUsed() {
        // Récupérer l'email saisi par l'utilisateur
        let emailToCheck = $('#email').val();
        // Récupérer le tableau des utilisateurs depuis localStorage
        let users = JSON.parse(localStorage.getItem("users")) || [];
        // Log pour voir combien d'utilisateurs sont dans le localStorage
        console.log("Nombre total d'utilisateurs:", users.length);

        
        // Boucle pour parcourir tous les utilisateurs
        for (let i = 0; i < users.length; i++) {
            // Log de débogage pour chaque utilisateur
            console.log(`Utilisateur ${i + 1}:`, 
                "Email enregistré:", users[i].email, 
                "| Email à vérifier:", emailToCheck
            );
            
            // Comparaison en minuscules pour éviter les problèmes de casse
            if (users[i].email.toLowerCase() === emailToCheck.toLowerCase()) {
                // Email déjà utilisé
                console.log("Email TROUVE: Correspond à un email existant!");
                alert('Cet email est déjà utilisé');
                return false; // Bloquer la création du compte
            }
        }
        
        // Si aucun doublon n'a été trouvé
        return true; // Autoriser la création du compte
    }