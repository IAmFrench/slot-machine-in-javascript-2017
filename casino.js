/**
 * On Créé la classe Machine a sous
 */
class slotMachine {

    constructor(credits) {
        this._credits = credits || 20; // on definis les credits, sinon 20 par défaut
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
        One = Math.floor(Math.random() * 4);
        Two = Math.floor(Math.random() * 4);
        Three = Math.floor(Math.random() * 4);
        Four = Math.floor(Math.random() * 4);
        $('.result').html('YOU LOSE');

        // on remplace les symboles avec les nouveaux
        $($('.x')[0]).html('<img src = "' + images[One] + '">');
        $($('.x')[1]).html('<img src = "' + images[Two] + '">');
        $($('.x')[2]).html('<img src = "' + images[Three] + '">');
        $($('.x')[3]).html('<img src = "' + images[Four] + '">');

        // on regarde si au moins l'un des symboles est different
        if (One !== Two || Two !== Three || Three!== Four) {
            this.lose();
        } else {
            // on ajoute les credits  l'utilisateur
            this.win();
        }

        // et on met à jours le score
        $('span.score').text(machine.credits);
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
        console.log('Won !');
        console.log('+5 Credits');
        $('.result').html('YOU WIN');
        this.credits += 5; // on ajoute 5 credits
        // on affiche la notification
        new PNotify({
            title: 'Résult',
            text: 'Look at that ! You won 5 credits ! ^_^',
            type: 'success',
            styling: 'bootstrap3'
        });
        // idem mais en plein ecran
        swal("Good job!", "You won 5 credits!", "success");
        // on ajoute cette partie au local storage
        store.set((new Date).getTime(), {credits: this._credits, state: 'win'});
    }


    /**
     * Si l'utilisateur perd
     * On ne fais rien, on affiche simplement un message d'erreur
     */
    lose() {
        console.log('Perdu !');

        // on affiche la notification
        new PNotify({
            title: 'Résult',
            text: 'Lose! ^_^, but why not try again ;)',
            type: 'error',
            styling: 'bootstrap3',
            delay: 2000
        });
        // on ajoute cette partie au local storage
        store.set((new Date).getTime(), {credits: this._credits, state: 'lose'});
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
    $('button#start').click(function () {
        // l'utilisateur peut-il lancer le machine ? (assez de crédits ?)
        if (machine.hasEnoughMoney()) {
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

    // quand on clique sur le bouton pour afficher l'historique
    $('button.view-history').click(function () {
        // on remplie le tablea de la modal
        var table = $('table.table');
        if (localStorage.length !== 0) {
            // il y a un historique
            table.html('<thead> <tr> <th>Date</th> <th>Credits</th> <th>Win/Lose</th> </tr> </thead>');
            table.append('<tbody></tbody>');
            var tbody = $('tbody');
            for (var key in localStorage){
                console.log(typeof(key));
                d = new Date(Number(key));
                var date = d.toLocaleDateString("fr", {weekday: "long", year: "numeric", month: "long", day: "numeric", hour: '2-digit', minute:'2-digit', second: '2-digit'});
                var credit = JSON.parse(localStorage[key]).credits;
                var resultat = JSON.parse(localStorage[key]).state;
                tbody.append("<tr> <th>" + date + "</th> <th>" + credit + "</th> <th>" + resultat + "</th> </tr>");
            }
            // et on inverse l'ordre
            tbody.html($('tr',tbody).get().reverse());

            // et on ajoute la pagination
            console.log('pagination');
            table.DataTable();
        }

        // et on ouvre la modal
        $('#score').modal('show');
    });
});


