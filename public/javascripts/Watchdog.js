function Watchdog() {
  var jobList = [];
  return {
    addJob: function(id) {
      jobList.push(id);
    },

    pendingJobs: function() {
      return (jobList.length !== 0);
    },

    jobFinished: function(jobId) {
      var foundJobIdIndex = jobList.indexOf(jobId);
      jobList.splice(foundJobIdIndex, 1);
    }
  };
}