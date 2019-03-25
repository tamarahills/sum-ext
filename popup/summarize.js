var activeUrl = '';
var tData = {
  scoutUrl: 'https://xxxx/summaryText',
  scoutToken: 'xxxxx',
  feedbackurl: 'https://xxxx/dev/metric'
};

function clickLike() {
  var likeBtn = document.getElementById('imageLike');
  var dislikeBtn = document.getElementById('imageDislike');
  var filename = likeBtn.src.replace(/^.*[\\\/]/, '');

  if (filename == 'like-unfilled.png') {
    //Like is not checked
    likeBtn.src = '../icons/like-filled.png';
  } else {
    //Like is checked
    likeBtn.src = '../icons/like-unfilled.png';
  }
  dislikeBtn.src = '../icons/dislike-unfilled.png';

  document.getElementById('feedbackDiv').style.visibility = 'hidden';
  document.getElementById('thumbsDiv').style.visibility = 'hidden';
  callFeedback(activeUrl, 'like', '');
}

function SendFeedback() {
  document.getElementById('feedbackDiv').style.visibility = 'hidden';
  document.getElementById('thumbsDiv').style.visibility = 'hidden';

  var feedback = document.getElementById('feedbackTag');
  feedback.innerHTML = 'Thanks for your feedback!';

  let fb = document.querySelector('input[name = "problem"]:checked').value;
  console.log('feedback is 1: ' + fb);

  if (fb == 'other') {
    let fbText = document.getElementById('feedbackText').value;
    console.log('fbText: ' + fb);
    if (fbText) {
      fb = fbText;
    }
  }

  console.log('Final Feedback is: ' + fb);
  callFeedback(activeUrl, 'dislike', fb);
}

function callFeedback(url, action, feedback) {
  var feedbackMsg = document.getElementById('feedbackTag');
  feedbackMsg.innerHTML = 'Thanks for your feedback!';

  let data = {
    url: url,
    action: action,
    feedback: feedback
  };
  fetch(tData.feedbackurl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  })
    .then(response => {
      console.log('status is: ' + response.status);
    })
    .catch(err => {
      var textDiv = document.getElementById('popup-content');
      textDiv.innerHTML = 'Cuaght an error';
    });
}

function clickDislike() {
  var likeBtn = document.getElementById('imageLike');
  var dislikeBtn = document.getElementById('imageDislike');
  var filename = dislikeBtn.src.replace(/^.*[\\\/]/, '');

  if (filename == 'dislike-unfilled.png') {
    //disLike is not checked
    dislikeBtn.src = '../icons/dislike-filled.png';
    var x = document.getElementById('feedbackDiv');
    if (x.style.visibility === 'hidden') {
      x.style.visibility = 'visible';
    }
    let sbmt = document.getElementById('submitBtn');
    sbmt.onclick = SendFeedback;
  } else {
    //disLike is checked
    dislikeBtn.src = '../icons/dislike-unfilled.png';
  }
  likeBtn.src = '../icons/like-unfilled.png';
}

document.addEventListener('DOMContentLoaded', function() {
  let textToSay = 'The URL of this is: ';
  browser.windows
    .getLastFocused({ populate: true })
    .then(logTabs => {
      const activeTab = logTabs.tabs.find(tab => tab.active);
      textToSay += activeTab.url;
      return activeTab.url;
    })
    .then(url => {
      let data = `url=${url}&v=1&locale=en-US&summary=1`;
      activeUrl = url;
      fetch(tData.scoutUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-access-token': tData.scoutToken
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: data // body data type must match "Content-Type" header
      })
        .then(response => response.json())
        .then(dataRet => {
          if (dataRet.summaryText) {
            var title = document.getElementById('titleTag');
            title.innerHTML = dataRet.title;

            var author = document.getElementById('authorTag');
            author.innerHTML = `by ${dataRet.author}`;

            var textDiv = document.getElementById('textTag');
            textDiv.innerHTML = dataRet.summaryText;

            var feedback = document.getElementById('feedbackTag');
            feedback.innerHTML = 'How was this summary?';

            var likeBtn = document.getElementById('imageLike');
            var dislikeBtn = document.getElementById('imageDislike');

            likeBtn.src = '../icons/like-unfilled.png';
            likeBtn.addEventListener('click', clickLike);

            dislikeBtn.src = '../icons/dislike-unfilled.png';
            dislikeBtn.addEventListener('click', clickDislike);
          } else {
            document.getElementById('errorTag').innerHTML =
              'Sorry, unable to parse this webpage';
            document.getElementById('summary-content').style.visibility =
              'hidden';
            document.getElementById('errorDiv').style.visibility = 'visible';
          }
        })
        .catch(err => {
          var textDiv = document.getElementById('popup-content');
          textDiv.innerHTML = 'Cuaght an error';
        });
    });
});
