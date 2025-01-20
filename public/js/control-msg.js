

$('#endb').html(`
    <div id="animation" style="display: block;" >
        <div class="lds-ring-big"><div></div><div></div><div></div><div></div></div>
    </div>
`)



// get Message form db

$.ajax({
    type:'POST',
    url:'/compte/get-invitmsg',
    data:{},
    success:(res)=>{
        console.log(res)

        setTimeout(() => {
            CreateInvitMsg(res.result)
            $('#endb').html(`
                
            `)
        }, 1000);

        // create Conversation

    }

})


function CreateInvitMsg(data){
    var html = ''   

    data.forEach((msg)=>{
      
        html += `
            <div class="person-msg">
                <h4><a href="/compte/chat?idp=${msg.idProprietaire}&idb=${msg.idBien}&idc=${msg.idClient}">${msg.fullNameClient} - </a></h4>
                <p>A propos : ${msg.aPropos}</p>
            </div>
        `
       

        
    })
    if(data.length == 0){
        html = '<p>Aucun message trouvé.</p>'
    }

    $('#person-msgs').html(html)
}