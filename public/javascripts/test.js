
var db=require('./db');

deploy_test = async (difficulty_level) =>{
    //document.getElementById('difficulty').value;
    let search_index='';
    for(let i=0;i<difficulty_level;i++){
        search_index+="_";
    }
    let test="so basically andi problem here this needs to be smth else";
    let sql="SELECT word FROM entries WHERE word LIKE '"+search_index+"%'"+" ORDER BY RAND() limit 120;";
    db.query(sql, function(err,result){
        if(err) throw err;
        for(let i=0;i<result.length;i++){
            test+= result[i].word+" ";
            if(i==result.length-1) console.log(test);
        }
    });
    console.log("what is being returned: ",test);
    return test;
};

module.exports = deploy_test;