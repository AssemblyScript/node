import { Buffer } from "../buffer";

/**
 * TODO: Look at https://nodejs.org/dist/latest-v12.x/docs/api/fs.html#fs_fs_readfilesync_path_options
 *
 * Path can be `<string> | <Buffer> | <URL> | <integer>`.
 *
 * This will require a `<T>` parameter to handle all these cases. In this particular case, I think
 * it's okay to default to only `<string>`.
 */
export function readFileSync(): Buffer {
  return new Buffer(0);
}
