chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'checkLinks') {
    var links = document.querySelectorAll('a');
    chrome.runtime.sendMessage({
      totalLinks: links.length  
     });
    const validLinks = [];
    const brokenLinks = [];

    links.forEach(function(link) {
      if (link.href) {
        fetch(link.href, {method: 'head'})
          .then(function(response) {
            if (response.ok) {
              validCount++;
            } else {
              invalidCount++;
            }

            if (validCount + invalidCount === links.length) {
              chrome.runtime.sendMessage({action: 'updateStatus', validCount: validCount, invalidCount: invalidCount});
            }
          })
          .catch(function(error) {
            invalidCount++;

            if (validCount + invalidCount === links.length) {
              chrome.runtime.sendMessage({action: 'updateStatus', validCount: validCount, invalidCount: invalidCount});
            }
          });
      }
    });
    chrome.runtime.sendMessage({
      type: "linksChecked",
      validLinks: validLinks,  
      brokenLinks: brokenLinks
   });
  }
});

chrome.runtime.sendMessage({
  action: 'updateStatus', 
  validCount: validCount,
  invalidCount: invalidCount
});