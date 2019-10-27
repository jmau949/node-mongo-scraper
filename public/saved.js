$.getJSON("/saved", function(data) {
  for (let i = 0; i < data.length; i++) {
  $("#posts").append(
      "<div class='col-sm-4' style='margin-bottom:60px;'><div class='card'><div class='card-body'><h5>" + data[i].title + "</h5></a><hr><p class='card-text'>" + data[i].link + "</p><button data-id='" + data[i]._id + "' class='btn-note btn btn-outline-primary btn-sm' data-toggle='modal' data-target='#myModal' style='margin-right:10px;'>Note</button><button id='btn-delete' data-id='" + data[i]._id + "' class='btn btn-outline-danger btn-sm'>Delete</button></div></div></div>"
    );
}
});

$(document).on("click", ".btn-note", function() {
  $(".modal-title").empty();
  $(".input").empty();
  let thisId = $(this).attr("data-id");

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
      body: $("#bodyinput").val()
    }
  })
  
    .done(function(data) {
      console.log(data)
    });
  $("#bodyinput").val("");
});


$(document).on("click", "#btn-delete", function() {
  
  let thisId = $(this).attr("data-id");
  console.log(thisId);

  $.ajax({
    method: "PUT",
    url: "/delete/" + thisId,
   
  })
  
  .done(function(data) {
      console.log(data);
      location.reload();
  });
});
