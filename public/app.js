$.getJSON("/posts", function(data) {
  for (let i = 0; i < data.length; i++) {

     $("#posts").append(
      "<div class='col-sm-4' style='margin-bottom:60px;'><div class='card'><div class='card-body'><h5>" + data[i].title + "</h5></a><hr><p class='card-text'>" + data[i].link + "</p><button data-id='" + data[i]._id + "' class='btn-note btn btn-outline-primary btn-sm' data-toggle='modal' data-target='#myModal' style='margin-right:10px;'>Note</button><button id='btn-save' data-id='" + data[i]._id + "' class='btn btn-outline-primary btn-sm'>Save Post</button></div></div></div>"
    );
}
});


$(document).on("click", ".btn-fetch", function() {
  console.log('blah');
  alert('posts up-to-date!');
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    .done(function(data) {
      location.reload();
    });
});


$(document).on("click", ".btn-note", function() {
  
  $(".modal-title").empty();
  $(".input").empty();

  // Save the id from .btn-note
  let thisId = $(this).attr("data-id");
  console.log(thisId);

  $.ajax({
    method: "GET",
    url: "/posts/" + thisId
  })
    .done(function(data) {
      console.log(data);
      $(".modal-title").append("<h5>" + data.title + "</h5>");
      $(".input").append("<textarea id='bodyinput' name='body'></textarea>");
      $(".input").append("<button data-id='" + data._id + "' id='savenote' class='btn btn-primary btn-sm' style='margin-top:20px;'data-dismiss='modal'>Save Note</button>");
      if (data.note) {
        $("#bodyinput").val(data.note.body);
      }
    });
});



$(document).on("click", "#savenote", function() {
  let thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/posts/" + thisId,
    data: {
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    .done(function(data) {
    });

  $("#bodyinput").val("");
});

$(document).on("click", "#btn-save", function() {
  $(this).addClass("disabled");
  let thisId = $(this).attr("data-id");
  $.ajax({
    method: "PUT",
    url: "/saved/" + thisId,
  })
  .done(function(data) {
      console.log(data);
  });
});


