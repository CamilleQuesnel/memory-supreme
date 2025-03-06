//rajouter les différents memory
//créer une fonction des meilleurs scores qui affiche
    //que les 5 derniers score
    //nom //score // taille //choix memory //date 

///////////////////////////////////////////
//      CHARGEMENT DU DOM               //
///////////////////////////////////////////
    document.addEventListener("DOMContentLoaded", function() {

    // Récupération des options de jeu
    let options = JSON.parse(localStorage.getItem("options")) || {
        memoryChoice: "memory-legume", // Valeur par défaut
        memorySize: "4x3"
    };
      // Initialise le compteur de coups
      $('#plays-number').text("Nombre de coups: 0");

         // Récupération de la base de données json
    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        // Utilise le choix de memory depuis localStorage
        let memoryType = options.memoryChoice;
        let memorySize = options.memorySize;
        
        // Récupère le tableau de cartes correspondant au type choisi
        let cards = data[memoryType];
        
        if (!cards) {
            console.error("Type de memory non trouvé:", memoryType);
            cards = data["legumes-cards"]; // Fallback par défaut
        }
        
        cards = shuffleArray(cards); // Mélange les cartes
        
        // Détermine le nombre de cartes à afficher selon la taille choisie
        let gridSize = 12; // Par défaut 4x3 = 12 cartes
        if (memorySize === "3x3") {
            gridSize = 6; // 3x3 = 9 cartes, donc 3 paires (6 cartes)
        }
        
        // Ne prend que le nombre de cartes nécessaires
        let selectedCards = cards.slice(0, gridSize);
        
        createBoard(selectedCards, memorySize); // Crée le tableau de cartes

        
            //cache la div front par défaut////////
            $('.front').css('display', 'none')  ///
            //////////////////////////////////////

             // Met à jour les variables globales
                totalPairs = gridSize / 2;

            $('.card').on ('click', memoryImage)//gère la disparition au click du back de la carte pour afficher le front de la carte
            $('.card').on ('click',onlyTwoCards)//gère la comparaison entre deux cartes, fait appel à d'autres fonctions
            console.log('Données chargées :', data);})
            .catch(error => {
                console.error("Erreur lors du chargement des données:", error);
            });
        console.log('ouistiti à la cerise')
        
    })
///////////////////////////////////////////
//      FIN CHARGEMENT DU DOM            //
//////////////////////////////////////////

    //création du jeu avce récupération du tableau dans le json
    function createBoard(cards, memorySize) {
        let board = $('#board'); // Récupération de l'ID
        board.empty(); // Vide la div
        
        // Détermine la classe CSS à appliquer en fonction de la taille
        let cardSizeClass = "card-4x3"; // Classe par défaut
        if (memorySize === "3x3") {
            cardSizeClass = "card-3x3"; // Classe pour les cartes 3x3
        }
        
        // Ajoute la classe spécifique au board pour adapter la mise en page
        board.removeClass("board-4x3 board-3x3").addClass("board-" + memorySize);
        
        // Crée les cartes
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i]; // Récupère chaque carte du tableau mélangé
            
            let cardHTML = `
                <div class="card ${cardSizeClass}" data-id="${card.id}">
                    <div class="front">
                        <img src="${card.image}" alt="Image ${card.name}">
                    </div>
                    <div class="back">
                        <img src="assets/question.svg" alt="Dos de carte">
                    </div>
                </div>
            `;
            
            board.append(cardHTML); // Ajoute les cartes au board
        }
    }

    //gère la disparition au click du back de la carte pour afficher le front de la carte
    function memoryImage() {
        let back = $(this).find('.back'); // Sélectionne uniquement la .back de la carte cliquée
        let front = $(this).find('.front'); // Sélectionne la .front de la carte cliquée
    
        if (back.length > 0) {
            back.css('display', 'none'); // Supprime uniquement la back de cette carte
            front.css('display', 'block'); // Affiche la face avant
            let countCards = $('.front:visible').length;//compte le nombre de cartes retournées
            console.log(countCards)
        }return 
    } 

// Fonction pour mélanger un tableau (algorithme de Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Échange des éléments
    }
    return array;
}


let cardIds = []; //stocke les deux cartes retournées
let cardElements = []; // Stocke les éléments pour cacher les mauvaises cartes après
let pairsFound = 0; // Compteur de paires trouvées
let totalPairs = 6; // Nombre total de paires 
let playsCount = 0; // Compteur de coups joués

function onlyTwoCards() {
    let revealedCards = $('.front:visible').closest('.card').not('.matched'); // Sélectionne uniquement les cartes visibles non appariées
    
    if (revealedCards.length === 2) { // Vérifie si exactement 2 cartes sont visibles
        playsCount++; // compteur de coups
        $('#plays-number').text(`Nombre de coups: ${playsCount}`); // Affiche le nombre de coups
        
        cardIds = []; // Réinitialise les tableaux
        cardElements = [];

        for (let i = 0; i < 2; i++) {
            let card = $(revealedCards[i]); // Prend l'index du fichier json de la carte front
            let cardId = card.attr("data-id"); // Récupère la data-ID de la carte
            cardIds.push(cardId); // Stocke l'ID
            cardElements.push(card); // Stocke l'élément HTML
        }

        console.log("Cartes retournées :", cardIds);

        // Désactive les clics pendant la vérification
        $('.card').off('click');
        
        // Vérifie si les deux cartes ont le même ID
        setTimeout(() => checkMatch(), 500); // Petit délai pour voir les cartes
    }
}

function checkMatch() {
    if (cardIds[0] === cardIds[1]) {
        console.log("C'est une paire !");
        // Ajoute la class Matched aux cartes qui sont paires
        cardElements.forEach(card => {
            card.addClass('matched');
        });
        
        pairsFound++;//rajoute 1 au compteur des paires
        
        // Vérifie si le jeu est terminé
        if (pairsFound === totalPairs) {
            console.log("Jeu terminé !");
            $('#plays-number').append(`<p>Partie terminée en ${playsCount} coups !</p>`);
            
            // Ajout de l'écoute de la barre d'espace pour recommencer
            $(document).on('keydown', function(e) {
                if (e.keyCode === 32) { // Code de la barre d'espace
                    location.reload(); // Recharge la page pour recommencer
                }
            });
        }
        
        resetSelections();
    } else {
        console.log("Pas une paire !");

        setTimeout(() => {
            cardElements.forEach(card => {
                card.find('.front').hide();  // Cache l'image
                card.find('.back').show();   // Réaffiche le dos de la carte
            });

            resetSelections();
        }, 1000);
    }
}

function resetSelections() {
    // Vide les tableaux 
    cardIds = [];
    cardElements = [];
    
    // Réactive les clics sur les cartes non appariées
    $('.card').not('.matched').on('click', memoryImage);
    $('.card').not('.matched').on('click', onlyTwoCards);
}