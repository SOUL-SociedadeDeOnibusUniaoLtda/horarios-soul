//autor: jeanroldao@gmail.com

var linhasAgrupadas = null;
function getLinhas() {
  //tabelaHorarios
  if (linhasAgrupadas) {
    return linhasAgrupadas;
  }
  
  linhasAgrupadas = {};
  
  for (var i = 0; i < tabelaHorarios.length; i++ ) {
    var linhaAtual = tabelaHorarios[i];
    if (!linhasAgrupadas[linhaAtual.sentido]) {
      linhasAgrupadas[linhaAtual.sentido] = {};
    }
    
    if (!linhasAgrupadas[linhaAtual.sentido][linhaAtual.linha]) {
      linhasAgrupadas[linhaAtual.sentido][linhaAtual.linha] = 0;
    }
    
    linhasAgrupadas[linhaAtual.sentido][linhaAtual.linha]++;
  }
  
  for (var sentido in linhasAgrupadas) {
    var linhas = [];
    for (var linha in linhasAgrupadas[sentido]) {
      linhas.push(linha);
    }
    linhas.sort();
    linhasAgrupadas[sentido] = linhas;
  }
  return linhasAgrupadas;
}

var sentidos = null;
function getSentidos() {

  if (sentidos) {
    return sentidos;
  }
  
  var sentidosCadastradas = {};
  for (var i = 0; i < tabelaHorarios.length; i++ ) {
    if (!sentidosCadastradas[tabelaHorarios[i].sentido]) {
      sentidosCadastradas[tabelaHorarios[i].sentido] = 0;
    }
    sentidosCadastradas[tabelaHorarios[i].sentido]++;
  }
  
  sentidos = [];
  for (var sentido in sentidosCadastradas) {
    sentidos.push(sentido);
  }
  return sentidos;
}

function busca(filtro) {
  //tabelaHorarios
  
  var listaFiltrada = [];
  for (var i = 0; i < tabelaHorarios.length; i++ ) {
    if (filtro(tabelaHorarios[i])) {
      listaFiltrada.push(tabelaHorarios[i]);
    }
  }
  listaFiltrada.sort(function(a,b){
    //return a.hora < b.hora;
    if (a.hora < b.hora) {
      return -1;
    } else if (a.hora > b.hora) {
      return 1;
    } else if(a.descricao < b.descricao) {
      return -1;
    } else if (a.descricao > b.descricao) {
      return 1;
    } else {
      return 0;
    }
  });
  return listaFiltrada;
}

function formatTime(time) {
	var horas = time.getHours();
	if (horas < 10) {
		horas = "0" + horas;
	}
	var minutos = time.getMinutes();
	if (minutos < 10) {
		minutos = "0" + minutos;
	}
	return horas + ":" + minutos;
}

function getAndroidVersion() {
  var ua = navigator.userAgent; 
  var match = ua.match(/Android\s([0-9\.]*)/);
  return match ? match[1] : false;
};

$(window).resize(function(){
  if ($('.navbar-default .navbar-inner').width() != $('body').width()) {
    $('.navbar-default .navbar-inner').width($('body').width());
  }
});

$(function () {

  var txtPesquisar = $('#txtPesquisar');
  var txtHoraInicial = $('#txtHoraInicial');
  var txtHoraFinal = $('#txtHoraFinal');
  var selectDia = $('#selectDia');
  var selectSentido = $('#selectSentido');
  var selectLinhas = $('#selectLinhas');
  var btnPesquisar = $('#btnPesquisar');
  var btnVoltar = $('#btnVoltar');
  
  $('#topo_fixo').click(function(){
    $('body').animate({scrollTop: 0}, 'slow');
  });
  
  var horaini = new Date();
  horaini.setHours(horaini.getHours()-1);
  txtHoraInicial.val(formatTime(horaini));
  
  var horafim = new Date();
  horafim.setHours(horafim.getHours() + 1);
  
  txtHoraFinal.val(formatTime(horafim));
  
  /*
  $(getSentidos()).each(function(i, sentido){
	
    var optionSentido = document.createElement('option');
    optionSentido.value = sentido;
    optionSentido.text = sentido;
    
    selectSentido.append(optionSentido);
  });
  */
  
  var atualizaLinhas = function() {
    var linhasAtual = selectLinhas.val();
    selectLinhas.find('option').remove();
    
    var linhas = getLinhas()[selectSentido.val()];
    $(linhas).each(function(i, linha){
      var optionLinha = document.createElement('option');
      optionLinha.value = linha;
      optionLinha.text = linha;
    
      selectLinhas.append(optionLinha);
    });
    
    selectLinhas.val(linhasAtual);
  }
  
  selectSentido.change(atualizaLinhas);
  atualizaLinhas();
  
  
  if (!selectLinhas.attr('multiple')) {
    selectLinhas.attr('multiple', true);
  }
  
  //var android = getAndroidVersion();
  //if (android && android < '4') {}
  var selectLinhasMaxHeight = selectDia.height() * 2;
  if (selectLinhas.height() > selectLinhasMaxHeight) {
    selectLinhas.height(selectLinhasMaxHeight);
  }
  
  btnPesquisar.click(function() {
    $('#conteudo_tabela').slideUp(function(){
      $(table).remove();
      table = null;
      
      btnPesquisar.text('Pesquisando...');
      setTimeout(function(){
      
        var selecao = selectLinhas.val() || [];
        
        var resultado = [];
        var sentido = selectSentido.val();
        if (txtHoraInicial.val() < txtHoraFinal.val()) {
          resultado = busca(function(item){
          
            return (item.descricao.toLowerCase().indexOf(txtPesquisar.val().toLowerCase()) != -1)
              && (selecao.length == 0 || selecao.indexOf(item.linha) != -1)
              && item.dia == selectDia.val()
              && item.sentido == sentido
              && item.hora >= txtHoraInicial.val()
              && item.hora <= txtHoraFinal.val();
          });
        } else {
          resultado = busca(function(item){
          
            return (item.descricao.toLowerCase().indexOf(txtPesquisar.val().toLowerCase()) != -1)
              && (selecao.length == 0 || selecao.indexOf(item.linha) != -1)
              && item.dia == selectDia.val()
              && item.sentido == sentido
              && item.hora >= txtHoraInicial.val();
          });
          
          resultado = resultado.concat(busca(function(item){
          
            return (item.descricao.toLowerCase().indexOf(txtPesquisar.val().toLowerCase()) != -1)
              && (selecao.length == 0 || selecao.indexOf(item.linha) != -1)
              && item.dia == selectDia.val()
              && item.sentido == sentido
              && item.hora <= txtHoraFinal.val();
          }));
        }
        
        btnPesquisar.text('Pesquisar');
        btnPesquisar.blur();
        montaGrid(resultado);
        $('#conteudo_tabela').show();
        $('body,html').animate({scrollTop:btnPesquisar.position().top - 75}, 'slow');
        
        //$('#conteudo_form,#conteudo_tabela').slideToggle();
        //$('#conteudo_form').css('visibility', 'hidden');
        /*
        $('#conteudo_form').fadeOut('slow', function() {

          $('#conteudo_tabela').fadeIn();
          document.body.scrollTop = 0
          if (history.pushState) {
            history.pushState({page:'search'});
            console.log('history.pushState');
          }
        });
        */
      }, 100);
    });
  });
  
  /*
  var acaoVoltar = function(){
      //setTimeout(function(){
      document.body.scrollTop = 0
      $('#conteudo_tabela').fadeOut('slow', function(){
        $('#conteudo_form').fadeIn();
      });
      //$('#conteudo_form').css('visibility', 'visible');
      //}, 1);
  };
  
  if (history.pushState) {
    history.replaceState({page:'home'});
    window.onpopstate = function(event) {
      //alert('window.onpopstate');
      
      // /*
      document.addEventListener('scroll', function noScrollOnce(event) {
        alert('noScrollOnce');
        event.preventDefault();
        document.removeEventListener('scroll', noScrollOnce);
      });
      //* /
      
      if (event.state) {
        acaoVoltar();
      }
    };
  }
  
  btnVoltar.click(function() {
    if (history.pushState) {
      history.back();
    } else {
      acaoVoltar();
    }
  });
  
  document.addEventListener("deviceready", function() {
    //alert('deviceready');
    var acao = function() {
      alert('phonegap acao');
    }
    document.addEventListener("menubutton", acao, false);
    document.addEventListener("backbutton", acao, false);
    document.addEventListener("volumedownbutton", acao, false);
    document.addEventListener("volumeupbutton", acao, false);
  }, false);
  */
});

function montaGrid(lista) {

  var table = getTable();
  if (lista.length == 0) {
    criaLinha(table, ['<b>Sem linhas para essa pesquisa, mude o filtro para resultados diferentes</b>']);
  } else {
  
    var total_linhas = lista.length;
    var tr = document.createElement('tr');
    //var th = document.createElement('th');
    var prural = total_linhas == 1 ? '' : 's';
    tr.innerHTML = '<th colspan="3">' + total_linhas + ' linha'+prural+' encontrada'+prural+'</th>';
    $('thead', table).append(tr);
    //criaLinha(table, ['', '', total_linhas + ' linhas encontradas']);
    criaLinha(table, ['Hora', 'Linha', 'Descri&ccedil;&atilde;o'], 'thead');
    for (var i = 0; i < total_linhas; i++) {
      var linha = lista[i];
      criaLinha(table, [linha.hora, linha.linha, linha.descricao]);
    }
  }
}

var table = null;
function getTable() {
  if (table != null) {
    table.parentNode.removeChild(table);
  }
  table = document.createElement('table');
  table.className = 'table table-bordered';
  table.appendChild(document.createElement('thead'));
  table.appendChild(document.createElement('tbody'));
  
  $('#conteudo_tabela').append(table);
  return table;
}

function criaLinha(table, campos, tablePart) {
  tablePart = tablePart || 'tbody';
  var tr = document.createElement('tr');
  for (var i = 0; i < campos.length; i++) {
    var td = document.createElement(tablePart == 'tbody' ? 'td' : 'th');
    if (typeof campos[i] != 'object') {
      td.innerHTML = campos[i];
    } else {
      td.appendChild(campos[i]);
    }
    tr.appendChild(td);
  }
  $(tablePart, table).append(tr);
}
