const cleanVideoId = (value: string | null | undefined) => {
  if (!value) return null;

  return value.split("?")[0]?.split("&")[0]?.trim() || null;
};

const getYouTubeVideoId = (videoUrl: string) => {
  try {
    const url = new URL(videoUrl);

    if (url.hostname.includes("youtu.be")) {
      return cleanVideoId(url.pathname.replace("/", ""));
    }

    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/watch")) {
        return cleanVideoId(url.searchParams.get("v"));
      }

      if (url.pathname.startsWith("/shorts/")) {
        return cleanVideoId(url.pathname.split("/shorts/")[1]);
      }

      if (url.pathname.startsWith("/embed/")) {
        return cleanVideoId(url.pathname.split("/embed/")[1]);
      }

      if (url.pathname.startsWith("/live/")) {
        return cleanVideoId(url.pathname.split("/live/")[1]);
      }
    }

    return null;
  } catch {
    return null;
  }
};

const getVimeoVideoId = (videoUrl: string) => {
  try {
    const url = new URL(videoUrl);

    if (!url.hostname.includes("vimeo.com")) {
      return null;
    }

    return cleanVideoId(url.pathname.replace("/", "").split("/")[0]);
  } catch {
    return null;
  }
};

export const getProjectVideoEmbedUrl = (
  videoUrl: string | null | undefined,
) => {
  if (!videoUrl) return null;

  const youtubeId = getYouTubeVideoId(videoUrl);

  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
  }

  const vimeoId = getVimeoVideoId(videoUrl);

  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
  }

  return null;
};
