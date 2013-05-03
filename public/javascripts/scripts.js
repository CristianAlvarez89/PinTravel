//Dropdown plugin data
var ddData = [
    {
        text: "Barcelona",
        value: 1,
        selected: true,
        description: "Spain",
        lat: 41.38506390,
        lng: 2.17340350
    },
    {
        text: "Madrid",
        value: 2,
        selected: false,
        description: "Spain",
        lat : 40.41677540,
        lng : -3.70379020

    },
    {
        text: "Letur",
        value: 3,
        selected: false,
        description: "Albacete, Spain",
        lat : 38.36562610,
        lng : -2.10146190

    },
    {
        text: "Lloret de Mar",
        value: 4,
        selected: false,
        description: "Girona, Spain",
        lat : 41.70015590,
        lng : 2.84165750


    },
    {
        text: "Blanes",
        value: 4,
        selected: false,
        description: "Girona, Spain",
        lat : 41.50015590,
        lng : 2.64165750

    }
];

function emplenaMarkersUsuari(map)
{
    //Obtenim el JSON amb els pins de l'usuari
    var pins = $.ajax({url:'pin',async: false,success:function(data){return data;}});
    pins = JSON.parse(pins.responseText);

    for (var i=0;i<pins.length;i++)
    {
        var title = (pins[i].town != '') ? pins[i].town : pins[i].city;
        var marker = new google.maps.Marker(
            {
                position: new google.maps.LatLng(pins[i].lat,pins[i].long),
                map: map,
                title: title
            });

        var content = '<div>'+
                        pins[i].city+
                        pins[i].country+
                        '</div>';

        var infowindow = new google.maps.InfoWindow({content: content});
        google.maps.event.addListener(marker, 'click', function(){infowindow.open(map,marker);});
    }
    return pins.length;
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

        $('#myDropdown').ddslick({
            data:ddData,
            width:300,
            height:300,
            selectText: "Select your preferred social network",
            onSelected: function(selectedData){
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(selectedData.selectedData.lat,selectedData.selectedData.lng),
                    map: mapa,
                    title: 'Click to zoom'
                });
                mapa.setCenter(marker.getPosition());
                mapa.setZoom(9);
            }
        });
        $('#dropDown').css('padding-left','10px');
    }
    else
    {
        $('#searchPins').hide();
        $('#map_canvas').css('width','100%');
        $('#formlabel').hide();
        $('#formlabel').attr('onclick','hideForm('+2+')');
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
                        if (data.free) smoke.alert('Pin was added');
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