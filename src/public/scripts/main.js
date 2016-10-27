(function($){

  var $list = $('.list');
  var $inputField = $('#item-form__content');
  var list__item__SOURCE = $('#template__list-item').html();

  // List coming from server on initial page load
  var startList = window.LIST;

  startList.map(function (item) {
    addItemToList(item);
    return item;
  });


  $('.item-form__cancel').on('click', resetForm);

  $('#item-form').submit(function(e) {
    e.preventDefault();

    if ($(this).attr('type') === 'add') {
      var $newContent = $inputField;
      var newContent = $newContent.val();

      if ($newContent.val() !== '') {  
        addItem($newContent.val());
      }
    }

    if ($(this).attr('type') === 'edit') {
      var updatedContent = $inputField.val();
      var targetId = $(this).attr('target-item-id');

      var updatedItem = {
        content: updatedContent,
        id: targetId
      }
      
      editItemAjax(updatedItem, function(response) {
        if (response.success) {
          updateItemView(response.item);
        }

        resetForm();
      });
    }
  });


  function resetForm() {
    $form = $('#item-form');

    $form.attr('type', 'add'); // default should be add item
    $form.attr('target-item-id', ''); // no default target
    $inputField.val(''); // reset input field
  }
  /*
    Adding an item 
    - Called in form submission
    - Sends content to server 
  */
  function addItem(newContent, cb) {
    $.post('http://localhost:8000/api/items/add/', { content: newContent }, function(response) {
      if (response.success) {

        addItemToList(response.item);
        resetForm();
      } 
    });
  }
  function addItemToList(item) {
    var template = Handlebars.compile(list__item__SOURCE);
    
    item.isComplete = convertToBool(item.isComplete);

    var newItem = template(item);

    let newItemNode = $list.append(newItem) // add item to list
      .find('#list__item-' + item.id) // find the dom node

      addListeners(newItemNode);
  }

  function deleteItem() {
    var id = $(this).parent().attr('data-id');
    if (confirm('Are you sure you want to delete?')) {
      deleteItemAjax(id, function(response) {
        if (response.success) {
          $('#list__item-' + id).remove();
        }
      });
    }
  }

  function deleteItemAjax(id, cb) {
    $.ajax({
      url: 'http://localhost:8000/api/items/delete/' + id,
      type: 'DELETE',
      success: function(response) {
        cb(response);
      }
    });
  }

  function addListeners ($item) {
    $item.find('.settings-widget__delete').on('click', deleteItem); // add on delete click event
    $item.find('input[type="checkbox"]').on('click', updateIsComplete);
    $item.find('.settings-widget__edit').on('click', editContent);
  }

  function updateIsComplete() {
    // this is going to determine the status of the check
    // send the update to the server
    // then update the view once the server has been updated
    var isChecked = $(this).prop('checked');
    var itemId = $(this).attr('item-id')

    var item = {
      id: itemId,
      isComplete: isChecked
    };
    editItemAjax(item, function(response){
      if(response.success) {
        updateItemView(response.item);
      }
    });
  }

  function updateItemView (updatedItem) {
    var $item = $('#list__item-' + updatedItem.id);
    var template = Handlebars.compile(list__item__SOURCE);
    updatedItem.isComplete = convertToBool(updatedItem.isComplete);

    $item.replaceWith(template(updatedItem));
    
    addListeners($('#list__item-' + updatedItem.id));
  }

  function editItemAjax(item, cb) {
    $.ajax({
      url: 'http://localhost:8000/api/items/update/' + item.id,
      type: 'PUT',
      data: item,
      success: function(response) {
        cb(response);
      }
    })
  }

  function editContent() {
    var id = $(this).parent().attr('data-id');
    var content = $('#list__item-' + id).find('.list__item__content').text().trim();

    // set the form to edit mode
    $('#item-form').attr('type', 'edit');
    $('#item-form').attr('target-item-id', id);
    $inputField.val(content);
    
  }

  function convertToBool(potentialString) {
    // convert string to boolean
    return (typeof potentialString === "string" && potentialString.toLowerCase() === "true") ? true : false;
  }
  


}(jQuery));