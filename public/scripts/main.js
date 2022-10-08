function showcomments(commentid) {
    let comments = document.getElementById("comments" + commentid);
    console.log(comments.style.display);
    if(comments.style.display === "none") {
        comments.style.display = "block";
    } else {
        comments.style.display = "none";
    }
}

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  return response.json();
}

  function tip(id, author) {
    async function postData(url = '', data = {}) {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
      });
      return response.json();
  }


      postData('/home/tip', {id: id, author: author})
      .then(data => {
        console.log("tips" + id);
        const tips = document.getElementById("tips" + id);
        tips.innerHTML = data;
      });
}

function share(postid, author) {
    postData('/home/share', {postid: postid, author: author})
    .then(data => {
      console.log(data);
    });
}


function comment(postid) {
  const text = document.getElementById("commentinput" + postid).value;
  document.getElementById("commentinput" + postid).value = "";
  postData('/home/comment', {postid: postid, text: text})
  .then(data => {
    console.log(data);
    if(data.name !== null) {
      const name = document.createElement("p");
      name.innerHTML = "| " + "<a href=/profile/" + data.name + ">"  + data.name + "</a>" + "<br>" + "| " + data.text;
      console.log(document.getElementById("comments" + postid));
      document.getElementById("comments" + postid).appendChild(name);
    } else {
      console.log(data.err);
    }
  })
}

function logout() {
  let form = document.createElement("form");
  form.action = "/logout?_method=DELETE";
  form.method = "POST";
  form.style.visibility = "hidden";
  document.body.appendChild(form);
  form.submit();
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function showLogout() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.profile-item-elipses')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
