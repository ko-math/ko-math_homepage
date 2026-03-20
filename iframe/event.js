
const inputFormula = document.querySelector('#formula');
inputFormula.addEventListener('input' , function (){
    const delList = document.querySelectorAll('.outputFormula');
    for (const del of delList) {
        del.remove();
    }
    const formula = inputFormula.value;
    const ans = ko_math.formula(formula);
    const inputDiv = document.querySelector('#inputFormula');
    const output = document.createElement('p');
    output.textContent = ans;
    output.classList.add('outputFormula');
    inputDiv.append(output);
});


const inputBF = document.querySelector('#bfcode');
const inputStr = document.querySelector('#inputStrBF');
inputBF.addEventListener('change' , function (){
    const delList = document.querySelectorAll('.outputBF');
    for (const del of delList) {
        del.remove();
    }
    const code = inputBF.value;
    const inputStrBF = inputStr.value
    let ans = ko_math.brainf(code,inputStrBF,32,0)[0].replace(/\n/g,"<br>");
    
    const inputDiv = document.querySelector('#inputBF');
    let output = document.createElement('h3');
    output.innerHTML = '出力:';
    output.classList.add('outputBF');
    inputDiv.append(output);
    
    output = document.createElement('p');
    output.innerHTML = ans;
    output.classList.add('outputBF');
    inputDiv.append(output);

    output = document.createElement('h3');
    output.innerHTML = 'メモリ:';
    output.classList.add('outputBF');
    inputDiv.append(output);

    ans = ko_math.brainf(code,inputStrBF,32,0)[1];
    output = document.createElement('p');
    output.innerHTML = `[${ans}]`;
    output.classList.add('outputBF');
    inputDiv.append(output);

});


const compRun = document.querySelector('#compRun');
compRun.addEventListener('click' , function (){
    const delList = document.querySelectorAll('.outputCompFormula');
    for (const del of delList) {
        del.remove();
    }
    const data = [];
    data.push(compFormula.value);
    data.push(compOpe.value);    
    data.push(compVar.value);
    data.push(compVarName.value);
    data.push(compRange.value);
    const ans = ko_math.functionary(data[1],data[0],JSON.parse(data[2]),data[3],JSON.parse(data[4]));
    console.log(data);
    console.log(ans);
    
    const inputDiv = document.querySelector('#inputComp');
    const output = document.createElement('p');
    output.textContent = ans;
    output.classList.add('outputCompFormula');
    inputDiv.append(output);
});
