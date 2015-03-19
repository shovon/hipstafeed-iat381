$(function () {

  var clientID = 'adb0c81ce1f44a2f9608d47937504183';
  var redirect = 'http://localhost:3030';

  var $content = $('#content');

  getState()
    .then(function (status) {
      if (!status.loggedIn) {
        loggedOffMessage();
      } else {
        status.feed.data.forEach(function (image) {
          var img = new Image();
          img.src = image.images.standard_resolution.url;
          $content.append($(img));
        });
      }
    });

  /**
   * This is where the magic with Instagram happens, folks!
   * 
   * Determines whether or not the user is logged in. If the user is logged in,
   * get the user's feed.
   *
   * returns Promise that will represents whether or not the user is logged in.
   */
  function getState() {
    var token = window.location.hash.split('=')[1];
    if (token) {
      return new Promise(function (resolve, reject) {
        JSONP('https://api.instagram.com/v1/users/self/feed', {access_token: token}, function (json) {
          // TODO: not all responses are successful.
          resolve({
            loggedIn: true,
            feed: json
          });
        });
      });
    }
    return Promise.resolve({ loggedIn: false });
  }

  /**
   * Displays the screen when the user is logged off. Do whatever you want here.
   */
  function loggedOffMessage() {
    var $innerContent = $(document.createElement('div'));
    $innerContent.addClass('log-in');

    var $link = $(document.createElement('a'));
    $link.text('Log in');

    // You have to enable implicit OAuth!
    $link.attr('href', 'https://api.instagram.com/oauth/authorize/?client_id=' + clientID + '&redirect_uri=' + redirect + '&response_type=token');
    $innerContent.append($link)

    var $message = $(document.createElement('aside'));
    $message.text('Made with ♥ by Salehen Shovon Rahman');

    $content.append($innerContent);
    $content.append($message);
  }
});