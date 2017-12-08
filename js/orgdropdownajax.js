$.ajax({
        type: "POST",
        url: "search_dropdown.php",
        data: "query="+request.term+"&page=personal_carrier",
        dataType: 'json',
        cache: false,
        success: function(data) {             
            response($.map(data, function(obj) {
                return {
                    id: obj.id,
                    label: obj.ICname,
                    address1: obj.address1,
                    address2: obj.address2,
                    city: obj.city,
                    state: obj.state,
                    zip: obj.zip
                };                              
            }));
        },
        error: function(error) {
            console.log('Error: '+error);
        }
    });