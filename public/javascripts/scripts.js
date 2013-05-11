$(function() {
    $( "#dialog" ).dialog({
        autoOpen: false,
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        }
    });
    $( "#openphotos" ).click(function() {
        $( "#dialog" ).dialog( "open" );
    });
});
$(document).ready(function(){
    $("a[rel^='prettyPhoto']").prettyPhoto();
    $.getJSON('/pin', function(data) {
        $('#myDropdown').ddslick({
            data:data,
            width:300,
            height:300,
            selectText: "Pinned cities",
            onSelected: function(selectedData){
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(selectedData.selectedData.lat,selectedData.selectedData.long),
                    map: mapa,
                    title: 'Click to zoom'
                });
                mapa.setCenter(marker.getPosition());
                mapa.setZoom(11);
                setTimeout("$('#openphotos').effect('bounce', { times:10, distance:8 }, 1000);",1000);
                $('#photoQuantity').html('6');
                $('#deletePin').attr('onclick','deletePin('+selectedData.selectedData._id+')');
            }
        });
    });
});
//Dropdown plugin data

function emplenaMarkersUsuari(map)
{
    //Obtenim el JSON amb els pins de l'usuari
    var pins = $.ajax({url:'pin',async: false,success:function(data){return data;}});
    pins = JSON.parse(pins.responseText);

    //Per cada Pin creem el Markar i lafegim al mapa
    for (var i=0;i<pins.length;i++)
    {
        var title = (pins[i].town != '') ? pins[i].town : pins[i].city;
        var marker = new google.maps.Marker(
            {
                position: new google.maps.LatLng(pins[i].lat,pins[i].long),
                map: map,
                title: title
            });
        addInfoWindow(map,marker,pins[i]);
    }
    return pins.length;
}

function addInfoWindow(map,marker,pin)
{
    var info = (pin.town != '') ? pin.town+'<br>'+pin.city + '<br>' + pin.country : pin.city + '<br>' + pin.country;

    var infoWindow = new google.maps.InfoWindow({
        content: info
    });

    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map, marker);
    });
}


function changeMapType(map)
{
    if(map.getMapTypeId() == google.maps.MapTypeId.TERRAIN)
    {
        map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
        $('#maptype').css('background-image','url("../images/maps_alt.png")');
    }
    else
    {
        map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
        $('#maptype').css('background-image','url("../images/maps.png")');

    }
}

function openCloseAddCity()
{
    if($('#settings-widget').css('display') == 'none')
    {
        $('#map_canvas').css('width','75%');
        $('#formlabel').show();
        $('#formlabel').css('left','25%');
        $('#searchPins').hide();
        $('#settings-widget').show();
        $('#formlabel').attr('onclick','hideForm('+1+')');
    }
    else
    {
        $('#settings-widget').hide();
        $('#map_canvas').css('width','100%');
        $('#formlabel').hide();
        $('#formlabel').attr('onclick','hideForm('+1+')');
    }
}
function openCloseSearchPins()
{
    if($('#searchPins').css('display') == 'none')
    {
        $('#map_canvas').css('width','75%');
        $('#formlabel').show();
        $('#formlabel').css('left','25%');
        $('#searchPins').show();
        $('#settings-widget').hide();
        $('#formlabel').attr('onclick','hideForm('+2+')');
        $('#dropDown').css('padding-left','10px');
        $('.buttons').show();
        $('.photoAlbum').show();
        setTimeout("$('#openphotos').effect('bounce', { times:10, distance:8 }, 1000);",1000);
        $('#photoQuantity').html('3');

    }
    else
    {
        $('#searchPins').hide();
        $('#map_canvas').css('width','100%');
        $('#photoAlbum').hide();
        $('#formlabel').hide();
        $('#formlabel').attr('onclick','hideForm('+2+')');
        $('#dialog').hide();
    }
}
function emplenaInformacioLloc(place)
{
    $('#cityData').show();
    var dades = place.formatted_address.split(", ");
    $('#coordenatesName > #lat').html(place.geometry.location.lat());
    $('#coordenatesName > #lng').html(place.geometry.location.lng());
    if(dades.length == 1)
    {
        $('#countryName').html(dades[0].trim());
        $('.co').show();
        $('.ci').hide();
        $('.to').hide();
    }
    else if(dades.length == 2)
    {
        $('#cityName').html(dades[0].trim());
        $('.ci').show();
        $('#countryName').html(dades[1].trim());
        $('.co').show();
        $('.to').hide();
    }
    else
    {
        $('#townName').html(dades[0].trim());
        $('.to').show();
        $('#cityName').html(dades[1].trim());
        $('.ci').show();
        $('#countryName').html(dades[2].trim());
        $('.co').show();
    }
    $('.buttons').show();
}

function hideForm(botoclicat)
{
    if(botoclicat == 1)
    {
        if($('#settings-widget').css('display') == 'none')
        {
            $('#map_canvas').css('width','75%');
            $('#formlabel').removeClass('formlabelhide');
            $('#formlabel').addClass('formlabelshow');
            $('#settings-widget').show();
            $('#formlabel').css('left','25%');
        }
        else
        {
            $('#settings-widget').hide();
            $('#formlabel').addClass('formlabelhide');
            $('#formlabel').removeClass('formlabelshow');
            $('#map_canvas').css('width','100%');
            $('#formlabel').css('left','0');
        }
    }
    else if(botoclicat == 2)
    {
        if($('#searchPins').css('display') == 'none')
        {
            $('#map_canvas').css('width','75%');
            $('#formlabel').removeClass('formlabelhide');
            $('#formlabel').addClass('formlabelshow');
            $('#searchPins').show();
            $('#formlabel').css('left','25%');
        }
        else
        {
            $('#searchPins').hide();
            $('#formlabel').addClass('formlabelhide');
            $('#formlabel').removeClass('formlabelshow');
            $('#map_canvas').css('width','100%');
            $('#formlabel').css('left','0');
            $('#dialog').hide();
        }
    }

}

function addPin()
{
    smoke.confirm('Do you want to add that Pin?',function(e)
        {
            if (e)
            {
                var lat =  parseFloat($('#coordenatesName > #lat').text()).toFixed(6);
                var lng =  parseFloat($('#coordenatesName > #lng').text()).toFixed(6);
                var town = $('#cityData #townName').text();
                var city = $('#cityData #cityName').text();
                var country = $('#cityData #countryName').text();
                $.post(
                    'pin',
                    {
                        lat:lat,
                        lng:lng,
                        town:$('#cityData #townName').text(),
                        city:$('#cityData #cityName').text(),
                        country:$('#cityData #countryName').text()
                    },
                    function(data)
                    {
                        if (data.free)
                        {
                            $('#pinnedCitys').append('<li onclick="showCity('+lat+','+lng+',\''+town+'\',\''+city+'\',\''+country+'\')"><a class="dd-option"> <label class="dd-option-text">'+$('#cityData #cityName').text()+'</label> <small class="dd-option-description dd-desc">'+$('#cityData #countryName').text()+'</small></a></li>');
                            smoke.alert('Pin was added');
                        }
                        else smoke.alert('Pin had already been added');
                    }
                );
            }
            else
                smoke.alert('That Pin was not been added');
        });
}

function firstPin()
{
    if (parseInt(sessionStorage.numPins) == 0)
        smoke.alert('Add your first Pin!',{},function(){$('#add-pin').effect("shake", { times:10, distance:8 }, 1000);});
}

function showCity(lat,lng,town,city,country)
{
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat,lng),
        map: mapa,
        title: 'Click to zoom'
    });
    mapa.setCenter(marker.getPosition());
    mapa.setZoom(11);
    setTimeout("$('#openphotos').effect('bounce', { times:10, distance:8 }, 1000);",1000);
    $('#photoQuantity').html('6');
}