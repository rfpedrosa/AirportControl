function hitRectangle(x, y, rectangle) {
    if( (rectangle.x <= x) && (x <= (rectangle.x + rectangle.width)) &&
        (rectangle.y <= y) && (y <= (rectangle.y + rectangle.height)) ) {

        //alert(x + "," + y + " is Inside Rectangle:" + rectangle.x + "," + rectangle.y + "," + (rectangle.x + rectangle.width) + "," + (rectangle.y + rectangle.height));
        return true;
    }

    //alert(x + "," + y + " is NOT Inside Rectangle:" + rectangle.x + "," + rectangle.y + "," + (rectangle.x + rectangle.width) + "," + (rectangle.y + rectangle.height));
    return false;
    
}

function drawArrowsAroundRectangle(graphics, rectangle, ignoreRight) {
    // left arrow
    graphics.moveTo(rectangle.x - 30,rectangle.y + rectangle.height / 2);
    graphics.lineTo(rectangle.x - 10,rectangle.y + rectangle.height / 2);
    graphics.lineTo(rectangle.x - 20,rectangle.y + 5);
    graphics.moveTo(rectangle.x - 10,rectangle.y + rectangle.height / 2);
    graphics.lineTo(rectangle.x - 20,rectangle.y + rectangle.height - 5);
    // right arrow
    if(! ignoreRight) {
        graphics.moveTo(rectangle.x + rectangle.width + 30,rectangle.y + rectangle.height / 2);
        graphics.lineTo(rectangle.x + rectangle.width + 10,rectangle.y + rectangle.height / 2);
        graphics.lineTo(rectangle.x + rectangle.width + 20,rectangle.y + 5);
        graphics.moveTo(rectangle.x + rectangle.width + 10,rectangle.y + rectangle.height / 2);
        graphics.lineTo(rectangle.x + rectangle.width + 20,rectangle.y + rectangle.height - 5);
    }
    // up arrow
    graphics.moveTo(rectangle.x + rectangle.width / 2,rectangle.y - 30);
    graphics.lineTo(rectangle.x + rectangle.width / 2,rectangle.y - 10);
    graphics.lineTo(rectangle.x + 5,rectangle.y - 20);
    graphics.moveTo(rectangle.x + rectangle.width / 2,rectangle.y - 10);
    graphics.lineTo(rectangle.x + rectangle.width - 5,rectangle.y - 20);
    // down arrow
    graphics.moveTo(rectangle.x + rectangle.width / 2,rectangle.y + rectangle.height + 30);
    graphics.lineTo(rectangle.x + rectangle.width / 2,rectangle.y + rectangle.height + 10);
    graphics.lineTo(rectangle.x + 5,rectangle.y + rectangle.height + 20);
    graphics.moveTo(rectangle.x + rectangle.width / 2,rectangle.y + rectangle.height + 10);
    graphics.lineTo(rectangle.x + rectangle.width - 5,rectangle.y + rectangle.height + 20);
    
}

function post_to_url(path, params, method) {
    method = method || "post"; // Set method to post by default, if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);

        form.appendChild(hiddenField);
    }

    document.body.appendChild(form);    // Not entirely sure if this is necessary
    form.submit();
}