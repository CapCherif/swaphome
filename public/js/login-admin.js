
console.log('login admin is running')

$('#login-admin-form').submit((e)=>{
    e.preventDefault()

    $('#login-admin-form .animation').show()
    $('#login-admin-form button').css("opacity", "0.5")

    $.ajax({
        type:"POST",
        url:"/login-admin",
        data:{username:$('#login-admin-form .username').val(), password:$('#login-admin-form .password').val()},
        success:(res)=>{
            console.log(res)
            $('#login-admin-form input').val("")
            $('#login-admin-form .animation').hide()
            $('#login-admin-form button').css("opacity", "1")
            if(res.done){
                $('.success').show()
                window.location.href="/admin/dashboard"
            }
            else{
                $('.err').show()
                setTimeout(() => {
                    $('.err').slideUp()
                }, 3000);
            }
        }
    })


})