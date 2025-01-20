console.log('admin users...')


function GetUsersConfirmation(param){
    $('#users-wrapper').html(`
        <div class="anim">
            <div class="lds-ring-violet"><div></div><div></div><div></div><div></div></div>
        </div>    
    `)
    
    $.ajax({
        type:'POST',
        url:"/get-users-confirmation",
        data:{confirmation:param},
        success:(res)=>{
            CreateUsers(res.users)
        }
    })

}
// démarrage
GetUsersConfirmation("nconfirmed")


function CreateUsers(users){
    console.log(users)
    var html = ""
    users.forEach(user => {
        html += `
            <div class="admin-user" id="user_${user._id}">
                <div>
                    <h3><a href="/admin/users/detail?id=${user._id}">${user.firstname} - ${user.lastname}</a></h3>
                    <small>${user.email}</small>
                </div>
                <div class="control">
            `
                if(user.confirme == 0){
                    html += `
                        <button class="accept" onclick="AcceptUser('${user._id}')">Accpeter</button>
                    `
                }
                html +=
            `
                    
                    <button class="refuse" onclick="RefuseUser('${user._id}')">Supprimer</button>
                </div>
            </div>
        `
    });

    if(users.length == 0){
        html = "<p>Aucun utilisateur trouvé.</p>"
    }
    $('#users-wrapper').html(html)
}


$('#filter-form-confirmation').submit((e)=>{
    e.preventDefault()
    GetUsersConfirmation($('#confirmation').val())
})

$('#filter-form-name').submit((e)=>{
    e.preventDefault()
    $('#users-wrapper').html(`
        <div class="anim">
            <div class="lds-ring-violet"><div></div><div></div><div></div><div></div></div>
        </div>    
    `)
    setTimeout(() => {
        $.ajax({
            type:'POST',
            url:"/get-user-name",
            data:{name:$('#filter-form-name input').val()},
            success:(res)=>{
                CreateUsers(res.users)
            }
        })
    }, 1000);
   
})

function AcceptUser(id){
    $('#user_'+id+" .accept").css("opacity", "0.5").text('Accepting..')
    $.ajax({
        type:'POST',
        url:"/accept-user",
        data:{id},
        success:(res)=>{
            if(res.done){
                $('#user_'+id).slideUp()
            }
        }
    })
}


function RefuseUser(id){
    $('#user_'+id+" .refuse").css("opacity", "0.5").text('Suppression..')
    $.ajax({
        type:'POST',
        url:"/refuse-user",
        data:{id},
        success:(res)=>{
            if(res.done){
                $('#user_'+id).slideUp()
            }
        }
    })
}