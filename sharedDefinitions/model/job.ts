import mongoose from 'mongoose'
import type { JobPriority, JobStatus } from './resources/enums.js'
import { IJobInputUpload, IJobInputSharedDirectory, IJobInputExternal } from './jobInput'
import { JobCommand } from './jobCommand'

export const name = 'Job'

export interface IGJob<Input extends IJobInputUpload | IJobInputSharedDirectory | IJobInputExternal> {
  _id: mongoose.Types.ObjectId
  name: string
  owner: string
  createdAt: Date
  description: string
  node: string
  command: JobCommand
  input: Input
  priority: JobPriority
  status: {
    code: JobStatus
    at: Date
    message?: string
    executeDirectoryPath?: string
    resultDirectoryPath?: string
  }
}

export type IJob = IGJob<IJobInputUpload | IJobInputSharedDirectory | IJobInputExternal>
export type IJobUpload = IGJob<IJobInputUpload>
export type IJobSharedDirectory = IGJob<IJobInputSharedDirectory>
export type IJobExternal = IGJob<IJobInputExternal>
