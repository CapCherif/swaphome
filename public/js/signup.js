
// $('.animation').show();
// $('#signup_form button').addClass('lighten').attr('disabled', true)
// setTimeout(() => {
//     $('.animation').hide();
//     $('#signup_form button').removeClass('lighten').attr('disabled', false)
// }, 3000);

$('#signup_form').submit((e)=>{
    e.preventDefault()

    // $('.animation').show()
    // $('#signup_form button').addClass('lighten').attr('disabled', true)

    var firstname = $('#firstname').val()
    var lastname = $('#lastname').val()
    var birth = $('#birth').val()
    var address = $('#address').val()
    var phone = $('#phone').val()
    var email = $('#email').val()
    
    var psw = $('#psw').val()
    var cpsw = $("#cpsw").val()

    // console.log(role, fullname, adresse, phone, email, psw, cpsw)

    if(psw.length < 6){

        // $('.animation').hide()
        // $('#signup_form button').removeClass('lighten').attr('disabled', false)
        $('.err').text('longueur du mot de passe: minimuim 6 caractères !!').show()
        setTimeout(() => {
            $('.err').hide().text('').hide()
        }, 3000);
    }
    else if(psw != cpsw){
        // $('.animation').hide()
        // $('#signup_form button').removeClass('lighten').attr('disabled', false)

        $('.err').text('Erreur de confirmation du mot de passe').show()
        setTimeout(() => {
            $('.err').hide().text('').hide()
        }, 3000);
    }
    else{
        // envoyer a la bd
        $('.animation').show();
        $('#signup_form button').addClass('lighten').attr('disabled', true)
        // setTimeout(() => {
        //     $('.animation').hide();
        //     $('#signup_form button').removeClass('lighten').attr('disabled', false)
        // }, 3000);
        $.ajax({
            type:'POST',
            url:'/signup',
            data: {firstname, lastname, birth, address,  email, phone, psw},
            success:(res)=>{
                if(res.done){
                    $('.success').slideDown()
                    setTimeout(() => {
                       $('.success').slideUp(); 
                       window.location.href="/compte"
                    }, 2000);
                }
                else if(res.err){
                    $('.err').text(res.err).show()
                    setTimeout(() => {
                        $('.err').text('').hide();
                    }, 5000);
                }
                $('.animation').hide()
                $('#signup_form button').removeClass('lighten').attr('disabled', false)

                $('#firstname').val("")
                $('#lastname').val("")
                $('#birth').val("")
                $('#address').val("")
                $('#phone').val("")
                 $('#email').val("")

                $('#psw').val("")
                $("#cpsw").val("")
            }
        })
    }
   
  
})