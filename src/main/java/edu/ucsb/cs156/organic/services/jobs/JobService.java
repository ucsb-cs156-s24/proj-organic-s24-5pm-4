package edu.ucsb.cs156.organic.services.jobs;

import edu.ucsb.cs156.organic.entities.jobs.Job;
import edu.ucsb.cs156.organic.repositories.jobs.JobsRepository;
import edu.ucsb.cs156.organic.services.CurrentUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class JobService {
  @Autowired
  private JobsRepository jobsRepository;

  @Autowired
  private CurrentUserService currentUserService;

  @Lazy
  @Autowired
  private JobService self;

  public Job runAsJob(JobContextConsumer jobFunction, long id) {
    Job job = Job.builder()
      .createdBy(currentUserService.getUser())
      .status("running")
      .id(id)
      .build();

    jobsRepository.save(job);
    self.runJobAsync(job, jobFunction);
    return job;
  }

  @Async
  public void runJobAsync(Job job, JobContextConsumer jobFunction) {
    JobContext context = new JobContext(jobsRepository, job);

    try {
      jobFunction.accept(context);
    } catch (Exception e) {
      e.printStackTrace();
      job.setStatus("error");
      context.log(e.getMessage());
      return;
    }

    job.setStatus("complete");
    jobsRepository.save(job);
  }
}
