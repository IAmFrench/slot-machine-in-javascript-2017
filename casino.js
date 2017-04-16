function runSlots() {
    var One;
    var Two;
    var Three;
    var images = ["https://upload.wikimedia.org/wikipedia/commons/a/ab/Naipe_ouros.png", "https://upload.wikimedia.org/wikipedia/commons/a/a0/Naipe_copas.png", "https://upload.wikimedia.org/wikipedia/commons/5/5c/Naipe_espadas.png"
 , "https://upload.wikimedia.org/wikipedia/commons/8/8a/SuitClubs.svg"];
    
    //https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Math/random//
    
    One = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    Two = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    Three = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    $('.result').html('YOU LOSE');
    $($('.x')[0]).html('<img src = "' + images[One - 1] + '">');
    $($('.x')[1]).html('<img src = "' + images[Two - 1] + '">');
    $($('.x')[2]).html('<img src = "' + images[Three - 1] + '">');
    if (One !== Two || Two !== Three) {
        return null;
    }
    if (One !== undefined && Two !== undefined && Three !== undefined) {
        $('.result').html(One);
        $('.result').append(' ' + Two);
        $('.result').append(' ' + Three);
    }
    return $('.result').html('YOU WIN');
}
$(document).ready(function () {
    $('button').click(function () {
        runSlots();
    });
});