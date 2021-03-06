var API_URL_PREFIX = "api/1.0/";


async function getData() {
    var loaded_tweets = [];
    await $.ajax
    ({
        type: "GET",
        url: API_URL_PREFIX  + "load_twitter_data/",
        contentType: 'application/json',
        success: function (response) {
            loaded_tweets = response['tweets'];
        },
        error: function (error) {
            console.log("error: " + error)
        },
    });
    return loaded_tweets;
};


async function loadUserTweets(user_id) {
    var loaded_tweets = [];
    await $.ajax
    ({
        type: "POST",
        url: API_URL_PREFIX + "load_tweets_user/",
        contentType: 'application/json',
        async: true,
        data: JSON.stringify({'user_id': user_id}),
        success: function (response) {
            loaded_tweets = response['tweets'];
        },
        error: function (error) {
            console.log("error: " + error)
        },
    });
    return loaded_tweets;
};


async function loadUserTweetsAnalysis(user_id) {
    await $.ajax
    ({
        type: "POST",
        url: API_URL_PREFIX + "load_user_tweets_analysis/",
        contentType: 'application/json',
        async: true,
        data: JSON.stringify({'user_id': user_id}),
        success: function (response) {
            analysis_result = response;
        },
        error: function (error) {
            console.log("error: " + error)
        },
    });
    return analysis_result;
};


async function loadTopicTweets(topic_name) {
    var loaded_tweets = [];
    await $.ajax
    ({
        type: "POST",
        url: API_URL_PREFIX + "load_tweets_topic/",
        contentType: 'application/json',
        async: true,
        data: JSON.stringify({'topic': topic_name}),
        success: function (response) {
            loaded_tweets = response['tweets'];
        },
        error: function (error) {
            console.log("error: " + error)
        },
    });
    return loaded_tweets;
};


function closeAll() {
    var dolls = [];
    dolls = Array.prototype.concat.apply(dolls, document.getElementsByClassName("analysis-button"));
    for (let dol of dolls) {
        dol.classList.remove("active");
        var content = document.getElementById("analysis-" + dol['id'].split('-')[2])
        content.style.maxHeight = null;
    }

    var dolls = [];
    dolls = Array.prototype.concat.apply(dolls, document.getElementsByClassName("tweets-user-button"));
    for (let dol of dolls) {
        dol.classList.remove("active");
        var content = document.getElementById("user_tweets-" + dol['id'].split('-')[2])
        content.style.maxHeight = null;
    }

    var dolls = [];
    dolls = Array.prototype.concat.apply(dolls, document.getElementsByClassName("tweets-topic-button"));
    for (let dol of dolls) {
        dol.classList.remove("active");
        var content = document.getElementById("topic_tweets-" + dol['id'].split('-')[2])
        content.style.maxHeight = null;
    }
}


function add_collapsible() {
    var coll = [];
    coll = Array.prototype.concat.apply(coll, document.getElementsByClassName("analysis-button"));
    var i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = document.getElementById("analysis-" + this['id'].split('-')[2])
        if (content.style.maxHeight){
          content.style.maxHeight = null;
          closeAll();
        } else {
          closeAll();
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    }

    var coll = [];
    coll = Array.prototype.concat.apply(coll, document.getElementsByClassName("tweets-user-button"));
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        //closeAll();
        this.classList.toggle("active");
        var content = document.getElementById("user_tweets-" + this['id'].split('-')[2])
        if (content.style.maxHeight){
          content.style.maxHeight = null;
          closeAll();
        } else {
          closeAll();
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    }

    var coll = [];
    coll = Array.prototype.concat.apply(coll, document.getElementsByClassName("tweets-topic-button"));
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        //closeAll();
        this.classList.toggle("active");
        var content = document.getElementById("topic_tweets-" + this['id'].split('-')[2])
        if (content.style.maxHeight){
          content.style.maxHeight = null;
          closeAll();
        } else {
          closeAll();
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    }

}

async function create_tweets() {

    var loaded_tweets = await getData();

    var tweet_strings = [];

    for (let tweet of loaded_tweets) {
         s = '<div class="post">' +
            '<div class="post__avatar">' +
            '<img src=' +
            tweet[0]['user']['profile_image_url_https'] +
            ' alt="" />' +
            '</div>' +
            '<div class="post__body">' +
            '<div class="post__header">' +
            '<div class="post__headerText">' +
            '<h3>' +
            tweet[0]['user']['name'] +
            '<span class="post__headerSpecial">';
         tweet_strings.push(s);

         if (tweet[0]['user']['verified'] == true)
         {
            s = '<span class="material-icons post__badge"> verified </span>';
            tweet_strings.push(s);
         }

         s = ' @' +
             tweet[0]['user']['screen_name'] +
             '</span>' +
             '</h3>' +
             '</div>' +
             '<div class="post__headerDescription">' +
             '<p>' + tweet[0]['text'] + '</p>' +
             '</div>' +
             '</div>';
         tweet_strings.push(s);

         try {
            if (typeof(tweet[0]['extended_entities']['media']) != "undefined")
             {
                for (let i = 0; i < tweet[0]['extended_entities']['media'].length; i++) {
                    if (tweet[0]['extended_entities']['media'][i]['type'] == "photo")
                    {
                        s = '<img src=' +
                            tweet[0]['extended_entities']['media'][i]['media_url_https'] +
                            ' alt=""/>';
                            tweet_strings.push(s);
                    }
                }
             }
         }
         catch(err) {
            console.log(err.message);
         }

         s = '<div class="post__footer">' +
             '<span class="material-icons"> repeat </span>' +
             '<span class="material-icons"> favorite_border </span>' +
             '<span class="material-icons"> publish </span>' +
             '</div>' +
             '</div>' +
             '</div>';
         tweet_strings.push(s);

         s = '<button type="button" id="analysis-button-' + tweet[0]['id_str'] + '" class="analysis-button">Learn more about this post</button>'
         tweet_strings.push(s);

         s = '<button type="button" id="tweets-user-' + tweet[0]['id_str'] + '" class="tweets-user-button">Other posts of this user</button>'
         tweet_strings.push(s);

         s = '<button type="button" id="tweets-topic-' + tweet[0]['id_str'] + '" class="tweets-topic-button">Other opinions on that topic</button>'
         tweet_strings.push(s);

         var sent_name = tweet[0]['id_str'] + '_sent'
         var emotion_name = tweet[0]['id_str'] + '_emotion'
         var hate_name = tweet[0]['id_str'] + '_hate'
         s = '<div id="analysis-' + tweet[0]['id_str'] + '" class="analysis">' +
             // '<div style="height: 200px">' +
             '<p class="analysis-text">Sentiment analysis of this post:</p>' +
             '<canvas class="analysis-canvas" id=' + sent_name + '></canvas>' +
             // '</div>' +
             // '<div style="height: 200px">' +
             '<p class="analysis-text">Emotion analysis of this post:</p>' +
             '<canvas class="analysis-canvas" id=' + emotion_name + '></canvas>' +
             // '</div>' +
             // '<div style="height: 200px">' +
             '<p class="analysis-text">Probability of this post being aggressive, hateful and targeted:</p>' +
             '<canvas class="analysis-canvas" id=' + hate_name + '></canvas>' +
             // '</div>' +
             '</div>';
         tweet_strings.push(s);

         s = '<div id="user_tweets-' + tweet[0]['id_str'] + '" class="analysis-user-tweets">';
         tweet_strings.push(s);
         user_tweets = await loadUserTweets(tweet[0]['user']['id_str']);
         if (user_tweets.length == 0) {
            tweet_strings.push("<p class='user-tweets-text'>This user hasn't posted anything else yet...</p>");
         } else {
            for (let u_tweet of user_tweets) {
                tweet_strings.push('<p class="user-tweets-text">' + u_tweet['text'] + '</p>');
            }
            tweet_strings.push('<div class="user-post-diagram">' +
                               '<div class="user-analysis-canvas"><canvas id="user-tweets-sentiment-canvas-' +
                               tweet[0]['id_str'] + '"></canvas></div>' +
                               '<div class="user-analysis-canvas"><canvas id="user-tweets-emotion-canvas-' +
                               tweet[0]['id_str'] + '"></canvas></div></div>');
         }
         tweet_strings.push('</div>');

         s = '<div id="topic_tweets-' + tweet[0]['id_str'] + '" class="analysis-topic-tweets">';
         tweet_strings.push(s);
         topic_tweets = await loadTopicTweets('covid');
         if (topic_tweets.length == 0) {
            tweet_strings.push("<p class='topic-tweets-text'>We couldn't find any tweets with similar topic...</p>");
         } else {
            for (let t_tweet of topic_tweets) {
                tweet_strings.push('<p class="topic-tweets-text"><b>' + t_tweet['user']['name'] + '</b><br>' +
                t_tweet['text'] + '</p>');
            }
         }
         tweet_strings.push('</div>');

    }

    var html = document.getElementById("t_feed").innerHTML;

    var final_string = '<div id="t_feed" class="feed">' + html;

    for (let tweet of tweet_strings) {
        final_string = final_string + tweet;
    }

    document.getElementById("t_feed").innerHTML =  final_string + '</div>';

    for (let tweet of loaded_tweets) {
         var sent_name = tweet[0]['id_str'] + '_sent'
         var ctx = document.getElementById(sent_name);
         var data_array = [];
         var labels = [];
         for (let key in tweet[1]['sentiment']) {
             data_array.push(parseFloat(tweet[1]['sentiment'][key]))
             labels.push(key)
         }
         var myChart = new Chart(ctx, {
             type: 'doughnut',
             data: {
                 labels: labels,
                 datasets: [{
                     label: 'sentiment',
                     data: data_array,
                     backgroundColor: [
                         'rgba(203, 67, 53, 1)',
                         'rgba(244, 208, 63, 1)',
                         'rgba(39, 174, 96, 1)'
                     ]
                 }]
             },
             options: {
                 responsive: true,
                 // maintainAspectRatio: false,
                 legend: {
                     display: true,
                     position: 'right',
                     labels: {
                         fontColor: 'rgb(0,0,0)'
                     },
                     onClick: (e) => e.stopPropagation(),
                 }
             }
         });

         var emotion_name = tweet[0]['id_str'] + '_emotion'
         var ctx = document.getElementById(emotion_name);
         var data_array = [];
         var labels = [];
         for (let key in tweet[1]['emotion']) {
             data_array.push(parseFloat(tweet[1]['emotion'][key]))
             labels.push(key)
         }
         var myChart = new Chart(ctx, {
             type: 'doughnut',
             data: {
                 labels: labels,
                 datasets: [{
                     label: 'emotion',
                     data: data_array,
                     backgroundColor: [
                         'rgba(203, 67, 53, 1)',
                         'rgba(39, 174, 96, 1)',
                         'rgba(52, 152, 219, 1)',
                         'rgba(44, 62, 80, 1)'
                     ]
                 }]
             },
             options: {
                 responsive: true,
                 // maintainAspectRatio: false,
                 legend: {
                     display: true,
                     position: 'right',
                     labels: {
                         fontColor: 'rgb(0,0,0)'
                     },
                     onClick: (e) => e.stopPropagation(),
                 }
             }
         });

         var hate_name = tweet[0]['id_str'] + '_hate'
         var ctx = document.getElementById(hate_name);
         var data_array = [];
         var labels = [];
         for (let key in tweet[1]['hate_speech']) {
             data_array.push(parseFloat(tweet[1]['hate_speech'][key]))
             labels.push(key)
         }
         var myChart = new Chart(ctx, {
             type: 'bar',
             data: {
                 labels: labels,
                 datasets: [{
                     label: 'hate speech',
                     data: data_array,
                     backgroundColor: [
                         'rgba(203, 67, 53, 1)',
                         'rgba(203, 67, 53, 1)',
                         'rgba(203, 67, 53, 1)'
                     ]
                 }]
             },
             options: {
                 responsive: true,
                 // maintainAspectRatio: false,
                 legend: {
                     display: true,
                     position: 'right',
                     labels: {
                         fontColor: 'rgb(0,0,0)'
                     },
                     onClick: (e) => e.stopPropagation(),
                 },
                 scales: {
                    yAxes: [{
                            display: true,
                            ticks: {
                                beginAtZero: true,
                                max: 1
                            }
                    }]
                 }
             }
         });

         var user_tweets = await loadUserTweets(tweet[0]['user']['id_str']);
         if (user_tweets.length > 0) {
             var user_tweets_analysis = await loadUserTweetsAnalysis(tweet[0]['user']['id_str']);
             var user_tweets_sent = 'user-tweets-sentiment-canvas-' + tweet[0]['id_str'];
             var ctx = document.getElementById(user_tweets_sent);
             var data_array = [];
             var labels = [];
             for (let key in user_tweets_analysis['sentiment']) {
                 data_array.push(parseFloat(user_tweets_analysis['sentiment'][key]))
                 labels.push(key)
             }
             var myChart = new Chart(ctx, {
                 type: 'doughnut',
                 data: {
                     labels: labels,
                     datasets: [{
                         label: 'sentiment',
                         data: data_array,
                         backgroundColor: [
                             'rgba(203, 67, 53, 1)',
                             'rgba(244, 208, 63, 1)',
                             'rgba(39, 174, 96, 1)'
                         ]
                     }]
                 },
                 options: {
                     responsive: true,
                     //maintainAspectRatio: false,
                     legend: {
                         display: true,
                         position: 'right',
                         labels: {
                             fontColor: 'rgb(0,0,0)'
                         },
                         onClick: (e) => e.stopPropagation(),
                     }
                 }
             });

             var user_tweets_emotion = 'user-tweets-emotion-canvas-' + tweet[0]['id_str'];
             var ctx = document.getElementById(user_tweets_emotion);
             var data_array = [];
             var labels = [];
             for (let key in user_tweets_analysis['emotion']) {
                 data_array.push(parseFloat(user_tweets_analysis['emotion'][key]))
                 labels.push(key)
             }
             var myChart = new Chart(ctx, {
                 type: 'doughnut',
                 data: {
                     labels: labels,
                     datasets: [{
                         label: 'emotion',
                         data: data_array,
                         backgroundColor: [
                             'rgba(203, 67, 53, 1)',
                             'rgba(39, 174, 96, 1)',
                             'rgba(52, 152, 219, 1)',
                             'rgba(44, 62, 80, 1)'
                         ]
                     }]
                 },
                 options: {
                     responsive: true,
                     // maintainAspectRatio: false,
                     legend: {
                         display: true,
                         position: 'right',
                         labels: {
                             fontColor: 'rgb(0,0,0)'
                         },
                         onClick: (e) => e.stopPropagation(),
                     }
                 }
             });
         }
    }

    add_collapsible();
}
