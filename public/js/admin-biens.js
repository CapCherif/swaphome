

function GetBiensConfirmation(param){
    $('#biens-wrapper').html(`
        <div class="anim">
            <div class="lds-ring-violet"><div></div><div></div><div></div><div></div></div>
        </div>    
    `)
    
    $.ajax({
        type:'POST',
        url:"/get-biens-confirmation",
        data:{confirmation:param},
        success:(res)=>{
            CreateBiens(res.biens)
        }
    })

}
// démarrage
GetBiensConfirmation("nconfirmed")


function CreateBiens(biens){
    console.log(biens)
    var html = ""
    biens.forEach(bien => {
        html += `
            <div class="admin-user" id="bien_${bien._id}">
                <div>
                    <h3><a href="/admin/biens/detail?id=${bien._id}">${bien.category} - ${bien.location}</a></h3>
                    <p>${bien.category}</p>
                    <small>${bien.createdAt}</small>
                </div>
                <div class="control">
            `
                if(bien.confirme == 0){
                    html += `
                        <button class="accept" onclick="Acceptbien('${bien._id}')">Accpeter</button>
                    `
                }
                else{
                    html += `
                        <button class="block" onclick="Blockbien('${bien._id}')">Bloquer</button>
                    `
                }
                html +=
            `
                    
                    <button class="refuse" onclick="Refusebien('${bien._id}')">Supprimer</button>
                </div>
            </div>
        `
    });

    if(biens.length == 0){
        html = "<p>Aucun bien trouvé.</p>"
    }
    $('#biens-wrapper').html(html)
}


$('#filter-bien-confirmation').submit((e)=>{
    e.preventDefault()
    GetBiensConfirmation($('#confirmation').val())
})

$('#filter-bien-type').submit((e)=>{
    e.preventDefault()
    $('#biens-wrapper').html(`
        <div class="anim">
            <div class="lds-ring-violet"><div></div><div></div><div></div><div></div></div>
        </div>    
    `)
    setTimeout(() => {
        $.ajax({
            type:'POST',
            url:"/get-bien-type",
            data:{type:$('#filter-bien-type select').val()},
            success:(res)=>{
                CreateBiens(res.biens)
            }
        })
    }, 1000);
})

$('#filter-bien-location').submit((e)=>{
    e.preventDefault()
    $('#biens-wrapper').html(`
        <div class="anim">
            <div class="lds-ring-violet"><div></div><div></div><div></div><div></div></div>
        </div>    
    `)
    setTimeout(() => {
        $.ajax({
            type:'POST',
            url:"/get-bien-location",
            data:{location:$('#filter-bien-location input').val()},
            success:(res)=>{
                CreateBiens(res.biens)
            }
        })
    }, 1000);
   
})

function Acceptbien(id){
    $('#bien_'+id+" .accept").css("opacity", "0.5").text('Accepting..')
    $.ajax({
        type:'POST',
        url:"/accept-bien",
        data:{id},
        success:(res)=>{
            if(res.done){
                $('#bien_'+id+" .accept").replaceWith(
                    `
                    <button class="block" onclick="Blockbien('${id}')">Bloquer</button>
                    `
                )
            }
        }
    })
}


function Blockbien(id){
    $('#bien_'+id+" .block").css("opacity", "0.5").text('Block en cours...')
    $.ajax({
        type:'POST',
        url:"/block-bien",
        data:{id},
        success:(res)=>{
            if(res.done){
                $('#bien_'+id+" .block").replaceWith(
                    `
                    <button class="accept" onclick="Acceptbien('${id}')">Accpeter</button>
                    `
                )
            }
        }
    })
}


function Refusebien(id){
    $('#bien_'+id+" .refuse").css("opacity", "0.5").text('Suppression..')
    $.ajax({
        type:'POST',
        url:"/refuse-user",
        data:{id},
        success:(res)=>{
            if(res.done){
                $('#bien_'+id).slideUp()
            }
        }
    })
}