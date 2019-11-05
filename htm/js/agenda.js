function slugCustom(str) {
    str = str.replace(/^\s+|\s+$/g, '');
    str = str.toLowerCase();
    var from = "„‡·‰‚?ËÈÎÍÏÌÔÓıÚÛˆÙ˘˙¸˚ÒÁ∑_,:;";
    var to = "aaaaaeeeeeiiiiooooouuuunc-----";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(from.charAt(i), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

    return str;
};


function getDateFormat() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return yyyy + '' + mm + '' + dd;
}

jQuery(document).ready(function ($) {

    window.id_container = '#idFCContent';


    $(window.id_container).append('<h3 class="loading-agenda">Carregando agenda...</h3>');

    var url_xml = 'https://www.comschool.com.br/xml-products.ehc?format=0&exibedescricao=1';
    window.agenda_master = [];
    window.cidades = [];
    var request = $.ajax({
        url: url_xml,
        method: "GET",
        dataType: "xml"
    });

    request.done(function (retorno) {


        $(retorno).find('produto').each(function () {
            if (
                $(this).find('filtro[nome="Cidade"]') && $(this).find('filtro[nome="Cidade"]').text().length > 0 &&
                $(this).find('descritor[nome="Data"]') && $(this).find('descritor[nome="Data"]').text().length > 0
            ) {
                var data_format = $(this).children('descritor[nome="Data"]').text();
                data_format = data_format.split('/');
                data_format = data_format.reverse();
                data_format = data_format.join('');
                if (parseInt(getDateFormat()) < parseInt(data_format)) {
                    window.cidades[slugCustom($(this).children('filtro[nome="Cidade"]').text())] = ($(this).children('filtro[nome="Cidade"]').text());
                    window.agenda_master.push({
                        id_produto: $(this).children('id_produto').text(),
                        tipo: $(this).children('descritor[nome="Tipo"]').text(),
                        hora: $(this).children('descritor[nome="Hora"]').text(),
                        data: $(this).children('descritor[nome="Data"]').text(),
                        data_numero: data_format,
                        data_hora: $(this).children('descritor[nome="Data e Hora"]').text(),
                        cidade: $(this).children('filtro[nome="Cidade"]').text(),
                        cidade_class: slugCustom($(this).children('filtro[nome="Cidade"]').text()),
                        link_produto: $(this).children('link_produto').text(),
                        titulo: $(this).children('descricao').text(),
                        descricao: $(this).children('DescricaoCurta').text(),
                        preco: $(this).children('preco').text(),
                        preco_normal: $(this).children('preco_normal').text(),
                        imagem: $(this).children('imagem').text(),
                        categoria: $(this).children('categoria').text(),
                        id_unique: slugCustom($(this).children('descritor[nome="Data"]').text() + $(this).children('descritor[nome="Hora"]').text() + $(this).children('descricao').text()),
                    });
                }

            }
        })

        //remove os duplicados
        for (x in window.agenda_master) {
            var item = window.agenda_master[x];
            if (item) {
                for (y in window.agenda_master) {
                    var verifica = window.agenda_master[y];
                    if (verifica) {
                        if (item.id_produto != verifica.id_produto && item.id_unique == verifica.id_unique) {
                            item.tipo += '/' + verifica.tipo;
                            window.agenda_master[y] = null;
                        }
                    }
                }
            }
        }

        window.agenda_master = window.agenda_master.filter(function (el) {
            return el != null;
        });

        window.agenda_master.sort(function compare(a, b) {
            if (a.data_numero < b.data_numero) return -1;
            if (a.data_numero > b.data_numero) return 1;
            return 0;
        });

        var htmlNav = '<div class="buttons">';
        htmlNav += '<button data-cidade="all" class="filtro-cidade onbutton all">Todos</button>';
        for (x in window.cidades) {
            var classhtml = x == 'all' ? 'onbutton' : 'offbutton';
            htmlNav += '<button data-cidade="' + x + '" class="filtro-cidade ' + classhtml + ' ' + x + '">' + window.cidades[x] + '</button>';
        }

        htmlNav += '</div>';

        var containerHtml = '<div>';
        for (x in window.cidades) {
            var display = x == 'all' ? 'block' : 'none';
            containerHtml += '<div style="display:' + display + ';" id="box-' + x + '" class="box-cidade">';

            for (y in window.agenda_master) {
                var item = window.agenda_master[y];

                if (!item) continue;

                if (item.cidade_class == x) {
                    var classCategoria = 'redCat';
                    if (item.categoria == 'Cursos Marketing Digital') classCategoria = 'greenCat';
                    if (item.categoria == 'Cursos Midias Sociais') classCategoria = 'blueCat';
                    if (item.categoria == 'Cursos Comportamentais') classCategoria = 'goldCat';

                    containerHtml += '<div class="DivListProd">' +
                        '<div class="ListProductStyleProd">' +
                        '<div class="DivListDate"><span data-js="data-descr">' + item.data + '</span></div>' +
                        '<div class="DivListDesc">' +
                        '<div class="listClass Cursos E-commerce ' + classCategoria + '">' + item.categoria + '</div>' +
                        '<div class="ListProductStyleNomeProd" >' + item.titulo + '</div>' +
                        '<div class="tipoDescr"><b>Tipo: </b>' + item.tipo + '</div>' +
                        '<div ><ul class="EstProdFilterFC"><li class="EstFilterItemFC"><ul><li class="EstFilterLabel1FC">Cidade</li><li class="EstFilterValueFC">' + item.cidade + '</li></ul></li></ul></div>' +
                        '</div>' +
                        '<div class="DivListMore"><a href="/listaprodutos.asp?idloja=40121&amp;idproduto=' + item.id_produto + '" target="_top"><div class="DivListProductStyleDet">VEJA MAIS</div></a></div>' +
                        '</div>' +
                        '</div>';
                }
            }

            containerHtml += '</div>';



        }

        ///GERAL
        containerHtml += '<div style="display:block" id="box-all" class="box-cidade">';
        for (y in window.agenda_master) {
            var item = window.agenda_master[y];
            if (!item) continue;

            var classCategoria = 'redCat';
            if (item.categoria == 'Cursos Marketing Digital') classCategoria = 'greenCat';
            if (item.categoria == 'Cursos Midias Sociais') classCategoria = 'blueCat';
            if (item.categoria == 'Cursos Comportamentais') classCategoria = 'goldCat';

            containerHtml += '<div class="DivListProd">' +
                '<div class="ListProductStyleProd">' +
                '<div class="DivListDate"><span data-js="data-descr">' + item.data + '</span></div>' +
                '<div class="DivListDesc">' +
                '<div class="listClass Cursos E-commerce ' + classCategoria + '">' + item.categoria + '</div>' +
                '<div class="ListProductStyleNomeProd" >' + item.titulo + '</div>' +
                '<div class="tipoDescr"><b>Tipo: </b>' + item.tipo + '</div>' +
                '<div ><ul class="EstProdFilterFC"><li class="EstFilterItemFC"><ul><li class="EstFilterLabel1FC">Cidade</li><li class="EstFilterValueFC">' + item.cidade + '</li></ul></li></ul></div>' +
                '</div>' +
                '<div class="DivListMore"><a href="/listaprodutos.asp?idloja=40121&amp;idproduto=' + item.id_produto + '" target="_top"><div class="DivListProductStyleDet">VEJA MAIS</div></a></div>' +
                '</div>' +
                '</div>';
        }
        containerHtml += '</div>';
        ///FIM GERAL

        containerHtml += '</div>';

        $(window.id_container).append(htmlNav);
        $(window.id_container).append(containerHtml);
        $('.loading-agenda').remove();


    });

    request.fail(function (jqXHR, textStatus) {
        console.log('Erro')
        console.log(jqXHR)
        console.log(textStatus)
    });


    $(document).on('click', '.filtro-cidade', function () {
        $('.filtro-cidade').addClass('offbutton').removeClass('onbutton');
        $(this).removeClass('offbutton').addClass('onbutton');
        $('.box-cidade').css({'display': 'none'});
        $('#box-' + $(this).data('cidade')).css({'display': 'block'});
    });



    $('body').append("<style>" +
        ".ProductList #FilCatClose, .ProductList #ProductsFilterFC {display:none;}" +
        ".ProductList #idPaginationProdFC {display:none;}" +
        ".ProductList .FCProdSty4 {padding:40px 60px;}" +
        ".ProductList #idTxtIntroFoundProdsFC {display:flex; display:-webkit-flex; justify-content:center; -webkit-justify-content:center; margin-bottom:40px !important; font-family:'Roboto',arial,verdana; font-size:24px; font-weight:700;}" +
        ".ProductList .FCProdSty4 #idTxtIntroFoundProdsFC:before {content:'PrÛximos Cursos'}" +
        ".ProductList .FCProdSty4 #idFoundFC, .ProductList .FCProdSty4 #idPageCountFC {display:none;}" +
        ".DivListProd {width: 100%; height: auto; padding: 30px 0; margin: 20px 0 0 0; border-bottom:1px solid #f0f0f0; cursor:pointer; }" +
        ".ListProductStyleProd {width: 100%; min-height: 80px; padding: 0; transition:all 0.3s ease; display: -ms-flexbox; display: -webkit-flex; display: flex; }" +
        ".ListProductStyleProd .DivListProductStyleSpy, .ListProductStyleProd .DivListProductStyleReview, .ListProductStyleProd .DivListProductStyleSpy, .ListProductStyleProd .DivListDate {display:block;}" +
        ".ListProductStyleProd .DivListProductStyleDet {display:block; background:#ffffff; clear:both; border-radius: 20px; -webkit-border-radius: 20px; -moz-border-radius: 20px; width:130px; height:20px; -webkit-box-shadow: 0 0 5px 0 rgba(0,0,0,.25); -moz-box-shadow: 0 0 5px 0 rgba(0,0,0,.25); box-shadow: 0 0 5px 0 rgba(0,0,0,.25);}" +
        ".ListProductStyleProd a .DivListProductStyleDet {font-family:'Roboto',arial,verdana;font-size:16px; font-weight:700; color:#da151d; text-align: center;}" +
        ".ListProductStyleProd .ListProductStyleNomeProd {margin:1px 0 0 0; font-size: 18px;}" +
        ".ListProductStyleProd .ListProductStyleDesc {margin:15px 0 0 0; font-size: 14px;}" +
        ".ListProductStyleProd .DivListDate {width: 18%; margin-left:2%; font-size: 18px; display:flex; display:-webkit-flex; align-items:center; -webkit-align-items:center; justify-content:flex-start; -webkit-justify-content:flex-start;}" +
        ".ListProductStyleProd .DivListDesc {width: 60%;}" +
        ".ListProductStyleProd .DivListMore {width: 18%; margin-right:2%; display:flex; display:-webkit-flex; align-items:center; -webkit-align-items:center; justify-content:flex-end; -webkit-justify-content:flex-end; font-family:'Roboto',arial,verdana;}" +
        "a .DivListProductStyleDet {padding:10px;}" +
        ".estNextPageButFC span {display: none;}" +
        ".estNextPageButFC:after {content: 'VER MAIS CURSOS';}" +
        ".hideFromList {display: none;}" +
        ".listClass {color: #fff; background:#707070; text-align: center; display: inline-block; padding: 2px 5px; margin-bottom: 5px; font-size:12px; text-transform:uppercase;}" +
        ".redCat{background:#da151d}" +
        ".blueCat{background:#23aee8}" +
        ".greenCat{background:#569c58}" +
        ".goldCat{background:#d0b500}" +
        ".buttons {border-bottom:1px solid #da151d;}" +
        ".offbutton {font-family:'Roboto',arial,verdana; font-size: 18px; color:#707070; background: #fff; height: 72px; border:0; padding:0 15px;}" +
        ".onbutton {font-family:'Roboto',arial,verdana; font-size: 18px; color: #ffffff; background: #da151d; height: 72px; border:0; padding:0 15px;}" +
        "@media only screen and (max-width:900px) {" +
        ".ProductList .FCProdSty4 {padding: 40px 40px;}" +
        ".ListProductStyleProd .DivListDate {width: 18%; margin-left: 0; margin-right:2%}" +
        ".ListProductStyleProd .DivListMore {width: 18%; margin-left: 2%; margin-right:0; justify-content: flex-start; -webkit-justify-content: flex-start;}" +
        ".ListProductStyleProd a .DivListProductStyleDet {font-size: 14px; width: 100%;}" +
        "}" +
        "@media only screen and (max-width:768px) {" +
        ".ProductList .FCProdSty4 {padding: 20px 40px 40px 40px;}" +
        ".ListProductStyleProd .DivListDesc {width: 68%;}" +
        ".ListProductStyleProd .DivListMore {width: 10%; justify-content: center; -webkit-justify-content: center;}" +
        ".ListProductStyleProd a .DivListProductStyleDet {text-indent: -9999px; line-height: 0; font-size: 20px; width: 40px; height: 34px; padding: 6px 0 0 0;}" +
        ".ListProductStyleProd a .DivListProductStyleDet:after {content:'+'; text-indent: 0; line-height: initial; display:block;}" +
        "}" +
        "@media only screen and (max-width:670px) {" +
        ".ListProductStyleProd .DivListDate {width: 20%; font-size: 16px;}" +
        ".ListProductStyleProd .DivListDesc {width: 66%;}" +
        ".ListProductStyleProd .ListProductStyleNomeProd {margin: 3px 0 0 0; font-size: 16px;}" +
        "}" +
        "@media only screen and (max-width:640px) {" +
        ".offbutton {font-size: 16px;}" +
        ".onbutton {font-size: 16px;}" +
        "}" +
        "@media only screen and (max-width:600px) {" +
        ".DivListProd {margin: 15px 0 0 0; padding: 20px 0;}" +
        ".ListProductStyleProd .DivListDate {width: 24%;}" +
        ".ListProductStyleProd .DivListDesc {width: 60%;}" +
        ".offbutton {font-size: 16px; background: #f7f7f7; color:#707070; padding: 10px 0; width: 45%; border: 0; border-radius: 20px; height: 40px; margin: 0 2% 15px 2%;}" +
        ".onbutton {font-size: 16px; background: #da151d; color:#ffffff; padding: 10px 0; width: 45%; border: 0; border-radius: 20px; height: 40px; margin: 0 2% 15px 2%;}" +
        "}" +
        "@media only screen and (max-width:480px) {" +
        ".offbutton {font-size: 14px;}" +
        ".onbutton {font-size: 14px;}" +
        ".DivListProd {margin: 0 0 0 0; padding: 20px 0; height: 120px;}" +
        ".ListProductStyleProd {flex-wrap: wrap;}" +
        ".ListProductStyleProd .DivListDate {width: 100%; margin: 0 0 10px 0; font-size:14px;}" +
        ".ListProductStyleProd .DivListDesc {width: 76%;}" +
        ".ListProductStyleProd .ListProductStyleNomeProd {margin: 3px 0 0 0; font-size: 14px;}" +
        ".ListProductStyleProd .DivListMore {width: 20%; margin-left: 4%;}" +
        ".EstProdFilterFC {font-size: 14px;}" +
        "}" +
        "@media only screen and (max-width:380px) {" +
        ".ProductList .FCProdSty4 {padding: 20px;}" +
        "}" +
        ".loading-agenda { width: 100%; text-align: center; padding: 30px 0 0; }" +
        "</style>");

})
