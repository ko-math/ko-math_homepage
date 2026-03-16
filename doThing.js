async function aboutMeApi(){
    const res = await fetch("https://ko-math-about.komath.workers.dev");
    return await res.json();
}

async function aboutMe(){
    const data = await aboutMeApi();

    const wrapper = document.createElement("div");
    wrapper.classList.add("aboutMe");

    wrapper.innerHTML = `
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
    let html = await res.text();
    html = html.replace(/(href|src)="\//g, 'href="https://scratch.mit.edu/');
    return html;
}

async function doThing() {
    document.querySelectorAll('.doThingElement').forEach(el => el.remove());
    
    const count =document.getElementById('doThingCount').value;
    const doThing = await doThingApi(20); /*←countに変えても良し*/
    const wrapper = document.createElement('div');
    wrapper.classList.add('doThingElement');
    wrapper.innerHTML = doThing;
    wrapper.querySelectorAll("a").forEach(a => {
        a.target = "_blank";
    });
    document.getElementById('doThingApi').appendChild(wrapper);
}

const inputDoThing =document.getElementById('doThingCount');
inputDoThing.addEventListener("change",doThing);

// DOMが変わったら毎回
/*
new MutationObserver(sendHeight)
  .observe(document.body, {
    childList: true,
    subtree: true
});
*/


