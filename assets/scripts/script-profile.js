

//afficher une image différente en fonction de l'option select

document.addEventListener("DOMContentLoaded", function() {
    // Vérifier si un utilisateur est connecté
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        alert("Vous n'êtes pas connecté !");
        window.location.href = "login.html"; // Rediriger vers la page de connexion
        return;
    }

    // Affichage des informations de l'utilisateur
    $("#repeat-email").text(currentUser.email);
    $("#repeat-name").text(currentUser.name);
    //sauvegarde les choix d'utilisateur
    $('#submit').on('click', saveOption)
    //charge l'image au chargement de la page
    changeImage();
    //change d'image dans le select memory
    $('#memory').on('change', function() {
        changeImage();
    })
});

function saveOption () {
    let options = {
        memoryChoice: $('#memory').val(),
        memorySize: $('#memory-size').val(),
    };

        // Sauvegarder dans localStorage
        localStorage.setItem("options", JSON.stringify(options));
        $('#display-option').text('choix sauvegardé');
        $('#display-option').css('color', 'red');
        
}

// Change l'image selon l'option sélectionnée
function changeImage() {
    let choice = $('#memory').val(); // Récupère la valeur sélectionnée

    console.log("Choix sélectionné :", choice); // Debugging
    console.log("Changement détecté2 !")
    let imagePath = "";

    switch (choice) {
        case "chiens":
            imagePath = "assets/images/chiens/memory_details_chiens.png";
            break;
        case "alphabet-scrabble":
            imagePath = "assets/images/alphabet-scrabble/memory_detail_scrabble.png";
            break;
        case "animaux":
            imagePath = "assets/images/animaux/memory_detail_animaux.png";
            break;
        case "animaux-animes":
            imagePath = "assets/images/animauxanimes/memory_detail_animaux_animes.png";
            break;
        case "animaux-domestiques":
            imagePath = "assets/images/animauxdomestiques/memory_detail_animaux_domestiques.png";
            break;
        case "dinosaures":
            imagePath = "assets/images/dinosaures/memory_detail_dinosaures.png";
            break;
        case "dinosaures-avec-nom":
            imagePath = "assets/images/dinosauresAvecNom/memory_details_dinosaures_avec_nom.png";
            break;
        case "memory-legume":
            imagePath = "assets/images/memory-legume/memory_detail.png";
            break;
        default:
            imagePath = "assets/images/memory-legume/memory_detail.png"; // Image par défaut si aucun choix
            break;
    }
    $('.render-memory img').attr("src", imagePath);

}