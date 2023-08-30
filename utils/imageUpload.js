const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: "totel-d7322",
  keyFilename: "./config/serviceAccount.json",
});

exports.imageUpload = async (files) => {
  try {
    if (Array.isArray(files)) {
      if (files.length > 10) {
        return {
          success: false,
          message: 'You can only upload up to 10 files',
        };
      }

      const tooLargeFiles = files.filter((file) => file.size > 3000000);
      if (tooLargeFiles.length > 0) {
        return {
          success: false,
          message: 'Some files are too large',
        };
      }

      const downloadURLs = await Promise.all(
        files.map(async (file) => {
          const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET_NAME);
          const fileBlob = bucket.file(
            `media/${file.originalname}_${Date.now()}`
          );

          const metaData = {
            contentType: file.mimetype,
          };

          await fileBlob.save(file.buffer, {
            metadata: metaData,
          });

          return fileBlob.publicUrl();
        })
      );

      if (downloadURLs.some((url) => !url)) {
        return {
          success: false,
          message: 'File upload failed',
        };
      }

      return {
        success: true,
        downloadURLs,
      };
    } else {
      const file = files[0];
      if (file.size > 3000000) {
        return {
          success: false,
          message: 'File is too large',
        };
      }

      const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET_NAME);
      const fileBlob = bucket.file(
        `media/${file.originalname}_${Date.now()}`
      );

      const metaData = {
        contentType: file.mimetype,
      };

      await fileBlob.save(file.buffer, {
        metadata: metaData,
      });

      const downloadURL = fileBlob.publicUrl();

      if (!downloadURL) {
        return {
          success: false,
          message: 'File upload failed',
        };
      }

      return {
        success: true,
        downloadURL,
      };
    }
  } catch (err) {
    console.log(err.message);
    return {

      success: false,
      message: err.message,
    };
  }
};
