
let utilities = {
    checkAllNumbers: (str) => {
        str = "" + str;
        if(str.length===0) return false;

        let isNum = true;
        for(let i = 0; i<str.length; i++) {
            if(str[i]>'9' || str[i]<'0') {
                isNum=false;
                break;
            }
        } // for
        return isNum;
    }
}

let app = {
    $begin:"",
    $userInputs:"",
    $timeSuggestions:"",

    init: function($doms) {
        Object.assign(app, $doms);
    }
}
