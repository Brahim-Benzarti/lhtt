function text(){
    document.getElementById('show').click();
};

class attempt{
    constructor(time_spent,errors_done){
        this.time_spent= time_spent;
        this.errors_done=errors_done;
    }
    time(){
        let d=new Date(-(1*60*60*1000));
        d.setMilliseconds(this.time_spent);
        return(d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
    };
    errors(){
        return(this.errors_done);
    }
}
var d;
var number_of_errors;
var start_time;
var end_time;
var started;
var target0;
var tryagain;
started=0;
var finished_attempt;

/* target: the target text, displayed: the correct text, current: what was typed, buffer: the next char, emmit_wrong: 0 or 1 for blocking the typed text or letting it free */    
function text_check(target,displayed,current,buffer,emmit_wrong){
    if(((current.value.charAt(0)==target.innerHTML.charAt(0)) && started==0)){
        number_of_errors=0;
        d= new Date();
        start_time=d.getTime();
        target0=target.innerHTML.trim();
        started=1;
    }
    if(started==1){
        if(target0.indexOf(current.value)==0){
            target.innerHTML=target0.slice(current.value.length+1);
            displayed.innerHTML=current.value;
            buffer.innerHTML=target0.substr(current.value.length,1);
            buffer.style.color='lime';
        }else{
            buffer.style.color='red';
            number_of_errors=number_of_errors+1;
            if(emmit_wrong=="1"){
                current.value=current.value.slice(0,current.value.length-1);
            }
        }
        if(target0==current.value){
            d= new Date();
            end_time=d.getTime();
            var typing_time=end_time-start_time;
            if(emmit_wrong=="1"){
                var errors=number_of_errors;
            }else{
                var errors=number_of_errors/2;
                errors=Math.round(errors);
            };
            finished_attempt = new attempt(typing_time,errors);
            $(document).ready(()=>{
                $.post('_save', {time: finished_attempt.time(),time_sec: finished_attempt.time_spent, err: finished_attempt.errors(), text_ref: document.getElementById('text_id').value}, (res)=>{
                    $('#myModal').html(res);
                    redo();
                })
            });
        }
    }
};
redo = ()=>{
    if(started==1){
        document.getElementById('current').value="";
        document.getElementById('correct').innerHTML="";
        document.getElementById('focused').innerHTML="";
        started=0;
        document.getElementById('target').innerHTML=target0;
    }
};
cheater=()=>{
    $(document).ready(()=>{
        $.get('cheat',(data,status)=>{
            alert("U have ben deleted, with all your attempts.\nShortly we will BAN");
        });
    });
    // window.location.href="/users/cheat";
};