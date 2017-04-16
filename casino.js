/**
 * On initialise le Credit
 */
var Credit;


function runSlots() {
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
    
    //https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Math/random//
    
    One = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    Two = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    Three = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    Four = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    $('.result').html('YOU LOSE');
    $($('.x')[0]).html('<img src = "' + images[One - 1] + '">');
    $($('.x')[1]).html('<img src = "' + images[Two - 1] + '">');
    $($('.x')[2]).html('<img src = "' + images[Three - 1] + '">');
    $($('.x')[3]).html('<img src = "' + images[Four - 1] + '">');
    if (One !== Two || Two !== Three || Three!== Four) {
        console.log('Perdu !')
        return null;
    }
    if (One !== undefined && Two !== undefined && Three !== undefined && Four !== undefined) {
        $('.result').html(One);
        $('.result').append(' ' + Two);
        $('.result').append(' ' + Three);
        $('.result').append(' ' + Four);
    }

    console.log('Gagné !: +5 credits !');
    setNewCredit(Credit + 5);
    return $('.result').html('YOU WIN');
}


/**
 * Permet de sauvegarder le Credit en "cookie"
 */
function setNewCredit(value)
{
    Cookies.set('Credit', value, { expires: 7, path: '' });
    getCredit();

}


/**
 * Permet d'obtenir le Credit de l'utilisateur depuis les cookies
 */
function getCredit()
{
    Credit = Number(Cookies.get('Credit'));
    return Credit; // on retourne un chiffre
}


/**
 * Permet de définir le Credit attribué à chaque début de partie
 * par défaut 20 crédits
 */
function initCredit()
{
    Cookies.set('Credit', '20', { expires: 7, path: '' });
    getCredit();
}


/**
 * Permet de detecter si le Credit existe au début de la partie
 * et si nécéssaire initialiser le Credit
 */
function detectCredit()
{
    // on regarde s'il faut définir le Credit en cookie
    if (typeof(Cookies.get('Credit')) == 'undefined') {
        console.log('Cookie vide ou malformé !', Cookies.get('Credit'));
        // on initialise donc le cookie
        initCredit();
    }
    Credit = getCredit();
    return Credit;
}


/**
 * Permet de vérifier si l'utilisateur a assez de sous ( sup à 0)
 */
function hasEnoughMoney()
{
    if(getCredit() <= 0) {
        // ben pas assez de sous-sous
        return false;
    } else {
        return true;
    }
}


/**
 * *****************************************************************************
 * Début du programme (en haut ce sont les fonctions)
 * *****************************************************************************
 */
/**
 * On récupère le Credit
 */
detectCredit();
console.log('Vous avez ' + Credit + ' credit(s) !');


/**
 * On écoute le clic sur le bouton
 */
$(document).ready( function ()
{
    $('button').click( function ()
    {
        // l'utilisateur peut-il lancer le machine ? (assez de crédits ?)
        if (hasEnoughMoney()) {
            // oui, alors on retire 1 crédit
            console.log('Partie lancée: -1 crédit');
            setNewCredit(Credit - 1);
            runSlots();
        } else {
            console.log('pas assez de crédits !');
            // afficher ici un message d'erreur
            // mais pour le moment on se contente de réinitialiser le nombre de crédits
            console.log('Mais on est sympas donc on vous fait cadeau de +20 credits !');
            initCredit();
        }
        console.log('Vous avez ' + Credit + ' credits');
    });
});