// client action: upload image to imgbb
export const uploadImageToImgBB = async (file) => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("imgBB api key is missing");
  }

  if (!file) {
    throw new Error("image file is required");
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!data?.success) {
    throw new Error("failed to upload image");
  }

  return data.data.url;
};