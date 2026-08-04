function getSelectedBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for(var i = 0; i < uiBathrooms.length; i++) {
        if(uiBathrooms[i].checked) {
            return parseInt(uiBathrooms[i].value);
        }
    }
    return -1;
}

function getBHKValue() {
    var uiBHK = document.getElementsByName('uiBHK');
    for(var i = 0; i < uiBHK.length; i++) {
        if(uiBHK[i].checked) {
            return parseInt(uiBHK[i].value);
        }
    }
    return -1;
}

function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");
    
    var sqft = document.getElementById("uiSqft");
    var bhk = getBHKValue();
    var bathrooms = getSelectedBathValue();
    var location = document.getElementById("uilocations");
    var estPrice = document.getElementById("uiEstimatedPrice");
    
    // Show loading state
    document.getElementById("button-text").style.display = "none";
    document.getElementById("button-loader").style.display = "inline-block";
    estPrice.innerHTML = "Calculating...";
    estPrice.classList.add("price-animation");
    
    var url = "http://127.0.0.1:5000/predict_home_price";
    
    $.post(url, {
        total_sqft: parseFloat(sqft.value),
        bhk: bhk,
        bath: bathrooms,
        location: location.value
    }, function(data, status) {
        console.log(data.estimated_price);
        
        // Format the price with commas
        var formattedPrice = parseFloat(data.estimated_price).toLocaleString('en-IN');
        
        // Show result with animation
        estPrice.innerHTML = `<h2>₹${formattedPrice} Lakh</h2>`;
        estPrice.style.backgroundColor = "#e8f5e9";
        estPrice.style.color = "#2e7d32";
        
        // Reset button state
        document.getElementById("button-text").style.display = "inline-block";
        document.getElementById("button-loader").style.display = "none";
        
        console.log(status);
    }).fail(function() {
        estPrice.innerHTML = "Error calculating price. Please try again.";
        estPrice.style.backgroundColor = "#ffebee";
        estPrice.style.color = "#c62828";
        
        // Reset button state
        document.getElementById("button-text").style.display = "inline-block";
        document.getElementById("button-loader").style.display = "none";
    });
}

function onPageLoad() {
    console.log("document loaded");
    var url = "http://127.0.0.1:5000/get_location_names";
    $.get(url, function(data, status) {
        console.log("got response for get_location_names request");
        if (data) {
            var locations = data.locations;
            var uiLocations = document.getElementById("uilocations");
            $('#uilocations').empty();
            $('#uilocations').append('<option value="" disabled selected>Choose a location</option>');
            for (var i in locations) {
                var opt = new Option(locations[i]);
                $('#uilocations').append(opt);
            }
        }
    });
}

window.onload = onPageLoad;
