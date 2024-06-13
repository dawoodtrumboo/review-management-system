// export type UploadFileType = Express.Multer.File

export type UploadFileType = {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  size: number
  buffer?: Buffer // Optional property for file content (if needed)
  stream?: NodeJS.ReadableStream // Optional property for file stream (if needed)
  // Add other properties specific to your upload needs
}
