function search() {
  const text = document.getElementById('search').value;

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

    postData('/search', {text: text})
    .then(data => {
      const results = document.getElementById('search-results');
      results.innerHTML = "";
        console.log(data.data);
        data.data.forEach(function(user) {
          const profileitemwrapper = document.createElement('div');
          profileitemwrapper.className = "sr-profile-item-wrapper";
          const profileitem = document.createElement('div');
          profileitem.className = "sr-profile-item";
          const profilenameandbio = document.createElement('div');
          profilenameandbio.className = 'sr-profile-name-and-bio';
          const profileitemname = document.createElement('h1');
          profileitemname.className = 'sr-profile-item-name';
          const pfp = document.createElement('img');
          profileitemwrapper.addEventListener("click", (e) => window.open('/profile/' + user.name));
          pfp.style.width = "40px";
          pfp.style.height = "40px";
          pfp.style.border = "1px solid #272a33";
          pfp.style.borderRadius = "100%";
          pfp.src = "/pictures/kitten.jpg";
          profileitemname.innerHTML = user.name;
          results.style.visibility = "visible";
          profilenameandbio.appendChild(profileitemname);
          profileitem.appendChild(pfp);
          profileitemwrapper.appendChild(profileitem);
          profileitemwrapper.appendChild(profilenameandbio);

          results.appendChild(profileitemwrapper);
        });
    });
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.search-results')) {
    const results = document.getElementsByClassName("search-results")[0];
    if(results.style.visibility == "visible") {
      results.style.visibility = "hidden";
    }
  }
}
