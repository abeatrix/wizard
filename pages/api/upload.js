const { writeFile } = require('fs');
let multiparty = require('multiparty');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(400).json({ Error: 'Method not allowed.' });
  }
  try {
    const form = new multiparty.Form();
    const data = await new Promise((resolve, reject) => {
      form.parse(req, function (err, fields, files) {
        if (err) reject({ err });
        resolve({ fields, files });
      });
    });
    const fileData = data.fields.file[0];
    const fileName = data.fields.fileName[0];
    writeFile(
      `/Users/bwork/Dev/wizard/${fileName}`,
      fileData,
      function (err, data) {
        return res.status(200).json({ body: 'Uploaded successfully' });
      }
    );
    return res.status(200).json({ body: 'Uploaded successfully' });
  } catch (error) {
    console.log(error);
    return res.status(400).json('Failed');
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
