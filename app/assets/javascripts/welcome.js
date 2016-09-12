$(document).ready(function() {
  var BASEURL = 'http://devpoint-ajax-example-server.herokuapp.com/api/v1';

  function loadUsers() {
    $('#users').empty();
    $.ajax({
      url: BASEURL + '/users',
      type: 'GET',
      dataType: 'JSON'
    }).done(function(data){
      data.forEach(function(user){
				$('#users').prepend(
					             '<li data-user-id="' + user.id + '">' + user.first_name + " " + user.last_name + " - " +
					               '<button class="delete_user">Delete User</button> \
					                <button class="edit_button">Edit User</button> \
					              </li>');
			});
    }).fail(function(data){
      console.log(data);
    });
  }

  $('#load_users').click(function() {
    	loadUsers();
    });

  $(document).on('click', '.delete_user', function() {
    var userId = $(this).parent().data('user-id');
    $.ajax({
      url: BASEURL + '/users/' + userId,
      type: 'DELETE',
      dataType: 'JSON',
    }).done(function(data){
      alert("User Deleted!");
      loadUsers();
    }).fail(function(data){
      console.log(data);
    })
  });

  $('#show_create').click(function() {
  	var $newUserContent = $('#new_user_content');
  	$newUserContent.slideToggle(400, function(){
  		var $createButton = $('#show_create');
  		if($newUserContent.is(':hidden')) {
  			$createButton.text('Create New User');
  		} else {
  			$createButton.text('Hide Create User');
  		}
  	});
  });

  $('#new_user').submit(function(e) {
    e.preventDefault();
    var $userFirstName = $('#user_first_name');
    var $userLastName = $('#user_last_name');
    var $userPhoneNumber = $('#user_phone_number');

    $.ajax({
      url: BASEURL + $(this).attr('action'),
      type:$(this).attr('method'),
      dataType: 'JSON',
      data: {user: {first_name: $userFirstName.val(),
                    last_name: $userLastName.val(),
                    phone_number: $userPhoneNumber.val()}}
    }).done(function(data) {
      alert("User Created Successfully!");
      $userFirstName.val('');
      $userLastName.val('');
      $userPhoneNumber.val('');
      $userFirstName.focus();
      loadUsers();

    }).fail(function(data) {
      console.log(data);
    });
  });

  $(document).on('click', '.edit_button', function() {
		var userId = $(this).parent().data('user-id');
		$.ajax({
			url: BASEURL + '/users/' + userId,
			type: 'GET',
			dataType: 'JSON'
		}).done(function(data) {
			var first_name = data.first_name;
			var last_name = data.last_name;
			var phone_number = data.phone_number;
			$('#edit_first_name').val(first_name);
			$('#edit_last_name').val(last_name);
			$('#edit_phone_number').val(phone_number);
			$('#user_id').val(userId);
			$('#edit_content').slideDown();
		}).fail(function(data) {
			console.log(data);
		});
		// make ajax call to get the specific courses info
		// fill in hidden form input values
		// show the form
	});

	$('#edit_user_content').submit(function(e) {
		e.preventDefault();
		var form = this;
		var userId = $('#user_id').val();
		$.ajax({
			url: BASEURL + '/users/' + userId,
			type: 'PUT',
			dataType: 'JSON',
			data: $(this).serializeArray()
		}).done(function(data) {
			form.reset();
			// this is the shorthand way to reset the form, rather than above .val way
			$('#edit_content').slideUp();
			loadUsers();
		}).fail(function(data) {
			console.log(data);
		});
	});
});
