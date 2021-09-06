let viewedRepoIndex = localStorage.getItem("Recent viewed repository" + "-selectedIndex");
let getViewedRepos = localStorage.getItem("Recent viewed repository");
let getViewedReposObj = JSON.parse(getViewedRepos);

let repoName = "";
//let searchedShortName = "";


if (viewedRepoIndex !== null)
{
    repoName = getViewedReposObj[viewedRepoIndex];
    document.getElementById("headerBarTitle").textContent = "Statistics for " + repoName;

}

let shortName = "";
let numOfAdditions = []
let memberName = []
let sumOfLines = []
let totalSum = 0
let totalSumArray = []
let issue_array = [];
let total_time_issue_array = [];
let comment_array = [];
let total_time_array = [];
let dev_array = []
let file_list = [];// A list of files that are on a repo
let names = []; // A list of names of people who contributed to a certain file. Should reset every time a new file path is specified. array gets add to big_names
let big_names = []; // An array of arrays, where each inner array is a list of names. indexes are equal to file_list indexes
let num_of_names = []; //A list of the numbers of contributors to each file. indexes are equal to file_list indexes
let file_names = [];
let file_paths = [];
let counter_files = 0; // a counter for the number of times the getStatsfile() is called and too many files are shown
//Function to sum up the total number of lines
let time_between_updates_to_files=[];
let tot_time_per_file = 0;
let colours =[];// Array for the colours of myChart4


function sum(total, num){
    return total + num
}
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}


function getLineStats(result){
   result.forEach(i =>{
      memberName.push(i.author.login);

     for(let j = 0; j < i.weeks.length; j++){
          if(i.weeks[j].w > new Date(2019,0,1).valueOf()/1000){
                numOfAdditions.push(i.weeks[j].a)
          }
     }
    })

    let i, j, sumOfLines, chunk = (numOfAdditions.length/memberName.length);
    for (i = 0,j = numOfAdditions.length; i < j; i += chunk) {
          sumOfLines = numOfAdditions.slice(i,i + chunk);
          totalSum = sumOfLines.reduce(sum)
          totalSumArray.push(totalSum)
    }
}
  function display_data(issueList) {
    counter = 1;
    issueList.items.forEach(i =>{
      i.issue_number = counter;
      counter++;
  })}

  //Function which gives 2 arrays corresponding to the Comments per issue
  //The two arrays are issue number, and issue number
  // This will later be turned into average response time per issue
  // the arrays will be average response time(total response time divided by total comments) and issue issue_number
  check_array = []
  date_array = []
  let months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function checkIn(object){
    object.forEach(i=>{
      check_array.push(i.total)
      let date = new Date(i.week*1000);

      // Year
      let year = date.getFullYear();
      // Month
      let month = months_arr[date.getMonth()];
      // Day
      let day = date.getDate();
      // Display date time in dd-mm-yyyy
      let convdataTime = day+'-'+month+'-'+year;
      date_array.push(convdataTime)

    })

  }
  function comments_vs_issue(object){
    object.items.forEach(i =>{
    issue_array.push(i.issue_number);
    let final_time = new Date(i.updated_at);
    let initial_time = new Date(i.created_at);
    let total_time = final_time - initial_time;
    let num_comment = i.comments;
    let avg_time = total_time/num_comment;
    avg_time = Math.round(avg_time/3.6e+6);
    comment_array.push(avg_time);
  }
  )}

function getTotalTimeToCloseIssue(object){
  object.items.forEach(i =>{
    if (i.closed_at !=  null){
    total_time_issue_array.push(i.issue_number);
    let close_time = new Date(i.closed_at);
    let open_time = new Date(i.created_at);
    let total = (close_time.getTime() - open_time.getTime())/1000;
    total /= (60*60);
    let total_time_to_close = total.toFixed(1);
    total_time_array.push(total_time_to_close);
  }

  })
}

comment_url_array = []
function getTopContributorURL(object){
  object.items.forEach(i=>{
    comment_url = i.comments_url;
    comment_url_array.push(i.comments_url);
      })
}

function print(){
  let outputRef = document.getElementById('data2');
  let output = "";
  let total = 0;
  for (let i = 0; i < total_time_array.length;i++){
    parse = parseFloat(total_time_array[i])
    total += parse;
  }
  let avg = total/total_time_array.length;
  let finalavg = avg.toFixed(2);
  output += "<h3>Average response time to close an Issue  (hrs)</h3><br>";
  output += "<p>"+finalavg+ " hrs </p>";
  outputRef.innerHTML = output;
}

  function getDeveloper(object){
    object.forEach(i =>{

      if (i.event.toLowerCase() === "closed"){
        let dev = i.actor.login;
        dev_array.push(dev)
      }
    })
  }

  function print_top_dev(){
    let outputRef = document.getElementById('data3');
    let output = "";
    let mf = 1;
    let m = 0;
    let item;
    for (var i = 0; i < dev_array.length; i++) {
      for (var j = i; j < dev_array.length; j++) {
        if (dev_array[i] == dev_array[j]) m++;
        if (mf < m) {
          mf = m;
          item = dev_array[i];
        }
      }

    m = 0;
    }
    output += "<h3>The main developer that solved issues</h3><br>";
    output += "<p>"+item+" [Issue solved count: "+ mf+"]</p>";
    outputRef.innerHTML = output;
  }


// retrieve api data
  async function getStats(){
    const url = "https://api.github.com/search/issues?q=repo:" + repoName + "&updated:>=1900-01-01&page=1&per_page=50&comments:>=50";
    const response = await fetch(url, {
      headers: {
        'Authorization': 'token c99c233b53b54509c6cb29e79a03ab6c8f71c81a',
      }
    });
    result = await response.json();

    const url2 = "https://api.github.com/repos" + "/" + repoName + "/" + "stats" + "/" + "contributors";
    const response2 = await fetch(url2, {
      headers: {
        'Authorization': 'token c99c233b53b54509c6cb29e79a03ab6c8f71c81a',
      }
    });
    const result2 = await response2.json();

    for (i = 1; i<30; i++){
    const url_top_contributor = "https://api.github.com/repos/" + repoName + "/issues/events?page="+ i;
    const response_cont = await fetch(url_top_contributor,{
      headers: {
        'Authorization': 'token c99c233b53b54509c6cb29e79a03ab6c8f71c81a',
      }
    });
    result_cont = await response_cont.json();

    const url_timeline = "https://api.github.com/repos/" + repoName + "/stats/commit_activity"
    const response_time = await fetch(url_timeline,{
      headers: {
        'Authorization': 'token c99c233b53b54509c6cb29e79a03ab6c8f71c81a',
      }
    });
    result_time = await response_time.json();
    getDeveloper(result_cont);
    }
    display_data(result);
    comments_vs_issue(result);
    getTotalTimeToCloseIssue(result);
    print();
    print_top_dev();
    getLineStats(result2);
    checkIn(result_time);
    let outputRef = document.getElementById('data1');
      let output = "";
      output += "<h3>Total Number of Issues</h3><br>";
      output += "<p>"+result.total_count+ " Issues </p>";
      outputRef.innerHTML = output;

    const url_code = "https://api.github.com/repos/" +repoName + "/" + "stats/code_frequency"
    const response_code = await fetch(url_code,{
      headers: {
        'Authorization': 'token c99c233b53b54509c6cb29e79a03ab6c8f71c81a',
      }
    });
    result_code = await response_code.json();
    let outputRef2 = document.getElementById('data4');
    let output2 = "";
    output2 += "<h3>Average lines of code change per commit</h3><br>";
    output2 += "<p>"+getTotalLines(result_code)+ "</p>";
    outputRef2.innerHTML = output2;

  }



  let path = ""; //A path to the file on github api
  async function getStatsfile(path){
    const dum = await dummy(); // Dummy file to wait until previous iteration completes before letting this iteration complete. This means the top layer of files are added to file list first.
    if (file_list.length > 20) {
      counter_files++;
      return file_list;
    }
    const url = "https://api.github.com/repos/" + repoName + "/contents/" + path;
    const response = await fetch(url,{
      headers: {
        'Authorization': 'token c99c233b53b54509c6cb29e79a03ab6c8f71c81a',
      }
    });
    const files_result = await response.json();

    //.some stops function execution when you return true.
    files_result.some(i =>{
      if (file_list.length > 20) {
        counter_files++;
        return file_list;
      }
      else if (i.type != "dir") {
        file_list.push([i.name,i.path]);
      }
      else {
        getStatsfile(i.path); //This is currently a FIFO approach (first item in the list of files and directories)
                              // how do i change it to a Breath first approach (Finds all 'files' in the same level first, before going down)
      }

    })
    // this shud be an array like this: [ [#1file,#1path], [#2file,#2path], [#nfile,#npath] ]. An array of arrays

    if (counter_files == 1) {
      for (var q = 0; q < file_list.length; q++) {
        file_names.push(file_list[q][0]);// A list of the file names
        file_paths.push(file_list[q][1]); //A list of the file paths
        getStatsContributors(file_list[q][1]);
      }

    }
    return file_list;
  }

let b=0; // counter for the for loops below
async function getStatsContributors(filepath){
  const url = "https:api.github.com/repos/" + repoName + "/commits?path=" + filepath;
  const response = await fetch(url,{
    headers: {
      'Authorization': 'token c99c233b53b54509c6cb29e79a03ab6c8f71c81a',
    }
  });
  const file_result = await response.json();
  getstatscontributorsfunc(file_result);
  getTimeBetweenUpdates(file_result);
  for (; b < big_names.length; b++) {
    num_of_names.push(big_names[b].length);

    for (var i = 0; i < num_of_names.length; i++) {
      colours.push(getRandomColor());
    }

  }


  }
function getstatscontributorsfunc(file_result){
  names = [];
  file_result.some(i => {

    if (!names.includes(i.commit.author.name)) {
      names.push(i.commit.author.name);
    }
  })
  big_names.push(names);// Error occurs here, where the previous indexes of the array big_name also get rewritten to be the same as the thing that was just pusshed to it
  return big_names;
}

function getTimeBetweenUpdates(file_result){
  tot_time_per_file = 0;
  let avge_time_per_file=0;
  for (var i = 0; i < file_result.length-1; i++) {
    tot_time_per_file = tot_time_per_file + (new Date(file_result[i].commit.committer.date) - new Date(file_result[i+1].commit.committer.date));
  }
  avge_time_per_file = tot_time_per_file/(file_result.length);
  avge_time_per_file = Math.round(avge_time_per_file/3.6e+6);
  time_between_updates_to_files.push(avge_time_per_file);

}

let linesChange = []

function getTotalLines(result){
  let average;

  for(let i = 0; i < result.length; i++){
    linesChange.push(result[i][1] + result[i][2]);
  }

  linesChangeTotal = linesChange.reduce(sum);
  commitTotal = check_array.reduce(sum);

  average = Math.round(linesChangeTotal/commitTotal);
  return average;
 }



function logging(){
  getStatsfile(path);
}
//DUMMY FUNCTION. USE IF ASYNC IS GIVING YOU A HARD TIME.
function dummy(){
    return 1;
  }

logging();


//// This function gets a randomcolour
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// print charts
async function printCharts(){
    await getStats();
  await getStatsfile();

  let myChart = document.getElementById('myChart').getContext('2d');
  let chart_1 = new Chart(myChart, {
                      type: 'bar',
                      data: {
                        labels:issue_array,
                        datasets:[{
                          label:'Average response time per issue (hrs)',
                          data:comment_array,
                          backgroundColor: "#9575cd",
                        }]
                      },
                      options: {
                        title:{
                          display: true,
                          fontSize: 16,
                          text:'Average response time per issue (hrs)'
                        },
                        legend:{
                          position:'right'
                        },
                        responsive: true,
                        scales: {
                          xAxes: [{
                            scaleLabel: {
                              fontSize: 14,
                              display: true,
                              labelString: 'Issue number (#)'
                            },
                            ticks: {
                              maxRotation: 90,
                              minRotation: 80
                            }

                          }],
                          yAxes: [{
                            scaleLabel:{
                              fontSize: 14,
                              display: true,
                              labelString: 'Average response time per issue (hrs)'
                            },
                            ticks: {
                              beginAtZero: true
                            }
                          }]
                        }
                      }

                    })
    let total_time_to_an_issue_chart = document.getElementById('timeIssueClosedChart').getContext('2d');
    let chart_2 = new Chart(total_time_to_an_issue_chart, {
                        type: 'bar',
                        data: {
                          labels:total_time_issue_array,
                          datasets:[{
                            label:'Total time to close an issue(hrs)',
                            data:total_time_array,
                            backgroundColor: "blue",
                          }]
                        },
                        options: {
                          title:{
                            display: true,
                            fontSize: 16,
                            text:'Total time to close an issue in the Respository'
                          },
                          legend:{
                            position:'right'
                          },
                          responsive: true,
                          maintainAspectRatio: true,
                          scales: {
                            xAxes: [{
                              scaleLabel: {
                                display: true,
                                fontSize: 14,
                                labelString: 'Issue number (#)'
                              },
                              ticks: {
                                maxRotation: 90,
                                minRotation: 80
                              }
                            }],
                            yAxes: [{
                              scaleLabel: {
                                display: true,
                                fontSize: 14,
                                labelString: 'Total time to close an issue(hrs)'
                              },
                              ticks: {
                                beginAtZero: true
                              }
                            }]
                          }
                        }

                      })

    let numOfLinesContributedChart = document.getElementById('numLinesByUser').getContext('2d');
    let chart_3 = new Chart(numOfLinesContributedChart, {
                      type: 'bar',
                        data: {
                          labels:memberName,
                          datasets:[{
                            backgroundColor: "#f44336",
                            label:'Num of lines of code',
                            data:totalSumArray,
                          }]
                        },
                        options: {
                          title:{
                            display: true,
                            fontSize: 16,
                            text:'Number of lines contributed by each member'
                          },
                          legend:{
                            position:'right'
                          },
                          responsive: true,
                          scales: {
                            xAxes: [{
                              scaleLabel: {
                                display: true,
                                fontSize: 14,
                                labelString: 'Names of Members'
                              },
                              ticks: {
                                maxRotation: 90,
                                minRotation: 80
                              }
                            }],
                            yAxes: [{
                              scaleLabel: {
                                display: true,
                                fontSize: 14,
                                labelString: 'Number of lines contributed by each member'
                              },
                              ticks: {
                                beginAtZero: true
                              }
                            }]
                          }
                        }

                      })


      let myChart4 = document.getElementById('linesContributed');
      let ctx = myChart4.getContext('2d');
      let ok = new Chart(ctx, {
                          type: 'pie',
                          data: {
                            labels:file_names,
                            datasets:[{
                              label:'Number of contributors per file',
                              data:num_of_names,
                              hoverBorderWidth:0.5,
                              hoverBorderColor:'#000',
                              borderWidth: 0,
                              backgroundColor: colours
                            }]
                          },
                          options: {
                            title:{
                              display: true,
                              fontSize:16,
                              text:'Number of contributors per file in Repository'
                            },
                            legend:{
                              display: true,
                              position:'right'
                            },
                            responsive: true,
                          }

                        });
                        myChart4.onclick = function(evt) {
                          var activePoints = ok.getElementsAtEvent(evt);
                          if (activePoints[0]) {
                            var chartData = activePoints[0]['_chart'].config.data;
                            var idx = activePoints[0]['_index'];

                            var label = chartData.labels[idx];
                            var value = big_names[idx].join("\n");

                            var click_msg = label + ", has the following contributors:" + "\n" + value;
                            alert(click_msg);
                          }
                        }

      let average_update_chart = document.getElementById('averageUpdates').getContext('2d');
      let chart_5 = new Chart(average_update_chart, {
                          type: 'bar',
                          data: {
                            labels:file_names,
                            datasets:[{
                              label:'Time between updates (hrs)',
                              data:time_between_updates_to_files,
                              backgroundColor: colours,
                            }]
                          },
                          options: {
                            title:{
                              display: true,
                              fontSize: 16,
                              text:'Average time between updates to a file'
                            },
                            legend:{
                              position:'right'
                            },
                            responsive: true,
                            maintainAspectRatio: true,
                            scales: {
                              xAxes: [{
                                scaleLabel: {
                                  display: true,
                                  fontSize: 14,
                                  labelString: 'File name'
                                },
                                ticks: {
                                  maxRotation: 90,
                                  minRotation: 80
                                }
                              }],
                              yAxes: [{
                                scaleLabel: {
                                  display: true,
                                  fontSize: 14,
                                  labelString: 'Time between updates(hrs)'
                                },
                                ticks: {
                                  beginAtZero: true
                                }
                              }]
                            }
                          }

                        })




        let checkIn_timeline = document.getElementById('timeline').getContext('2d');
        let chart_6 = new Chart(checkIn_timeline, {
                            type: 'line',
                            data: {
                              labels:date_array,
                              datasets:[{
                              label:'Timeline of work',
                              data:check_array,
                              pointBackgroundColor: "#01579b",
                              borderColor: "#263238",
                              }]
                            },
                            options: {
                              title:{
                                display: true,
                                fontSize: 16,
                                text:'Timeline of work for Repository (weekly)',
                              },
                              legend:{
                                position:'right'
                              },
                              responsive: true,
                              maintainAspectRatio: true,
                              scales: {
                                xAxes: [{
                                  scaleLabel: {
                                    display: true,
                                    fontSize: 14,
                                    labelString: 'Date'
                                  },
                                  ticks: {
                                    maxRotation: 90,
                                    minRotation: 80
                                  }
                                }],
                                yAxes: [{
                                  scaleLabel: {
                                    display: true,
                                    fontSize: 14,
                                    labelString: 'Total work was check in (weekly)'
                                  },
                                  ticks: {
                                    beginAtZero: true
                                  }
                                }]
                              }
                            }

                          })
          }


a = printCharts();
