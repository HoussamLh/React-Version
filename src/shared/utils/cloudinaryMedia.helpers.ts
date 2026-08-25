export const getCloudinaryVideoDeliveryUrl = (
  videoUrl: string | null | undefined,
) => {
  if (!videoUrl || !videoUrl.includes("res.cloudinary.com/")) {
    return null;
  }

  try {
    const url = new URL(videoUrl);
    const uploadMarker = "/video/upload/";

    if (!url.pathname.includes(uploadMarker)) {
      return null;
    }

    url.pathname = url.pathname.replace(
      uploadMarker,
      `${uploadMarker}f_mp4,vc_h264/`,
    );

    return url.toString();
  } catch {
    return null;
  }
};
