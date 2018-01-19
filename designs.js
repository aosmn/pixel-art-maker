// Select color input
const colorPicker = $('#hex-text');
// Select size input
const canvasHeight = $('#input_height');
const canvasWidth = $('#input_width');
const sizePickerForm = $('#sizePicker');
const canvas = $('#pixel_canvas');
const clearCanvasBtn = $('#clearCanvas');
const clearPixelBtn = $('#clearPixel');
const inputSize = $('#inputSize');

let isToolBoxExpanded = false;

let isDragging = false;
let clearPixelsActive = false;

let firstRun = true;

// convert rgb to hex
const rgbToHex = (colorval) => {
  // get text inside ();
  let parts = colorval.substring(colorval.indexOf('(')+1, colorval.length-1).split(', ');
  let color = '#';
  // add r, g, b values to color string
  for (let i = 0; i < 3; ++i) {
      // convert string to integer then back to hexadecimal string
      parts[i] = parseInt(parts[i], 10).toString(16);
      // if the value of the number is < 10, concatenate 0 to the left of the string
      if (parts[i].length == 1) parts[i] = '0' + parts[i];

      color += parts[i];
  }
  return color;
}

const colorMulti = (evt, hover) => {
  let prevRow, crntRow, prevTd;
  // If clearPixel button is active, set color to white
  // else set color to colorpicker color
  const colorValue = clearPixelsActive ? 'rgba(0, 0, 0, 0)' : colorPicker.val();

  const radius = $("#inputSize").val();
  // color rows within radius
  for (let i = 0; i < radius; i++) {
    // color first row
    if (i == 0) {
      prevRow = $(evt.target).parent();
      prevTd = $(evt.target).parent().children('#'+evt.target.id)
      prevTd.css('background-color', colorValue);
      // color each pixel in row
      for (let j = 0; j < radius-1; j++) {
        prevTd.next().css('background-color', colorValue);
        prevTd = prevTd.next()
      }
    } else {
      // color the next rows
      crntRow = prevRow.next();
      prevTd = crntRow.children('#'+evt.target.id).css('background-color', colorValue);;
      // color each pixel in row
      for (let j = 0; j < radius-1; j++) {
        prevTd.next().css('background-color', colorValue);
        prevTd = prevTd.next();
      }
      prevRow = crntRow;
    }
  }
}


// makeGrid method draws the pixel grid
const makeGrid = (height,width) => {
  // clear canvas
  canvas.children().remove();

  // enable clear buttons
  clearCanvasBtn.attr('disabled', false);
  clearPixelBtn.attr('disabled', false);
  colorPicker.attr('disabled', false);
  inputSize.attr('disabled', false);
  // foreach row add append table row
  // append table cells
  for (let i = 0; i < height; i++) {
    canvas.append('<tr id="tr'+i+'"></tr>');
    for (let j = 0; j < width; j++) {
      $('#tr'+i).append('<td id = "td'+j+'"></td>');
    }
  }
  // adjust pixel height = pixel width
  const cw = $('td').parent().width()/width;
  $('tr').css({'height':cw+'px'});
}

// When size is submitted by the user, call makeGrid()
sizePickerForm.on('submit', (evt) => {
  evt.preventDefault();

  const height = canvasHeight.val();
  const width = canvasWidth.val();
  if (firstRun) {
    makeGrid(height, width);

  } else {
    if (confirm("This will clear canvas! confirm?")) {
      makeGrid(height, width);
      firstRun = true;
    }
  }
});

// on window resize adjust pixel height = pixel width
$(window).on('resize', () => {
    const cw = $('td').parent().width()/canvasWidth.val();
    $('tr').css({'height':cw+'px'});
});

// Change color of the pixel on click
canvas.on('click', 'td', (evt) => {
  colorMulti(evt);
});

// additional functionality color pixels on dragging

canvas.on('mousedown', 'td', (evt) => {
  colorMulti(evt);
  // set isDragging flag to true
  isDragging = true;
  if (firstRun) {
    firstRun = false
  }
});

// Set color On entering a new pixel.
canvas.on('mouseenter', 'td', (evt) => {
  // only if dragging
  if (isDragging) {
    colorMulti(evt);
  }
});

// unset is dragging on mouse up
$(window).on('mouseup', () => {
    isDragging = false;
});

// unset is dragging if mouse leaves canvas
canvas.on('mouseleave', () => {
    isDragging = false;
});

// On color change add previous color to history palette
colorPicker.on('change', (evt) => {
  if ($('#recentColors').children().length < 10) {
    $('#recentColors').append('<div style="background-color:'+evt.target.value+'"></div>');
  } else {
    // if color palette is already full, remove first element to insert a new one
    $('#recentColors').children().first().remove();
    $('#recentColors').append('<div style="background-color:'+evt.target.value+'"></div>');
  }
});

// on clicking color palette set selected color to clicked color
$('#recentColors').on('click','div', (evt) => {
  // convert rgb to hex to be able assign value to color picker
  colorPicker.val(rgbToHex($(evt.target).css('backgroundColor')));
});

// Additional functionality clear all canvas
clearCanvasBtn.on('click', () => {
  if (confirm('Are you sure you want to clear the canvas?')) {
    $('td').css('background-color', 'rgba(0, 0, 0, 0)');
  }
});

// Additional functionality clear pixels
clearPixelBtn.on('click', () => {
  clearPixelsActive = !clearPixelsActive;
  clearPixelBtn.toggleClass('active');
});
