


// au début
var limit = 1
var skip = 0
var ville = ""
var nv = ""
var type = ""



function CreateProperty(data, ptemplate){
    

    var html = ""
    console.log(data)
    data.forEach((property)=>{
        html += `
            <div class="property-item-small">
                <div class="cont-img">
                    <img src="/${property.imgs[0].slice(7,)}" alt="Image de">
                </div>
                <div class="property-info">
                    <h3><a href="/property/detail?id=${property._id}">${property.location}</a></h3>
                    <p>${property.category}</p>
                   
                    <p>${property.description.slice(0, 80)}...</p>
            `
            if(idUser != "false" && idUser != property.owner){
                html += `
                    <a href="/property/exchange?id=${property._id}" class="btn echangebtn">Demander l'échange</a>
                    <a href="/compte/chat?idp=${property.owner}&idb=${property._id}&idc=${idUser}" class="msg-icon">
                        <i class="fa-solid fa-message"></i>
                    </a>
                `
            }

            html +=
            `
                    


                </div>
            </div>
        
        `
    })

    if(data.length == 0){
        html = "<p style='color:white;'>Aucune propriété trouvée.</p>"
    }

    if(ptemplate){
        var t = $('#res-property .property-list').html()
        $('#res-property .property-list').html(t + html)
    }
    else{
        $('#res-property .property-list').html(html)
    }
}



function GetProperty(){
    limit = 1
    skip=0

    $('#res-property .property-list').html(`
        <div id="animation" style="display: block;" >
            <div class="lds-ring-big"><div></div><div></div><div></div><div></div></div>
        </div>
    `)
    console.log(skip, limit)
    setTimeout(() => {
        $.ajax({
            type:'POST',
            url:"/get-property",
            data:{ville:$('#ville').val(), nv:$('#nv').val(), type:$('#type').val(), limit:limit, skip:skip },
            success:(res)=>{
                ville = $('#ville').val()
                nv = $('#nv').val()
                type = $('#type').val()

                CreateProperty(res.data, false)
                if(res.canLoad){
                    skip = skip + limit
                    $('.loadMore').css('display', 'block')
                }
                else{
                    $('.loadMore').css("display", "none")
                }
            }
        })
        
    }, 1000);

}


GetProperty()


$('.filter-property').submit((e)=>{
    e.preventDefault()
    GetProperty()
})


function LoadMore(ville, type, nv){

    $('.loadMore').css('opacity','0.5')
    $('.loadMore').find('.animation').show()

    console.log(skip, limit)
    setTimeout(() => {
        $.ajax({
            type:'POST',
            url:"/get-property",
            data:{ville:ville, nv:nv, type:type, limit:limit, skip:skip },
            success:(res)=>{
                $('.loadMore').css('opacity','1')
                $('.loadMore').find('.animation').hide()
                
                CreateProperty(res.data, true)
                console.log(res.canLoad)
                console.log("count", res.count)
                if(res.canLoad){
                    skip = skip + limit
                    console.log('skip', skip)
                    $('.loadMore').css('display', 'block')
                }
                else{
                    $('.loadMore').css("display", "none")
                }
            }
        })
        
    }, 1000);
}

$('.loadMore').on('click', function(){
    LoadMore(ville, type, nv)
})