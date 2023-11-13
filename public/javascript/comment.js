const postId = document.querySelector('input[name="post-id"]').value;

async function commentFormHandler(event) {
    event.preventDefault();

    const comment= document.querySelector('input[name="comment-body"]').value.trim();
    console.log(comment);

    if (comment_text) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({
                post_id:postId,
                comment_text:comment,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.reload();

        } else {
            alert(response.statusText);
            document.querySelector('#comment-form').style.display = "block";
        }
    }
}

document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);