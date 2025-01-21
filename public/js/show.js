


var buildIncr = 0;
var build =false;
var i = 0
var mots = ["Echangez votre bien", "en 59 secondes"]
var int;
function Building(){
    int = setInterval(()=>{
        if(build){
            Build()
        }
        else{
            Destroy()
        }
    }, 50)
}

setTimeout(()=>{
    Building()

}, 500)

function Destroy(){
    var mot = $('#show span').text()
    if(mot.length == 0){
        i++
        if(i == mots.length){
            i = 0
        }
        build = true
        // clear interval
        clearInterval(int)
        Bar()
        setTimeout(() => {
            clearInterval(bar)
            Building()
        }, 1000);
        // delay ..
        // reset interval
    }
    else{
        $('#show span').text(mot.slice(0, mot.length - 1))
    }
}

function Build(){
    var m = mots[i]
    $('#show span').text(m.slice(0, buildIncr))
    if(buildIncr == m.length){
        buildIncr = 0
        build = false
        clearInterval(int)
        Bar()
        setTimeout(() => {
            clearInterval(bar)
            Building()
        }, 1000);
    }else{
        buildIncr++
    }
    
}


/*

setInterval(() => {
    var mot = $('#show span').text()

    if(mot.length == 0){
        i++;
        if(i > mots.length - 1){
            i = 0
        }
        // mot = mots[i]
        console.log(i)
        build = true
    }
    
    if(build){
        if(buildIncr == mots[i].length){
            buildIncr = 0
            build = false
        }else{
            mot = mots[i].slice(0, buildIncr)
            buildIncr++
            $('span').text(mot)
        }
    }
    else{
        mot = mot.slice(0,mot.length-1)
        $('span').text(mot)
    }
}, 500);






*/

var bar ;

function Bar(){
    bar = setInterval(()=>{
        if($('#show b').css('background-color') == 'rgb(3, 137, 182)'){
            $('#show b').css({'background-color':'rgba(93, 209, 248,0.1)'})
    
        }else{
            $('#show b').css({'background-color':'rgb(3, 137, 182)'})
        }
    }, 200)
}





/* partie on hover on works */


// $('.work').hover( 
//     function(){
//         $(this).find('div').animate({"left":"0"}, 400)

//     }
//     ,

//     function(){
//         $(this).find('div').animate({"left":"-300"}, 400)

//     }

// )

// $('div').hover(
				
//     function () {
//        $(this).css({"background-color":"red"});
//     }, 
     
//     function () {
//        $(this).css({"background-color":"blue"});
//     }
//  );



// var curr_position = 0;

// $('#right').on('click', function(){

//     curr_position -= 300

//     if(curr_position < -600){
//         curr_position = 0
//     }
//     $('#chaine').animate({"margin-left":curr_position}, 300)
// })


// $('#left').on('click', function(){

//     curr_position += 300

//     if(curr_position > 0){
//         curr_position = -600
//     }
//     $('#chaine').animate({"margin-left":curr_position}, 300)
// })



// $('#msgForm').submit((e)=>{
//     e.preventDefault()

//     // fire animation
//     // $('.animation').show()
//     $('#msgForm button').css('opacity', '0.5').attr('disabled', true).text('Sending...')
//     $.ajax({
//         type:'POST',
//         url:'/post_msg',
//         data:{name:$("#name").val(), phone:$('#phone').val(), email:$('#email').val(), message:$('#message').val()},
//         success:(res)=>{
//             $('#msgForm button').css('opacity', '1').attr('disabled', false).text('Submit')
//             $('.msgSent').slideDown()
//             setTimeout(() => {
//                 $('.msgSent').slideUp()
//             }, 3000);
//             $('#msgForm input').val('')
//         }
//     })
// })