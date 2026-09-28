
(function () {
  var form = document.getElementById('movipiso-boxes-form');
  var output = document.getElementById('movipiso-boxes-result');
  if (!form || !output) return;
  function read(id) { return Number(document.getElementById(id).value); }
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    var books = read('box-books');
    var kitchen = read('box-kitchen');
    var clothes = read('box-clothes');
    var mixed = read('box-mixed');
    var textiles = read('box-textiles');
    var suitcases = read('box-suitcases');
    var reserve = read('box-buffer') / 100;
    var small = books + kitchen;
    var clothingMedium = Math.max(0, Math.ceil(clothes / 2) - suitcases);
    var medium = clothingMedium + mixed;
    var large = Math.ceil(textiles / 2);
    var total = small + medium + large;
    var reserveBoxes = Math.ceil(total * reserve);
    var baseCounts = [small, medium, large];
    var rawShares = baseCounts.map(function (count) { return total ? reserveBoxes * count / total : 0; });
    var extras = rawShares.map(Math.floor);
    var remaining = reserveBoxes - extras.reduce(function (sum, value) { return sum + value; }, 0);
    var order = [0, 1, 2].sort(function (a, b) { return (rawShares[b] - extras[b]) - (rawShares[a] - extras[a]); });
    for (var i = 0; i < remaining; i++) extras[order[i]]++;
    var upperSmall = small + extras[0];
    var upperMedium = medium + extras[1];
    var upperLarge = large + extras[2];
    var upperTotal = upperSmall + upperMedium + upperLarge;
    output.textContent = '';
    var title = document.createElement('strong');
    title.textContent = total === 0 ? 'Aún no hay contenido contabilizado' : 'Lista inicial: ' + total + (upperTotal > total ? '–' + upperTotal : '') + ' cajas';
    output.appendChild(title);
    var list = document.createElement('ul');
    [['Pequeñas', small, upperSmall], ['Medianas', medium, upperMedium], ['Grandes', large, upperLarge]].forEach(function (item) {
      var li = document.createElement('li');
      li.textContent = item[0] + ': ' + item[1] + (item[2] > item[1] ? '–' + item[2] : '');
      list.appendChild(li);
    });
    output.appendChild(list);
    var note = document.createElement('p');
    note.textContent = 'El extremo superior incorpora la reserva elegida una sola vez sobre el total y la reparte entre tamaños. Ajusta estas cifras con tus primeras cajas llenas; muebles y objetos especiales se cuentan aparte.';
    output.appendChild(note);
    output.hidden = false;
  });
}());
