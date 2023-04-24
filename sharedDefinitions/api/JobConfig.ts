import { JobCommand } from "../model/jobCommand"

type JobConfig = {
  name?: string
  description?: string
  command: JobCommand
}
export default JobConfig
