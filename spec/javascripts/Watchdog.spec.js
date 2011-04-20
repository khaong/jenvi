var watchdog;

describe('Watchdog should monitor state of running job requests', function() {
  beforeEach(function() {
    watchdog = new Watchdog();
  });

  it("should return false if there are no running jobs", function() {
    expect(watchdog.pendingJobs()).toBeFalsy();
  });
  
  it("should return true if there are running jobs", function() {
    watchdog.addJob("23");

    expect(watchdog.pendingJobs()).toBeTruthy();
  });

  it("should return false if all jobs have finished", function(){
    var firstJob = "xx";
    var secondJob = "yy";

    watchdog.addJob(firstJob);
    watchdog.addJob(secondJob);

    watchdog.jobFinished(firstJob);
    watchdog.jobFinished(secondJob);

    expect(watchdog.pendingJobs()).toBeFalsy();
  });
});