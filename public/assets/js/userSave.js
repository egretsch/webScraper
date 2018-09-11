$(document).ready(function () {

    
    //click event to save an article
    $(document).on('click', '#saveArticle', function (e) {
        let articleId = $(this).data('id');
        $.ajax({
            url: '/save/' + articleId,
            type: 'GET',
            success: function (response) {
                window.location.href = '/';
            },
            error: function (error) {
                showErrorModal(error);
            }
        });
    });//end of #saveArticle click event

    $('#scrape').on('click', function (e) {
        console.log("/scraper was click")
        e.preventDefault();
        $.get("/scraper", function (data) {
            window.location.href = "/";
            console.log("/scraper get worked")
        });
    });

});//end of document ready function