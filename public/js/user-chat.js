

$('#endb').html(`
    <div id="animation" style="display: block;" >
        <div class="lds-ring-big"><div></div><div></div><div></div><div></div></div>
    </div>
`)



var localMessages = []

// get Message form db

$.ajax({
    type:'POST',
    url:'/compte/get-msg',
    data:{idClient, idProprietaire, idBien},
    success:(res)=>{
        console.log(res)

        setTimeout(() => {
            CreateConversation(res.result)
            localMessages = res.result.messages

            $('#endb').html(`
                
            `)
        }, 1000);

        // create Conversation

    }

})

function CreateConversation(conv){
    var html = ''   
    // if(result){

    // }
    conv.messages.forEach((msg)=>{
        if(msg.idUser == idClient){
            html += `
            <div class="chat-msg">
                <h3>${fullname}</h3>
                <p>${msg.texte}</p>
                <small>envoyé le ${msg.createdAt}</small>
            </div>
        `
        }
        else{
            html += `
            <div class="chat-msg">
                <h3>Propriétaire:</h3>
                <p>${msg.texte}</p>
                <small>envoyé le ${msg.createdAt}</small>
            </div>
        `
        }

        
    })
    if(conv.messages.length == 0){
        html = '<p>Aucun message trouvé.</p>'
    }

    $('#chat-msg').html(html)


}

// const socket = io('http://localhost:5000');

$('#form-chat').submit((e)=>{
    e.preventDefault()
    $('#form-chat button').find('.animation').show()
    $('#form-chat button').css('opacity',"0.5").off()
    var texte = $('textarea').val()

    setTimeout(() => {
        $.ajax({
            type:'POST',
            url:"/compte/add-msg",
            data:{idProprietaire, texte:texte, idBien, idClient},
            success:(res)=>{
                console.log(res)

                // socket.on('receiveMessage', ({ idProprietaire, message }) => {
                //     console.log(`Message de ${message}`);
                // });
                
                $('textarea').val("")
                var dt = new Date()

                if(idUser == idClient){
                    $('#chat-msg').append(`<div class="chat-msg">
                                        <h3>${fullname}</h3>
                                        <p>${texte}</p>
                                        <small>envoyé le ${dt}</small>
                                    </div>`
                    )
                }
                else{
                    $('#chat-msg').append(`<div class="chat-msg">
                        <h3>Propriétaire</h3>
                        <p>${texte}</p>
                        <small>envoyé le ${dt}</small>
                    </div>`
                    )
                }
            }
        })
        $('#form-chat button').find('.animation').hide()
        $('#form-chat button').css('opacity',"1").on()
    }, 1000);
})



// setinterval

setInterval(()=>{
    $.ajax({
        type:'POST',
        url:'/compte/get-msg',
        data:{idClient, idProprietaire, idBien},
        success:(res)=>{
            console.log(res)
            if(res.result.messages.length != localMessages){
                CreateConversation(res.result)
            }
            
    
        }
    
    })
}, 20000)