$(document).ready(function() {
    // Vérifie l'email et le mot de passe lors du clic sur "Se connecter"
    $('#submit').on('click', function(e) {
        e.preventDefault(); // Empêcher l'envoi du formulaire
        // Déclaration des variables input email et mdp
        let email = $('#email').val().trim();
        let password = $('#mdp').val().trim();

        // Renvoi une alerte si la saisie est vide
        if (!email || !password) {
            alert("Veuillez saisir un email et un mot de passe.");
            return;
        }

        // Vérifications et redirections
        if (isEmailAlreadyUsed(email)) {
            let user = checkPassword(email, password); // Retourne l'utilisateur s'il est trouvé

            if (user) {
                // Stocke les informations de l'utilisateur connecté dans le localStorage
                localStorage.setItem("currentUser", JSON.stringify(user));

                alert("Bienvenue, vous êtes connecté !");
                window.location.href = "profile.html"; // Redirection vers la page du profil
            } else {
                alert("Mot de passe incorrect.");
            }
        } else {
            alert("Compte introuvable. Veuillez créer un compte.");
            window.location.href = "inscription.html"; // Redirection vers la page d'inscription
        }
    });

    // Active/désactive le bouton de connexion quand on tape
    $('#email, #mdp').on('input', function() {
        let email = $('#email').val().trim();
        let password = $('#mdp').val().trim();
        $('#submit').prop('disabled', !(email && password));
    });
});

// Vérifie si l'email existe dans le localStorage
function isEmailAlreadyUsed(email) {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Vérifie si le mot de passe correspond à l'email et retourne l'utilisateur si trouvé
function checkPassword(email, password) {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    let foundUser = users.find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
    console.log(foundUser)
    return foundUser ? foundUser : null; // Retourne l'utilisateur s'il est trouvé, sinon null
}
