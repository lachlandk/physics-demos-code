let swapping = false;

(function($) {
    $.fn.extend({
        swap: function(values) {

            let defaults = {
                target: null,
                speed: 1000,

            };
            let parameters = $.extend(defaults, values);

            return this.each(function() {

                let selectedObject = $(this);

                if (parameters.target != null && !swapping) {

                    swapping = true;
                    let targetID = $("#"+parameters.target);

                    // set relative positioning
                    let selectedObjectPositionCSS = selectedObject.css("position");
                    let targetPositionCSS = targetID.css("position");
                    if (selectedObjectPositionCSS !== "absolute") {
                        selectedObject.css("position", "relative");
                    }
                    if (targetPositionCSS !== "absolute") {
                        targetID.css("position", "relative");
                    }

                    // calculate final position
                    let selectedObjectInitialPosition = selectedObject.offset();
                    let selectObjectInitialLeft = selectedObjectInitialPosition.left;
                    let targetInitialPosition = targetID.offset();
                    let targetInitialLeft = targetInitialPosition.left;
                    let selectedObjectDirection = '-';
                    let targetDirection = '-';
                    let absoluteDistance = 0;

                    if (selectObjectInitialLeft <= targetInitialLeft) { // if left of target
                        selectedObjectDirection = '+';
                        absoluteDistance = targetInitialLeft - selectObjectInitialLeft;
                    } else { // if right of target
                        targetDirection = "+";
                        absoluteDistance = selectObjectInitialLeft - targetInitialLeft;

                    }

                    // animate objects
                    selectedObject.animate({
                    }, 100, function() {
                        selectedObject.animate({
                            left: selectedObjectDirection + "=" + (absoluteDistance) + "px"
                        }, parameters.speed, function() {
                            selectedObject.animate({
                            }, 100);
                        });
                    });
                    targetID.animate({
                    }, 100, function() {
                        targetID.animate({
                            left: targetDirection + "=" + (absoluteDistance) + "px"
                        }, parameters.speed, function() {
                            targetID.animate({
                            }, 100, function() {
                                swapping = false;
                            });
                        });
                    });

                }

            });


        }
    });
})(jQuery);