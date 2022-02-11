
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
    }, 
    cvtMilitaryTimeToFractional: (militaryTime) => {
        let h = parseInt(militaryTime.substr(0,2));
        let m = parseInt(militaryTime.substr(2,2));
        let fractional = h+(m/60)
        // Round to two decimal places
        fractional = Math.round((fractional + Number.EPSILON) * 100) / 100;
        return fractional;
    },
    cvtFractionalToMilitaryTime: (fractionalTime) => {
        let h = Math.floor(fractionalTime);
        let hh = (""+h).padStart(2,"0");

        let moduled = fractionalTime%1;
        let m = Math.round(moduled*60);
        let mm = (""+m).padStart(2,"0");

        let timemark = hh+mm;
        return timemark;
    },
}

let app = {
    $begin:"",
    $userInputs:"",
    $timeSuggestions:"",
    currentTime:"",

    init: function($doms) {
        Object.assign(app, $doms);
        this.currentTime = "" + (new Date).getHours() + (new Date).getMinutes();

        // User sets
        this.$begin.on("input", ev=>{
            const {target:el} = ev;
            const $el = $(el);

            $el.removeClass("is-valid").removeClass("is-invalid");
            if($el.val.length==4 && utilities.checkAllNumbers(val)) {
                $el.addClass("is-valid");
                this.currentTime = $el.val;
            } else {
                $el.addClass("is-invalid");
                this.currentTime = "" + (new Date).getHours() + (new Date).getMinutes();
            }
        });
    }
}
