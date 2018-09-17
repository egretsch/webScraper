$(document).ready(function () {

    
    //click event to save an article
    $('.saveArticle').on('click', function (e) {
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
        
        e.preventDefault();
        $.get("/scraper", function (data) {
            window.location.href = "/";

        });
    });


    $('#home').on('click', function (e) {

        e.preventDefault();
        $.get("/", function (data) {
            window.location.href = "/";
        });
    });

    $('.deleteArticle').on('click', function (e) {
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

    $('.addNote').on('click', function (e) {
        $('#noteArea').empty();
        $('#noteTitleEntry, #noteBodyEntry').val('');
        let id = $(this).data('id');
        $('#submitNote, #noteBodyEntry').attr('data-id', id);
        $.ajax({
            url: '/getComment/' + id,
            type: 'GET',
            success: function (data) {
                $.each(data.Comments, function (i, item) {
                    showComment(item, id);
                });
                $('#noteModal').modal('show');
            },
            error: function (error) {
                showErrorModal(error);
            }
        });
    }); 

    $('#submitNote').on('click', function (e) {
        e.preventDefault();
        sendComment($(this));
    });//end of #submitNote click event

    //keypress event to allow user to submit note with enter key
    $('#noteBodyEntry').on('keypress', function (e) {
        if (e.keyCode === 13) {
            sendComment($(this));
        }
    });//end of #noteBodyEntry keypress(enter) event

    //function to post a note to server
    function sendComment(element) {
        let comment= {};
        comment.articleId = $(element).attr('data-id'),
        comment.title = $('#noteTitleEntry').val().trim();
        comment.body = $('#noteBodyEntry').val().trim();
        if (comment.title && comment.body) {
            $.ajax({
                url: '/createComment',
                type: 'POST',
                data: comment,
                success: function (response) {
                    showComment(response, comment.articleId);
                    $('#noteBodyEntry, #noteTitleEntry').val('');
                },
                error: function (error) {
                    showErrorModal(error);
                }
            });
        }
    }//end of sendNote function


    //function to display error modal on ajax error
    function showErrorModal(error) {
        $('#error').modal('show');
    }


    //function to display notes in notemodal
    function showComment(element, articleId) {
      
        let $title = $('<p>')
            .text(element.title)
            .addClass('noteTitle');
        let $deleteButton = $('<button>')
            .text('X')
            .addClass('deleteNote storyButton');
            $deleteButton.attr({
                "data-artId" : articleId,
                "data-comment": element._id
            })
        let $comment = $('<div>')
            .append($deleteButton, $title)
            .attr('data-comment-id', element._id)
            .attr('data-article-id', articleId)
            .addClass('note')
            .appendTo('#noteArea');
    }//end of showNote function
    $(document).on('click', '.deleteNote', function (e) {
        e.stopPropagation();
        let thisItem = $(this);
        

        let ids = {
            commentId: $(this)[0].dataset.comment,
            articleId: $(this)[0].dataset.artid
        }
        

        $.ajax({
            url: '/deleteComment',
            type: 'POST',
            data: ids,
            success: function (response) {
                thisItem.parent().remove();
            },
            error: function (error) {
                showErrorModal(error);
            }
        });
    });//end of .deleteNote click event

    //click event to retrieve the title and body of a single note
    //and populate the note modal inputs with it
    $(document).on('click', '.note', function (e) {
        e.stopPropagation();
        let id = $(this).data('comment-id');

        $.ajax({
            url: '/getSingleComment/' + id,
            type: 'GET',
            success: function (comment) {
                $('#noteTitleEntry').val(comment.title);
                $('#noteBodyEntry').val(comment.body);
            },
            error: function (error) {
                
                showErrorModal(error);
            }
        });
    }); //end of .note click event

});//end of document ready function