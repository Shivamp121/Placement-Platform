import { S3Client, CreateBucketCommand, HeadBucketCommand, BucketLocationConstraint } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const ensureBucketExists = async () => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;

  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log(`S3 Bucket "${bucketName}" already exists and is ready.`);
  } catch (error: any) {
    const isNotFound = error.name === "NotFound" || error.$metadata?.httpStatusCode === 404;
    const isNetworkMissing = error.code === "ENOTFOUND" || error.message?.includes("ENOTFOUND");
    if (isNotFound || isNetworkMissing) {
      console.log(`Bucket not found or unresolvable. Creating bucket "${bucketName}" automatically...`);
      
      try {
        await s3Client.send(
          new CreateBucketCommand({
            Bucket: bucketName,
            CreateBucketConfiguration: {
              LocationConstraint: process.env.AWS_REGION! as BucketLocationConstraint,
            },
          })
        );
        console.log(`Successfully created S3 Bucket: "${bucketName}"`);
      } catch (createError: any) {
        console.error("Failed to automatically create S3 bucket:", createError.message);
      }
    } else {
      console.error("Error checking S3 bucket status:", error.message);
    }
  }
};