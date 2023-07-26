# Getting Started

## What is AJM?

Abaqus Job Manager(AJM) is web interface which enable you run and watch abaqus job on your web browser.

AJM also allows all jobs on Abaqus to be displayed and jobs to be launched in sequence according to license and CPU constraints.

## User account

AJM has no login system. Just select who you are.

### Register user

First, please register as a user.

User registration is done in the User Editor of the Admin page.

A password is required to access the Admin.

Please ask about registoration to the person in charge.

### Arrange user folders on workstations

Second, please arrange user folder in each the job result folder and the job import folder on the workstation(s) which you are going to use.

Name of folders must be same as user name.

## 3 ways to use AJM

### Upload input file(s)

You can just upload an inp file to AJM and execute job for simple job composed of just an inp file.

The result would output in your folder in the job result folder.

Multiple inp files can be upload at onece and AJM make jobs for each files.

### Import From Directory

"Upload input file(s)" does not fit for resume jobs suspended or do jobs with user subroutine or other job composed an inp file and other files.

Arrange a folder include files required to the job in user folder of job import folder.

Make a configuretion file named "abaqusjob_config.json" and write some configuration in it.

Then you can fetch and find the folder in "Import From Directory" tab.

Multiple inp files be imported from one job folder and AJM make jobs for each files.

#### Examle of abaqusjob_config.json

```json
{
  "command": {
    "cpus": 2,
    "options": [
      {
        "name": "user",
        "value": "UMATPlasticity.f"
      }
    ]
  },
  "name": "JobName",
  "description": "It's an example job configuration with user subroutine."
}
```

### Use Abaqus Externally

You secure license tokens and you can run abaqus command by your own way instead of AJM.

In other words "Use Abaqus Externally" job makes it clear that you are running any abaqus job out of AJM and some license tokens is consumed for the job.

The job controlled by API with http. There are 2 implementation of abaqus job runner now: Python version and Mathematica version. These make sure run abaqus job with control AJM job.

## When you get into trouble

Report it to Developper (<soraji@fract.t.u-tokyo.ac.jp>)
