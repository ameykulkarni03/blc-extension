chrome.runtime.onConnect.addListener(port => {

  port.onMessage.addListener(msg => {

    if (msg.type === 'ping') {
      port.postMessage({type: 'pong'});
    }

    if (msg.type === 'check_links') {

      chrome.tabs.query({active: true}, tabs => {

        const tab = tabs[0];

        chrome.scripting.executeScript({
          target: {tabId: tab.id},
          func: getPageLinks
        }, links => {

          chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: checkBrokenLinks,
            args: [links]  
          }, brokenLinks => {

            port.postMessage({brokenLinks});

          });

        });

      });

    }

  });

});

function getPageLinks() {

  return Array.from(document.querySelectorAll('a'))
            .map(link => link.href);
}

function checkBrokenLinks(links) {

  return links.filter(link => {
    
    const res = fetch(link);
    return !res.ok;

  });
}