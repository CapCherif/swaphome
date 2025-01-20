$('#burger').on('click', function(){
    $('#_links').slideToggle(200)
})


window.addEventListener("resize", function(event) {
    if(document.body.clientWidth >= 800){

        $('#_links').hide(200)
        // $('#voile').fadeOut(50)
        // $('#copyvrtnav').animate({"right":"-200px"}, 200)
    }
})