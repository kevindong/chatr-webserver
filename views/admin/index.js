function buttonClick(type, url, data) {
    $.ajax({
        type: type,
        url: url,
        data: data,
        success: function () {
            location.reload();
        }
    });
};