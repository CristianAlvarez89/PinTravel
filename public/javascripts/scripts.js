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
    $( "#openphotos" ).click(function(){
        var pinID = $(this).attr('pin');
        $.ajax({
            url:'images/pin/'+pinID,
            dataType: 'text',
            success:function(data)
            {
                if (data == 'nok') smoke.alert('You have to add your first image');
                else
                {
                    var dataXsplit = data.split(',');
                    var dataXarrayObj = new Array(), i;
                    for(i in dataXsplit){
                        dataXsplit[i] = dataXsplit[i].replace(";",",");
                        dataXarrayObj[i] = $.parseJSON(dataXsplit[i]);
                    }
                    $.fancybox(dataXarrayObj);
                }
            }
        });
    });
});
$(document).ready(function(){
    $("a[rel^='prettyPhoto']").prettyPhoto();
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
        $('#viewFriends').hide();
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
function openCloseViewFriends()
{
    if($('#viewFriends').css('display') == 'none')
    {
        $('#map_canvas').css('width','75%');
        $.getJSON('/users', function(data) {
            $('#pintravelUsersNumber').html(data.length + " users in Pintravel!");
            var availableFriends = [];
            for(var i = 0; i<data.length;i++)
            {
                availableFriends.push(data[i].username);
            }

            $( "#friendsSearch" ).autocomplete({
                source: availableFriends
            });

            $('#formlabel').show();
            $('#formlabel').css('left','25%');
            $('#viewFriends').show();
            $('#searchPins').hide();
            $('#settings-widget').hide();
            $('#formlabel').attr('onclick','hideForm('+3+')');
        });

    }
    else
    {
        $('#viewFriends').hide();
        $('#map_canvas').css('width','100%');
        $('#formlabel').hide();
        $('#formlabel').attr('onclick','hideForm('+3+')');
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
        $('#viewFriends').hide();
        $('#formlabel').attr('onclick','hideForm('+2+')');
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
                    setTimeout("$('#openphotos').effect('bounce', { times:10, distance:8 }, 1000);",1000)
                    $('#dropDown').css('padding-left','10px');
                    $('.buttons').show();
                    $('.photoAlbum').show();
                    $('#photoQuantity').html('6');
                    $('#deletePin').attr('onclick','esborraPin("'+selectedData.selectedData._id+'")');
                    $('#imgUploadPinID').attr('value',selectedData.selectedData._id);
                    if (selectedData.selectedData.town != '') $('#imgUploadPinName').attr('value',selectedData.selectedData.town);
                    else $('#imgUploadPinName').attr('value',selectedData.selectedData.city);
                    $('#openphotos').attr('pin',selectedData.selectedData._id);
                }
            });
        });

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
    else if(botoclicat == 3)
    {
        if($('#viewFriends').css('display') == 'none')
        {
            $('#map_canvas').css('width','75%');
            $('#formlabel').removeClass('formlabelhide');
            $('#formlabel').addClass('formlabelshow');
            $('#viewFriends').show();
            $('#formlabel').css('left','25%');
        }
        else
        {
            $('#viewFriends').hide();
            $('#formlabel').addClass('formlabelhide');
            $('#formlabel').removeClass('formlabelshow');
            $('#map_canvas').css('width','100%');
            $('#formlabel').css('left','0');
            $('#dialog').hide();
        }
    }

}
function esborraPin(id)
{
    smoke.confirm('Do you really want to remove that Pin?',function(e)
    {
        if (e)
        {
            $.ajax({
                type: "delete",
                url: "pin",
                data: {id:id},
                success: function(data)
                {
                    if (data.status == 'nok') smoke.alert('Something went bad.');
                    else
                    if (data.removed == true) smoke.alert('Your Pin was removed properly',{},function(){window.location = 'home';});
                    else smoke.alert('Your Pin could not be deleted');
                }
            });
        }
        else
            smoke.alert('You chose de best option :)');
    });
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
                            smoke.alert('Pin was added');
                            $('#pinnedCitys').append('<li onclick="showCity('+lat+','+lng+',\''+town+'\',\''+city+'\',\''+country+'\')"><a class="dd-option"> <label class="dd-option-text">'+$('#cityData #cityName').text()+'</label> <small class="dd-option-description dd-desc">'+$('#cityData #countryName').text()+'</small></a></li>');
                            $('#townName').html('');
                            $('#cityName').html('');
                            $('#countryName').html('');
                            $('#cityData').hide();
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

function showUserInfo(usuari)
{
    var user = $.ajax({url:'users/'+usuari,async:false,success:function(data){return data}});
    user = JSON.parse(user.responseText);
    var nomusuari = (user.status == 'ok' && user.found == true) ? user.user : false;

    if (usuari == '') smoke.alert('Type a name');
    else if (!nomusuari) smoke.alert('Sorry, that user does not found.');
    else
    {
        var idusuari = user.userID;
        var usuariAmic = $.ajax({url:'friends/'+idusuari,async:false,success:function(data){return data}});
        usuariAmic = JSON.parse(usuariAmic.responseText);
        usuariAmic = usuariAmic.friend;
        console.log(usuariAmic);

        if($('#userInformation').html() == undefined)
        {
            $('#friendsList').append('<div id="userInformation" >');
            $('#friendsList').append("<div style='width:50%; display:table-row;'></div>");
            $('#friendsList').append("<div style='display:table-cell;'></div>");
            $('#friendsList').append("<img style='vertical-align:middle;' src = 'images/noimageuser.png' />");
            $('#friendsList').append('<span  id="nomUsuari" style="font-size:12px; font-family: Caesar Dressing ;color:white;">'+usuari + '</span>');
            if(usuariAmic)
            {
                $('#friendsList').append('<img id="viewFriendButton" src="images/viewFriend.png" style="vertical-align:middle; cursor:pointer;">');
                $('#friendsList').append('<img id="deleteFriendButton" src="images/deleteFriend.png" style="vertical-align:middle; cursor:pointer;">');
                $('#viewFriendButton').attr('onclick','openFriendInfo("'+nomusuari+'", "'+idusuari+'")');
                $('#deleteFriendButton').attr('onclick','deleteFriend("'+nomusuari+'", "'+idusuari+'")');
            }
            else
            {
                $('#friendsList').append('<img id="addFriendButton" src="images/addFriend.png" style="vertical-align:middle; cursor:pointer;">');
                $('#addFriendButton').attr('onclick','addUserFriend("'+nomusuari+'", "'+idusuari+'")');
            }
            $('#friendsList').append("<div style='clear:both;'></div>");
            $('#friendsList').append('</div>');
        }
        else
        {
            $('#nomUsuari').html(usuari);
            if(usuariAmic)
            {
                $('#viewFriendButton').attr('onclick','openFriendInfo("'+nomusuari+'", "'+idusuari+'")');
                $('#viewFriendButton').show();
                $('#deleteFriendButton').attr('onclick','deleteFriend("'+nomusuari+'", "'+idusuari+'")');
                $('#deleteFriendButton').show();
                $('#addFriendButton').hide();
            }
            else
            {
                $('#addFriendButton').attr('onclick','addUserFriend("'+nomusuari+'", "'+idusuari+'")');
                $('#addFriendButton').show();
                $('#viewFriendButton').hide();
                $('#deleteFriendButton').hide();
            }
        }
    }
}
function addUserFriend(nomusuari, idusuari)
{
    smoke.confirm('Would you like to add '+nomusuari+' to your friends?',function(e)
    {
        if (e)
        {
            $.post(
                'friends',
                {friendID:idusuari},
                function(data)
                {
                    if (!data.status) smoke.alert('Friend could not be added');
                    else
                    {
                        $('#addFriendButton').hide();
                        $('#friendsList').append('<img id="viewFriendButton" src="images/viewFriend.png" style="vertical-align:middle; cursor:pointer;">');
                        $('#friendsList').append('<img id="deleteFriendButton" src="images/deleteFriend.png" style="vertical-align:middle; cursor:pointer;">');
                        $('#viewFriendButton').attr('onclick','openFriendInfo("'+nomusuari+'", "'+idusuari+'")');
                        $('#deleteFriendButton').attr('onclick','deleteFriend("'+nomusuari+'", "'+idusuari+'")');
                        smoke.alert('Friend was added');
                    }
                }
            );
        }
        else smoke.alert('It is your choise');
    });
}

function openFriendInfo(nomusuari,idusuari)
{
    $.ajax(
        {
            url:'pin/'+idusuari,
            success:function(data)
            {
                $('#friendsPinsInformation').text('');
                $('#friendsPinsInformation').prepend('<a class="fancybox" href="#inline1" title=""></a>');
                var info = "";

                for (var i=0;i<data.length;i++)
                {
                    if (data[i].town != '') info += (i+1)+": "+data[i].town+", "+data[i].city+", "+data[i].country+"<br>";
                    else info += (i+1)+": "+data[i].city+", "+data[i].country+"<br>";
                }
                $('#friendsPinsInformation').text(info);
                $.fancybox.open(info,{title:nomusuari+"'s Pins"});
            }
        });
}
function deleteFriend(nomusuari,idusuari)
{
    smoke.confirm('Are you plenty sure you want to remove that friend from your friends?',function(e)
    {
        if (e)
        {
            $.ajax({
                url:'friends/'+idusuari,
                method:'delete',
                success:function(data)
                {
                    if (!data.removed) smoke.alert('Friend could not be removed');
                    else
                    {
                        $('#addFriendButton').attr('onclick','addUserFriend("'+nomusuari+'", "'+idusuari+'")');
                        $('#addFriendButton').show();
                        $('#viewFriendButton').hide();
                        $('#deleteFriendButton').hide();
                        smoke.alert('Friend was removed');
                    }
                }
            });
        }
        else smoke.alert('Nice :)');
    });
}