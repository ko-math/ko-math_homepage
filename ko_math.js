window.ko_math = {
    pi: calc('pi#') ,
    e: calc('e#') ,
    tau: calc('tau#') ,
    phi: calc('phi#') ,
    
    formula : function (formula){
        return calc(formula);
    }, 
    brainf : function (code,input,cellbit,EOF){
        return BrainF(code,input,cellbit,EOF);
    },
    functionary : function (ope , Formula ,variable,variable_name ,range){
        return functionary(ope , Formula ,variable,variable_name ,range);
    }
};


function calc(calc){
    let Formula = calc;
    const num = ['0','1','2','3','4','5','6','7','8','9','.'];
    const ope1 = ['+','-','*','/','%','^'];//演算子
    const opeRank = [0,0,1,1,1,1];
    const ope2f = ['s','c','t'];
    const ope2 = ['sin','cos','tan'];//関数
    addOpe2('sqrt');
    addOpe2('max');
    addOpe2('exp');
    addOpe2('log');
    addOpe2('ln');
    addOpe2('abs');
    addOpe2('round');
    addOpe2('ceil');
    addOpe2('floor');
    addOpe2('min');
    addOpe2('asin');
    addOpe2('acos');
    addOpe2('atan');
    addOpe2('fact');
    addOpe2('rand');
    addOpe2('pi');
    const constant = {};//定数
    const constantf =[];//定数
    addConst('pi',Math.PI);
    addConst('tau',2*Math.PI);
    addConst('e',Math.E);
    addConst('phi',(1+Math.sqrt(5))/2 );

    let euler = 0
    for (let i = 1;i < 100000;i++){
        euler += 1/i;
    }
    euler -=Math.log(100000);
    addConst('euler',euler);
    //定数を書く際@を最後につけること
    for (let i = 0;i < Formula.length;i++){
        if ((Formula[i] == ')' && (num.includes(Formula[i + 1]) || '('.includes(Formula[i + 1]))) || (num.includes(Formula[i]) && Formula[i+1] == '(')  || (num.includes(Formula[i]) && ope2f.includes(Formula[i+1])) || (num.includes(Formula[i]) && constantf.includes(Formula[i+1]))  )  {
            const before = Formula.slice(0 , i+1);
            const after = Formula.slice(i+1 , Formula.length);
            Formula = before + '*' + after;
        }
    }
    const formula = Formula;
    const formulaList = [];

    let token = '';
    for (let i = 0; i < formula.length;i++){    
        const char = formula.charAt(i);
        let isMinus = 0;
        if (num.includes(char) ){
            token = token + char ;
        } else {
            if (token != ''){
                formulaList.push(token);
            }
            if (ope1.includes(char) || '()'.includes(char)){
                if (char == '-' && (ope1.includes(formula.charAt(i-1)) ||formula.charAt(i-1) == '('  || i == 0) ){
                    token = token + '-';
                    isMinus = 1;
                } else{
                    formulaList.push(char);
                }
            } else if(ope2f.includes(char)){
                let i_ = i;
                let func ='';
                while (formula.charAt(i_) !='(' && i_ < formula.length ){
                    if ( !(ope1.includes(formula.charAt(i_))) && !(num.includes(Number(formula.charAt(i_)))) ){
                    } else {
                        i_ = formula.length;
                        break;
                    }
                    func = func + formula.charAt(i_);
                    i_++;
                }
                if (ope2.includes(func) ){
                    formulaList.push(func);
                }
                if (i_ >= formula.length){
                    i = isThisConst(i , '#');
                } else {
                    i = i_ - 1;
                }
            } else if (constantf.includes(char)){
                i = isThisConst(i , '#');
            }
            if (isMinus == 0){
                token = '';
            } else {
                isMinus = 0;
            }
        }
    }
    if (token != ''){
        formulaList.push(token);
    }

    //ここまでToken分け。addOpe2関数でsinなどの名前が長い演算子を追加できます。デバッグ用。
    const outputRPN = [];
    const stackRPN = [];  
    for (let i = 0;i < formulaList.length;i++){
        if (!(isNaN(Number(formulaList[i])))) {
            outputRPN.push(formulaList[i]);
        } else if (ope1.includes(formulaList[i])){
            const current = formulaList[i];
            let top = stackRPN[stackRPN.length - 1];
            if (current == '^'){
                while (ope1.includes(top) && opeRank[ope1.indexOf(current)] < opeRank[ope1.indexOf(top)]) {
                    outputRPN.push(stackRPN.pop());
                    top = stackRPN[stackRPN.length - 1];
                }
            } else{
                while (ope1.includes(top) && opeRank[ope1.indexOf(current)] <= opeRank[ope1.indexOf(top)]) {
                    outputRPN.push(stackRPN.pop());
                    top = stackRPN[stackRPN.length - 1];
                }
            }

            stackRPN.push(current);
        } else if (formulaList[i] == '('){
            stackRPN.push('(');
        } else if (formulaList[i] == ')') {
            let i_ = '';
            let i__ = stackRPN.length;
            while (i_ != '(' && i__ >= 0 ){ //i_がなにもない→限界突破している
                i_ = stackRPN.pop();
                outputRPN.push(i_);
                i__--;
            }
            outputRPN.pop();
            if (ope2.includes(stackRPN[stackRPN.length - 1])){
                outputRPN.push(stackRPN.pop());
            }
        } else if (ope2.includes(formulaList[i])){
            stackRPN.push(formulaList[i]);
        }
    }
    while (stackRPN.length > 0){
        outputRPN.push(stackRPN.pop());
    }

    while (formulaList.length > 0){
        formulaList.pop();
    }
    for (const el of outputRPN ){
        formulaList.push(el);
    }
    //ここまでRPN変換。
    //ここから演算処理。
    const stack = [];
    for (const tokens of formulaList){
        ope(tokens);
    }
    //ここからHTMlに計算結果表示。
    return stack[0];
    //ここより下は関数たち。
    //addOpe2関数。引数opeで関数を作る、デバッグ用。
    function addOpe2(ope){
        ope2f.push(ope.charAt(0));
        ope2.push(ope);
    }
    //addConst関数。定数とその値を追加します。Math.PIとかも使用可能
    function addConst(constantName , constValue){
        constantf.push(constantName.charAt(0));
        constant[constantName]=constValue;
    }
    
    //ope関数。引数opeによってスタックから抽出
    function ope(ope){
        if (!(isNaN(Number(ope)))) {
            stack.push(Number(ope));
        } else {
            let num1 = Number(stack.pop());
            let num2;
            switch (ope){
                case '+':
                    num2 = Number(stack.pop());
                    stack.push(num2 + num1);
                    break;
    
                case '-':
                    if (stack.length == 0){
                        stack.push(0 - num1);
                    } else {
                        num2 = Number(stack.pop());
                        stack.push(num2 - num1);
                    }
                    break;
    
                case '*':
                    num2 = Number(stack.pop());
                    stack.push(num2 * num1);
                    break;
    
                case '/':
                    num2 = Number(stack.pop());
                    stack.push(num2 / num1);
                    break;
                case '%':
                    num2 = Number(stack.pop());                
                    stack.push(num2 % num1);
                    break;
                case '^':
                    num2 = Number(stack.pop());                
                    stack.push(num2 ** num1);    
                    break;
                case 'max':
                    num2 = Number(stack.pop());                
                    stack.push(Math.max(num1,num2));    
                    break;
                case 'sin':
                    stack.push(Math.sin(Math.PI/180 * num1) );
                    break;
                case 'cos':
                    stack.push(Math.cos(Math.PI/180 * num1));
                    break;
                case 'tan':
                    stack.push(Math.tan(Math.PI/180 * num1));
                    break;            
                case 'sqrt':
                    stack.push(num1 ** 0.5);
                    break;
                case 'exp':
                    stack.push(Math.E ** num1);
                    break;
                case 'log':
                    stack.push(Math.log10(num1));
                    break;
                case 'ln':
                    stack.push(Math.log(num1));
                    break;
                case 'abs':
                    stack.push(Math.abs(num1));
                    break;
                case 'floor':
                    stack.push(Math.floor(num1));
                    break;
                case 'ceil':
                    stack.push(Math.ceil(num1));
                    break;
                case 'round':
                    stack.push(Math.round(num1));
                    break;
                case 'min':
                    num2 = Number(stack.pop());
                    stack.push(Math.min(num1,num2));
                    break;
                case 'asin':
                    stack.push(180/Math.PI*Math.asin(num1));
                    break;
                case 'acos':
                    stack.push(180/Math.PI*Math.acos(num1));
                    break;
                case 'atan':
                    stack.push(180/Math.PI*Math.atan(num1));
                    break;
                case 'fact':
                    let fact = 1
                    for (let i = 2;i <= num1;i++){
                        fact *= i
                    }
                    stack.push(fact);
                    break;
                case 'rand':
                    stack.push(Math.random());
                    break;
                case 'pi':
                    stack.push(num1);
                    stack.push(Math.PI);
                    break;
                    //default処理
                default :
                    stack.push('error');
            }
        }
    }    
    //isThisConst関数。speは定数の末尾につける特殊文字。
    function isThisConst(i,spe) {
        let i_ = i;
        let value ='';
        
        while (formula.charAt(i_) != spe && i_ < formula.length){
            value = value + formula.charAt(i_);
            i_++;
        }
        
    
        if (constant.hasOwnProperty(value) ){
            formulaList.push(constant[value]);
        }
        return (i_ - 1);
    }
    //関数を追加したい場合、addOpe2に関数の名前を入れてから、ope関数のcaseにその関数名の場合の処理を追加してください。なお、num1が第二引数です。ただ、一変数関数におかれてはnum1で問題有りません
    //演算子も同じです。opeとopeRankに記号(1文字)と優先順位の強さをそれぞれ入力して、処理を作ってください。
}

//ここからbf用
function BrainF(formula , input ,cellbit,EOF){
    const code = formula;
    const codeLength = code.length;
    let ptr = 0;
    const stack = [0];
    let output = '';
    let inputIndex = 0;
    const jumpTable = jumpTableAdd(code);
    if (input == '' && formula.includes(',')){
        alert('入力を決定してください');
    } else if (jumpTable == 'error'){
        alert('カッコが閉じていません');
    } else {
        for (let i = 0  ; i < codeLength ;i++){
            if ('<>'.includes(code[i])){
                if (code[i] == '>'){
                    ptr ++;
                } else {
                    ptr = Math.max(0,ptr - 1);
                }
                plusStack(ptr);                
            } else{
                switch (code[i]){
                    case '+':
                        stack[ptr] = (stack[ptr] + 1) % (2 ** cellbit) ;
                        break;

                    case '-':
                        stack[ptr] = (stack[ptr] - 1 + (2 ** cellbit) ) % (2 ** cellbit);
                        break;

                    case '.':
                        output = output + String.fromCharCode(stack[ptr]);
                        break;

                    case ',':
                        if (inputIndex < input.length){
                            stack[ptr] = input.charCodeAt(inputIndex);
                        } else {
                            stack[ptr] = EOF;
                        }
                        inputIndex ++;
                        break;
                    case '[':
                        if (stack[ptr] == 0){
                            i = jumpTable[i];
                        }
                        break;
                    case ']':
                        i = jumpTable[i] - 1 ;
                        break;
                    default:
                        break;
                }
            }
        }
        return [output,stack]
        //ここより下関数
        function plusStack(pointer){
            while(stack.length <= pointer){
                stack.push(0);
            }
        }
    }
}


//jumpTableAdd関数。ジャンプ先を保存
function jumpTableAdd(code){
    const stack = [];
    const table = {};
    for (let i = 0; i < code.length;i++){
        switch (code[i]){
            case '[':
                stack.push(i);
                break;
            case ']':
                const open = stack.pop();
                table[open] = i;
                table[i] = open;
                break;
            default:
               break; 
        }
    }
    if (stack.length > 0){
        return 'error'
    } else{
        return table
    }
}

//微分・積分

function complexCalc(Formula ,variable){ //variableはオブジェクト形式で。
    let formula = Formula;
    for (const vari in variable){
        formula = formula.replaceAll('@'+vari,'(' + variable[vari] + ')'); 
    }
    formula = calc(formula);
    return formula
}

function functionary(ope , Formula ,variable,variable_name ,range){ //ope→dif,int Formula→式 variable→変数オブジェクト range→(積分)範囲配列
    let ans = 'error' ;
    let value1;
    let value2;
    let h;
    const newVar = {...variable}; //shallow
    switch (ope){
        case 'dif':
            h = 0.0000000001;
            newVar[variable_name]= Number(variable[variable_name]) + h;
            value1 = complexCalc(Formula,newVar);
            newVar[variable_name]= Number(variable[variable_name]) - h;
            value2 = complexCalc(Formula,newVar);
            ans = (value1 - value2)/(2*h);
            break;
        case 'int':
            h = 0.01;
            value1 = 0;
            console.log(range);
            for (let i = range[0];i <= range[1] ;i += h){
                newVar[variable_name] = i;                
                const f_a = complexCalc(Formula,newVar);
                newVar[variable_name] = i + h;
                const f_b = complexCalc(Formula,newVar);
                value1 += (f_a+f_b)*h/2
                
            }
            ans = value1;
            break;
        case 'calc': 
            ans = complexCalc(Formula,variable);
            break;
        case 'solve':
            ans = (range[0]+range[1])/2;
            for(let i = 0;i < 10;i++){
                newVar[variable_name]= ans;
                ans = ans - complexCalc(Formula,newVar)/functionary('dif',Formula,newVar,variable_name,'');//解の範囲をrangeで指定
            }
            
            break;        
        case 'sum':
            ans = 0;
            for(let i = range[0];i < range[1];i++){
                newVar[variable_name]= i;
                ans += complexCalc(Formula,newVar);
            }
            break;        
        case 'prod':
            ans = 1;
            for(let i = range[0];i < range[1];i++){
                newVar[variable_name]= i;
                ans *= complexCalc(Formula,newVar);
            }
            break;
        default:
            break;
    }
    return ans
}
