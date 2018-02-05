// Select color input
const colorPicker = $('#hex-text');
// Select size input
const canvasHeight = $('#input_height');
const canvasWidth = $('#input_width');
const sizePickerForm = $('#sizePicker');
const canvas = $('#pixel_canvas');
const clearCanvasBtn = $('#clearCanvas');
const fillCanvasBtn = $('#fillCanvas');
const clearPixelBtn = $('#clearPixel');
const inputSize = $('#inputSize');
const recentColors = $('#recentColors');
const saveCanvas = $("#saveCanvas");
const undoBtn = $("#undo");
const redoBtn = $("#redo");
const zoomIn = $("#zoomIn");
const zoomOut = $("#zoomOut");
const zoomInput = $("#input_zoom");

let isToolBoxExpanded = false;

let isDragging = false;
let clearPixelsActive = false;
let isFillCanvas = false;
let isClearCanvas = false;

let firstRun = true;

let previousMoves = [];
let previousMove = [];
let nextMoves = [];
let nextMove = [];

let pixelZoom = 1;
let pixelSize = 10;

// let hasPrevious = false;
// let hasNext = false;

const savePreviousMove = () => {
  nextMoves = [];
  if (previousMoves.length == 10) {
    previousMoves.splice(0,1);
  }
  previousMoves.push({move: previousMove, color: clearPixelsActive ? 'rgba(0, 0, 0, 0)' : colorPicker.val(), isEraser: clearPixelsActive, isUndone: false, isFillCanvas: isFillCanvas, isClearCanvas: isClearCanvas});
  isClearCanvas = false;
  redoBtn.attr("disabled", true);
  previousMove = [];
  if (previousMoves.length > 0) {
    undoBtn.attr("disabled", false);
  }
  if ($(".clean").length < (canvasHeight.val()*canvasWidth.val())) {
    saveCanvas.attr('disabled', false);
    saveCanvas.attr('title', "Save canvas");
  } else {
    saveCanvas.attr('disabled', true);
    saveCanvas.attr('title', "Can't save empty canvas");
  }
}

// Undo move
const undoPreviousMove = () => {
  nextMove = previousMoves.pop();
  if (nextMove) {
    if (nextMove.isEraser || nextMove.isClearCanvas) {
      nextMove.move.forEach(function(cp) {
        let pixel = $(cp.selector);
        if (cp.wasClean) {
          pixel.addClass("clean");
          pixel.css('background-color', "rgba(0,0,0,0)");
        } else {
          pixel.removeClass("clean");
          pixel.css('background-color', cp.previousVal);
        }
      });
    } else {
      nextMove.move.forEach(function(cp) {
        let pixel = $(cp.selector);
        if (cp.wasClean) {
          pixel.addClass("clean");
          pixel.css('background-color', cp.previousVal);
        } else
          pixel.css('background-color', cp.previousVal);
      });
    }
    nextMove.isUndone = true;
    nextMoves.push(nextMove);
    nextMove = [];

    if (previousMoves.length == 0) {
      undoBtn.attr("disabled", true);
    }
    if (nextMoves.length > 0) {
      redoBtn.attr("disabled", false);
    }

    if ($(".clean").length < (canvasHeight.val()*canvasWidth.val())) {
      saveCanvas.attr('disabled', false);
      saveCanvas.attr('title', "Save canvas");
    } else {
      saveCanvas.attr('disabled', true);
      saveCanvas.attr('title', "Can't save empty canvas");
    }
  }

}

// Redo move
const redoNextMove = () => {
  previousMove = nextMoves.pop();
  if (previousMove) {
    if (previousMove.isEraser || previousMove.isClearCanvas) {
      previousMove.move.forEach(function(cp) {
        let pixel = $(cp.selector);
        pixel.addClass("clean");
        pixel.css('background-color', "rgba(0,0,0,0)");
      });
    } else {
      previousMove.move.forEach(function(cp) {
        let pixel = $(cp.selector);
        if (previousMove.isUndone && cp.wasClean) {
          pixel.removeClass("clean");
        }
        pixel.css('background-color', previousMove.color);
      });
    }
    previousMove.isUndone = false;
    previousMoves.push(previousMove);
    previousMove = [];

    if (previousMoves.length > 0) {
      undoBtn.attr("disabled", false);
    }
    if (nextMoves.length == 0) {
      redoBtn.attr("disabled", true);
    }

    if ($(".clean").length < (canvasHeight.val()*canvasWidth.val())) {
      saveCanvas.attr('disabled', false);
      saveCanvas.attr('title', "Save canvas");
    } else {
      saveCanvas.attr('disabled', true);
      saveCanvas.attr('title', "Can't save empty canvas");
    }
  }
}

undoBtn.on("click", function(e){
  undoPreviousMove()
});
redoBtn.on("click", function(e){
  redoNextMove()
});


// Turn off eraser tool
const turOffEraser = () => {
  clearPixelsActive = false;
  clearPixelBtn.removeClass('active');
}

// Turn off fill tool
const turnOffFill = () => {
  isFillCanvas = false;
  fillCanvasBtn.removeClass('active');
}
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

const colorMulti = (evt, isTouch) => {
  let prevRow, crntRow, prevTd, previousColor, hasClean, hasMove;
  // If clearPixel button is active, set color to white
  // else set color to colorpicker color
  const colorValue = clearPixelsActive ? 'rgba(0, 0, 0, 0)' : colorPicker.val();
  const radius = $("#inputSize").val();
  // color rows within radius
  for (let i = 0; i < radius; i++) {
    // color first row
    if (i == 0) {
      if (isTouch) {
        let target = document.elementFromPoint(evt.originalEvent.changedTouches[0].clientX, evt.originalEvent.changedTouches[0].clientY);
        prevRow = $(target).parent();
        prevTd = $($(target).parent().children('#'+target.id)[0]);
      } else {
        prevRow = $(evt.target).parent();
        prevTd = $($(evt.target).parent().children('#'+evt.target.id)[0]);
      }
      previousColor = prevTd.css('background-color');
      hasClean =  prevTd.hasClass("clean");
      hasMove = previousMove.filter(function(m) {
        return m.selector == "#"+ prevTd.parent().attr("id")+ " #"+prevTd.attr("id");
      });
      if (hasMove.length == 0)
        previousMove.push({selector: "#"+ prevTd.parent().attr("id")+ " #"+prevTd.attr("id"), previousVal: previousColor, wasClean: hasClean});


      if (clearPixelsActive)
        prevTd.addClass("clean");
      else
        prevTd.removeClass("clean");

      prevTd.css('background-color', colorValue);
      // color each pixel in row
      for (let j = 0; j < radius-1; j++) {
        previousColor = prevTd.next().css('background-color');
        hasClean =  prevTd.next().hasClass("clean");
        hasMove = previousMove.filter(function(m) {
          return m.selector == "#"+ prevTd.parent().attr("id")+ " #"+prevTd.next().attr("id");
        });
        if (hasMove.length == 0)
          previousMove.push({selector: "#"+ prevTd.parent().attr("id")+ " #"+prevTd.next().attr("id"), previousVal: previousColor, wasClean: hasClean});

        if (clearPixelsActive)
          prevTd.next().addClass("clean");
        else
          prevTd.next().removeClass("clean");
        prevTd.next().css('background-color', colorValue);
        prevTd = prevTd.next();
      }
    } else {
      // color the next rows
      if (isTouch) {
        let target = document.elementFromPoint(evt.originalEvent.changedTouches[0].clientX, evt.originalEvent.changedTouches[0].clientY);
        crntRow = prevRow.next();
        prevTd = crntRow.children('#'+target.id)
      } else {
        crntRow = prevRow.next();
        prevTd = crntRow.children('#'+evt.target.id)
      }
      previousColor = prevTd.css('background-color');
      hasClean =  prevTd.hasClass("clean");

      hasMove = previousMove.filter(function(m) {
        return m.selector == "#"+ prevTd.parent().attr("id")+ " #"+prevTd.attr("id");
      });
      if (hasMove.length == 0)
        previousMove.push({selector: "#"+ prevTd.parent().attr("id")+ " #"+prevTd.attr("id"), previousVal: previousColor, wasClean: hasClean});

      if (clearPixelsActive)
        prevTd.addClass("clean");
      else
        prevTd.removeClass("clean");
      prevTd.css('background-color', colorValue);
      // color each pixel in row
      for (let j = 0; j < radius-1; j++) {
        previousColor = prevTd.next().css('background-color');
        hasClean =  prevTd.next().hasClass("clean");
        hasMove = previousMove.filter(function(m) {
          return m.selector == "#"+ prevTd.parent().attr("id")+ " #"+prevTd.next().attr("id");
        });
        if (hasMove.length == 0) {
          previousMove.push({selector: "#"+ prevTd.parent().attr("id")+ " #"+prevTd.next().attr("id"), previousVal: previousColor, wasClean: hasClean});
        }

        if (clearPixelsActive)
          prevTd.next().addClass("clean");
        else
          prevTd.next().removeClass("clean");
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

  nextMoves = [];
  nextMove = [];
  previousMoves = [];
  previousMove = [];

  // enable clear buttons
  clearCanvasBtn.attr('disabled', false);
  fillCanvasBtn.attr('disabled', false);
  clearPixelBtn.attr('disabled', false);
  colorPicker.attr('disabled', false);
  inputSize.attr('disabled', false);
  saveCanvas.attr('disabled', true);
  undoBtn.attr('disabled', true);
  redoBtn.attr('disabled', true);
  // foreach row add append table row
  // append table cells
  for (let i = 0; i < height; i++) {
    canvas.append('<tr id="tr'+i+'"></tr>');
    for (let j = 0; j < width; j++) {
      $('#tr'+i).append('<td id = "td'+j+'" class="clean"></td>');
    }
  }
  // adjust pixel height = pixel width
  const cw = $('td').parent().width()/width;
  $('td').css('width', pixelSize+'px')
  $('td').css('min-width', pixelSize+'px')
  $('td').css('height', pixelSize+'px')
  $('tr').css({'height': pixelSize+'px'});
};

makeGrid(100, 100);

const clearCanvas = () => {
  if (confirm('Are you sure you want to clear the canvas?')) {
    turnOffFill();
    turOffEraser();
    isClearCanvas = true;
    cells = $("tr td")
    for (var i = 0; i < cells.length; i++) {
      let cell = $(cells[i])
      let previousColor = cell.css("background-color");
      let hasClean = cell.hasClass("clean");
      previousMove.push({selector: "#"+ cell.parent().attr("id")+ " #"+cell.attr("id"), previousVal: previousColor, wasClean: hasClean});
    }
    savePreviousMove()


    $('td').css('background-color', 'rgba(0, 0, 0, 0)');
    $('td').addClass("clean");
    if ($(".clean").length < (canvasHeight.val()*canvasWidth.val())) {
      saveCanvas.attr('disabled', false);
      saveCanvas.attr('title', "Save canvas");
    } else {
      saveCanvas.attr('disabled', true);
      saveCanvas.attr('title', "Can't save empty canvas");
    }
  }
};

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
// $(window).on('resize', () => {
//     const cw = $('td').parent().width()/canvasWidth.val();
//     $('tr').css({'height':cw+'px'});
// });

// Change color of the pixel on click
canvas.on('click', 'td', (evt) => {
  if (isFillCanvas){
    cells = $("tr td")
    for (var i = 0; i < cells.length; i++) {
      let cell = $(cells[i])
      let previousColor = cell.css("background-color");
      let hasClean = cell.hasClass("clean");
      previousMove.push({selector: "#"+ cell.parent().attr("id")+ " #"+cell.attr("id"), previousVal: previousColor, wasClean: hasClean});
    }
    savePreviousMove()
    $('td').removeClass("clean");
    $('td').css('background-color', colorPicker.val());
    if ($(".clean").length < (canvasHeight.val()*canvasWidth.val())) {
      saveCanvas.attr('disabled', false);
      saveCanvas.attr('title', "Save canvas");
    } else {
      saveCanvas.attr('disabled', true);
      saveCanvas.attr('title', "Can't save empty canvas");
    }
  }
  // else
  //   colorMulti(evt);
  return false;
});

canvas.on('touchstart', 'td', (evt) => {
  if (evt.touches.length == 1){
    console.log(evt);
    if (!isFillCanvas){
      colorMulti(evt);
    }
    // set isDragging flag to true
    isDragging = true;
    if (firstRun) {
      firstRun = false
    }
    return false;
  }
  alert("toucheen")
});

canvas.on('touchmove', (evt) => {

  console.log(evt.touches);
  if (evt.touches.length == 1){
    // only if dragging
    if (isDragging) {
      colorMulti(evt, true);
    }
    return false;
  }
  alert("toucheen")
});
canvas.on('touchend', () => {
  if (!isFillCanvas){
    savePreviousMove();
  }
  isDragging = false;
});

canvas.on('dragstart', function (e) {
  return false;
});
canvas.on('dragstart', 'td', function (e) {
  return false;
});
// additional functionality color pixels on dragging

canvas.on('mousedown', 'td', (evt) => {
  if (!isFillCanvas){
    colorMulti(evt);
  }
  // set isDragging flag to true
  isDragging = true;
  if (firstRun) {
    firstRun = false
  }
  return false;
});
canvas.contextmenu((evt)=>{evt.preventDefault()})
// Set color On entering a new pixel.
canvas.on('mouseenter', 'td', (evt) => {
  // only if dragging
  if (isDragging) {
    colorMulti(evt);
  }
});
canvas.on('mouseup', () => {
  if (!isFillCanvas){
    savePreviousMove();
  }
});
// unset is dragging on mouse up
$(window).on('mouseup', () => {
    isDragging = false;
});

// unset is dragging if mouse leaves canvas
// canvas.on('mouseleave', () => {
//     isDragging = false;
// });

// On color change add previous color to history palette
colorPicker.on('change', (evt) => {

  turOffEraser();

  if (evt.which == 13 && ((colorval.indexOf("#") >-1 && colorval.length >= 4) || (colorval.indexOf("#") == -1 && colorval.length >= 3))) {
    if (recentColors.children().length < 10) {
      recentColors.append('<div style="background-color:'+evt.target.value+'"></div>');
    } else {
      // if color palette is already full, remove first element to insert a new one
      recentColors.children().first().remove();
      recentColors.append('<div style="background-color:'+evt.target.value+'"></div>');
    }
  }
});

colorPicker.on('focus', (evt) => {
  colorPicker.select();
});

// on clicking color palette set selected color to clicked color
recentColors.on('click','div', (evt) => {
  // convert rgb to hex to be able assign value to color picker
  turOffEraser();
  colorPicker.val(rgbToHex($(evt.target).css('backgroundColor')));
  hexToRgb(rgbToHex($(evt.target).css('backgroundColor')));
});

// Additional functionality fill all canvas
clearCanvasBtn.on('click', () => {
  clearCanvas();
});

// Additional functionality clear pixels
clearPixelBtn.on('click', () => {
  clearPixelsActive = !clearPixelsActive;
  clearPixelBtn.toggleClass('active');
  turnOffFill();
});

// Additional functionality fill all canvas
fillCanvasBtn.on('click', () => {
  isFillCanvas = !isFillCanvas;
  fillCanvasBtn.toggleClass('active');
  turOffEraser();
});

//==============================================================================
// SAVE CANVAS FUNCTIONALITY

const downloadImage = (evt) => {
  var fileName = "Pixel Art Image";
  var userInput = prompt("Please enter file name", "Pixel Art Image");

  if (userInput != null) {
    if (userInput.length > 0) {
      fileName = userInput;
    }

    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    var height = canvas.height()
    var width = canvas.width()
    // var html = canvas.html();

    var cloneCanvas = canvas.clone();
    cloneCanvas.find("td").css("border", "solid 1px #fff4");
    cloneCanvas.find("td.clean").css("background-color", "rgba(0,0,0,0)");

    var data = '<svg xmlns="http://www.w3.org/2000/svg" width="'+ width +'" height="'+ height +'">' +
               '<foreignObject width="100%" height="100%">' +
               '<div xmlns="http://www.w3.org/1999/xhtml" width="100%" height="100%">'+
               '<table style="border-spacing: 0; border-collapse: collapse; width:100%;height:100%">'+
                cloneCanvas.html() +
                '</table>' +
                '</div>'+
               '</foreignObject>' +
               '</svg>';

    var DOMURL = window.URL || window.webkitURL || window;
    var img = new Image();
    var svg = new Blob([data], {type: 'image/svg+xml'});
    var url = DOMURL.createObjectURL(svg);

    img.onload = function() {
      a.href = url;
      a.download = fileName + ".svg";
      a.click();
      DOMURL.revokeObjectURL(url);
    }
    img.src = url;
  }
};

saveCanvas.on("click", downloadImage);

// =============================================================================
// ZOOM IN AND OUT
zoomIn.on('click', function(e){
  zoomInput.val((parseInt(zoomInput.val()))+10);
  let newSize = Math.floor(pixelSize * zoomInput.val() / 100);

  $('td').css('width', newSize + 'px');
  $('td').css('min-width', newSize + 'px');
  $('td').css('height', newSize + 'px');
  $('tr').css({'height': newSize + 'px'});
});

zoomOut.on('click', function(e){
  if (zoomInput.val() > 10) {
    zoomInput.val((parseInt(zoomInput.val()))-10);
    let newSize = Math.floor(pixelSize * zoomInput.val() / 100);

    $('tr').css('height', newSize + 'px');
    $('td').css('width', newSize + 'px');
    $('td').css('min-width', newSize + 'px');
    $('td').css('height', newSize + 'px');
  }
});

zoomInput.on('change', function(e){
  let newSize = Math.floor(pixelSize * zoomInput.val() / 100);

  $('tr').css('height', newSize + 'px');
  $('td').css('width', newSize + 'px');
  $('td').css('min-width', newSize + 'px');
  $('td').css('height', newSize + 'px');
});

//==============================================================================
// KEYBOARD SHORTCUTS

// define a handler
$(window).keydown(function(e) {
  // console.log(e.keyCode);

  // save ctrl+s
  if (e.ctrlKey && e.keyCode == 83) {
    e.preventDefault();
    downloadImage();
  }
  // clear ctrl+u
  if (e.ctrlKey && e.keyCode == 85) {
    e.preventDefault();
    clearCanvas();
  }
  // erase ctrl+e
  if (e.ctrlKey && e.keyCode == 66) {
    e.preventDefault();
    isFillCanvas = !isFillCanvas;
    fillCanvasBtn.toggleClass('active');
    turOffEraser();
  }
  // fill ctrl+b
  if (e.ctrlKey && e.keyCode == 69) {
    e.preventDefault();
    clearPixelsActive = !clearPixelsActive;
    clearPixelBtn.toggleClass('active');
    turnOffFill();
  }
  //  brush size up
  if (e.ctrlKey && e.keyCode == 38) {
    e.preventDefault();
    inputSize.val(parseInt(inputSize.val()) + 1)
  }
  // brush size down
  if (e.ctrlKey && e.keyCode == 40) {
    e.preventDefault();
    inputSize.val(parseInt(inputSize.val()) - 1)
  }
  // redo
  if (e.ctrlKey && e.keyCode == 89) {
    e.preventDefault();
    redoNextMove()
  }
  // undo
  if (e.ctrlKey && e.keyCode == 90) {
    e.preventDefault();
    undoPreviousMove()
  }
});
