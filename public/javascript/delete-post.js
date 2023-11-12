const delButton = document.querySelector('.delete-post-btn');
const postId = document.querySelector('input[name="post-id"]').value;

async function deleteFormHandler(event) {
  event.preventDefault();

    const response = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      document.location.replace('/dashboard/');
    } else {
      alert(response.statusText);
    }
}
if(delButton!=null){
  delButton.addEventListener('click', deleteFormHandler);
}
