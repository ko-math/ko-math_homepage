async function aboutMeApi(){
    const res = await fetch("https://ko-math-about.komath.workers.dev");
    return await res.json();
}

async function aboutMe(){
    const data = await aboutMeApi();

    const wrapper = document.createElement("div");
    wrapper.classList.add("aboutMe");

    wrapper.innerHTML = `
        <h2>${data.username}</h2>
        <img src="${data.profile.images["90x90"]}">
        <p>${data.profile.bio.replace(/\n/g,'<br>') || ""}</p>
        <p>Country: ${data.profile.country || ""}</p>
    `;

    document.getElementById("aboutMeApi").appendChild(wrapper);
}

aboutMe();











async function doThingApi(n) {
    if (n > 20){
        alert('20以下の数値を入力してください');
        return '';
    }
    const res = await fetch(`https://dothing.komath.workers.dev/?&max=${n}`);
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


