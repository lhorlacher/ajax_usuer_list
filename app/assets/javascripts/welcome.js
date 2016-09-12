$(document).ready(function(){
	var BASEURL = 'http://devpoint-ajax-example-server.herokuapp.com/api/v1/users'
	loadUsers()

	function loadUsers() {
		$('#users').empty()
		$.ajax({
			url: BASEURL,
			type: 'GET',
			dataType: 'JSON'
		}).done(function(data) {
			data.forEach(function(user) {
				$('#users').prepend(('<li data-user-id="' + user.id + '">' + 
					user.first_name + ' ' + user.last_name + editButton(user.id) + 
					deleteButton(user.id)));
			});
		}).fail(function() {
		});
	}

	function deleteButton() {
		return '<button class="delete_user">Delete</button>'
	}

	function editButton() {
		return '<button class="edit_user">Edit</button>'
	}

	$(document).on('click', '.delete_user', function() {
		var userId = $(this).parent().data('user-id');
		console.log(userId)
		$.ajax({
			url:BASEURL + '/' + userId,
			type: 'DELETE',
			dataType: 'JSON'
		}).done(function(data) {
			loadUsers()
		}).fail(function() {
			loadUsers()
		})
	})

	$(document).on('click', '.edit_user', function() {
		console.log('click')
		var userId = $(this).parent().data('user-id');
		$.ajax({
			url: BASEURL + '/' + userId,
			type: 'GET',
			dataType: 'JSON'
		}).done(function(user) {
			var firstName = user.first_name
			var lastName = user.last_name
			var phoneNumber = user.phone_number
			$('#edit_first_name').val(firstName);
			$('#edit_last_name').val(lastName);
			$('#edit_phone_number').val(phoneNumber);
			$('#user_id').val(userId);
			$('#edit_form_div').slideDown();
		}).fail(function(user) {
			console.log(user)
		});
	})

	$('#edit_form').submit(function(e) {
		e.preventDefault()
		console.log($(this))
		var form = this;
		var userId = $('#user_id').val()
		$.ajax({
			url: BASEURL + '/' + userId,
			type: 'PUT',
			dataType: 'JSON',
			data: $(this).serializeArray()
		}).done(function(data) {
			console.log(this)
			form.reset()
			loadUsers()
			$('#edit_form_div').slideUp()
		}).fail(function(data) {
			console.log('fail')
		})
	});

	$('#view_form').click(function() {
		var $viewForm = $('#view_form')
		var $form = $('#form_div')
		$form.slideToggle(function() {
			if($form.is(':hidden')) {
				$viewForm.text('Create User')
			}else{
				$viewForm.text('Hide Form')
			}
		});
	});

	$('#form').submit(function(e) {
		e.preventDefault();
		var $userFirstName = $('#user_first_name');
		var $userLastName = $('#user_last_name');
		var $userPhoneNumber = $('#user_phone_number');
		$.ajax({
			url: BASEURL,
			type: $(this).attr('method'),
			dataType: 'JSON',
			data: {user: {first_name: $userFirstName.val(),
							last_name: $userLastName.val(),
							phone_number: $userPhoneNumber.val()}}
		}).done(function(data) {
			$userFirstName.val('');
			$userLastName.val('');
			$userPhoneNumber.val('');
			$userFirstName.focus()
			console.log('user create')
			loadUsers();
		}).fail(function(data) {
			console.log('create failed')
		})
	})

});
