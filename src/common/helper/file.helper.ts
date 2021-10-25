import { parse } from 'path';
import * as slugify from 'slug';

export class FileHelper {
  static customFileName(req, file, cb) {
    const fileMetadata = parse(file.originalname);
    const slugFileName =
      slugify(fileMetadata.name, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    return cb(null, `${slugFileName}${fileMetadata.ext}`);
  }

  static destinationPath(req, file, cb) {
    cb(null, process.env.STATIC_DIR);
  }
}
