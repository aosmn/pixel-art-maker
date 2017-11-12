// Select color input
const colorPicker = $("#colorPicker");
// Select size input
const canvasHeight = $("#input_height");
const canvasWidth = $("#input_width");
const sizePickerForm = $("#sizePicker");
const canvas = $("#pixel_canvas");

let isDragging = false;
let clearPixelsActive = false;


// convert rgb to hex
function rgbToHex(colorval) {
  // get text inside ();
  let parts = colorval.substring(colorval.indexOf("(")+1, colorval.length-1).split(", ");
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

// makeGrid method draws the pixel grid
function makeGrid(height,width) {
  // clear canvas
  canvas.children().remove();
  // foreach row add append table row
  // append table cells
  for (let i = 0; i < height; i++) {
    canvas.append("<tr id='tr"+i+"'></tr>");
    for (let j = 0; j < width; j++) {
      $("#tr"+i).append("<td id = 'td"+j+"'></td>");
    }
  }
  // adjust pixel height = pixel width
  const cw = $('td').parent().width()/width;
  $('tr').css({'height':cw+'px'});
}

// When size is submitted by the user, call makeGrid()
sizePickerForm.on("submit",function(evt) {
  evt.preventDefault();
  const height = canvasHeight.val();
  const width = canvasWidth.val();
  makeGrid(height, width);
});

// Change color of the pixel on click
$('#pixel_canvas').on("click", "td",function(evt) {
  if (clearPixelsActive) {
    $(evt.target).css("background-color", "white");
  } else {
    $(evt.target).css("background-color", colorPicker.val());
  }
});

// on window resize adjust pixel height = pixel width
$(window).on('resize', function() {
    const cw = $('td').parent().width()/canvasWidth.val();
    $('tr').css({'height':cw+'px'});
});

// additional functionality color pixels on dragging

$('#pixel_canvas').on("mousedown", "td",function(evt) {
  // If clearPixel button is active, set color to white
  // else set color to colorpicker color
  $(evt.target).css("background-color", clearPixelsActive ? "white" : colorPicker.val());
  // set isDragging flag to true
  isDragging = true;
});

// Set color On entering a new pixel.
$('#pixel_canvas').on("mouseenter", "td",function(evt) {
  // only if dragging
  if (isDragging) {
    // If clearPixel button is active, set color to white
    // else set color to colorpicker color
    $(evt.target).css("background-color", clearPixelsActive ? "white" : colorPicker.val());
  }
});

// unset is dragging on mouse up
$(window).on('mouseup', function() {
    isDragging = false;
});

// unset is dragging if mouse leaves canvas
$("#pixel_canvas").on('mouseleave', function() {
    isDragging = false;
});

// On color change add previous color to history palette
$("#colorPicker").on("change", function(evt){
  if ($("#recentColors").children().length < 10) {
    $("#recentColors").append("<div style='background-color:"+evt.target.value+"'></div>");
  } else {
    // if color palette is already full, remove first element to insert a new one
    $("#recentColors").children().first().remove();
    $("#recentColors").append("<div style='background-color:"+evt.target.value+"'></div>");
  }
});

// on clicking color palette set selected color to clicked color
$("#recentColors").on("click","div", function(evt) {
  // convert rgb to hex to be able assign value to color picker
  $("#colorPicker").val(rgbToHex($(evt.target).css("backgroundColor")))
});

// Additional functionality clear all canvas
$("#clearCanvas").on("click", function() {
  $("td").css("background-color", "white")
});

// Additional functionality clear pixels
$("#clearPixel").on("click", function() {
  clearPixelsActive = !clearPixelsActive;
  $("#clearPixel").toggleClass("active");
});
