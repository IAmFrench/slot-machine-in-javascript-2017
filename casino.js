/**
 * On Créé la classe Machine a sous
 */
class slotMachine {

    constructor(credits) {
        this._credits = credits || 20; // on definis les credits, sinon 20 par défaut
        this.cases = []; // on stoke ici les valeurs des cases
        $('span.score').text(this.credits); // on affiche le score
    }


    /**
     * Permet d'obtenir le Credit de l'utilisateur depuis les cookies
     */
    get credits() {
        this._credits = Number(Cookies.get('Credit')); // on définis et obtient depuis les cookies
        return this._credits;
    }

    set credits(value) {
        this._credits = value; // on définis la nouvelle valeure
        Cookies.set('Credit', value, { expires: 7, path: '' }); // on met à jours le cookie
        return this._credits;
    }

    /**
     * Pour lancer la machine
     */
    run() {
        console.log('Partie lancée: -1 crédit');
        this.credits -= 1; // on enlève 1 crédit


        var One;
        var Two;
        var Three;
        var Four;
        var images = [
            "https://upload.wikimedia.org/wikipedia/commons/a/ab/Naipe_ouros.png",
            "https://upload.wikimedia.org/wikipedia/commons/a/a0/Naipe_copas.png",
            "https://upload.wikimedia.org/wikipedia/commons/5/5c/Naipe_espadas.png",
            "https://upload.wikimedia.org/wikipedia/commons/8/8a/SuitClubs.svg"
        ];
        
        // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Math/random/
        One = Math.floor(Math.random() * 4) + 1;
        Two = Math.floor(Math.random() * 4) + 1;
        Three = Math.floor(Math.random() * 4) + 1;
        Four = Math.floor(Math.random() * 4) + 1;
        $('.result').html('YOU LOSE');

        // on remplace les symboles avec les nouveaux
        $($('.x')[0]).html('<img src = "' + images[One - 1] + '">');
        $($('.x')[1]).html('<img src = "' + images[Two - 1] + '">');
        $($('.x')[2]).html('<img src = "' + images[Three - 1] + '">');
        $($('.x')[3]).html('<img src = "' + images[Four - 1] + '">');

        // on regarde si au moins l'un des symboles est different
        if (One !== Two || Two !== Three || Three!== Four) {
            this.lose();
            return null;
        }

        // on ajoute les credits  l'utilisateur
        this.win();

        // et enfin on affiche 'you win'
        return $('.result').html('YOU WIN');
    }


    /**
     * Permet de vérifier si l'utilisateur a assez de sous ( sup à 0)
     */
    hasEnoughMoney() {
        if(this._credits <= 0) {
            // ben pas assez de sous-sous
            return false;
        } else {
            return true;
        }
    }


    /**
     * SI l'utilisateur gagne
     * On lui ajoute 5 credits
     * et on afiche un message
     */
    win() {
        console.log('Gagné !: +5 credits !');
        this.credits += 5; // on ajoute 5 credits

        // et on affiche les nouveaux symboles
        $('.result').html(One);
        $('.result').append(' ' + Two);
        $('.result').append(' ' + Three);
        $('.result').append(' ' + Four);
    }


    /**
     * Si l'utilisateur perd
     * On ne fais rien, on affiche simplement un message d'erreur
     */
    lose() {
        console.log('Perdu !');
    }
}


/**
 * Permet de définir le Credit attribué à chaque début de partie
 * par défaut 20 crédits
 *
 * dans une fonction séparée pour pouvoir reset lse crédits depuis le navigateur
 */
function initCredit() {
    Cookies.set('Credit', '20', { expires: 7, path: '' });
    location.reload(true);
    return 'Vous avez maintenant ' + Cookies.get('Credit') + ' credits!';

}


/**
 * Permet de detecter si le Credit existe au début de la partie
 * et si nécéssaire initialiser le Credit
 */
function detectCredit() {
    // on regarde s'il faut définir le Credit en cookie

    var credit = Cookies.get('Credit');
    console.log(Cookies.get('Credit'));

    if (typeof(credit) == 'undefined' || credit == 'NaN') {
        console.log('Cookie vide ou malformé !', Cookies.get('Credit'));
        // on initialise donc le cookie
        credit = 20;//getCredit();
        initCredit();
    }

    // sinon c'est que c'est bon
    return credit;
}


/**
 * Permet d'afficher la modal LASTCHANCE
 */
var compteur = 0;
function openLASTCHANCE() {
    console.log('On ouvre la modal !');
    // on définis les propriétés de notre modal
    $('#LASTCHANCE').modal({
        backdrop: 'static',
        keyboard: false
    }); // on ouvre la modal

    /**
     * On écoute le clic sur le bouton "PAY" (dans la modal de payement)
     * et on supprime la modale si on clique dessus
     */
    listenOnPayForm = setInterval(function () {
        if ($("#_pnp_modal").length) {
            clearInterval(listenOnPayForm);
            console.log(compteur);
            if (compteur == 0) {
                $('#LASTCHANCE').modal('hide');
                compteur = 1;
            }
            // si on a déjà cliqué sur le bouton (donc fait disparaitre la modal)
            $('.pnp_close_icon').click(function (){
                // on supprime notre element
                console.log('cliqué sur la croix');
                $("#_pnp_modal").remove();
                compteur = 0;
            });
        }
    }, 500);
}

function startAnimation() {
    var compteurDeTours;
    var nb = 0;
    machine.run();
    for (compteurDeTours = 0; compteurDeTours < 3; compteurDeTours++) {
        var nb = nb + 360;
        var rota = nb + 'deg';
        $('.x').transition({
            perspective: '100px',
            rotateX: rota
        });
    }
}

/**
 * *****************************************************************************
 * Début du programme (en haut ce sont les fonctions)
 * *****************************************************************************
 */
// on initialise la machine a sous
var machine = new slotMachine(detectCredit());

console.log('Vous avez ' + machine.credits + ' credit(s) !');


/**
 * On écoute le clic sur le bouton
 */
$(document).ready(function () {
    $('button').click(function () {
        // l'utilisateur peut-il lancer le machine ? (assez de crédits ?)
        if (machine.hasEnoughMoney()) {
            $('span.score').text(machine.credits);
            $('#start').prop('disabled', true)
            setTimeout(_ => $('#start').prop('disabled', false), 1500);
            startAnimation();
        } else {
            console.log('pas assez de crédits !');
            // afficher ici un message d'erreur
            // mais pour le moment on se contente de réinitialiser le nombre de crédits
            openLASTCHANCE();
        }
        console.log('Crédits restants:  ' + machine.credits);
    });
});





