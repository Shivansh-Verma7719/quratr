import { createClient } from "@/utils/supabase/client";
import imageCompression from "browser-image-compression";

async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error("Error compressing image:", error);
    return file;
  }
}

export async function createNewPost(text: string, image: File | null) {
  const supabase = createClient();

  // console.log("Creating new post");
  // console.log("Text:", text);
  // console.log("Image:", image);
  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.log("User not found", userError);
    return null;
  }

  const { data: userData, error: userDataError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (userDataError || !userData) {
    console.log("User data not found", userError);
    return null;
  }

  let imagePath = null;
  if (image) {
    // Compress image if it's larger than 2MB
    const compressedImage =
      image.size > 2 * 1024 * 1024 ? await compressImage(image) : image;
    console.log("Compressed image:", compressedImage);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("feed_images")
      .upload(
        `${user.id}/${Date.now()}-${compressedImage.name}`,
        compressedImage
      );

    console.log("Upload data:", uploadData);
    console.log("Upload error:", uploadError);

    if (uploadError) {
      console.log("Error uploading image", uploadError);
      return null;
    }
    imagePath = uploadData.path;
  }

  console.log("Image path:", imagePath);

  const { error } = await supabase.from("posts").insert({
    user_id: user.id,
    username: userData.username,
    content: text,
    image: imagePath,
    reaction_count: 0,
  });

  // console.log("Post data:", data);
  // console.log("Post error:", error);

  if (error) {
    console.log("Error creating post", error);
    return null;
  }
  return "success";
}
