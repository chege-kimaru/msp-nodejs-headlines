let CURRENT_HEADLINE = undefined;

const openViewModal = (id) => {
    CURRENT_HEADLINE = id;

    fetch(`/headlines/${id}`)
        .then(res => res.json())
        .then(data => {
            $('.h_title').text(data.title).val(data.title);
            $('.h_author').text(data.author).val(data.author);
            $('.h_about').text(data.about).val(data.about);
            $('.h_location').text(data.location).val(data.location);
            $('.h_date').text(data.createdAt).val(data.createdAt);
            $('.h_image').attr('src', data.image);
            $('.view.ui.modal')
                .modal('show');
        });
};

const update = (e) => {
    e.preventDefault();
    let formData = new FormData($('#updateForm')[0]);

    $('.update-btn').addClass('loading');
    fetch(`/headlines/${CURRENT_HEADLINE}`, {method: 'PUT', body: formData})
        .then(res => res.json())
        .then(data => {
            location.reload();
            $('.update-btn').removeClass('loading');
        }).catch(e => $('.update-btn').removeClass('loading'));

};


const del = () => {
    $('.delete-btn').addClass('loading');
    fetch(`/headlines/${CURRENT_HEADLINE}`, {method: 'DELETE'})
        .then(res => res.json())
        .then(data => {
            location.reload();
            $('.delete-btn').removeClass('loading');
        }).catch(e => $('.delete-btn').removeClass('loading'));
};

$(document).ready(() => {

});
