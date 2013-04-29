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
        $('#settings-widget').show();
    }
    else
    {
        $('#settings-widget').hide();
        $('#map_canvas').css('width','100%');
        $('#formlabel').hide();
    }
}
function emplenaInformacioLloc(place)
{
    $('#cityData').show();
    var dades = place.formatted_address.split(", ");
    $('#coordenatesName').html(place.geometry.location.lat() + " , " + place.geometry.location.lng());
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

function hideForm()
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