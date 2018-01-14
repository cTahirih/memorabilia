// obtiene imagen y username
var userName = $('#user-name');
var userImg = $('#user-photo');
var userNameProfile = $('#user-name-profile');
var database = firebase.database();
var userConect = null;

function redirectLogin() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      initFirebase();
    } else {
      window.location.href = '../views/login.html';
    }
  });
}

function initFirebase() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var displayName = user.displayName;
      var userPhoto = user.photoURL;
      var pName = $('<p/>', {
        'class': 'user-name',
      });

      var profileName = $('<h3/>', {
        'class': 'user-name-profile',
      });

      pName.append(displayName);
      profileName.append(displayName);
      userName.append(pName);
      userNameProfile.append(profileName);

      if (userPhoto) {
        var imgU = $('<img>', {
          'class': 'responsive-img circle user',
          'src': userPhoto
        });
      } else {
        var imgU = $('<img>', {
          'class': 'responsive-img circle user',
          'src': '../assets/images/user_circle.png'
        });
      }

      userImg.append(imgU);
      userConect = database.ref('/user/' + user.uid);
      // console.log(userExist(user.uid));
      if (!userExist(user.uid)) {
        // conecto a la base de datos creo la referencia user y llamo a addUserDb
        addUserDb(user.uid, user.displayName, user.photoURL);
      }
    }
  });
}
// obtiene uid y name
function addUserDb(uid, name, photo) {
  var conect = userConect.set({
    uid: uid,
    name: name,
    photo: photo
  });
}

function userExist(uid) {
  var exist = false;
  firebase.database().ref('/user/' + uid).on('value', function(snapshot) {
    snapshot.forEach(function(elm) {
      var element = elm.val();
      // console.log(element);
      if (element.uid === uid) {
        exist = true;
      }
    });
  });
  return exist;
}

$(window).on('load', function() {
  redirectLogin();
});

$(document).ready(function() {
  // var nameUserChat = $('#name');
  var valTextChat = $('#cht_log_email');
  var btnSend = $('#btn-send');
  var contChat = $('#content-msg');
  var contState = $('#contain-val-text');
  // mandar información a firebase para el chat

  btnSend.on('click', function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {

        var name = user.displayName;
        var msg = valTextChat.val();

        firebase.database().ref('chat').push({
          name: name,
          message: msg
        });
      }
    });
  });

  // obtiene data de la base de datos

  firebase.database().ref('chat').on('value', function(snapshot) {
    contChat.html('');
    snapshot.forEach(function(elm) {
      var element = elm.val();
      var txtName = element.name;
      var txtMsg = element.message;
      var tName = $('<li/>', {
        'class': 'li',
      }).text(txtName + ': ' + txtMsg);

      contChat.append(tName);
      $('#cht_log_email').val('');
    });
  });

  // obtiene data para estados
  var valTextState = $('#textarea');
  $('#bt-send-text').on('click', function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var name2 = user.displayName;
        var state = valTextState.val();

        firebase.database().ref('state').push({
          user: name2,
          message: state
        });
      }
    });
  });

var newBox = $('#news-box');
  firebase.database().ref('state').on('value', function(snapshot) {
    newBox.html('');
    snapshot.forEach(function(elm) {
    valTextState.val('');
      var element = elm.val();
      var name2U = element.user;
      var states = element.message;
    
    var sUserCard = $('<div/>', {
        'class': 'post col s12',
      });

      var post = $('<p/>', {
        'class': 'li',
      }).text(name2U + ': ' + states);
      newBox.append(sUserCard);
      sUserCard.append(post);

    });
  });

 
  // cerrar sesión

  $('#sign-out').on('click', function() {
    firebase.auth().signOut();
  });
  // boton para estados, guarda en firebase

    $('#home').on('click', function() {
      window.location.href = '../index.html';
    });

    $('#profile').on('click', function() {
      window.location.href = 'views/perfil.html';
    });


  $(function() {
    $('.button-collapse').sideNav();
});

  $('.chips').material_chip();
  $('.chips-initial').material_chip({
    data: [{
      tag: 'Futbol',
    }, {
      tag: 'Anime',
    }, {
      tag: 'Monedas',
    }],
  });
  $('.chips-placeholder').material_chip({
    placeholder: 'Enter a tag',
    secondaryPlaceholder: '+Tag',
  });
  $('.chips-autocomplete').material_chip({
    autocompleteOptions: {
      data: {
        'Futbol': null,
        'Anime': null,
        'Monedas': null
      },
      limit: Infinity,
      minLength: 1
    }
  });
});
