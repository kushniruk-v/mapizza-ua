export interface INewsRequest {
  title: string;
  description: string;
  imagePath: string;
  newFormNews: Array<{
    header: string;
    additionalDescription: string;
    additionalImage: string;
    additionalList: string;
  }>;
}

export interface INewsResponse extends INewsRequest {
  id: number | string;
}
