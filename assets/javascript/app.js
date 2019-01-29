var TOPICS = [
  "Fear",
  "Anger", 
  "Sadness", 
  "Joy",
  "Disgust",
  "Surprise", 
  "Admiration",
  "Anticipation",
  "Pride",
  "Shame"
];

var buttonCount = TOPICS.length;

var VIDEOS = [];
var STILLS = [];

// Giphy API key
const myKey = "yQG5TpI3mcYg4Jx0FJfxxya0MuGR9SzJ";

function renderButtons(){
  $(".buttons-view").empty();
  for(var i = 0; i < TOPICS.length; i++) {
    addButton(TOPICS[i]);
  }
}

function addButton(str) {
  var btn = $("<button>");
  // btn.addClass("species");
  btn.text(str);
  $(".buttons-view").append(btn);
}

function enableButtons() {
  $('button').click(function(){
    console.log(this.innerHTML);
  });
}

function createLoopElement(str) {
  return '<video autoplay loop width="400" height="300"><source src="' + str + '" type="video/mp4"/></video>';
  // Trying to give the images the same dimensions and placement when they swap out.
  // return '<video autoplay loop width="400" height="300" src="' + str + '" type="video/mp4">';
}

function createStillElement(str) {
  return '<div width="400" height="300"><img width="400" src="' + str + '"></div>';
  // Alternately: 
  // return '<img width="400" src="' + str + '">';  
}

var looping = false;

function createImageElement(jpg, gif) {
  if(!looping) {
    return '<div  width="400" height="300"><img src="' + jpg + '" alt="' + gif + '"></div>';
  } else {
    return '<video autoplay loop width="400"><source src="' + gif + '" alt="' + jpg + '" type="video/mp4"/></video>';
  }
}

function addImages(str) {
  for(var i = 0; i < 4; i++) {
    createImageElements(str);
  }
  for(var i = 0; i < IMAGES.length; i++) {
    $("#gif-image").append(IMAGES[i].still);
  }
}

function createImageElements(str) {
  var xhr = $.get(`https://api.giphy.com/v1/gifs/random?api_key=${myKey}&tag=${str.toLowerCase()}&limit=1`);
  xhr.done(function(data) { 

    var mp4 = data.data.images.looping.mp4;
    var videoElement = createLoopElement(mp4);

    var jpeg = data.data.images.original_still.url;
    var stillElement = createStillElement(jpeg);

    // These arrays store the animated and the still elements at the same index so you can switch between them
    VIDEOS.push(videoElement);
    STILLS.push(stillElement);
 
  });
}

function appendElement(str) {
  var xhr = $.get(`https://api.giphy.com/v1/gifs/random?api_key=${myKey}&tag=${str.toLowerCase()}&limit=1`);
  xhr.done(function(data) { 
    console.log(data.data.images.original_still.url); 
    var mp4 = data.data.images.looping.mp4;
    var videoElement = createLoopElement(mp4);

    var jpeg = data.data.images.original_still.url;
    var stillElement = createStillElement(jpeg);

    // Reset the arrays.
    // I won't need this when I get each button to generate 10 images
    STILLS = [];
    VIDEOS = [];

    STILLS.push(stillElement);
    VIDEOS.push(videoElement);

    // These will be different when I have it generate more than one image
    $("#gif-image").empty();
    $("#gif-image").append(STILLS[0]);

  });
}

function appendSeveralElements(str, num) {
  for(var i = 0; i < num; i++) {
    appendElement(str);
  }
}

$(document).ready(function(){
  renderButtons();

  // This is an alternative method for the click function
  // $('.clickable').bind('click', function(){
  //   alert("it works!");
  // });

  $(".clickable").click(function(){
    $(this).empty();
    if(looping) {
      $(this).prepend(STILLS[0]);
    } else {
      $(this).prepend(VIDEOS[0]);
    }
    // Toggle the looping Boolean
    looping = !looping;
  });
      /*

    // Here are some earlier things I tried for clicking the images:
    var original = this.innerHTML;
    var source = $(this.innerHTML).attr("src");
    var alternate = $(this.innerHTML).attr("alt");
    var modified = createImageElement(alternate, source);
    console.log("Original: " + original);
    console.log("Modified: " + modified);

    // appendElement(modifiedElement);
    // $(this).replaceWith(modified);
    // swapOut(this, modified);
    
    looping = !looping;
    // appendElement(modified);
    // $(this).replaceWith(modified);
    console.log("Looping? " + looping);
    console.log("Modified: " + modified);

    // It's too dynamic with "this" randomly updating changing the gif every time it is clicked.
    // The answer might be to create an array of 10 gifs when the keyword button is initially pressed.
    // Display these on the page as still images with unique identifiers.
    // Then the toggle functions swaps these out between the two alternatives (MP4-loop and JPG-static-image)
    // Get it to swap out the image/video at the same index.
    // How do you get the click function to identify the proper index?
  });
  */

  // $(".clickable").click(function(){
  // Can you use ajax here?
  //   // $.ajax({
  //   //   url: queryURL,
  //   //   method: "GET"
  //   // }).then(function(response) {
  //   //   console.log(response);
  //   // });
  // });

  $('button').click(function(){
    var emotion = this.innerHTML;
    createImageElements(emotion);
    appendElement(emotion);
    $("#image-header").text("Click on image to animate or freeze");
  });

  $("#add-emotion").on("click", function(event){
    event.preventDefault();
    var newCategory = $("#new-category").val().trim();
    TOPICS.push(newCategory);
    renderButtons();
    enableButtons();
    // appendElement(newCategory);
    // Clear textbox
    $("#new-category").val("");
  });

});

