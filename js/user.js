
const url = "https://stackoverflow-lite-cdvx2.herokuapp.com"
// const url = "http://localhost:5000";

function createNode(element){
    return document.createElement(element);
}

function append(parent, element){
    return parent.appendChild(element)
}

let alertMessage = (message) => {
    let alert = document.getElementById('alert');
    alert.style.display = 'block';
    alert.style.padding = '10px';
    alert.innerHTML = message;
    setTimeout(() => alert.style.display = 'none', 6000);
}

let alertMain = (message) => {
    let alert = document.getElementById('alert2');
    alert.style.display = 'block';
    alert.style.padding = '10px';
    alert.innerHTML = message;
    setTimeout(() => alert.style.display = 'none', 6000);
}


function onFetchAnswers(){
    console.log(document.title == "StackOverflow-lite-question");
    if (document.title == "StackOverflow-lite-question"){
        questionId = window.localStorage.getItem('questionId1');
        questionId = String(questionId);

        let submit2 = document.getElementById('submit2');
            condition1 = !document.title == "StackOverflow-lite-question";
            condition2 = !document.title == "StackOverflow-lite-index";
            L = document.getElementById('L');
            P = document.getElementById('P');
            S = document.getElementById('S');

        submit2.addEventListener('click', postAns => {
            postAnswer(questionId);
            // window.localStorage.setItem('questionId', questionId);
            // window.location.reload();
        })
        console.log(questionId);

        usr = window.localStorage.getItem('user');
        if(usr){
            console.log(usr);
            
            L.style.display = 'none';
            S.style.display = 'none';
            P.style.display = 'list-item';
        }
        if (!usr){
            console.log('not user =', usr)
            P.style.display = 'none';
            S.style.display = 'list-item';
            L.style.display = 'list-item';
        }

        let Question = document.getElementById('Question');
            h3 = createNode('h3');
            li = createNode('li');
            span1 = createNode('span');
            span2 = createNode('span');

        fetch(`${url}/api/v1/questions`, {
            mode: "cors",
        })
        .then(res => res.json())
        .then(json => {
            if ('questions' in json){
                console.log(json.questions);
                for(let question of json.questions){
                    let condi = question.questionId == questionId;
                    console.log(question.questionId , '< >', questionId, condi);
                    if (question.questionId == questionId){
                        localStorage.setItem("qtn_author2", question.author);
                        console.log(localStorage.getItem("qtn_author2"));
                        h3.innerHTML = `${question.body}`;
                        span1.innerHTML = `<strong>Author: </strong>${question.author}`;
                        span2.innerHTML = `<strong>Topic: </strong>${question.topic}`;
                            
                        append(li, span2);
                        append(li, h3);
                        append(li, span1);
                        append(Question, li);
                        break; 
                    }
                }
            }
        })
        console.log('testing 1');
        fetch(`${url}/api/v1/questions/${questionId}`, {
            mode: "cors",
        })
        .then(res => res.json())
        .then(json =>{
            console.log(json);

            if ("message" in json){
                console.log(json.message);
                let Qtns2 = document.getElementById('Qtns2');
                    Qtn = createNode('p');
    
                Qtn.innerHTML = `${json.message}`
                append(Qtns2, Qtn)

            }
            if ("answers" in json){
                console.log(json);
                console.log('answers>', json.answers);
                for (let answer of  json.answers){
                    let li = createNode('li'),
                        span = createNode('span'),
                        span2 = createNode('span'),
                        strong = createNode('strong');
                        Qtns2 = document.getElementById('Qtns2');
                        Qtn = createNode('p');
                        condition = document.title == "StackOverflow-lite-question";
                        condition2 = !answer.prefered == true;
                        a = createNode('a');
                        b = createNode('b');

                    qtn_author = localStorage.getItem("qtn_author2");
                    user = localStorage.getItem('user');
                    console.log('answer>', answer);
                    console.log(user, '<user author>', qtn_author);
                    if (condition && user == qtn_author && condition2){
                        a.addEventListener('click', prefAnswer =>{
                            preferAnswer(questionId, answer.answerId);
                            // window.location.reload();
                        })
                        b.classList.add('prefer');
                        span.innerHTML = ` <strong>Author:</strong> ${answer.author}`;
                        span.classList.add('author');
                        span2.innerHTML = `${answer.body} <br>`;
                        a.innerHTML = 'Prefer answer'
                        append(li, span2);
                        append(li, span);
                        append(b, a);
                        append(li, b)
                        append(Qtn, li);
                        append(Qtns2, Qtn);
                    }
                    

                    if (answer.prefered == true){
                        strong.classList.add("prefered");
                        span.innerHTML = ` <strong>Author:</strong> ${answer.author}`;
                        span.classList.add('author');
                        span2.innerHTML = `${answer.body} <br>`;
                        strong.innerHTML = "Prefered answer";
                        append(li, span2);
                        append(li, span);
                        append(li, strong);
                        append(Qtn, li);
                        // append(a, Qtn);
                        append(Qtns2, Qtn);
                    }
                    if (answer.prefered == false && user == null ){
                        span.innerHTML = ` <strong>Author:</strong> ${answer.author}`;
                        span.classList.add('author');
                        span2.innerHTML = `${answer.body} <br>`;
                        append(li, span2);
                        append(li, span);
                        append(Qtn, li);
                        // append(a, Qtn);
                        append(Qtns2, Qtn);
                        
                    }
                }
            }
        });
        if(condition1 || condition2){
            console.log('deleting qn1d');
            window.localStorage.removeItem('questionId1');
        }
    }
}


function postAnswer(questionId){
    let body = document.getElementById('body').value;
        postData = {
            body
        };

    console.log(`${postData}`);
    if (document.title=="StackOverflow-lite-question")
        fetch(`${url}/api/v1/questions/${questionId}/answers`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('access')}`,
                "content-type": "application/json"},
            body: JSON.stringify(postData) 
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            console.log(json.status_code);
            console.log(JSON.stringify(json));

            if ("message" in json || "msg" in json){
                alertMessage(json.message);
                if (json.msg == 'Token has expired' || json.msg == 'Not enough segments'){
                    alertMessage(json.msg);
                    alertMessage('Please login to continue!, redirecting to login page...');
                    setTimeout(() => window.location.replace('./login.html'), 3000);
                }
            }
            if ("success" in json){
                window.location.reload();
                console.log('this runs');
            }
        })
        .catch(error => console.log(error));
    }



function preferAnswer(questionId, answerId){
    if (document.title=="StackOverflow-lite-question"){
        fetch(`${url}/api/v1/questions/${questionId}/answers/${answerId}`, {
            method: "PUT",
            mode: "cors",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('access')}`,
                "content-type": "application/json"}
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            console.log(json.status_code);
            console.log(JSON.stringify(json));

            if ("message" in json || "msg" in json){
                alertMain(json.message);
                if (json.msg == 'Token has expired' || json.msg == 'Not enough segments'){
                    alertMain('Please login to continue!, redirecting to login page...');
                    setTimeout(() => window.location.replace('./login.html'), 3000);
                }
                // alertMessage(json.msg);
            }
            if ("success" in json){
                alertMain(json.success);
                window.location.reload();
                console.log('this runs');
            }
        })
        .catch(error => console.log(error));
    }
}