function searchForCity (cityName) {
    if ($("#city").val()){
        var tempUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + $("#city").val() + "&appid=f19d4e1c772c15cfa5a0df0f4a51a3f8";
        fetch(tempUrl)
        .then (function (response) {
            return response.json()
        })
        .then (function (data) {
            console.log(data);
        })
    }
}

$("#search-form").submit(function( event ) {
    searchForCity();
    event.preventDefault();
    });