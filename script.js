let facebookToken;
$(document).ready(function() {
  var $window = $(window);

  //Functions to show & hide controls
  function checkWidth() {
    var windowWidthSize = $window.width();
    var windowHeightSize = $window.height();

    if (windowWidthSize < 480) {
      $(".nav-head").removeClass("flex-column");
      $(".nav-head").addClass("nav-justified");
      $(".navbar").removeClass("sticky-top");
    } else {
      $(".nav-head").addClass("flex-column");
      $(".nav-head").removeClass("nav-justified");
      $(".navbar").addClass("sticky-top");
    }
  }

  checkWidth();
  $(window).resize(checkWidth);

  // USER INTERFACE EVENTS
  function userPressesEnterKey(e) {
    // When user presses enter key in search textbox
    if (e.which == 13) {
      // Click the search button
      $("#searchButton").click();
      return false;
    }
  }

  function userClicksSearchButton() {
    facebookToken = $('input[name="fbtoken"]').val();
    if (facebookToken == null || facebookToken == "") {
      alert("No Token found");
    } else {
      getDetails();
    }
  }

  $("#searchButton").click(userClicksSearchButton);
  $('input[name="fbtoken').keypress(userPressesEnterKey);
});

let getDetails = () => {
  // API call to get user details
  $.ajax({
    type: "GET",
    dataType: "json",
    async: true,
    url:
      "https://graph.facebook.com/me?fields=id,name,picture.type(large),cover,quotes,education,relationship_status,email,gender,birthday,posts&access_token=" +
      facebookToken,

    success: response => {
      $("#profile, #post").css("display", "block");
      console.log(response);

      $("#myName").text(response.name);
      $("#profileId").html(
        '<a target="blank" href="https://facebook.com/' +
          response.id +
          '">https://facebook.com/' +
          response.id +
          "</a>"
      );
      jQuery.each(response.education, function(i, val) {
        $("#educationList").append("<li>" + val.school.name + "</li>");
      });
      $("#email").text(response.email);
      $("#myStatus").text(response.relationship_status);
      $("#dob").text(response.birthday);
      $("#gender").text(response.gender);
      $("#about").text(response.about);
      $("#quotes").text(response.quotes);

      $("#profilePhoto").html(
        '<img src="' +
          response.picture.data.url +
          '" class="img-fluid profileHeight"/>'
      );
      $("#cover").css("background-image", "url(" + response.cover.source + ")");
      //Posts
      $.each(response.posts.data, function(i, post) {
        var j = i + 1;
        if (post.message) {
          $("#posts").append('<div class="card"><div class="card-body"><h4 class="card-title">Post ' + j + '</h4><h6 class="card-subtitle mb-2 text-muted">Created Time : ' + post.created_time + '</h6><p class="card-text">Message : ' + post.message + '</p><a href="#" class="card-link">Post ID : ' + post.id + "</a></div></div>");
        } else {
          $("#posts").append('<div class="card" ><div class="card-body"><h4 class="card-title">Post ' + j + '</h4><h6 class="card-subtitle mb-2 text-muted">Created Time : ' + post.created_time + '</h6><p class="card-text">Story : ' + post.story + '</p><a href="#" class="card-link">Post ID : ' + post.id + "</a></div></div>");
        }
      });
    },
    timeout: 10000,
    error: err => {
      console.log(err.responseJSON.error.message);
      alert(err.responseJSON.error.message);
    }
  }); // end ajax call
};
