function eval() {
    // Do not use eval!!!
    return;
}

function checkError(string) {
    if (string.replace(/\s/g, "").includes("/0")) {
        throw Error("TypeError: Division by zero.")
    }

    let leftBrackets = 0;
    let rightBrackets = 0;

    for (let i = 0; i < string.length; i++) {
        if (string[i] == '(') {
            leftBrackets++;
        } else if (string[i] == ')') {
            rightBrackets++;
        }
    }

    if (leftBrackets != rightBrackets) {
        throw Error("ExpressionError: Brackets must be paired")
    }
}

function getPriority(mathOperation) {
    if (mathOperation == "*" || mathOperation == "/") {
        return 3;
    } else if (mathOperation == "+" || mathOperation == "-") {
        return 2;
    } else if (mathOperation == ")" || mathOperation == "(") {
        return 1;
    }
}

function expressionCalculator(expr) {

    checkError(expr);

    newExpr = expr.replace(/\s/g, "")
        .replace(/\+|\-|\*|\//g, " $& ")
        .replace(/\(/g, "$& ")
        .replace(/\)/g, " $&")
        .split(" ");

    let current = [];
    let stackOperation = [];

    for (let i = 0; i < newExpr.length; i++) {
        if (/\d/.test(newExpr[i])) {
            current.push(Number(newExpr[i]));
        } else if (newExpr[i] == "(") {
            stackOperation.push(newExpr[i]);
        } else if (newExpr[i] == ")") {
            newArr = stackOperation.slice(stackOperation.lastIndexOf("(") + 1, stackOperation.length)
            newArr.reverse().forEach(item => current.push(item));
            stackOperation.splice(stackOperation.lastIndexOf("("), stackOperation.length)
        } else if (stackOperation.length == 0) {
            stackOperation.push(newExpr[i]);
        } else if (getPriority(newExpr[i]) == getPriority(stackOperation[stackOperation.length - 1])) {
            current.push(stackOperation.pop());
            stackOperation.push(newExpr[i]);
        } else if (getPriority(newExpr[i]) < getPriority(stackOperation[stackOperation.length - 1])) {

            if (stackOperation.includes("(")) {
                newArr = stackOperation.slice(stackOperation.lastIndexOf("(") + 1, stackOperation.length)
                newArr.reverse().forEach(item => current.push(item));
                stackOperation.splice(stackOperation.lastIndexOf("(") + 1, stackOperation.length);
                stackOperation.push(newExpr[i]);
            } else {
                stackOperation.reverse().forEach(item => current.push(item));
                stackOperation.splice(0, stackOperation.length);
                stackOperation.push(newExpr[i]);
            }

        } else if (getPriority(newExpr[i]) > getPriority(stackOperation[stackOperation.length - 1])) {
            stackOperation.push(newExpr[i]);
        }
    }

    stackOperation.reverse().forEach(item => current.push(item));

    let result = [];

    for (let k = 0; k < current.length; k++) {
        if (typeof (current[k]) == "number") {
            result.push(current.shift());
            k--; 
            continue;
        } else if (current[k] == "*") {
            sum = result[result.length - 2] * result[result.length - 1]
        } else if (current[k] == "/") {
            sum = result[result.length - 2] / result[result.length - 1]
        } else if (current[k] == "+") {
            sum = result[result.length - 2] + result[result.length - 1]
        } else if (current[k] == "-") {
            sum = result[result.length - 2] - result[result.length - 1]
        }
        current.shift();
        result.splice(result.length - 2, 2);
        result.push(sum)
        k--
    }
    
    return result[0];
}

module.exports = {
    expressionCalculator
}