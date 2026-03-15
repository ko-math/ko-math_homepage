async function aboutMeApi(){
    const res = await fetch("https://api.allorigins.win/raw?url=" + encodeURIComponent("https://api.scratch.mit.edu/users/ko-math/"));
    return await res.json();
}

async function aboutMe(){
    const data = await aboutMeApi();

    const wrapper = document.createElement("div");
    wrapper.classList.add("aboutMe");

    wrapper.innerHTML = `
        <img src="${data.profile.images["90x90"]}">
        <h3>${data.username}</h3>
        <p>${data.profile.bio || ""}</p>
        <p>Country: ${data.profile.country || ""}</p>
    `;

    document.getElementById("aboutMeApi").appendChild(wrapper);
}

aboutMe();











async function doThingApi(n) {
    const res = await fetch(`https://scratch.mit.edu/messages/ajax/user-activity/?user=ko-math&max=${n}`);
    return await res.text();
}

async function doThing() {
    const removeElements = document.getElementsByClassName('doThingElement');
    for (let removeElement of removeElements){
        removeElement.remove();
    }
    
    const count =document.getElementById('doThingCount').value;
    const doThing = await doThingApi(count);
    const wrapper = document.createElement('div');
    wrapper.classList.add('doThingElement');
    wrapper.innerHTML = doThing;
    document.getElementById('doThingApi').appendChild(wrapper);
}

const inputDoThing =document.getElementById('doThingButton');
inputDoThing.addEventListener("click",doThing);


function sendHeight() {
  const h = document.documentElement.scrollHeight;
  window.parent.postMessage(h, '*');
}

// 初回
window.addEventListener('load', sendHeight);

// DOMが変わったら毎回
new MutationObserver(sendHeight)
  .observe(document.body, {
    childList: true,
    subtree: true
});


