$(document).ready(function () {

    
    //click event to save an article
    $('.saveArticle').on('click', function (e) {
        let articleId = $(this).data('id');
        console.log(articleId)
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

    // $('#savedArticles').on('click', function (e) {
    //     console.log("/scraper was click")
    //     e.preventDefault();
    //     $.get("/savedarticle", function (data) {
    //         // window.location.href = "/savedarticle";
    //     });
    // });

    $('#home').on('click', function (e) {
        console.log("/scraper was click")
        e.preventDefault();
        $.get("/", function (data) {
            window.location.href = "/";
        });
    });

    $('.deleteArticle').on('click', function (e) {
        console.log(" iwas deleted")
        e.preventDefault();
        let id = $(this).data('id');
        $.ajax({
            url: '/deleteArticle/' + id,
            type: 'DELETE',
            success: function (response) {
                window.location.href = '/savedarticle';
            },
            error: function (error) {
                showErrorModal(error);
            }
        });
    });

});//end of document ready function