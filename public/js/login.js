

// $('.animation').show()
// $('#signin_form button').addClass('lighten').attr('disabled', true)

$('#signin_form').submit((e)=>{
    e.preventDefault();

    var email = $('#email').val();
    var psw = $("#psw").val();


    $('.animation').show()
    $('#signin_form button').addClass('lighten').attr('disabled', true)

    // setTimeout(() => {
    //     $('.spinner').hide()
    //     $('#login_form button').removeClass('lighten').attr('disabled', false)
    // }, 2000);

    $.ajax({
        type:'POST',
        url:'/signin',
        data:{email, psw},
        success:(response)=>{
            $('.animation').hide()
            $('#signin_form button').removeClass('lighten').attr('disabled', false)

            if(response.err){
                $('.err').text(response.err).slideDown();
                setTimeout(() => {
                    $('.err').hide().text('')
                }, 3000);
            }
            else if(response.login){
                $('#email').val("")
                $('#psw').val("")
                $('.success').slideDown()
                setTimeout(() => {
                    window.location.href="/compte"
                }, 1000);
            }
            else{
                $('#psw').val("")
                $('.err').slideDown().text("Erreu d'identification, mot de passe ou email invalide.")
                setTimeout(() => {
                    $('.err').slideUp();
                }, 3000);
            }
        }
    })
})