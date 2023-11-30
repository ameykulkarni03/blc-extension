let port;

document.addEventListener('DOMContentLoaded', () => {

  port = chrome.runtime.connect({name: "popup"});

  port.postMessage({
    type: 'ping',
    payload: {}   
  });  

  port.onMessage.addListener(msg => {

    if (msg.type === 'pong') {
      console.log('Connection established!'); 
    }

  });

  port.onMessage.addListener(msg => {
    
    if (msg.brokenLinks) {
      handleBrokenLinks(msg.brokenLinks);
    }

  });

  var checkButton = document.getElementById("checkButton");

  if (checkButton && !checkButton.hasEventListener) {
    checkButton.addEventListener("click", function() {
      console.log("Check button clicked");
      var port = chrome.runtime.connect({
        name: "popup"
      });
      document.getElementById("status").innerText = "Checking...";
      port.postMessage({
        type: 'check_links'  
      });
    });

    checkButton.hasEventListener = true;
  }

});

document.getElementById("status").innerText = "Checking..."; 

function handleBrokenLinks(brokenLinks) {

  document.getElementById("status").innerText = 
    `Found ${brokenLinks.length} broken out of ${totalLinks} total links`;

  let ul = document.createElement('ul');

  brokenLinks.forEach(link => {  
    let li = document.createElement('li');
    li.innerText = link;
    ul.appendChild(li);
  });

  document.body.appendChild(ul);

}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if(request.action === 'updateStatus') {
    const {validCount, invalidCount} = request;  
    handleBrokenLinks(invalidCount, validCount + invalidCount);
  }

});