import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs-extra";
import { addFrame } from "@edward1993/img-editor/dist/lib/imgEditor";

// how to receive a file https://github.com/vercel/micro/issues/434
const handle = async (request: VercelRequest, response: VercelResponse) => {
  console.log("Request - ", request);
  if (Buffer.isBuffer(request.body)) {
    const file = "./uploaded-file.png";
    fs.createWriteStream(file).write(request.body);
    const result = await addFrame([file]);
    response.status(200).send(`DONE - ${result}`);
  } else {
    response.status(500).send(`body wasn't a buffer`);
  }
};

export default handle;
