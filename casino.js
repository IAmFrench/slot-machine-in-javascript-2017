/**
 * On Créé la classe Machine a sous
 */
class slotMachine {

    /**
     * On instancie une machine a sous avec le nombre de crédits donnés
     * et on les affiches directement sur la page
     * @param {number} credits 
     */
    constructor(credits) {
        this._credits = credits || 20 // on definis les credits, sinon 20 par défaut
        $('span.score').text(this.credits) // on affiche le score
    }


    /**
     * Permet d'obtenir le Credit de l'utilisateur depuis les cookies
     */
    get credits() {
        this._credits = Number(Cookies.get('Credit')) // on définis et obtient depuis les cookies
        return this._credits
    }


    /**
     * Permet de définir une valeure pour les credits
     * Enregistre directement cette valeure dans les cookies
     */
    set credits(value) {
        this._credits = value // on définis la nouvelle valeure
        Cookies.set('Credit', value, { expires: 7, path: '' }) // on met à jours le cookie
        return this._credits
    }


    /**
     * Pour lancer la machine
     * Effectue le calcul pour déterminer les nouveaux symboles
     */
    run() {
        console.log('Partie lancée: -1 crédit')
        this.credits -= 1 // on enlève 1 crédit

        var One
        var Two
        var Three
        var Four
        var images = [
            "https://upload.wikimedia.org/wikipedia/commons/a/ab/Naipe_ouros.png",
            "https://upload.wikimedia.org/wikipedia/commons/a/a0/Naipe_copas.png",
            "https://upload.wikimedia.org/wikipedia/commons/5/5c/Naipe_espadas.png",
            "https://upload.wikimedia.org/wikipedia/commons/8/8a/SuitClubs.svg"
        ]
        
        // on détermine nos nouveaux sumboles
        // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Math/random/
        One = Math.floor(Math.random() * 4)
        Two = Math.floor(Math.random() * 4)
        Three = Math.floor(Math.random() * 4)
        Four = Math.floor(Math.random() * 4)
        $('.result').html('YOU LOSE')

        // on remplace les symboles avec les nouveaux
        $($('.x')[0]).html('<img src = "' + images[One] + '">')
        $($('.x')[1]).html('<img src = "' + images[Two] + '">')
        $($('.x')[2]).html('<img src = "' + images[Three] + '">')
        $($('.x')[3]).html('<img src = "' + images[Four] + '">')

        // on regarde si au moins l'un des symboles est different
        if (One !== Two || Two !== Three || Three!== Four) {
            this.lose()
        } else {
            // si ce n'est pas le cas, c'est que TOUT les symboles sont identiques, donc partie gagnée
            this.win()
        }

        // et on met à jours le score visuellement
        $('span.score').text(machine.credits)
    }


    /**
     * Permet de vérifier si l'utilisateur a assez de sous ( > 0)
     */
    hasEnoughMoney() {
        if(this._credits <= 0) {
            // ben pas assez de sous-sous
            return false
        } else {
            return true
        }
    }


    /**
     * Définis le comportement quand l'utilsiateur a gagné la partie
     */
    win() {
        console.log('Won !')
        FB.AppEvents.logEvent("gameWon")
        console.log('+5 Credits')
        $('.result').html('YOU WIN')
        this.credits += 5 // on ajoute 5 credits

        // on affiche la notification (celle en haut à droite)
        new PNotify({
            title: 'Résult',
            text: 'Look at that ! You won 5 credits ! ^_^',
            type: 'success',
            styling: 'bootstrap3'
        })
        // on affiche la notification (celle en plein écran - modal)
        swal("Good job!", "You won 5 credits!", "success")

        // on ajoute cette partie au localstorage 
        store.set((new Date).getTime(), {credits: this._credits, state: 'win'})
    }


    /**
     * Définis le comportement quand l'utilsiateur a prdu la partie
     */
    lose() {
        console.log('Perdu !')
        FB.AppEvents.logEvent("gameLose")
        // on affiche la notification
        new PNotify({
            title: 'Résult',
            text: 'Lose! ^_^, but why not try again )',
            type: 'error',
            styling: 'bootstrap3',
            delay: 2000
        })

        // on ajoute cette partie au local storage
        store.set((new Date).getTime(), {credits: this._credits, state: 'lose'})
    }
}


/**
 * Permet de définir le Credit attribué à chaque début de partie
 * par défaut 20 crédits
 *
 * dans une fonction séparée pour pouvoir reset lse crédits depuis le navigateur
 */
function initCredit() {
    Cookies.set('Credit', '20', { expires: 7, path: '' })
    location.reload(true) // on recharge la page
    return 'Vous avez maintenant ' + Cookies.get('Credit') + ' credits!'

}


/**
 * Permet de detecter si le Credit existe au début de la partie
 * et si nécéssaire initialiser le Credit
 */
function detectCredit() {
    // on regarde s'il faut définir le Credit en cookie

    var credit = Cookies.get('Credit')
    console.log(Cookies.get('Credit'))

    // si, pas de cookie définis
    if (typeof(credit) == 'undefined' || credit == 'NaN') {
        console.log('Cookie vide ou malformé !', Cookies.get('Credit'))
        
        // on initialise donc le cookie
        initCredit() // provoque une actualisation de la page, donc on s'arrete là
        return 0
    }

    // sinon c'est que c'est bon
    return credit
}


/**
 * Permet d'afficher la modal LASTCHANCE
 */
var compteur = 0
function openLASTCHANCE() {
    console.log('On ouvre la modal !')
    FB.AppEvents.logEvent("openLastChanceModal")
    // on définis les propriétés de notre modal
    $('#LASTCHANCE').modal({
        backdrop: 'static',
        keyboard: false
    }) // on ouvre la modal

    /**
     * On écoute le clic sur le bouton "PAY" (dans la modal de payement)
     * et on supprime la modale si on clique dessus
     */
    listenOnPayForm = setInterval(function () {
        if ($("#_pnp_modal").length) {
            clearInterval(listenOnPayForm)
            console.log(compteur)
            if (compteur == 0) {
                $('#LASTCHANCE').modal('hide')
                compteur = 1
            }
            // si on a déjà cliqué sur le bouton (donc fait disparaitre la modal)
            $('.pnp_close_icon').click(function (){
                // on supprime notre element
                console.log('cliqué sur la croix')
                $("#_pnp_modal").remove()
                compteur = 0
            })
        }
    }, 500)
}


/**
 * Permet de démarrer l'animation sur les symboles
 */
function startAnimation() {
    var compteurDeTours
    var nb = 0
    machine.run()
    for (compteurDeTours = 0; compteurDeTours < 3; compteurDeTours++) {
        var nb = nb + 360
        var rota = nb + 'deg'
        $('.x').transition({
            perspective: '100px',
            rotateX: rota
        })
    }
}


/**
 * *****************************************************************************
 * Début du programme (en haut ce sont les fonctions)
 * *****************************************************************************
 */
// on initialise la machine a sous
var machine = new slotMachine(detectCredit())

console.log('Vous avez ' + machine.credits + ' credit(s) !')


/**
 * On écoute le clic sur le bouton
 */
var td // Datatable
var table_opened // pour savoir si on a déjà ouvert la modal
$(document).ready(function () {
    $('button#start').click(function () {
        FB.AppEvents.logEvent("clickStartButton")
        // l'utilisateur peut-il lancer le machine ? (assez de crédits ?)
        if (machine.hasEnoughMoney()) {
            $('#start').prop('disabled', true) // on interdit le double clic (en désactivant le bouton)
            setTimeout(_ => $('#start').prop('disabled', false), 1500) // mais que pendant le temps de l'animation, soit 1.5s
            startAnimation() // et on lance l'animation
        } else {
            console.log('pas assez de crédits !')
            openLASTCHANCE() // on ouvre la modal $$$
        }

        // on indique à la fin du tour le nombre de crédits restants
        console.log('Crédits restants:  ' + machine.credits)
    })

    // on record le clic sur le bouton pour obtenir +20 credits
    $('#LASTCHANCE button.btn.btn-primary').click(function () {
        FB.AppEvents.logEvent("resetCreditsFromLastChanceModal")
    })
    // quand on clique sur le bouton pour afficher l'historique
    $('button.view-history').click(function () {
        FB.AppEvents.logEvent("openHistoryModal")
        // on remplie le tableau dans la modal
        var table = $('table.table')
        if (localStorage.length !== 0) {
            // il y a un historique
            // on ajoute la structure
            table.html('<thead> <tr> <th>Date</th> <th>Credits</th> <th>Win/Lose</th> </tr> </thead> <tbody></tbody>')

            // et on rempli le tableau
            var tbody = $('tbody')
            for (var key in localStorage){
                d = new Date(Number(key))
                var date = d.toLocaleDateString("fr", {weekday: "long", year: "numeric", month: "long", day: "numeric", hour: '2-digit', minute:'2-digit', second: '2-digit'})
                var credit = JSON.parse(localStorage[key]).credits
                var resultat = JSON.parse(localStorage[key]).state
                tbody.append("<tr> <th>" + date + "</th> <th>" + credit + "</th> <th>" + resultat + "</th> </tr>")
            }

            // On ajoute la pagination
            if (table_opened) {
                console.log("On détruit l'ancienne pagination")
                td.destroy() // on détruit l'ancienne pagination
            }
            console.log('Ajout de la pagination')

            // On adapte le nombre d'éléments affichés selon la hauteur d'une ligne
            switch (true) {
                case ($(window).width() < 335):
                    pageLength = Math.floor( ($(window).height() - 330) / 98)
                    break
                case ($(window).width() < 372):
                    pageLength = Math.floor( ($(window).height() - 340) / 78)
                    break
                case ($(window).width() < 480):
                    pageLength = Math.floor( ($(window).height() - 300) / 58)
                    break
                default:
                    pageLength = Math.floor( ($(window).height() - 300) / 38)
                    break
            }
            
            console.log('On affiche ' + pageLength + ' éléments par page')

            td = table.DataTable({
                "searching": false,
                "order": [[ 0, 'desc' ]],
                "pageLength": pageLength
            }) // et on trie
            table_opened = true // on indique que l'on viens d'initialiser notre pagination
        }

        // Puis on ouvre la modal
        $('#score').modal('show')
        return "History opened"
    })


    


    // on écoute si la fenetre est resizé
    $( window ).resize(function() {
        console.log('resize')
        setFooter()
    })
})


function setFooter() {
    // on design le footer
    if ($(document).height() == $(window).height()) {


        // on regarde si avec 60px de plus la taille du document reste supérieu
        // on peut "coller le footer au pied du document
        if (!$('footer').hasClass('footer_abs')) {
            $('footer').toggleClass('footer_abs')
        }
        if (!$('.git-link').hasClass('footer-right')) {
            $('.git-link').toggleClass('footer-right')
        }
        if ($('.git-link').hasClass('footer-right-std')) {
            $('.git-link').toggleClass('footer-right-std')
        }

        console.log('footer absolute')
    } else {
        console.log('footer document')
        if (!$('footer').hasClass('footer_content')) {
            $('footer').toggleClass('footer_content')
        }
        if ($('footer').hasClass('footer_abs')) {
            $('footer').toggleClass('footer_abs')
        }
        if (!$('.git-link').hasClass('footer-right-std')) {
            $('.git-link').toggleClass('footer-right-std')
        }
        if ($('.git-link').hasClass('footer-right')) {
            $('.git-link').toggleClass('footer-right')
        }
    }
}

// on définis le footer pendant que la page charge
setFooter()


