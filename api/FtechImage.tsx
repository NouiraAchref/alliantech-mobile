import AxiosInstance from "@/network/AxiosInstance";

export const FetchImage = async () => {
  const res = await AxiosInstance.post(`predict`, FormData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};
