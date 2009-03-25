function convertText(itexto, dest){

var lineBreak = '<br />';

var texto = itexto;

texto = texto.replace(/\r\n/g,lineBreak);
texto = texto.replace(/\n/g,lineBreak);
texto = texto.replace(/\r/g,lineBreak);

$(dest).innerHTML = texto;

}