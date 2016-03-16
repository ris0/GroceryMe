$(document).ready(function() {
    var listRef = new Firebase("https://torrid-heat-4913.firebaseio.com/");

    $('#add-new').on('submit', function (event) {
        event.preventDefault();
        if ($('#new-item').val() === "") return alert("No empty strings");
        listRef.push({
            name: $('#new-item').val(),
            complete: false
        })
    });

    // Firebase event child_added
    listRef.on("child_added", function(snapshot) {
        // Firebase snapshot object
        var item = snapshot.val();
        var key = snapshot.key();
        $('.items').append('<li id=' + key + '><input type="checkbox"><label>' + item.name + '</label></li>');
        $('#new-item').val('');
    });

    $('.items').on('change', 'input[type=checkbox]', function(e) {
        var key = $(this).parent().attr("id");

        var itemRef = listRef.child(key);
        // Built-in Firebase method .update, pass it an object
        // update() update(value, [onComplete])
        // write the enumerated children to this Firebase location. Passing null to update() will remove the value
        // at the specified location
        itemRef.update({
            complete: $(this).prop('checked')
        })
    });

    // Firebase event child_changed
    listRef.on("child_changed", function(snapshot) {
        var item = snapshot.val();
        var key = snapshot.key();
        $("#" + key).children('input[type=checkbox]').prop('checked', item.complete);
    });

    // Firebase once() method, once(eventType, successCb, [failureCb], [context])
    // Listens for exactly one event of the specified event type, and then stops listening.

    $('.remove-checked').on('click', function() {
        // Get all current items
        listRef.once('value', function(allItemsSnapshot){
            // Remove the item if it's complete
            allItemsSnapshot.forEach(function(itemSnapshot) {
                if(itemSnapshot.val().complete) {
                    var currentItem = itemSnapshot.key();
                    listRef.child(currentItem).remove();
                }
            });
        });
    });

    listRef.on("child_removed", function (snapshot) {
        var item = snapshot.val();
        var key = snapshot.key();

        $("#" + key).remove();

    })



});



