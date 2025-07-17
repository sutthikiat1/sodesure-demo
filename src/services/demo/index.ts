export interface IResponsePredict {
  prediction: number[][];
  predicted_class: string;
  confidence: number;
  filename: string;
}

export const servicePredict = async (
  data: FormData
): Promise<IResponsePredict> => {
  const response = await fetch(`/api/predict`, {
    method: "POST",
    body: data,
  }).then(async (res) => {
    return await res.json();
  });

  return response;
};
