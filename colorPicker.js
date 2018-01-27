const redPicker = $('.rgb-picker #red-picker input');
const greenPicker = $('.rgb-picker #green-picker input');
const bluePicker = $('.rgb-picker #blue-picker input');

const redLabel = $("#red-value");
const blueLabel = $("#blue-value");
const greenLabel = $("#green-value");

// const rgbText = $(".rgb-text input");
const colorPickerPreview = $(".color-preview input[type='color']");

const colorPickerRange = $(".pickers input[type='range']");

const hexToRgb = (colorval) => {
  // get text inside ();
  if ((colorval.indexOf("#") >-1 && colorval.length == 7) || (colorval.indexOf("#") == -1 && colorval.length == 6)) {
    const hexVal = colorval.substring(colorval.indexOf('#')+1, colorval.length);
    const red = parseInt(hexVal.substring(0,2), 16);
    const green = parseInt(hexVal.substring(2,4), 16);
    const blue = parseInt(hexVal.substring(4,6), 16);
    redPicker.val(red);
    greenPicker.val(green);
    bluePicker.val(blue);
    setRgb();
  }
}

const setRgb = () => {
  const red = redPicker.val();
  const green = greenPicker.val();
  const blue = bluePicker.val();
  const color = "rgb(" + red + ", " + green + ", " + blue + ")";
  colorPicker.val(rgbToHex(color));
  colorPickerPreview.val(rgbToHex(color));
  redLabel.html(red);
  greenLabel.html(green);
  blueLabel.html(blue);
  turOffEraser();
};
setRgb();


const textSetRgb = () => {
  hexToRgb(colorPicker.val())
}

const setColor = () => {
  hexToRgb(colorPickerPreview.val());
};


colorPickerRange.mouseup(function(evt) {
  turOffEraser();
  if (recentColors.children().length < 10) {
    recentColors.append('<div style="background-color:'+colorPicker.val()+'"></div>');
  } else {
    // if color palette is already full, remove first element to insert a new one
    recentColors.children().first().remove();
    recentColors.append('<div style="background-color:'+colorPicker.val()+'"></div>');
  }
});

colorPickerPreview.on("change", (evt) => {
  if (recentColors.children().length < 10) {
    recentColors.append('<div style="background-color:'+colorPicker.val()+'"></div>');
  } else {
    // if color palette is already full, remove first element to insert a new one
    recentColors.children().first().remove();
    recentColors.append('<div style="background-color:'+colorPicker.val()+'"></div>');
  }
});

colorPicker.on("keyup", (evt) => {
  colorval = colorPicker.val();
  if (evt.which == 13 && ((colorval.indexOf("#") >-1 && colorval.length == 4) || (colorval.indexOf("#") == -1 && colorval.length == 3))) {
    if ((colorval.indexOf("#") >-1 && colorval.length == 7) || (colorval.indexOf("#") == -1 && colorval.length == 6)) {
      const hexVal = colorval.substring(colorval.indexOf('#')+1, colorval.length);
      const red = parseInt(hexVal.substring(0,2), 16);
      const green = parseInt(hexVal.substring(2,4), 16);
      const blue = parseInt(hexVal.substring(4,6), 16);
      redPicker.val(red);
      greenPicker.val(green);
      bluePicker.val(blue);
      setRgb();
    } else if ((colorval.indexOf("#") >-1 && colorval.length == 4) || (colorval.indexOf("#") == -1 && colorval.length == 3)) {
     const hexVal = colorval.substring(colorval.indexOf('#')+1, colorval.length);
     const red = parseInt(hexVal.charAt(0)+hexVal.charAt(0), 16);
     const green = parseInt(hexVal.charAt(1)+hexVal.charAt(1), 16);
     const blue = parseInt(hexVal.charAt(2)+hexVal.charAt(2), 16);
     redPicker.val(red);
     greenPicker.val(green);
     bluePicker.val(blue);
     setRgb();
    }
  }
});

colorPicker.on("blur", (evt) => {
  colorval = colorPicker.val();
  if ((colorval.indexOf("#") >-1 && colorval.length == 4) || (colorval.indexOf("#") == -1 && colorval.length == 3)) {
     const hexVal = colorval.substring(colorval.indexOf('#')+1, colorval.length);
     const red = parseInt(hexVal.charAt(0)+hexVal.charAt(0), 16);
     const green = parseInt(hexVal.charAt(1)+hexVal.charAt(1), 16);
     const blue = parseInt(hexVal.charAt(2)+hexVal.charAt(2), 16);
     redPicker.val(red);
     greenPicker.val(green);
     bluePicker.val(blue);
     setRgb();
  }
});
