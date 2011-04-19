describe('Watchdog should monitor state of running job requests', function() {
  xit("should return false if there are no running jobs", function() {
    
    var watchdog = new Watchdog();

    expect(watchdog.pendingJobs()).toBeFalsy();
  });
  
  xit("should return true if there are running jobs", function() {
    var watchdog = new Watchdog();

    watchdog.addJob();

    expect(watchdog.pendingJobs()).toBeTruthy();
  })
});