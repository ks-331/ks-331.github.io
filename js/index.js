$(document).ready(function(){
    $('.slider').slider({full_width: true});
    $("#load_1kurs").on("click", function() {
        $("#load_1kurs").toggleClass( "active", true );
        $("#load_2kurs").toggleClass( "active", false );
        $("#unload_all").toggleClass("active", false);
        $("#2kurs").toggleClass( "hide", true );
        $("#1kurs").toggleClass( "hide", false );
    });
    $("#load_2kurs").on("click", function() {
        $("#load_2kurs").toggleClass( "active", true );
        $("#load_1kurs").toggleClass( "active", false );
        $("#unload_all").toggleClass("active", false);
        $("#1kurs").toggleClass( "hide", true );
        $("#2kurs").toggleClass( "hide", false );
    });
});
