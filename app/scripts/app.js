import $ from "jquery";

const init = () => {
    $.get('/api/construction')
        .done((response) => {
            $('<img>')
                .attr('src', response.imageURL)
                .css('display', 'none')
                .appendTo('body')
                .fadeIn(1000)
        })
};

init();

export default init;