const hexToRgb = (colorval) => {
  // get text inside ();
  if (colorval.indexOf("#") >-1 && colorval.length == 7 || colorval.indexOf("#") == -1 && colorval.length == 6) {
    const hexVal = colorval.substring(colorval.indexOf('#')+1, colorval.length);
    const red = parseInt(hexVal.substring(0,2), 16)
    const green = parseInt(hexVal.substring(2,4), 16);
    const blue = parseInt(hexVal.substring(4,6), 16);
    $('.rgb-picker #red-picker input').val(red);
    $('.rgb-picker #green-picker input').val(green);
    $('.rgb-picker #blue-picker input').val(blue);
    setRgb();
  }
}

const setRgb = () => {
  var red = $('.rgb-picker #red-picker input').val();
  var green = $('.rgb-picker #green-picker input').val();
  var blue = $('.rgb-picker #blue-picker input').val();
  var color = "rgb(" + red + ", " + green + ", " + blue + ")";
  $(".rgb-text input").val(rgbToHex(color));
  // $(".color-preview").css("backgroundColor", color);
  $(".color-preview input[type='color']").val(rgbToHex(color));
  $("#red-value").html(red);
  $("#blue-value").html(blue);
  $("#green-value").html(green);
}
  setRgb();


const textSetRgb = () => {
  hexToRgb($("#hex-text").val())
}

const setColor = () => {
  hexToRgb($(".color-preview input[type='color']").val());
}


$(".pickers input[type='range']").mouseup(function(evt) {
  if ($('#recentColors').children().length < 10) {
    $('#recentColors').append('<div style="background-color:'+colorPicker.val()+'"></div>');
  } else {
    // if color palette is already full, remove first element to insert a new one
    $('#recentColors').children().first().remove();
    $('#recentColors').append('<div style="background-color:'+colorPicker.val()+'"></div>');
  }
})

$(".color-preview input[type='color']").on("change", (evt) => {
  if ($('#recentColors').children().length < 10) {
    $('#recentColors').append('<div style="background-color:'+colorPicker.val()+'"></div>');
  } else {
    // if color palette is already full, remove first element to insert a new one
    $('#recentColors').children().first().remove();
    $('#recentColors').append('<div style="background-color:'+colorPicker.val()+'"></div>');
  }
})
