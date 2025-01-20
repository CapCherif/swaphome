
$('.field input').on('change', function(){

    var value = $(this).val()
    if(value != ""){
        $(this).parent().find('.doc_to').show()
    }
    else{
        $(this).parent().find('.doc_to').hide()

    }
})


$('.field').submit(function(e){
    e.preventDefault()
        
    var formData = new FormData(this);
    $(this).find('.doc_to').css('opacity', '0.5').text('ajout en cours...').attr('disabled', true)
    var formSection = $(this).find('section')
   
    var bienId = $(this).find('._bienId').val()
    var field = $(this).find('.field-doc').val()

    $.ajax({
        url: '/upload-doc',  // Remplacez par l'URL de traitement côté serveur
        type: 'POST',
        data: formData,
        processData: false, // Nécessaire pour empêcher jQuery de traiter formData
        contentType: false, // Nécessaire pour empêcher jQuery de définir un Content-Type incorrect
        success: function(response) {
            if(field != "diagnostique"){

                console.log('done')
                // $(this).find('.doc_to').css('opacity', '0.5').text('ajout en cours...').attr('disabled', true)
                formSection.html(`
                    
                    <a href="/${response.path}">Voir le document</a>
                    <div class="doc_control" id="${field}_trash">                        
                        <button class="doc_trash" type="button" onclick="DeleteDocBien('${bienId}', '${field}')"><i class="fa-solid fa-trash"></i></button>                        
                    </div>    
                `)

                formSection.parent().find('label').addClass('label-disabled')

            }
            
        }
        
    });


})


function DeleteDocBien(bienId, field){
    console.log(bienId, field)
   
    $.ajax({
        type:'POST',
        url:'/delete-doc-field',
        data:{bienId, field},
        success:(res)=>{
            console.log(res)
            if(res.done){
                if(field != "diagnostique"){
                    $("#"+field + "_field section").html(`
                        
                        <input type="file" name="file" id="${field}" required>
                        <input type="hidden" name="field" value="${field}" class="field-doc">
                        <input type="hidden" name="bienId" value="${bienId}" class="_bienId">
                        <button type="submit" class="doc_to">Charger</button>    
                    `)

                    $("#"+field + "_field").find('label').removeClass('label-disabled')

                }
            }
            
            
        }
    })
}