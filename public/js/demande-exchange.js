// $('#exchange-form button').find('.animation').show()

$('#exchange-form').submit((e)=>{
    e.preventDefault()

    // animation
    // console.log($('select').val().slice(5,))
    $('#exchange-form button').find('.animation').show()
    $('#exchange-form button').css('opacity', "0.5").off()

    // ajax
    $.ajax({
        type:'POST',
        url:'/demande-exchange',
        data:{idBienReceveur:idb, monBienChoisi:$('select').val().split('-')[0].slice(5,),
            location:$('select').val().split('-')[1].slice(9,)
        },
        success:(res)=>{
            // arreter l'animation
            if(res.done){
                $('#exchange-form').find('main').hide()
                $('.success').show()
            }
            else if(res.didExist){
                $('.didExist').slideDown()
                $('#exchange-form button').css('opacity', "1").on()
                $('#exchange-form button').find('.animation').hide()

                setTimeout(() => {
                    $('.didExist').slideUp()
                }, 2000);
            }
            
        }
    })
})