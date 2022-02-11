
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
    checkIsFloatOrInt: (str) => {
        str = "" + str;
        if(str.length===0) return false;

        let isFloat = true;
        for(let i = 0; i<str.length; i++) {
            if(str[i]===".") {
            } else if(str[i]>'9' || str[i]<'0') {
                isFloat=false;
                break;
            }
        } // for
        return isFloat;
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
    tasks: [],

    init: function($doms) {
        Object.assign(app, $doms);
        this.currentTime = "" + (new Date).getHours() + (new Date).getMinutes();

        // User sets begin time
        this.$begin.on("input", ev=>{
            const {target:el} = ev;
            const $el = $(el);

            $el.removeClass("is-valid").removeClass("is-invalid");
            if($el.val().length==4 && utilities.checkAllNumbers($el.val())) {
                $el.addClass("is-valid");
                this.currentTime = $el.val;
            } else {
                $el.addClass("is-invalid");
                this.currentTime = "" + (new Date).getHours() + (new Date).getMinutes();
            }
        });

        // User sets tasks
        this.$userInputs.on("input", ev=>{
            const {target:el} = ev;
            const $el = $(el);

            app.tasks = []; // reset tasks
            let lines = $el.val().split("\n");
            // console.log({linesLength2:lines.length==2})
            for(let i = 0; i<lines.length; i++) {
                let line = lines[i];
                let parsed = line.split(/[\t\s]/);
                let parsedRight = parsed[ parsed.length-1 ];
                if(utilities.checkIsFloatOrInt(parsedRight)) {
                    this.tasks.push({
                        task: parsed.slice(0,-1).join(" "),
                        militaryTime: (function() {
                            let lineTimeFraction = parseFloat(parsedRight);
                            let currentTimeFraction = utilities.cvtMilitaryTimeToFractional(app.currentTime);
                            let futureTimeFraction = currentTimeFraction + lineTimeFraction;
                            let futureTimeMilitary = utilities.cvtFractionalToMilitaryTime(futureTimeFraction);
                            // console.log({futureTimeFraction, should:"Int.Dec"})
                            // console.log({futureTimeMilitary, should:"HHMM"})
                            return futureTimeMilitary
                        })()
                    })
                } // vald line
            } // check all lines

            const $suggestions = this.$timeSuggestions.find("ul");
            $suggestions.html(""); // Reset suggestions
            app.tasks = app.tasks.sort((taskA, taskB)=>{
                let fractionA = utilities.cvtMilitaryTimeToFractional(taskA.militaryTime);
                let fractionB = utilities.cvtMilitaryTimeToFractional(taskB.militaryTime);
                return fractionA - fractionB;
            });
            console.log({tasksSorted: app.tasks})

            for(let i = 0; i<app.tasks.length; i++) {
                let task = app.tasks[i];
                $suggestions.append(`
                    <li class="suggestion">
                        <span class="suggestion-time">${task.militaryTime}</span>
                        <span class="suggestion-task">${task.task}</span>
                    </li>
                `);
            }
        }) // on user inputting tasks
    }
}
